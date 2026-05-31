import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import MakaoYetu from './components/MakaoYetu';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ForgotPassword from './components/ForgotPassword';
import AddProperty from './components/AddProperty';
import PropertyDetail from './components/PropertyDetail';
import MyBookings from './components/MyBookings';
import AdminPanel from './components/AdminPanel';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Rentals from './components/Rentals';
import PropertiesForSale from './components/PropertiesForSale';
import LandPlots from './components/LandPlots';
import Hostels from './components/Hostels';
import CommercialSpace from './components/CommercialSpace';
import FAQ from './components/FAQ';
import AgentProfile from './components/AgentProfile';
import Favorites from './components/Favorites';
import SearchResults from './components/SearchResults';
import FreeMapView from './components/FreeMapView';
import PropertyGallery from './components/PropertyGallery';
import ReelsFeed from './components/ReelsFeed';
import Chat from './components/Chat';
import CompareProperties from './components/CompareProperties';
import MortgageCalculator from './components/MortgageCalculator';
import Profile from './components/Profile';
import Settings from './components/Settings';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

function Protected({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MakaoYetu />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/add-property" element={<Protected><AddProperty /></Protected>} />
            <Route path="/my-bookings" element={<Protected><MyBookings /></Protected>} />
            <Route path="/admin" element={<Protected><AdminPanel /></Protected>} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/for-sale" element={<PropertiesForSale />} />
            <Route path="/land" element={<LandPlots />} />
            <Route path="/hostels" element={<Hostels />} />
            <Route path="/commercial" element={<CommercialSpace />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/agent/:id" element={<AgentProfile />} />
            <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/map" element={<FreeMapView />} />
            <Route path="/gallery" element={<PropertyGallery />} />
            <Route path="/reels" element={<ReelsFeed />} />
            <Route path="/chat" element={<Protected><Chat /></Protected>} />
            <Route path="/compare" element={<CompareProperties />} />
            <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
            <Route path="/profile" element={<Protected><Profile /></Protected>} />
            <Route path="/settings" element={<Protected><Settings /></Protected>} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}