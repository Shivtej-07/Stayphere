import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Stays from './pages/Stays';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import ChatAssistant from './components/ChatAssistant';
import LiveNotifications from './components/LiveNotifications';

import Transport from './pages/Transport';

import AdminDashboard from './pages/AdminDashboard';
import StayDetails from './pages/StayDetails';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ChatAssistant />
      <LiveNotifications />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-primary selection:text-white">
        <Routes>
          {/* Public Routes with Navbar */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/stays" element={<Layout><Stays /></Layout>} />
          <Route path="/stays/:id" element={<Layout><StayDetails /></Layout>} />
          <Route path="/transport" element={<Layout><Transport /></Layout>} />
          <Route path="/about" element={<Layout><div className="pt-24 text-center">About Page (Coming Soon)</div></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />

          {/* Admin Route without Navbar */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
