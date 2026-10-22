import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isReloading: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isReloading: false
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isReloading: false };
  }

  public componentDidMount() {
    window.addEventListener('online', this.handleAutoOnlineRecovery);
    document.addEventListener('visibilitychange', this.handleVisibilityRecovery);
  }

  public componentWillUnmount() {
    window.removeEventListener('online', this.handleAutoOnlineRecovery);
    document.removeEventListener('visibilitychange', this.handleVisibilityRecovery);
  }

  private handleAutoOnlineRecovery = () => {
    if (this.state.hasError) {
      this.handleReload();
    }
  };

  private handleVisibilityRecovery = () => {
    if (document.visibilityState === 'visible' && this.state.hasError && navigator.onLine) {
      const lastReload = Number(sessionStorage.getItem('last_auto_error_reload') || '0');
      if (Date.now() - lastReload > 10000) {
        sessionStorage.setItem('last_auto_error_reload', String(Date.now()));
        this.handleReload();
      }
    }
  };

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('App recovery triggered:', error, errorInfo);

    const errStr = (error?.message || error?.name || String(error)).toLowerCase();
    const isChunkOrNetworkError =
      errStr.includes('dynamically imported module') ||
      errStr.includes('loading chunk') ||
      errStr.includes('chunkloaderror') ||
      errStr.includes('failed to fetch') ||
      errStr.includes('load failed') ||
      errStr.includes('networkerror') ||
      errStr.includes('mime type') ||
      errStr.includes('unable to preload css') ||
      errStr.includes('importing a module script failed');

    if (isChunkOrNetworkError && navigator.onLine) {
      const lastReload = Number(sessionStorage.getItem('last_auto_error_reload') || '0');
      const now = Date.now();
      if (now - lastReload > 10000) {
        sessionStorage.setItem('last_auto_error_reload', String(now));
        this.handleReload();
      }
    }
  }

  private handleReload = async () => {
    try {
      (this as any).setState({ isReloading: true });
      sessionStorage.removeItem('last_auto_error_reload');
      sessionStorage.removeItem('chunk_retry_attempted');
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.update().catch(() => {})));
      }
    } catch (e) {}
    window.location.reload();
  };

  private handleGoHome = () => {
    try {
      sessionStorage.removeItem('last_auto_error_reload');
      sessionStorage.removeItem('chunk_retry_attempted');
    } catch (e) {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-[#f5f5f7] flex flex-col items-center justify-center p-6 selection:bg-[#054d44] selection:text-white font-sans relative overflow-hidden">
          {/* Ambient emerald glow matching brand aesthetic */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(5,77,68,0.22)_0%,rgba(5,5,5,0.95)_65%,#050505_100%)] pointer-events-none" />

          {/* Brand Header Pill */}
          <div className="relative z-10 mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/80">
              Turnos <span className="text-[#10b981]">Tattoo</span>
            </span>
          </div>

          {/* Main Card */}
          <div className="relative z-10 w-full max-w-md bg-[#0c0d0e]/95 border border-white/10 border-l-[3px] border-l-[#054d44] rounded-r-xl rounded-l-none p-7 md:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(5,77,68,0.15)] text-center backdrop-blur-xl">
            {/* Icon container */}
            <div className="w-16 h-16 rounded-full bg-[#054d44]/20 border border-[#054d44]/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(5,77,68,0.35)]">
              <svg
                className={`w-7 h-7 text-[#10b981] ${this.state.isReloading ? 'animate-spin' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight text-white mb-3">
              Pantalla en Reposo
            </h1>

            <p className="text-sm text-[#a1a1aa] mb-8 leading-relaxed">
              La conexión entró en pausa por inactividad o cambio de red. Actualizá la página para reconectar y seguir navegando.
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                disabled={this.state.isReloading}
                className="w-full py-3.5 px-6 bg-[#054d44] hover:bg-[#065f46] active:scale-[0.98] text-white font-extrabold uppercase tracking-[0.15em] text-xs transition-all duration-300 shadow-[0_0_25px_rgba(5,77,68,0.45)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
              >
                <svg
                  className={`w-4 h-4 ${this.state.isReloading ? 'animate-spin' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                <span>{this.state.isReloading ? 'Reconectando...' : 'Actualizar Página'}</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full py-3 px-6 bg-white/[0.03] hover:bg-white/[0.08] text-[#a1a1aa] hover:text-white font-bold uppercase tracking-[0.15em] text-[11px] border border-white/10 transition-colors cursor-pointer"
              >
                Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
