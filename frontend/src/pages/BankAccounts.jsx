import React from 'react';
import { Landmark } from 'lucide-react';
import ComingSoon from '../components/common/ComingSoon';

export const BankAccounts = () => {
  const plannedFeatures = [
    {
      title: 'Multi-Bank Live Telemetry',
      description:
        'Connect accounts from HDFC, ICICI, SBI, Axis, Kotak, and 40+ major Indian banks via the RBI Account Aggregator network.',
    },
    {
      title: 'Real-time Net Worth Aggregation',
      description:
        'Live synchronization across savings, current, salary, and fixed deposit balances with zero manual entry.',
    },
    {
      title: 'Inter-Account Transfer Reconciliation',
      description:
        'Automatically recognize transfers between your own bank accounts to prevent double-counting income or expenses.',
    },
    {
      title: 'Consent-Driven Read-Only Protocol',
      description:
        'Built strictly upon standardized Account Aggregator APIs. Your net banking login passwords and OTPs are never requested.',
    },
  ];

  return (
    <ComingSoon
      icon={Landmark}
      badge="Coming Soon"
      title="Direct Bank Account Sync"
      subtitle="Under Active Development"
      description="Direct bank synchronization across Indian financial institutions is currently under active development. You will soon be able to securely link your accounts for automated balance and transaction feeds."
      plannedFeatures={plannedFeatures}
    />
  );
};

export default BankAccounts;
