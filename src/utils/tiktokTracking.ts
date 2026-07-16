// TikTok Pixel Event Tracking Utility
// Pixel ID: D62IRV3C77U69UNGJPLG

declare global {
  interface Window {
    ttq: {
      track: (event: string, params?: object, options?: object) => void;
      identify: (params: object) => void;
      page: () => void;
    };
  }
}

// SHA-256 hashing function for PII data
async function hashSHA256(value: string): Promise<string> {
  if (!value) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(value.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate unique event ID
function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Identify user with hashed PII
export async function ttqIdentify(params: {
  email?: string;
  phone?: string;
  externalId?: string;
}) {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  const identifyParams: Record<string, string> = {};
  
  if (params.email) {
    identifyParams.email = await hashSHA256(params.email);
  }
  if (params.phone) {
    identifyParams.phone_number = await hashSHA256(params.phone);
  }
  if (params.externalId) {
    identifyParams.external_id = await hashSHA256(params.externalId);
  }
  
  if (Object.keys(identifyParams).length > 0) {
    window.ttq.identify(identifyParams);
  }
}

// Track ViewContent event
export function ttqViewContent(params: {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
  contentType?: string;
}) {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq.track('ViewContent', {
    contents: [{
      content_id: params.contentId,
      content_type: params.contentType || 'product',
      content_name: params.contentName
    }],
    value: params.value,
    currency: params.currency
  }, {
    event_id: generateEventId()
  });
}

// Track AddToCart event
export function ttqAddToCart(params: {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
  contentType?: string;
}) {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq.track('AddToCart', {
    contents: [{
      content_id: params.contentId,
      content_type: params.contentType || 'product',
      content_name: params.contentName
    }],
    value: params.value,
    currency: params.currency
  }, {
    event_id: generateEventId()
  });
}

// Track InitiateCheckout event
export function ttqInitiateCheckout(params: {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
  contentType?: string;
}) {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq.track('InitiateCheckout', {
    contents: [{
      content_id: params.contentId,
      content_type: params.contentType || 'product',
      content_name: params.contentName
    }],
    value: params.value,
    currency: params.currency
  }, {
    event_id: generateEventId()
  });
}

// Track AddPaymentInfo event
export function ttqAddPaymentInfo(params: {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
  contentType?: string;
}) {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq.track('AddPaymentInfo', {
    contents: [{
      content_id: params.contentId,
      content_type: params.contentType || 'product',
      content_name: params.contentName
    }],
    value: params.value,
    currency: params.currency
  }, {
    event_id: generateEventId()
  });
}

// Track PlaceAnOrder event
export function ttqPlaceAnOrder(params: {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
  contentType?: string;
}) {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq.track('PlaceAnOrder', {
    contents: [{
      content_id: params.contentId,
      content_type: params.contentType || 'product',
      content_name: params.contentName
    }],
    value: params.value,
    currency: params.currency
  }, {
    event_id: generateEventId()
  });
}

// Track Purchase/CompletePayment event
export function ttqPurchase(params: {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
  contentType?: string;
}) {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq.track('Purchase', {
    contents: [{
      content_id: params.contentId,
      content_type: params.contentType || 'product',
      content_name: params.contentName
    }],
    value: params.value,
    currency: params.currency
  }, {
    event_id: generateEventId()
  });
}

// Track CompleteRegistration event
export function ttqCompleteRegistration(params?: {
  contentId?: string;
  contentName?: string;
  value?: number;
  currency?: string;
}) {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  const trackParams: Record<string, unknown> = {};
  
  if (params?.contentId) {
    trackParams.contents = [{
      content_id: params.contentId,
      content_type: 'product',
      content_name: params.contentName || 'registration'
    }];
  }
  if (params?.value) {
    trackParams.value = params.value;
  }
  if (params?.currency) {
    trackParams.currency = params.currency;
  }
  
  window.ttq.track('CompleteRegistration', trackParams, {
    event_id: generateEventId()
  });
}

// Track Search event
export function ttqSearch(params: {
  searchString: string;
  contentId?: string;
  contentName?: string;
  value?: number;
  currency?: string;
}) {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  const trackParams: Record<string, unknown> = {
    search_string: params.searchString
  };
  
  if (params.contentId) {
    trackParams.contents = [{
      content_id: params.contentId,
      content_type: 'product',
      content_name: params.contentName || ''
    }];
  }
  if (params.value) {
    trackParams.value = params.value;
  }
  if (params.currency) {
    trackParams.currency = params.currency;
  }
  
  window.ttq.track('Search', trackParams, {
    event_id: generateEventId()
  });
}

// Track AddToWishlist event
export function ttqAddToWishlist(params: {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
  contentType?: string;
}) {
  if (typeof window === 'undefined' || !window.ttq) return;
  
  window.ttq.track('AddToWishlist', {
    contents: [{
      content_id: params.contentId,
      content_type: params.contentType || 'product',
      content_name: params.contentName
    }],
    value: params.value,
    currency: params.currency
  }, {
    event_id: generateEventId()
  });
}
