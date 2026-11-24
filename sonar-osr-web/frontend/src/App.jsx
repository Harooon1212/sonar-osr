import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demo" element={<LiveDemo />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lab" element={<PipelineLab />} />
            <Route path="/methods" element={<Methods />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
