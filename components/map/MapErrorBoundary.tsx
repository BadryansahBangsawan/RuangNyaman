'use client';

import { Component, ReactNode } from 'react';

interface MapErrorBoundaryProps {
    children: ReactNode;
}

interface MapErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * MapErrorBoundary component - Error boundary for map-related errors
 * 
 * This component catches JavaScript errors anywhere in the map component tree
 * and displays a fallback UI instead of crashing the entire application.
 * 
 * Features:
 * - Catches and handles errors in map components
 * - Displays user-friendly error messages
 * - Provides reset functionality
 * - Logs errors for debugging
 * - Prevents app crashes from map failures
 * 
 * Common Error Scenarios:
 * - Missing Leaflet library
 * - Invalid map configuration
 * - Tile loading failures
 * - Marker rendering errors
 * - Network connectivity issues
 * 
 * @example
 * ```tsx
 * <MapErrorBoundary>
 *   <MapProvider>
 *     <LeafletMap>
 *       <LeafletTileLayer url={tileUrl} />
 *     </LeafletMap>
 *   </MapProvider>
 * </MapErrorBoundary>
 * ```
 */
export class MapErrorBoundary extends Component<
    MapErrorBoundaryProps,
    MapErrorBoundaryState
> {
    constructor(props: MapErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): MapErrorBoundaryState {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error details for debugging
        console.error('Map Error Boundary caught an error:', error, errorInfo);

        // Here you could send error to an error reporting service
        // Example: errorReportingService.log(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center w-full h-full bg-zinc-100 dark:bg-zinc-900">
                    <div className="max-w-md p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-lg text-center">
                        <div className="mb-4">
                            <svg
                                className="w-16 h-16 mx-auto text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                            Map Error
                        </h2>

                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            {this.state.error?.message || 'An unexpected error occurred while loading the map.'}
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                            >
                                Try Again
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-lg transition-colors font-medium"
                            >
                                Go Home
                            </button>
                        </div>

                        <details className="mt-6 text-left">
                            <summary className="cursor-pointer text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300">
                                Technical Details
                            </summary>
                            <pre className="mt-2 p-3 bg-zinc-100 dark:bg-zinc-900 rounded text-xs overflow-auto text-zinc-800 dark:text-zinc-200">
                                {this.state.error?.stack || 'No stack trace available'}
                            </pre>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
