// This file maps voice commands (intents) to actions/routes.
// You can expand this as needed for more advanced logic.

export type IntentAction =
  | { type: 'route'; path: string }
  | { type: 'filter'; filterType: string; value: string }
  | { type: 'sort'; sortType: string }
  | { type: 'search'; query: string }
  | { type: 'addToCart'; productTitle?: string }
  | { type: 'productDetail'; productTitle: string }
  | { type: 'artistDetail'; artistUsername: string }
  | { type: 'orderStatus'; status: string }
  | { type: 'paymentStatus'; status: string }
  | { type: 'productInfo'; infoType: string; productTitle: string }
  | { type: 'unknown' };

// Example static mapping for simple navigation
const staticIntentMap: Record<string, IntentAction> = {
  // Home
  'go to home': { type: 'route', path: '/' },
  'home': { type: 'route', path: '/' },
  'back home': { type: 'route', path: '/' },
  'home page': { type: 'route', path: '/' },
  'open home': { type: 'route', path: '/' },
  'back to home': { type: 'route', path: '/' },
  'take me home': { type: 'route', path: '/' },
  'return home': { type: 'route', path: '/' },
  'show home': { type: 'route', path: '/' },
  'back to homepage': { type: 'route', path: '/' },
  'take me to the homepage': { type: 'route', path: '/' },
  'navigate home': { type: 'route', path: '/' },
  
  // Gallery/Artworks
  'show artworks': { type: 'route', path: '/gallery' },
  'artworks': { type: 'route', path: '/gallery' },
  'collection': { type: 'route', path: '/gallery' },
  'gallery': { type: 'route', path: '/gallery' },
  'what do you have': { type: 'route', path: '/gallery' },
  'anything available': { type: 'route', path: '/gallery' },
  'view gallery': { type: 'route', path: '/gallery' },
  'open gallery': { type: 'route', path: '/gallery' },
  'see artworks': { type: 'route', path: '/gallery' },
  'browse artworks': { type: 'route', path: '/gallery' },
  'explore artworks': { type: 'route', path: '/gallery' },
  'show me artworks': { type: 'route', path: '/gallery' },
  'view art collection': { type: 'route', path: '/gallery' },
  'browse art': { type: 'route', path: '/gallery' },
  'see what\'s available': { type: 'route', path: '/gallery' },
  'show available art': { type: 'route', path: '/gallery' },
  'explore gallery': { type: 'route', path: '/gallery' },
  'show art pieces': { type: 'route', path: '/gallery' },
  'view art store': { type: 'route', path: '/gallery' },
  'browse the gallery': { type: 'route', path: '/gallery' },
  'see art items': { type: 'route', path: '/gallery' },
  'show products': { type: 'route', path: '/gallery' },
  'view products': { type: 'route', path: '/gallery' },
  'explore art store': { type: 'route', path: '/gallery' },
  'see what you have': { type: 'route', path: '/gallery' },
  'show all artworks': { type: 'route', path: '/gallery' },
  'view all art': { type: 'route', path: '/gallery' },
  'browse products': { type: 'route', path: '/gallery' },
  'open artworks': { type: 'route', path: '/gallery' },
  'go to artworks': { type: 'route', path: '/gallery' },
  'display artworks': { type: 'route', path: '/gallery' },
  'view collection': { type: 'route', path: '/gallery' },
  'see the collection': { type: 'route', path: '/gallery' },
  'explore collection': { type: 'route', path: '/gallery' },
  
  // Cart
  'go to cart': { type: 'route', path: '/cart' },
  'my cart': { type: 'route', path: '/cart' },
  'cart': { type: 'route', path: '/cart' },
  'show my cart': { type: 'route', path: '/cart' },
  'view cart': { type: 'route', path: '/cart' },
  'open my cart': { type: 'route', path: '/cart' },
  'proceed to cart': { type: 'route', path: '/cart' },
  'take me to my cart': { type: 'route', path: '/cart' },
  'see my cart': { type: 'route', path: '/cart' },
  'check my cart': { type: 'route', path: '/cart' },
  'what\'s in my cart': { type: 'route', path: '/cart' },
  'show cart items': { type: 'route', path: '/cart' },
  'view cart items': { type: 'route', path: '/cart' },
  'see items in my cart': { type: 'route', path: '/cart' },
  'display my cart': { type: 'route', path: '/cart' },
  'open cart': { type: 'route', path: '/cart' },
  'review my cart': { type: 'route', path: '/cart' },
  'view shopping cart': { type: 'route', path: '/cart' },
  'show shopping cart': { type: 'route', path: '/cart' },
  'check cart contents': { type: 'route', path: '/cart' },
  'see cart details': { type: 'route', path: '/cart' },
  
  // Checkout
  'go to checkout': { type: 'route', path: '/checkout' },
  'checkout': { type: 'route', path: '/checkout' },
  'proceed to checkout': { type: 'route', path: '/checkout' },
  'open checkout': { type: 'route', path: '/checkout' },
  'continue to checkout': { type: 'route', path: '/checkout' },
  'move to checkout': { type: 'route', path: '/checkout' },
  'checkout now': { type: 'route', path: '/checkout' },
  'place an order': { type: 'route', path: '/checkout' },
  'i want to place an order': { type: 'route', path: '/checkout' },
  'can i place an order': { type: 'route', path: '/checkout' },
  'start checkout': { type: 'route', path: '/checkout' },
  'complete my order': { type: 'route', path: '/checkout' },
  'finish checkout': { type: 'route', path: '/checkout' },
  'confirm my order': { type: 'route', path: '/checkout' },
  'finalize my order': { type: 'route', path: '/checkout' },
  'order now': { type: 'route', path: '/checkout' },
  'continue to place order': { type: 'route', path: '/checkout' },
  'take me to checkout': { type: 'route', path: '/checkout' },
  'ready to place an order': { type: 'route', path: '/checkout' },
  'begin checkout': { type: 'route', path: '/checkout' },
  'submit my order': { type: 'route', path: '/checkout' },
  
  // Orders
  'show my orders': { type: 'route', path: '/orders' },
  'orders': { type: 'route', path: '/orders' },
  'my orders': { type: 'route', path: '/orders' },
  'view my orders': { type: 'route', path: '/orders' },
  'see my orders': { type: 'route', path: '/orders' },
  'go to orders': { type: 'route', path: '/orders' },
  'proceed to orders': { type: 'route', path: '/orders' },
  'open orders': { type: 'route', path: '/orders' },
  'order history': { type: 'route', path: '/orders' },
  'view order history': { type: 'route', path: '/orders' },
  'see previous orders': { type: 'route', path: '/orders' },
  'can i see my previous orders': { type: 'route', path: '/orders' },
  'what have i ordered': { type: 'route', path: '/orders' },
  'what have i bought': { type: 'route', path: '/orders' },
  'show what i ordered': { type: 'route', path: '/orders' },
  'display my orders': { type: 'route', path: '/orders' },
  
  // Payments
  'show my payments': { type: 'route', path: '/payments' },
  'payments': { type: 'route', path: '/payments' },
  'my payments': { type: 'route', path: '/payments' },
  'view my payments': { type: 'route', path: '/payments' },
  'see my payments': { type: 'route', path: '/payments' },
  'open payments': { type: 'route', path: '/payments' },
  'proceed to payments': { type: 'route', path: '/payments' },
  'past payments': { type: 'route', path: '/payments' },
  'view past payments': { type: 'route', path: '/payments' },
  'see past payments': { type: 'route', path: '/payments' },
  'show past payments': { type: 'route', path: '/payments' },
  'payment history': { type: 'route', path: '/payments' },
  'view payment history': { type: 'route', path: '/payments' },
  'see payment history': { type: 'route', path: '/payments' },
  'display my payments': { type: 'route', path: '/payments' },
  'display past payments': { type: 'route', path: '/payments' },
  'check my payments': { type: 'route', path: '/payments' },
  'check past payments': { type: 'route', path: '/payments' },
  'review payments': { type: 'route', path: '/payments' },
  'review past payments': { type: 'route', path: '/payments' },
  'show payment details': { type: 'route', path: '/payments' },
  
  // Artists
  'show artists': { type: 'route', path: '/artists' },
  'artists': { type: 'route', path: '/artists' },
  'artworker profiles': { type: 'route', path: '/artists' },
  'artworkers': { type: 'route', path: '/artists' },
  'go to artists': { type: 'route', path: '/artists' },
  'view artists': { type: 'route', path: '/artists' },
  'open artists': { type: 'route', path: '/artists' },
  'browse artists': { type: 'route', path: '/artists' },
  'explore artists': { type: 'route', path: '/artists' },
  'take me to artists': { type: 'route', path: '/artists' },
  'display artists': { type: 'route', path: '/artists' },
  'artists page': { type: 'route', path: '/artists' },
  'go see artists': { type: 'route', path: '/artists' },
  'show me artists': { type: 'route', path: '/artists' },
  'view artist list': { type: 'route', path: '/artists' },
  'check artists': { type: 'route', path: '/artists' },
  'explore artist list': { type: 'route', path: '/artists' },
  'open artist page': { type: 'route', path: '/artists' },
  
  // Login/Signup
  'login': { type: 'route', path: '/login' },
  'getting started': { type: 'route', path: '/login' },
  'register': { type: 'route', path: '/signup' },
  'allow me to get started': { type: 'route', path: '/signup' },
  'let me register': { type: 'route', path: '/signup' },
  'sign up': { type: 'route', path: '/signup' },
  'create account': { type: 'route', path: '/signup' },
  
  // General artworks/gallery navigation (questions)
  'what artworks do you have': { type: 'route', path: '/gallery' },
  'can you show me the artworks in your store': { type: 'route', path: '/gallery' },
  'i\'d like to see the artworks you offer': { type: 'route', path: '/gallery' },
  'what kind of artworks are on display': { type: 'route', path: '/gallery' },
  'what\'s currently in your art collection': { type: 'route', path: '/gallery' },
  'can i browse your artworks': { type: 'route', path: '/gallery' },
  'please show me what artworks you have': { type: 'route', path: '/gallery' },
  'what art pieces are available right now': { type: 'route', path: '/gallery' },
  'let me see the artworks you\'re selling': { type: 'route', path: '/gallery' },
  'what can i find in your art store': { type: 'route', path: '/gallery' },
  'display the artworks you have': { type: 'route', path: '/gallery' },
  'i\'d like to explore your artworks': { type: 'route', path: '/gallery' },
  'can you take me to the artworks section': { type: 'route', path: '/gallery' },
  'show me your art products': { type: 'route', path: '/gallery' },
  'what artworks are in stock': { type: 'route', path: '/gallery' },
  'i want to view the artworks you have': { type: 'route', path: '/gallery' },
  'proceed to the artworks please': { type: 'route', path: '/gallery' },
  'can i see your art collection': { type: 'route', path: '/gallery' },
  'show me everything you have in terms of art': { type: 'route', path: '/gallery' },
  'what art items do you offer': { type: 'route', path: '/gallery' },
  'let me browse the available art pieces': { type: 'route', path: '/gallery' },
  'what\'s available in your gallery': { type: 'route', path: '/gallery' },
  'take me to the artworks page': { type: 'route', path: '/gallery' },
  'show me the art products in the store': { type: 'route', path: '/gallery' },
  'i\'m interested in seeing your artworks': { type: 'route', path: '/gallery' },
  'what artworks can i look at': { type: 'route', path: '/gallery' },
  'display all available artworks': { type: 'route', path: '/gallery' },
  'can you show me what art is available': { type: 'route', path: '/gallery' },
  'i\'d like to see what\'s in your art store': { type: 'route', path: '/gallery' },
};

// Helper for dynamic intent extraction
export function parseIntent(transcript: string): IntentAction {
  const lower = transcript.trim().toLowerCase();
  
  // Check static mappings first
  if (staticIntentMap[lower]) return staticIntentMap[lower];

  // Dynamic: Product details (view product page)
  const productDetailMatch = lower.match(/(?:i want|show me|i'd like to see|can you show|display|view|let me see|open|take me to|i'm interested in|show details for|view details of|show details|go to|browse|preview|see|i want to view|show me more about|display information for) (.+)/);
  if (productDetailMatch) {
    const productTitle = productDetailMatch[1]
      .replace(/details?( of| for)?/i, '')
      .replace(/information for/i, '')
      .replace(/more about/i, '')
      .trim();
    if (productTitle && productTitle !== 'it' && productTitle !== 'this') {
      return { type: 'productDetail', productTitle };
    }
  }

  // Dynamic: Product information queries (price, description, owner)
  const productInfoMatch = lower.match(/(?:what is the price for|how much is|description for|the owner of|tell me about|what is|describe|who owns) (.+)/);
  if (productInfoMatch) {
    const productTitle = productInfoMatch[1].trim();
    let infoType = 'general';
    
    if (lower.includes('price') || lower.includes('how much')) infoType = 'price';
    else if (lower.includes('description') || lower.includes('describe') || lower.includes('tell me about')) infoType = 'description';
    else if (lower.includes('owner') || lower.includes('who owns')) infoType = 'owner';
    
    return { type: 'productInfo', infoType, productTitle };
  }

  // Dynamic: Add to cart
  const addToCartMatch = lower.match(/(?:add|buy|put|i want) (.+) (?:to cart|in my cart|in cart)/);
  if (addToCartMatch) {
    return { type: 'addToCart', productTitle: addToCartMatch[1].trim() };
  }
  // Add "it" or "this" to cart
  if (lower.match(/add (it|this) to cart/i) || lower.match(/buy (it|this)/i) || 
      lower.match(/put (it|this) in my cart/i) || lower.match(/i want (it|this) in my cart/i)) {
    return { type: 'addToCart' }; // productTitle will be handled by UI context
  }

  // Dynamic: Artist details
  const artistDetailMatch = lower.match(/(?:show|view|open|go to|see|explore|check|take me to|more about) (.+?)(?:'s profile|'s page| details| profile)?$/);
  if (artistDetailMatch) {
    const artistUsername = artistDetailMatch[1]
      .replace(/'s profile/i, '')
      .replace(/'s page/i, '')
      .replace(/ details/i, '')
      .replace(/ profile/i, '')
      .trim();
    return { type: 'artistDetail', artistUsername };
  }

  // Dynamic: Filter (gallery)
  const filterMatch = lower.match(/filter by (category|medium|artist|price|prices) (.+)/);
  if (filterMatch) {
    let filterType = filterMatch[1];
    let value = filterMatch[2].trim();
    
    // Handle price ranges
    if (filterType === 'price' || filterType === 'prices') {
      if (value.includes('under $100')) value = 'under-100';
      else if (value.includes('$100 - $500')) value = '100-500';
      else if (value.includes('$500 - $1,000')) value = '500-1000';
      else if (value.includes('$1,000 - $5,000')) value = '1000-5000';
      else if (value.includes('$5,000')) value = '5000+';
    }
    
    return { type: 'filter', filterType, value };
  }

  // Dynamic: Sort (gallery)
  if (lower.includes('sort by') || lower.includes('sort the')) {
    if (lower.includes('older')) return { type: 'sort', sortType: 'older' };
    if (lower.includes('newer')) return { type: 'sort', sortType: 'newer' };
    if (lower.includes('price high to low')) return { type: 'sort', sortType: 'price-desc' };
    if (lower.includes('price low to high')) return { type: 'sort', sortType: 'price-asc' };
    if (lower.includes('title a-z')) return { type: 'sort', sortType: 'title-asc' };
    if (lower.includes('title z-a')) return { type: 'sort', sortType: 'title-desc' };
  }

  // Dynamic: Search
  const searchMatch = lower.match(/search (for )?(.+)/);
  if (searchMatch) {
    return { type: 'search', query: searchMatch[2].trim() };
  }

  // Dynamic: Orders by status
  const orderStatusPatterns = [
    /(pending payment|confirmed|processing|shipped|paid|delivered) orders?/i,
    /show me orders that are (pending payment|confirmed|processing|shipped|paid|delivered)/i,
    /i want to see (pending payment|confirmed|processing|shipped|paid|delivered) orders/i,
    /display (pending payment|confirmed|processing|shipped|paid|delivered) orders/i,
    /show orders that are (pending payment|confirmed|processing|shipped|paid|delivered)/i,
    /i want to view (pending payment|confirmed|processing|shipped|paid|delivered) orders/i,
    /filter orders by (pending payment|confirmed|processing|shipped|paid|delivered)/i,
    /only show (pending payment|confirmed|processing|shipped|paid|delivered) orders/i,
    /view orders with status (pending payment|confirmed|processing|shipped|paid|delivered)/i,
    /show orders that are (shipped or processing)/i
  ];

  for (const pattern of orderStatusPatterns) {
    const orderStatusMatch = lower.match(pattern);
    if (orderStatusMatch) {
      let status = orderStatusMatch[1].toLowerCase();
      // Handle "shipped or processing" case
      if (status.includes('shipped or processing')) {
        status = 'shipped,processing';
      }
      return { type: 'orderStatus', status };
    }
  }

  // Dynamic: Payments by status
  const paymentStatusPatterns = [
    /(pending|successful|refunded|canceled|failed|all) payments?/i,
    /show (pending|successful|refunded|canceled|failed|all) payments/i,
    /view (pending|successful|refunded|canceled|failed|all) payments/i,
    /only show (pending|successful|refunded|canceled|failed|all) payments/i
  ];

  for (const pattern of paymentStatusPatterns) {
    const paymentStatusMatch = lower.match(pattern);
    if (paymentStatusMatch) {
      return { type: 'paymentStatus', status: paymentStatusMatch[1].toLowerCase() };
    }
  }

  // Fallback
  return { type: 'unknown' };
}