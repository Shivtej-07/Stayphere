import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Stays from './pages/Stays';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import ChatAssistant from './components/ChatAssistant';
import LiveNotifications from './components/LiveNotifications';

import Transport from './pages/Transport';

import AdminDashboard from './pages/AdminDashboard';
import StayDetails from './pages/StayDetails';
import DestinationDetails from './pages/DestinationDetails';
import Favorites from './pages/Favorites';
import About from './pages/About';
import ContactUs from './pages/ContactUs';

import ConnectionErrorBanner from './components/ConnectionErrorBanner';

const LayoutWrapper = () => {
  return (
    <>
      <ConnectionErrorBanner />
      <Navbar />
      <Outlet />
      <Footer />
      <ChatAssistant />
      <LiveNotifications />
    </>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes with Navbar */}
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/stays" element={<Stays />} />
          <Route path="/stays/:id" element={<StayDetails />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>

        {/* Admin Route without Navbar */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-primary selection:text-white">
        <AnimatedRoutes />
      </div>
    </Router>
  )
}

export default App
