// /pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add any other head tags here */}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Register the service worker */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker
                      .register('/sw.js')
                      .then(function(registration) {
                        console.log('Service Worker registered with scope:', registration.scope);
                      })
                      .catch(function(error) {
                        console.log('Service Worker registration failed:', error);
                      });
                  });
                }
              `,
            }}
          />
        </body>
      </Html>
    )
  }
}

export default MyDocument
