import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'
import Header from './components/Header'
import PollsView from './components/PollsView'
import { PollsContextProvider } from './Service/PollsContext.tsx'
import Create from './components/Create.tsx'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';

function App() {
  return (
    <PollsContextProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<PollsView />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
        <Create />
        <ToastContainer />
      </GoogleOAuthProvider>
    </PollsContextProvider>
  )
}

export default App
