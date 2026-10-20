import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AgriConnect Component Error Caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-100 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">
              पृष्ठ लोड करने में समस्या / Problem Loading Page
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              एक अस्थाई त्रुटि हुई है। कृपया पृष्ठ को पुनः लोड करें या मुख्य पृष्ठ पर जाएं।
              <br />
              (A temporary error occurred. Please reload the page or return to Home.)
            </p>
            {this.state.error && (
              <div className="p-3 bg-gray-50 rounded-xl text-[11px] font-mono text-left text-red-600 overflow-x-auto max-h-32 border border-gray-200">
                {this.state.error.toString()}
              </div>
            )}
            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>पुनः लोड करें (Reload)</span>
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>होम पेज (Home)</span>
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
