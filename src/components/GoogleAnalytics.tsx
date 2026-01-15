'use client'

import Script from 'next/script'

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  // 🛡️ Sentinel: Validate GA ID to prevent XSS and injection
  // Allow alphanumeric and hyphens only (standard GA format)
  // Limit length to 20 characters
  if (!/^[a-zA-Z0-9-]+$/.test(gaId) || gaId.length > 20) {
    console.error(`Security: Invalid GA ID format: ${gaId.substring(0, 50)}...`);
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
