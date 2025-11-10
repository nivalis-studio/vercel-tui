import { Component, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary_ extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      console.error(this.state.error?.stack);
      return (
        <box style={{ padding: 2 }}>
          <text content={`${this.state.error?.message || 'Unknown error'}`} />
          <text content={`${this.state.error?.cause || ''}`} />
        </box>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = ErrorBoundary_ as unknown as (props: {
  children: ReactNode;
}) => ReactNode;
