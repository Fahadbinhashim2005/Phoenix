import React from 'react';
import { CheckCircle2, Clock, PauseCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Subscription } from '../types';

interface SubscriptionTimelineProps {
  subscription: Subscription;
}

export const SubscriptionTimeline: React.FC<SubscriptionTimelineProps> = ({ subscription }) => {
  const formatDateSafe = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const steps = [
    {
      title: 'Quotation Accepted / Created',
      date: formatDateSafe(subscription.created_at),
      desc: `Subscription ${subscription.subscription_number} initiated.`,
      status: 'completed',
    },
    {
      title: 'Subscription Confirmed',
      date: formatDateSafe(subscription.start_date),
      desc: 'Terms confirmed by customer/sales administrator.',
      status: subscription.status !== 'draft' ? 'completed' : 'pending',
    },
    {
      title: 'Active Subscription',
      date: subscription.status === 'active' || subscription.status === 'paused' || subscription.status === 'closed'
        ? formatDateSafe(subscription.start_date)
        : null,
      desc: `Recurring billing active at ₹${subscription.total_amount.toLocaleString('en-IN')}.`,
      status: subscription.status === 'active' ? 'current' : ['paused', 'closed'].includes(subscription.status) ? 'completed' : 'pending',
    },
  ];

  if (subscription.paused_at) {
    steps.push({
      title: 'Paused',
      date: formatDateSafe(subscription.paused_at),
      desc: 'Temporarily halted billing and renewals.',
      status: subscription.status === 'paused' ? 'current' : 'completed',
    });
  }

  if (subscription.status === 'closed') {
    steps.push({
      title: 'Closed / Terminated',
      date: formatDateSafe(subscription.closed_at),
      desc: subscription.close_reason || 'Subscription concluded by user/admin.',
      status: 'closed',
    });
  } else {
    steps.push({
      title: 'Next Scheduled Billing',
      date: formatDateSafe(subscription.next_billing_date),
      desc: 'Automatic invoice generation scheduled.',
      status: subscription.status === 'active' ? 'pending' : 'disabled',
    });
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          let icon = <CheckCircle2 className="w-5 h-5 text-white" />;
          let iconBg = 'bg-emerald-600';

          if (step.status === 'current') {
            icon = <Clock className="w-5 h-5 text-white animate-pulse" />;
            iconBg = 'bg-violet-600 ring-4 ring-violet-100';
          } else if (step.status === 'closed') {
            icon = <XCircle className="w-5 h-5 text-white" />;
            iconBg = 'bg-rose-600';
          } else if (step.status === 'pending') {
            icon = <Clock className="w-4 h-4 text-slate-400" />;
            iconBg = 'bg-slate-200';
          } else if (step.status === 'disabled') {
            icon = <AlertCircle className="w-4 h-4 text-slate-300" />;
            iconBg = 'bg-slate-100';
          }

          return (
            <li key={idx} className="relative pb-8">
              {!isLast && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start space-x-3">
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
                  {icon}
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                  {step.date && (
                    <div className="text-right text-xs whitespace-nowrap font-medium text-slate-400">
                      {step.date}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
