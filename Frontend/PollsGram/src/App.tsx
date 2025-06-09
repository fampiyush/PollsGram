import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'
import Header from './components/Header'
import PollsView from './components/PollsView'
import { PollsContextProvider } from './Service/PollsContext.tsx'
import Create from './components/Create.tsx'

function App() {
  return (
    <PollsContextProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Header />
        <PollsView />
        <Create />
      </GoogleOAuthProvider>
    </PollsContextProvider>
  )
}

export default App
