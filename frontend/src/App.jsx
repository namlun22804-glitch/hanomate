import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Planner from './pages/Planner';
import MapExplore from './pages/MapExplore';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './contexts/AuthContext';
import './assets/styles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AuthModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/map" element={<MapExplore />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
