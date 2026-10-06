import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Browse from './pages/Browse';
import ItemDetails from './pages/ItemDetails';
import Impact from './pages/Impact';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyListings from './pages/MyListings';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import MyRequests from './pages/MyRequests';
import IncomingRequests from './pages/IncomingRequests';
import MyExchanges from './pages/MyExchanges';
import MyDonations from './pages/MyDonations';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminItems from './pages/admin/AdminItems';
import AdminRequests from './pages/admin/AdminRequests';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/edit-item/:id" element={<EditItem />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/incoming-requests" element={<IncomingRequests />} />
          <Route path="/my-exchanges" element={<MyExchanges />} />
          <Route path="/my-donations" element={<MyDonations />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/items" element={<AdminItems />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </>
);

export default App;
