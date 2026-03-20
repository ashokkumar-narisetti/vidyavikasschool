import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Founder from './pages/Founder';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Gallery from './pages/Gallery';
import Achievements from './pages/Achievements';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminApplications from './pages/admin/AdminApplications';
import AdminMessages from './pages/admin/AdminMessages';
import AdminGallery from './pages/admin/AdminGallery';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminPopupBanners from './pages/admin/AdminPopupBanners';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
          <Route path="/founder" element={<><Navbar /><Founder /><Footer /></>} />
          <Route path="/academics" element={<><Navbar /><Academics /><Footer /></>} />
          <Route path="/admissions" element={<><Navbar /><Admissions /><Footer /></>} />
          <Route path="/gallery" element={<><Navbar /><Gallery /><Footer /></>} />
          <Route path="/achievements" element={<><Navbar /><Achievements /><Footer /></>} />
          <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

          {/* Admin routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="popup-banners" element={<AdminPopupBanners />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
