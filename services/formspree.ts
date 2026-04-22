
/**
 * Formspree Service
 * Centralizes all form submissions to Formspree endpoints.
 */

const ENDPOINTS = {
  GENERAL: 'mlggdqro', // Contact, Newsletter, Reviews
  ORDERS: 'mqeearzy',  // Checkout/Orders
};

const BASE_URL = 'https://formspree.io/f/';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface ReviewFormData {
  name: string;
  rating: number;
  comment: string;
  product_title: string;
}

export interface OrderFormData {
  [key: string]: any; // FormData will be used for orders to support potential file uploads
}

async function post(endpoint: string, data: any, isFormData: boolean = false) {
  const url = `${BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  };

  if (isFormData) {
    options.body = data;
  } else {
    options.headers!['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.errors?.[0]?.message || errorData.error || 'Submission failed');
  }

  return response.json();
}

export const formspreeService = {
  submitContact: (data: ContactFormData) => 
    post(ENDPOINTS.GENERAL, {
      ...data,
      _subject: `🍯 New Contact Buzz from ${data.name}`
    }),

  submitNewsletter: (data: NewsletterFormData) => 
    post(ENDPOINTS.GENERAL, {
      ...data,
      _subject: `🍯 New Hive Newsletter Subscriber: ${data.email}`,
      source: "Footer Newsletter Form"
    }),

  submitReview: (data: ReviewFormData) => 
    post(ENDPOINTS.GENERAL, {
      ...data,
      _subject: `🐝 New Hive Review for ${data.product_title}`
    }),

  submitOrder: (data: FormData) => 
    post(ENDPOINTS.ORDERS, data, true),
};
