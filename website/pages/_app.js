import '@/styles/globals.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export default function App({ Component, pageProps }) {
  return (
    <>
      <SiteHeader />
      <main>
        <Component {...pageProps} />
      </main>
      <SiteFooter />
    </>
  )
}
