import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl bg-brand-elevated border border-brand-border flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-elevated">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-6xl font-black text-brand-text tracking-tighter mb-2 font-sans">
          404
        </h1>
        <h2 className="text-xl font-bold text-brand-text mb-3">
          Telemetry Page Not Found
        </h2>
        <p className="text-sm text-brand-muted mb-8 leading-relaxed">
          The requested resource does not exist or has been relocated to another route in FinTrack OS.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-emerald hover:bg-brand-emeraldHover shadow-glow-emerald transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{isAuthenticated ? 'Return to Dashboard' : 'Go to Homepage'}</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-brand-muted hover:text-brand-text bg-brand-elevated hover:bg-brand-border border border-brand-border transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;