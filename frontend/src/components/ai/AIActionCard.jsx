import React, { useState } from 'react';
import { Check, X, ShieldAlert, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';
import { useFinance } from '../../context/FinanceContext';

export const AIActionCard = ({ proposal, onActionComplete }) => {
  const toast = useToast();
  const { refreshBudgets, refreshTransactions, refreshAll } = useFinance();
  const [status, setStatus] = useState(proposal?.status || 'pending');
  const [loading, setLoading] = useState(false);

  if (!proposal) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await aiService.executeProposal(proposal.proposalId || proposal.id);
      setStatus('confirmed');
      toast.success(res.message || 'Action executed successfully in database!');

      // Refresh finance context so newly created budget/tx reflects across all pages immediately!
      if (proposal.actionType?.includes('budget')) {
        refreshBudgets();
      } else if (proposal.actionType?.includes('transaction')) {
        refreshTransactions();
      } else {
        refreshAll();
      }

      if (onActionComplete) onActionComplete(proposal.proposalId || proposal.id, 'confirmed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to execute proposed action');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await aiService.rejectProposal(proposal.proposalId || proposal.id);
      setStatus('rejected');
      toast.info('Proposed action cancelled.');
      if (onActionComplete) onActionComplete(proposal.proposalId || proposal.id, 'rejected');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border/80 shadow-md text-xs transition-all">
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-brand-border/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-brand-text block text-xs">
              Action Proposal (Permission Guardrail)
            </span>
            <span className="text-[10px] text-brand-subtle">
              Requires explicit confirmation before mutating database
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
            status === 'confirmed'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : status === 'rejected'
              ? 'bg-zinc-200 dark:bg-zinc-800 text-brand-muted border-brand-border'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}
        >
          {status === 'confirmed' ? 'Applied' : status === 'rejected' ? 'Cancelled' : 'Pending Confirmation'}
        </span>
      </div>

      <div className="p-3 rounded-xl bg-brand-card border border-brand-border/60 mb-3">
        <p className="font-semibold text-brand-text text-sm mb-1">
          {proposal.summary || `${proposal.actionType}: ${JSON.stringify(proposal.details)}`}
        </p>
        <div className="text-[11px] text-brand-subtle flex flex-wrap gap-x-4 gap-y-1">
          <span>Type: <strong className="text-brand-text">{proposal.actionType}</strong></span>
          {proposal.details?.category && (
            <span>Category: <strong className="text-brand-text">{proposal.details.category}</strong></span>
          )}
          {proposal.details?.allocated && (
            <span>Amount: <strong className="text-brand-text">₹{Number(proposal.details.allocated).toLocaleString('en-IN')}</strong></span>
          )}
        </div>
      </div>

      {status === 'pending' || status === 'pending_user_confirmation' ? (
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={handleReject}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl border border-brand-border text-brand-muted hover:text-brand-text hover:bg-brand-card font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm inline-flex items-center gap-1.5 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Confirm & Apply</span>
          </button>
        </div>
      ) : status === 'confirmed' ? (
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
          <CheckCircle2 className="w-4 h-4" />
          <span>This action has been executed in your database.</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-brand-subtle text-[11px]">
          <Clock className="w-4 h-4" />
          <span>This proposal was cancelled and not executed.</span>
        </div>
      )}
    </div>
  );
};

export default AIActionCard;

