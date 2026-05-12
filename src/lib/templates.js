/**
 * Mock template data for greeting cards.
 * Each template has an id, category, imageUrl, premium status, and optional quotes.
 * Uses deterministic picsum.photos seeds for consistent images.
 */

export const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💑' },
  { id: 'diwali', label: 'Diwali', emoji: '🪔' },
  { id: 'eid', label: 'Eid', emoji: '🌙' },
  { id: 'christmas', label: 'Christmas', emoji: '🎄' },
  { id: 'shayari', label: 'Shayari', emoji: '💬' },
  { id: 'joke', label: 'Jokes', emoji: '😄' },
  { id: 'motivational', label: 'Motivational', emoji: '💪' },
];

export const templates = [
  {
    id: 't1',
    category: 'birthday',
    imageUrl: 'https://picsum.photos/seed/birthday1/400/500',
    isPremium: false,
    quote: 'Wishing you all the happiness in the world! 🎉',
  },
  {
    id: 't2',
    category: 'birthday',
    imageUrl: 'https://picsum.photos/seed/birthday2/400/500',
    isPremium: false,
    quote: 'May your birthday be filled with sunshine and smiles!',
  },
  {
    id: 't3',
    category: 'anniversary',
    imageUrl: 'https://picsum.photos/seed/anniversary1/400/500',
    isPremium: false,
    quote: 'Happy Anniversary! Here\'s to many more years of love ❤️',
  },
  {
    id: 't4',
    category: 'anniversary',
    imageUrl: 'https://picsum.photos/seed/anniversary2/400/500',
    isPremium: false,
    quote: 'Love grows stronger with each passing year 💕',
  },
  {
    id: 't5',
    category: 'diwali',
    imageUrl: 'https://picsum.photos/seed/diwali1/400/500',
    isPremium: false,
    quote: 'May the festival of lights bring joy to your life! 🪔✨',
    quoteHindi: 'दीपावली की हार्दिक शुभकामनाएं!',
  },
  {
    id: 't6',
    category: 'diwali',
    imageUrl: 'https://picsum.photos/seed/diwali2/400/500',
    isPremium: false,
    quote: 'Wishing you a Diwali full of prosperity and happiness!',
    quoteHindi: 'आपको दीपावली की बहुत-बहुत शुभकामनाएं!',
  },
  {
    id: 't7',
    category: 'eid',
    imageUrl: 'https://picsum.photos/seed/eid1/400/500',
    isPremium: false,
    quote: 'Eid Mubarak! May this blessed day bring peace and joy 🌙',
  },
  {
    id: 't8',
    category: 'christmas',
    imageUrl: 'https://picsum.photos/seed/christmas1/400/500',
    isPremium: false,
    quote: 'Merry Christmas! May your holidays sparkle with joy 🎄',
  },
  {
    id: 't9',
    category: 'shayari',
    imageUrl: 'https://picsum.photos/seed/shayari1/400/500',
    isPremium: false,
    quote: 'Dil se dil tak, pyaar ka safar... ❤️',
    quoteHindi: 'दिल से दिल तक, प्यार का सफर...',
  },
  {
    id: 't10',
    category: 'joke',
    imageUrl: 'https://picsum.photos/seed/joke1/400/500',
    isPremium: false,
    quote: 'Laughter is the best medicine — here\'s your daily dose! 😄',
  },
  {
    id: 't11',
    category: 'motivational',
    imageUrl: 'https://picsum.photos/seed/motivate1/400/500',
    isPremium: false,
    quote: 'Believe in yourself. Every expert was once a beginner. 💪',
  },
  {
    id: 't12',
    category: 'motivational',
    imageUrl: 'https://picsum.photos/seed/motivate2/400/500',
    isPremium: false,
    quote: 'Dream big, work hard, stay focused. 🚀',
  },
  // === Premium Templates (t13 — t20) ===
  {
    id: 't13',
    category: 'birthday',
    imageUrl: 'https://picsum.photos/seed/bday-premium1/400/500',
    isPremium: true,
    quote: 'A premium birthday wish just for you! 🎂✨',
  },
  {
    id: 't14',
    category: 'anniversary',
    imageUrl: 'https://picsum.photos/seed/anni-premium1/400/500',
    isPremium: true,
    quote: 'Celebrating your love story — premium style 💎',
  },
  {
    id: 't15',
    category: 'diwali',
    imageUrl: 'https://picsum.photos/seed/diwali-premium1/400/500',
    isPremium: true,
    quote: 'Exclusive Diwali greetings for someone special 🪔💫',
    quoteHindi: 'खास दीपावली शुभकामनाएं 💫',
  },
  {
    id: 't16',
    category: 'eid',
    imageUrl: 'https://picsum.photos/seed/eid-premium1/400/500',
    isPremium: true,
    quote: 'Premium Eid Mubarak wishes 🌙💎',
  },
  {
    id: 't17',
    category: 'christmas',
    imageUrl: 'https://picsum.photos/seed/xmas-premium1/400/500',
    isPremium: true,
    quote: 'Exclusive Christmas greetings with love 🎅✨',
  },
  {
    id: 't18',
    category: 'shayari',
    imageUrl: 'https://picsum.photos/seed/shayari-premium1/400/500',
    isPremium: true,
    quote: 'Premium shayari for the soul 💬💎',
    quoteHindi: 'दिल को छू लेने वाली शायरी...',
  },
  {
    id: 't19',
    category: 'joke',
    imageUrl: 'https://picsum.photos/seed/joke-premium1/400/500',
    isPremium: true,
    quote: 'Exclusive humor just for premium members! 😂💎',
  },
  {
    id: 't20',
    category: 'motivational',
    imageUrl: 'https://picsum.photos/seed/moti-premium1/400/500',
    isPremium: true,
    quote: 'Success is a journey, not a destination. 🏆💎',
  },
];

/**
 * Get a single template by its ID
 * @param {string} id - Template ID
 * @returns {object|undefined}
 */
export const getTemplateById = (id) => templates.find((t) => t.id === id);

/**
 * Filter templates by category
 * @param {string} category - Category slug or 'all'
 * @returns {object[]}
 */
export const getTemplatesByCategory = (category) => {
  if (category === 'all') return templates;
  return templates.filter((t) => t.category === category);
};
