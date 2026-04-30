import { Component } from 'react'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-950 px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-5">
              <FiAlertTriangle size={28} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 bg-royal-600 hover:bg-royal-700 text-white text-sm font-medium rounded-xl transition-all mx-auto"
            >
              <FiRefreshCw size={15} /> Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
