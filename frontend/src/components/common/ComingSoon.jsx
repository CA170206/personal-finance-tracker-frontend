import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const ComingSoon = ({
  icon: Icon,
  badge = 'Coming Soon',
  title,
  subtitle = 'Under Active Development',
  description,
  plannedFeatures = [],
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Top Breadcrumb & Status Pill */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-black text-white dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-800 shadow-sm">
          <Clock className="w-3 h-3" />
          <span>{badge}</span>
        </span>
      </div>

      {/* Main Hero Card */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-8 sm:p-12 shadow-elevated relative overflow-hidden text-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-black/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          {/* Centered Top Icon Container with ample vertical spacing */}
          <div className="mb-6 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-black dark:bg-zinc-900 border border-zinc-800 text-white shadow-sm flex items-center justify-center">
              {Icon && <Icon className="w-8 h-8" />}
            </div>
          </div>

          {/* Subtitle Pill Badge on its own row */}
          <div className="mb-4 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{subtitle}</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-black text-brand-text tracking-tight mb-4 text-center leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed text-center max-w-xl mb-8">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-800 active:scale-95 shadow-sm transition-all"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/transactions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-brand-text bg-brand-elevated hover:bg-brand-border border border-brand-border transition-colors"
            >
              <span>View Active Transactions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Planned Capabilities Grid */}
      {plannedFeatures.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-muted">
              Planned Capabilities
            </h3>
            <span className="text-xs text-brand-subtle flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Bank-grade Security Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plannedFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-brand-card border border-brand-border flex items-start gap-3.5 shadow-sm hover:border-black/30 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-black dark:text-white flex-shrink-0 mt-0.5 font-bold text-xs">
                  {idx + 1}
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm font-bold text-brand-text">{feat.title}</h4>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security & Regulatory Notice */}
      <div className="p-4 rounded-2xl bg-brand-elevated/60 border border-brand-border flex items-center justify-between text-xs text-brand-subtle">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
          <span>
            FinTrack adheres to strict privacy and regulatory guidelines. Direct credentials and security PINs will never be requested or stored.
          </span>
        </div>
        <span className="font-mono text-[11px] hidden sm:inline text-brand-muted">
          v2.4 Roadmap
        </span>
      </div>
    </div>
  );
};

export default ComingSoon;

