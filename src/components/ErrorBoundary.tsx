import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, showDetails: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });

    // Detect if this is a transient network error, chunk load error, or dynamic import failure
    // (very common when waking the device from sleep or when a new version was deployed)
    const errStr = (error?.message || error?.name || String(error)).toLowerCase();
    const isChunkOrNetworkError = 
      errStr.includes('dynamically imported module') ||
      errStr.includes('loading chunk') ||
      errStr.includes('chunkloaderror') ||
      errStr.includes('failed to fetch') ||
      errStr.includes('networkerror') ||
      errStr.includes('importing a module script failed');

    if (isChunkOrNetworkError) {
      const lastReload = Number(sessionStorage.getItem('last_auto_error_reload') || '0');
      const now = Date.now();
      // Auto-reload once if not done in the last 15 seconds to transparently update the page
      if (now - lastReload > 15000) {
        sessionStorage.setItem('last_auto_error_reload', String(now));
        window.location.reload();
      }
    }
  }

  private handleReload = () => {
    try {
      sessionStorage.removeItem('last_auto_error_reload');
    } catch (e) {}
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-white font-sans relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,77,68,0.2)_0%,#050505_70%)] pointer-events-none"></div>

          <div className="relative z-10 w-full max-w-md bg-[#0c0d0e]/95 border border-primary/25 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.85),0_0_30px_rgba(5,77,68,0.2)] text-center animate-in zoom-in-95 duration-300">
            {/* Top emerald line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(5,77,68,0.3)]">
              <span className="material-symbols-outlined text-primary text-3xl">refresh</span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white mb-2">
              Conexión en Pausa
            </h1>
            
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              La ventana estuvo en reposo o se interrumpió la conexión. Actualiza la página para sincronizar con la última versión de la plataforma.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-primary hover:bg-[#065f46] text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(5,77,68,0.4)] hover:shadow-[0_0_30px_rgba(5,77,68,0.6)] active:scale-[0.98] transition-all text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 border border-primary/40"
              >
                <span className="material-symbols-outlined text-lg">sync</span>
                Actualizar Página
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl border border-white/10 transition-colors text-xs uppercase tracking-wider cursor-pointer"
              >
                Volver al Inicio
              </button>
            </div>

            {/* Hidden developer details toggle */}
            <div className="mt-6 pt-4 border-t border-white/5 text-left">
              <button
                type="button"
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="text-[11px] text-gray-500 hover:text-gray-400 uppercase tracking-wider flex items-center gap-1 transition-colors mx-auto cursor-pointer"
              >
                <span>{this.state.showDetails ? 'Ocultar detalles' : 'Detalles del sistema'}</span>
                <span className="material-symbols-outlined text-sm">
                  {this.state.showDetails ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-3 bg-black/60 border border-white/10 rounded-lg text-left">
                  <p className="text-xs text-red-400 font-mono break-all mb-2">
                    {this.state.error?.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-[10px] text-gray-400 font-mono overflow-x-auto max-h-36 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
