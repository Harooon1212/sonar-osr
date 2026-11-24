import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Backdrop from './components/Backdrop';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import LiveDemo from './pages/LiveDemo';
import Dashboard from './pages/Dashboard';
import PipelineLab from './pages/PipelineLab';
import Methods from './pages/Methods';
import Dataset from './pages/Dataset';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Backdrop />
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demo" element={<LiveDemo />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lab" element={<PipelineLab />} />
            <Route path="/pipeline" element={<PipelineLab />} />
            <Route path="/mission" element={<PipelineLab />} />
            <Route path="/methods" element={<Methods />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
