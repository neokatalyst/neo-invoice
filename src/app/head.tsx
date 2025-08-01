export const metadata = {
  title: 'Neo-Invoice',
  description: 'Smart invoice and quote platform for freelancers and businesses.',
  manifest: '/manifest.json'
}

export default function Head() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0f172a" />
      <link rel="icon" href="/web-app-manifest-192x192.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </>
  )
}
