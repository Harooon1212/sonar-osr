import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App';
import './styles/tokens.css';
import './styles/globals.css';
import 'katex/dist/katex.min.css';
import { useSettings } from './store/useSettings';

function Root() {
  const reducedMotion = useSettings((s) => s.reducedMotion);
  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <App />
    </MotionConfig>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
