import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1a6b3c" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
