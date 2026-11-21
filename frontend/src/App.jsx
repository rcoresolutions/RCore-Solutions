
import { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useAuth } from './context/AuthContext.jsx';

import PublicLayout from './components/PublicLayout.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

import { Login, Register } from './pages/Auth.jsx';
import Account from './pages/Account.jsx';
import NotFound from './pages/NotFound.jsx';

import Dashboard from './pages/admin/Dashboard.jsx';

import {
  ManageServices,
  ManageProducts,
  ManageUsers,
} from './pages/admin/Manage.jsx';

import ManageReviews from './pages/admin/ManageReviews.jsx';
import ManageMessages from './pages/admin/ManageMessages.jsx';
import SiteSettings from './pages/admin/SiteSettings.jsx';

// Scroll to top whenever the route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected routes
function Protected({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Main App
export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />

          <Route
            path="services"
            element={<Services />}
          />

          <Route
            path="services/:id"
            element={<ServiceDetail />}
          />

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="products/:id"
            element={<ProductDetail />}
          />

          <Route
            path="about"
            element={<About />}
          />

          <Route
            path="contact"
            element={<Contact />}
          />

          <Route
            path="login"
            element={<Login />}
          />

          <Route
            path="register"
            element={<Register />}
          />

          <Route
            path="account"
            element={
              <Protected>
                <Account />
              </Protected>
            }
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <Protected role="admin">
              <AdminLayout />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />

          <Route
            path="services"
            element={<ManageServices />}
          />

          <Route
            path="products"
            element={<ManageProducts />}
          />

          <Route
            path="users"
            element={<ManageUsers />}
          />

          <Route
            path="reviews"
            element={<ManageReviews />}
          />

          <Route
            path="messages"
            element={<ManageMessages />}
          />

          <Route
            path="settings"
            element={<SiteSettings />}
          />
        </Route>
      </Routes>
    </>
  );
}
