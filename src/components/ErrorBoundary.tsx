import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Check if it's a module loading error
    const isModuleError = error.message.includes('module') || 
                          error.message.includes('import') ||
                          error.message.includes('Failed to fetch');

    if (isModuleError) {
      console.log('Module loading error detected - likely cache issue');
    }
  }

  handleRefresh = () => {
    // Force a hard reload
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isModuleError = this.state.error?.message.includes('module') || 
                            this.state.error?.message.includes('import') ||
                            this.state.error?.message.includes('Failed to fetch');

      return (
        <div className="min-h-screen bg-midasbuy-darkBlue flex items-center justify-center p-4">
          <div className="glass-effect rounded-xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/10 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              {isModuleError ? 'Page Update Required' : 'Oops! Something went wrong'}
            </h1>
            
            <p className="text-gray-300 mb-6">
              {isModuleError 
                ? 'The app has been updated. Please refresh the page to continue.'
                : 'An unexpected error occurred. Please try refreshing the page.'}
            </p>

            <Button
              onClick={this.handleRefresh}
              className="w-full bg-midasbuy-blue hover:bg-midasbuy-blue/80 text-white font-semibold py-3"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh Page
            </Button>

            {!isModuleError && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs text-gray-400 bg-midasbuy-navy/50 p-3 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
