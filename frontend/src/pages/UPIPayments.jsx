import React from 'react';
import { Smartphone } from 'lucide-react';
import ComingSoon from '../components/common/ComingSoon';

export const UPIPayments = () => {
  const plannedFeatures = [
    {
      title: 'Real-time UPI Stream Ingestion',
      description:
        'Securely link Google Pay, PhonePe, Paytm, and BHIM VPA handles to auto-capture daily peer and merchant transfers.',
    },
    {
      title: 'Smart Merchant Auto-Categorization',
      description:
        'Automated tagging for food delivery (Swiggy, Zomato), quick commerce (Blinkit, Zepto), rides (Uber, Ola), and retail.',
    },
    {
      title: 'Statement & QR Receipt Parsing',
      description:
        'High-speed parsing for UPI transaction statements with intelligent duplicate detection and reconciliation.',
    },
    {
      title: 'Zero PIN or Credential Storage',
      description:
        'Read-only payment telemetry built with end-to-end encryption. No UPI PINs or payment initiation permissions required.',
    },
  ];

  return (
    <ComingSoon
      icon={Smartphone}
      badge="Coming Soon"
      title="UPI & Instant Payments"
      subtitle="Under Active Development"
      description="Automated UPI synchronization with Google Pay, PhonePe, Paytm, and BHIM is currently in development. You will soon be able to connect your UPI IDs and track transactions without manual logging."
      plannedFeatures={plannedFeatures}
    />
  );
};

export default UPIPayments;
