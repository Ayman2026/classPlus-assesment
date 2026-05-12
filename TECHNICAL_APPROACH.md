# Technical Approach Document — GreetWish App

## 1. Problem-Solving Approach

### Image Overlay Logic

The core challenge is to **dynamically composite** a user's profile picture and name onto a greeting card template and produce a shareable image — all client-side, with no server rendering.

I chose the **HTML5 Canvas API** for this because:
- It provides pixel-level control over image compositing
- It can export to PNG/Blob for downloading and sharing
- It works entirely in the browser with no server dependencies
- It supports circular clipping paths for profile pictures

### Canvas Rendering Pipeline

The rendering follows a strict **layered drawing order** (back-to-front):

```
┌─────────────────────────────────┐
│ 1. Background Image (cover-fit) │  ← drawImage with calculated crop
├─────────────────────────────────┤
│ 2. Dark Overlay Strip (top)     │  ← fillRect with rgba(0,0,0,0.45)
├─────────────────────────────────┤
│ 3. User Avatar (circular clip)  │  ← arc() + clip() + drawImage
│    └─ Green outer ring (3px)    │
│    └─ White inner ring (3px)    │
├─────────────────────────────────┤
│ 4. Display Name (centered)      │  ← fillText with Playfair Display
├─────────────────────────────────┤
│ 5. Quote Overlay (bottom)       │  ← Dark rect + word-wrapped text
└─────────────────────────────────┘
```

Each layer is drawn sequentially using `CanvasRenderingContext2D` methods. This ensures correct z-ordering without the complexity of a compositing engine.

#### Cover-Fit Algorithm
To make background images fill the canvas without distortion:
1. Calculate aspect ratios of both the source image and canvas
2. Determine the crop region (sx, sy, sw, sh) to center the image
3. Draw the cropped region scaled to fill the canvas

#### Circular Profile Picture Clip
```javascript
ctx.save();
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
ctx.clip();
ctx.drawImage(img, x, y, width, height);
ctx.restore();
```
The `save()`/`restore()` pattern is critical — without it, the clip path would affect all subsequent draw calls.

---

## 2. Tech Stack

| Tool | Version | Reason Chosen |
|------|---------|---------------|
| **React 18** | 18.x | Component-based UI, hooks, and concurrent features |
| **Vite 6** | 6.x | Fastest dev server with HMR, native ESM |
| **Tailwind CSS 4** | 4.x | Utility-first CSS with Vite plugin integration |
| **Firebase Auth** | 11.x | Managed auth with Google, Email, Anonymous support |
| **Firebase Firestore** | 11.x | Real-time NoSQL database for user profiles |
| **Firebase Storage** | 11.x | Cloud storage for user-uploaded avatars |
| **React Router v6** | 6.x | Declarative routing with nested layouts & outlet |
| **Zustand** | 5.x | Minimal, fast state management (no boilerplate) |
| **Framer Motion** | 11.x | Production-grade animations and page transitions |
| **Lucide React** | latest | Modern, tree-shakeable icon library |
| **react-hot-toast** | 2.x | Lightweight, customizable toast notifications |
| **HTML5 Canvas API** | native | Client-side image compositing and export |
| **Web Share API** | native | Native mobile sharing (WhatsApp, Instagram, etc.) |

### Why These Choices?

- **Zustand over Redux/Context**: Zero boilerplate, no providers, and the store is a simple hook. Perfect for a mid-size app.
- **Framer Motion over CSS animations**: Declarative `AnimatePresence` for unmount animations, layout animations, and spring physics.
- **Canvas API over CSS overlays**: CSS overlays can't be exported as a single merged image. Canvas gives us `toBlob()` for downloads and sharing.
- **Firebase over custom backend**: Managed services = zero DevOps. Authentication, storage, and database in one SDK.

---

## 3. Image Overlay Logic — Detailed Explanation

### Step 1: Image Loading
All images are loaded using `new Image()` with `crossOrigin = 'anonymous'` to avoid CORS taint on the canvas. This is wrapped in a Promise for async/await usage:

```javascript
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
```

### Step 2: Background Rendering
The template image is drawn using a **cover-fit** algorithm that centers and crops the image to fill the 400×500 canvas while maintaining aspect ratio.

### Step 3: Overlay Strips
Semi-transparent dark rectangles are drawn at the top (for the name area) and bottom (for quote text) using `rgba()` fill styles.

### Step 4: Circular Avatar
The user's profile photo is clipped into a circle using `ctx.arc()` + `ctx.clip()`. Before the photo, concentric circles are drawn for the green and white ring borders.

### Step 5: Text Rendering
Display name and quote text use `ctx.fillText()` with proper `textAlign` and `textBaseline` settings. Quote text includes a **word-wrap algorithm** that measures text width with `ctx.measureText()` and breaks lines at word boundaries.

### Step 6: Export
The final canvas is exported via:
- `canvas.toBlob()` → for downloading as PNG
- `canvas.toDataURL()` → for preview
- `new File([blob])` → for native sharing via Web Share API

---

## 4. Challenges & Solutions

### Challenge 1: CORS with Canvas Images
**Problem**: When drawing external images (picsum.photos) onto a canvas, the canvas becomes "tainted" and `toBlob()`/`toDataURL()` throws a security error.

**Solution**: Set `crossOrigin = 'anonymous'` on all `Image` objects before setting `src`. The image server must respond with appropriate `Access-Control-Allow-Origin` headers. Picsum.photos supports this by default.

### Challenge 2: Circular Profile Picture Clipping
**Problem**: Canvas has no native "circular image" method. Drawing a rectangular image and trying to mask it requires understanding clip paths.

**Solution**: Use `ctx.save()` → `ctx.arc()` → `ctx.clip()` → `ctx.drawImage()` → `ctx.restore()`. The save/restore pattern ensures the clip doesn't affect subsequent drawing operations.

### Challenge 3: Font Loading for Canvas
**Problem**: Canvas `fillText()` uses whatever font is currently loaded. If the Google Font hasn't finished loading when the canvas renders, it falls back to a system font, causing inconsistent appearance.

**Solution**: 
1. Fonts are loaded via `<link>` in `index.html` with `rel="preconnect"` for faster loading
2. The canvas re-renders when the component mounts (by which time fonts are typically loaded)
3. Fallback font stacks (`Playfair Display, serif` / `DM Sans, sans-serif`) ensure graceful degradation

### Challenge 4: Mobile Share API Compatibility
**Problem**: The Web Share API (`navigator.share()`) is not supported on all browsers. File sharing (`navigator.share({ files })`) has even more limited support.

**Solution**: 
1. Feature-detect with `if (navigator.share)` before attempting native share
2. Check file sharing support with `navigator.canShare({ files })`
3. Provide fallback options: WhatsApp deep link, direct download, and clipboard copy
4. Toast notifications inform the user which method was used

### Challenge 5: Responsive Canvas Display
**Problem**: Canvas has fixed pixel dimensions (400×500) but needs to display responsively across screen sizes without distortion.

**Solution**: Set the canvas `width`/`height` attributes to the desired pixel resolution (400×500) but use CSS `width: 100%; height: 100%` with the container maintaining the correct aspect ratio via `aspect-ratio: 4/5`.

---

## 5. Future Improvements

### Short Term
- **Firebase CDN for templates**: Replace picsum.photos with Firebase Storage-hosted template images for reliability and offline support
- **Template search**: Add a search bar to find templates by keyword
- **Custom text editing**: Allow users to edit the quote text on cards

### Medium Term
- **AI-generated quotes**: Integrate GPT API to generate personalized quotes based on the occasion and recipient's name
- **Template builder**: Admin panel for uploading and managing templates
- **Analytics**: Track template popularity, conversion rates, and user engagement

### Long Term
- **React Native port**: Build native iOS/Android apps sharing the same Firebase backend
- **Server-side rendering with Sharp.js**: Generate high-quality images on the server for better performance and consistency
- **Multi-language support**: RTL support for Arabic/Urdu, Devanagari for Hindi
- **Collaborative cards**: Multiple users contribute to a single group greeting card
- **Print integration**: Partner with printing services for physical card delivery

### Scalability Considerations
- **Image CDN**: Use Cloudflare Images or imgix for on-the-fly image transformations and caching
- **Firestore pagination**: Implement cursor-based pagination for template listings as the catalog grows
- **Code splitting**: React.lazy() for route-level code splitting to reduce initial bundle size
- **Service Worker**: Cache templates and static assets for offline-first experience
- **Edge functions**: Move image processing to Cloudflare Workers or Vercel Edge Functions for global low-latency rendering
