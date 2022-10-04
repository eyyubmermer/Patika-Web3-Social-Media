import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { MoralisProvider } from 'react-moralis'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MoralisProvider
        appId={""}
        serverUrl={""}
      >
        <Navbar />
        <Component {...pageProps} />
      </MoralisProvider>
    </>
  )
}

export default MyApp
