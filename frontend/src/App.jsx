import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import PlantCatalog from './pages/PlantCatalog';
import AddPlantForm from './pages/AddPlantForm';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const adminKey = urlParams.get('admin_key');
    
    const SECRET_ADMIN_KEY = 'mysecretpassword';
    
    if (adminKey === SECRET_ADMIN_KEY) {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
    } else {
      const storedAdminStatus = sessionStorage.getItem('isAdmin');
      setIsAdmin(storedAdminStatus === 'true');
    }
  }, [location.search]);

  const ProtectedAdminRoute = ({ children }) => {
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <Header isAdmin={isAdmin} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PlantCatalog />} />
            <Route 
              path="/admin/add-plant" 
              element={
                <ProtectedAdminRoute>
                  <AddPlantForm />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="*" element={
              <div className="not-found">
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;