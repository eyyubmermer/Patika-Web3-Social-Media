import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { MoralisProvider } from 'react-moralis'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MoralisProvider
        appId={"NN5VHIRayGPgzwXQ150t5rpMAKdkU4dCURpVWTu5"}
        serverUrl={"https://cj8auehnqhqu.usemoralis.com:2053/server"}
      >
        <Navbar />
        <Component {...pageProps} />
      </MoralisProvider>
    </>
  )
}

export default MyApp
