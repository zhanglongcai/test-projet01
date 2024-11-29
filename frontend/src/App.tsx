import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import { Home } from './pages/Home';

function App() {
  const [count, setCount] = useState(0);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AnimatePresence mode="wait">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Layout>
        </Router>
      </AnimatePresence>
      <Toaster position="top-right" />
    </GoogleOAuthProvider>
  );
}

export default App;