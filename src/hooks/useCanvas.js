/**
 * useCanvas hook — HTML5 Canvas rendering engine for greeting cards.
 *
 * Compositing pipeline:
 *  1. Draw template background image (cover-fit)
 *  2. Draw semi-transparent dark strip at top
 *  3. Draw user's profile picture as a circle with white + green ring
 *  4. Draw user's display name centered in the top strip
 *  5. Draw optional quote text at the bottom with overlay
 */
import { useCallback } from 'react';

/**
 * Load an image from a URL and return an HTMLImageElement.
 * Sets crossOrigin to "anonymous" so we can export the canvas.
 */
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });

/**
 * Draw an image cover-fit into canvas dimensions.
 */
const drawCoverImage = (ctx, img, cw, ch) => {
  const imgRatio = img.width / img.height;
  const canvasRatio = cw / ch;
  let sx, sy, sw, sh;

  if (imgRatio > canvasRatio) {
    sh = img.height;
    sw = sh * canvasRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / canvasRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
};

/**
 * Draw a circular clipped image at (x, y) with radius r.
 */
const drawCircularImage = (ctx, img, x, y, r) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
  ctx.restore();
};

/**
 * Main rendering function.
 *
 * @param {HTMLCanvasElement} canvas - Target canvas element
 * @param {object} template - Template object from templates.js
 * @param {object} userProfile - { displayName, photoURL }
 */
const renderCard = async (canvas, template, userProfile) => {
  const ctx = canvas.getContext('2d');
  const cw = canvas.width;
  const ch = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, cw, ch);

  // 1. Draw background
  try {
    const bgImg = await loadImage(template.imageUrl);
    drawCoverImage(ctx, bgImg, cw, ch);
  } catch {
    // Fallback: gradient background
    const grad = ctx.createLinearGradient(0, 0, cw, ch);
    grad.addColorStop(0, '#FF6B35');
    grad.addColorStop(1, '#FFD700');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
  }

  // 2. Dark strip at top for name area
  const stripHeight = 70;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, cw, stripHeight);

  // 3. User avatar (circle with rings)
  const avatarRadius = 22;
  const avatarCenterX = 45;
  const avatarCenterY = stripHeight / 2;

  if (userProfile?.photoURL) {
    try {
      const avatarImg = await loadImage(userProfile.photoURL);

      // Outer green ring
      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, avatarRadius + 5, 0, Math.PI * 2);
      ctx.fillStyle = '#22C55E';
      ctx.fill();

      // White ring
      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, avatarRadius + 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Avatar image
      drawCircularImage(ctx, avatarImg, avatarCenterX, avatarCenterY, avatarRadius);
    } catch {
      // Fallback circle
      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6B35';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        (userProfile?.displayName || 'U')[0].toUpperCase(),
        avatarCenterX,
        avatarCenterY
      );
    }
  } else {
    // No photo — draw initial circle
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius + 5, 0, Math.PI * 2);
    ctx.fillStyle = '#22C55E';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius + 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6B35';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      (userProfile?.displayName || 'U')[0].toUpperCase(),
      avatarCenterX,
      avatarCenterY
    );
  }

  // 4. Display name
  const name = userProfile?.displayName || 'Your Name';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px Playfair Display, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, cw / 2 + 20, stripHeight / 2);

  // 5. Quote at bottom
  if (template.quote) {
    const quoteBoxHeight = 90;
    const quoteY = ch - quoteBoxHeight;

    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, quoteY, cw, quoteBoxHeight);

    // Quote text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Simple word-wrap
    const words = template.quote.split(' ');
    const maxWidth = cw - 40;
    let line = '';
    const lines = [];

    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = test;
      }
    }
    if (line.trim()) lines.push(line.trim());

    const lineHeight = 22;
    const totalTextHeight = lines.length * lineHeight;
    const startY = quoteY + (quoteBoxHeight - totalTextHeight) / 2 + lineHeight / 2;

    lines.forEach((l, i) => {
      ctx.fillText(l, cw / 2, startY + i * lineHeight);
    });
  }
};

/**
 * Custom hook that exposes the renderCard function and download helper.
 */
const useCanvas = () => {
  const render = useCallback(
    async (canvas, template, userProfile) => {
      if (!canvas || !template) return;
      await renderCard(canvas, template, userProfile);
    },
    []
  );

  const downloadCard = useCallback((canvas, filename = 'greeting_card.png') => {
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, []);

  const getCardBlob = useCallback(
    (canvas) =>
      new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      }),
    []
  );

  return { render, downloadCard, getCardBlob };
};

export default useCanvas;
