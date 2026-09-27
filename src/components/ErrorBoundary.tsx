import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: 'red', color: 'white', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1>Algo salió mal en esta página.</h1>
          <p>Por favor, pásale este texto al chat (hazle una captura):</p>
          <hr />
          <h3 style={{ marginTop: '20px' }}>{this.state.error?.toString()}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', marginTop: '10px' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
