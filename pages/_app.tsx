import { AuthProvider } from '../contexts/AuthContext'
import '../styles/globals.scss'

function NextAuth({ Component, pageProps }) {
  return (
    <AuthProvider>
       <Component {...pageProps} />
    </AuthProvider>
  )
}

export default NextAuth
