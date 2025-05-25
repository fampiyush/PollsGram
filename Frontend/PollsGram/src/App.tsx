import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'
import Header from './components/Header'
import PollsView from './components/PollsView'

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Header />
        <PollsView />
      </GoogleOAuthProvider>
    </>
  )
}

export default App
