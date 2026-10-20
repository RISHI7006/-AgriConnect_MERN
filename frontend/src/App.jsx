import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { FarmersPage } from './pages/FarmersPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PriceTrendsPage } from './pages/PriceTrendsPage';
import { DemandPredictionPage } from './pages/DemandPredictionPage';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { CartPage } from './pages/CartPage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage } from './pages/AboutPage';

// Strict Role Guard Components
const getActiveUser = (contextUser) => {
  if (contextUser) return contextUser;
  try {
    const saved = localStorage.getItem('agriconnect_user');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

const FarmerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const activeUser = getActiveUser(user);

  if (loading && !activeUser) return null;
  if (!activeUser) return <Navigate to="/login" replace />;
  if (activeUser.role === 'buyer') return <Navigate to="/buyer-dashboard" replace />;
  return children;
};

const BuyerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const activeUser = getActiveUser(user);

  if (loading && !activeUser) return null;
  if (!activeUser) return <Navigate to="/login" replace />;
  if (activeUser.role === 'farmer') return <Navigate to="/farmer-dashboard" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const activeUser = getActiveUser(user);

  if (loading && !activeUser) return null;
  if (!activeUser) return <Navigate to="/login" replace />;
  if (activeUser.role !== 'admin') {
    return <Navigate to={activeUser.role === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard'} replace />;
  }
  return children;
};

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isDashboardView = [
    '/farmer-dashboard',
    '/buyer-dashboard',
    '/admin-dashboard',
    '/price-trends',
    '/demand-prediction',
    '/crop-recommendation'
  ].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      {!isDashboardView && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <AppLayout>
                <Routes>
                  {/* Screen 1: Home Page */}
                  <Route path="/" element={<HomePage />} />
                  
                  {/* Screen 2: Products Marketplace */}
                  <Route path="/products" element={<MarketplacePage />} />

                  {/* Farmers Directory */}
                  <Route path="/farmers" element={<FarmersPage />} />
                  
                  {/* Screen 3: Product Detail & Negotiation */}
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  
                  {/* Screen 4: Farmer Dashboard */}
                  <Route path="/farmer-dashboard" element={<FarmerRoute><FarmerDashboard /></FarmerRoute>} />
                  
                  {/* Screen 5: Buyer Dashboard */}
                  <Route path="/buyer-dashboard" element={<BuyerRoute><BuyerDashboard /></BuyerRoute>} />
                  
                  {/* Screen 6: Admin Dashboard */}
                  <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  
                  {/* Screen 7: Price Trend Analysis (ML) */}
                  <Route path="/price-trends" element={<PriceTrendsPage />} />
                  
                  {/* Screen 8: Demand Prediction (ML) */}
                  <Route path="/demand-prediction" element={<DemandPredictionPage />} />
                  
                  {/* Screen 9: Crop Recommendation (ML) */}
                  <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
                  
                  {/* Auxiliary Routes */}
                  <Route path="/cart" element={<BuyerRoute><CartPage /></BuyerRoute>} />
                  <Route path="/login" element={<AuthPage mode="login" />} />
                  <Route path="/register" element={<AuthPage mode="register" />} />
                  <Route path="/about" element={<AboutPage />} />

                  {/* Fallback route to prevent any 404 blank white page */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </Router>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
