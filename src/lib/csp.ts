export const CSP_NONCE_HEADER = 'x-csp-nonce';

function joinSources(...sources: Array<string | false | null | undefined>) {
  return sources.filter(Boolean).join(' ');
}

export function buildContentSecurityPolicy(nonce: string, isProduction: boolean): string {
  const directives = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `form-action 'self' https://accounts.google.com`,
    `script-src ${joinSources(
      `'self'`,
      `'nonce-${nonce}'`,
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://www.clarity.ms',
      'https://scripts.clarity.ms',
      'https://pagead2.googlesyndication.com',
      'https://checkout.razorpay.com',
      'https://challenges.cloudflare.com',
      'https://giscus.app',
      // vercel.live toolbar is injected on preview deployments.
      // VERCEL_ENV is 'production' only on the main domain; 'preview' on PR deploys.
      process.env.VERCEL_ENV !== 'production' && 'https://vercel.live'
    )}`,
    `style-src ${joinSources(`'self'`, `'unsafe-inline'`, 'https://fonts.googleapis.com')}`,
    `img-src ${joinSources(`'self'`, 'data:', 'blob:', 'https:')}`,
    `font-src ${joinSources(`'self'`, 'data:', 'https://fonts.gstatic.com')}`,
    `connect-src ${joinSources(
      `'self'`,
      'https://www.google-analytics.com',
      'https://region1.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://www.clarity.ms',
      'https://c.clarity.ms',
      'https://b.clarity.ms',
      'https://pagead2.googlesyndication.com',
      'https://googleads.g.doubleclick.net',
      'https://ep1.adtrafficquality.google',
      'https://ep2.adtrafficquality.google',
      'https://fundingchoicesmessages.google.com',
      'https://api.razorpay.com',
      'https://checkout.razorpay.com',
      'https://challenges.cloudflare.com',
      'https://giscus.app',
      'https://accounts.google.com',
      'https://oauth2.googleapis.com'
    )}`,
    `frame-src ${joinSources(
      `'self'`,
      'https://challenges.cloudflare.com',
      'https://checkout.razorpay.com',
      'https://giscus.app',
      'https://www.google.com',
      'https://googleads.g.doubleclick.net',
      'https://tpc.googlesyndication.com',
      'https://ep1.adtrafficquality.google',
      'https://ep2.adtrafficquality.google'
    )}`,
    `worker-src 'self' blob:`,
    `media-src 'self' blob:`,
    `manifest-src 'self'`,
    'block-all-mixed-content',
    isProduction ? 'upgrade-insecure-requests' : false,
  ];

  return directives.filter(Boolean).join('; ');
}