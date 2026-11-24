import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('SonarOSR ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="rounded-card bg-card p-8 shadow-card border border-line max-w-xl mx-auto my-8 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-bad-track text-bad flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={22} />
          </div>
          <h2 className="text-lg font-semibold text-ink mb-2">Something went wrong in this view</h2>
          <p className="text-sm text-ink-muted mb-5">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-control bg-primary text-white text-sm font-medium hover:opacity-95 transition"
          >
            <RotateCcw size={15} />
            Reload view
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
