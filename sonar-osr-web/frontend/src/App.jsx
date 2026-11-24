import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppFrame from './layout/AppFrame';
import ErrorBoundary from './ui/ErrorBoundary';
import Skeleton from './ui/Skeleton';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LiveDemo = lazy(() => import('./pages/LiveDemo'));
const PipelineLab = lazy(() => import('./pages/PipelineLab'));
const Methods = lazy(() => import('./pages/Methods'));
const Dataset = lazy(() => import('./pages/Dataset'));
const About = lazy(() => import('./pages/About'));
const Settings = lazy(() => import('./pages/Settings'));
const GetStarted = lazy(() => import('./pages/GetStarted'));

function PageLoader() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-64 rounded-control" />
      <Skeleton className="h-64 w-full rounded-card" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppFrame>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/demo" element={<LiveDemo />} />
              <Route path="/lab" element={<PipelineLab />} />
              <Route path="/pipeline" element={<PipelineLab />} />
              <Route path="/mission" element={<PipelineLab />} />
              <Route path="/methods" element={<Methods />} />
              <Route path="/dataset" element={<Dataset />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AppFrame>
    </Router>
  );
}
