import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  ChevronLeft,
  Building2,
  Calendar,
  CreditCard,
  Layers,
  Pause,
  Play,
  RotateCw,
  XCircle,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { subscriptionsApi } from '../../api/subscriptions';
import { financeApi } from '../../api/finance';
import { SubscriptionTimeline } from '../../components/SubscriptionTimeline';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export const SubscriptionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const subId = Number(id);
  const queryClient = useQueryClient();

  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [closeReason, setCloseReason] = useState('Customer opted out of renewal');

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', subId],
    queryFn: () => subscriptionsApi.getSubscription(subId),
    enabled: !!subId,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['subscription-invoices', subId],
    queryFn: () => financeApi.getInvoices({}),
    select: (allInvs) => allInvs.filter((inv) => inv.subscription_id === subId),
    enabled: !!subId,
  });

  const activateMutation = useMutation({
    mutationFn: () => subscriptionsApi.activateSubscription(subId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', subId] });
      toast.success('Subscription activated successfully');
    },
  });

  const pauseMutation = useMutation({
    mutationFn: () => subscriptionsApi.pauseSubscription(subId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', subId] });
      toast.success('Subscription paused');
    },
  });

  const resumeMutation = useMutation({
    mutationFn: () => subscriptionsApi.resumeSubscription(subId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', subId] });
      toast.success('Subscription resumed to active');
    },
  });

  const renewMutation = useMutation({
    mutationFn: () => subscriptionsApi.renewSubscription(subId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', subId] });
      toast.success('Subscription renewed for another cycle');
    },
  });

  const closeMutation = useMutation({
    mutationFn: () => subscriptionsApi.closeSubscription(subId, closeReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', subId] });
      toast.success('Subscription closed');
      setConfirmCloseOpen(false);
    },
  });

  if (isLoading || !subscription) {
    return <div className="p-12 text-center text-slate-400">Loading subscription details...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/subscriptions" className="hover:text-violet-600 transition flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Subscriptions</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900">{subscription.subscription_number}</span>
        </div>

        {/* Lifecycle Actions */}
        <div className="flex items-center gap-2">
          {subscription.status === 'confirmed' && (
            <Button
              loading={activateMutation.isPending}
              onClick={() => activateMutation.mutate()}
              icon={<Play className="w-4 h-4" />}
            >
              Activate Subscription
            </Button>
          )}

          {subscription.status === 'active' && (
            <>
              <Button
                variant="outline"
                loading={pauseMutation.isPending}
                onClick={() => pauseMutation.mutate()}
                icon={<Pause className="w-4 h-4" />}
              >
                Pause
              </Button>
              <Button
                variant="outline"
                loading={renewMutation.isPending}
                onClick={() => renewMutation.mutate()}
                icon={<RotateCw className="w-4 h-4" />}
              >
                Renew Term
              </Button>
              <Button
                variant="danger"
                onClick={() => setConfirmCloseOpen(true)}
                icon={<XCircle className="w-4 h-4" />}
              >
                Close
              </Button>
            </>
          )}

          {subscription.status === 'paused' && (
            <>
              <Button
                loading={resumeMutation.isPending}
                onClick={() => resumeMutation.mutate()}
                icon={<Play className="w-4 h-4" />}
              >
                Resume Active
              </Button>
              <Button
                variant="danger"
                onClick={() => setConfirmCloseOpen(true)}
                icon={<XCircle className="w-4 h-4" />}
              >
                Close
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {subscription.subscription_number}
            </h1>
            <StatusBadge status={subscription.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Contract started {format(new Date(subscription.start_date), 'dd MMMM yyyy')}
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Recurring Cadence Rate
          </span>
          <span className="text-3xl font-black text-violet-700">
            ₹{subscription.total_amount.toLocaleString('en-IN')}{' '}
            <span className="text-sm font-semibold text-slate-400">
              /{subscription.plan?.billing_frequency || 'month'}
            </span>
          </span>
        </div>
      </div>

      {/* 4 Info Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Customer Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-violet-600" />
            <span>Customer</span>
          </span>
          <Link
            to={`/customers/${subscription.customer_id}`}
            className="font-bold text-slate-900 hover:text-violet-600 block text-sm"
          >
            {subscription.customer?.name}
          </Link>
          <p className="text-xs text-slate-500">{subscription.customer?.company || subscription.customer?.email}</p>
        </div>

        {/* Plan Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-violet-600" />
            <span>Plan & Seats</span>
          </span>
          <p className="font-bold text-slate-900 text-sm">{subscription.plan?.name}</p>
          <p className="text-xs text-slate-500">
            {subscription.quantity} Unit(s) • {subscription.plan?.billing_frequency}
          </p>
        </div>

        {/* Billing Dates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-violet-600" />
            <span>Next Invoice Date</span>
          </span>
          <p className="font-bold text-slate-900 text-sm">
            {subscription.next_billing_date
              ? format(new Date(subscription.next_billing_date), 'dd MMM yyyy')
              : 'N/A'}
          </p>
          <p className="text-xs text-slate-500">Automated cycle</p>
        </div>

        {/* Quotation Ref */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-violet-600" />
            <span>Origin Quotation</span>
          </span>
          <p className="font-bold text-slate-900 text-sm">
            {subscription.quotation_id ? (
              <Link to={`/quotations/${subscription.quotation_id}`} className="text-violet-600 hover:underline">
                View Quote #{subscription.quotation_id}
              </Link>
            ) : (
              'Direct Creation'
            )}
          </p>
          <p className="text-xs text-slate-500">Contract Source</p>
        </div>
      </div>

      {/* Grid: Timeline Left (5 cols) + Invoices Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-600" />
            <span>Lifecycle Timeline</span>
          </h2>
          <SubscriptionTimeline subscription={subscription} />
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-600" />
            <span>Billing Invoices for this Subscription</span>
          </h2>

          {invoices.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No invoices generated yet.</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Invoices will be auto-generated when billing is due.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <Link
                      to={`/invoices/${inv.id}`}
                      className="font-bold text-violet-600 hover:underline block"
                    >
                      {inv.invoice_number}
                    </Link>
                    <span className="text-xs text-slate-400">
                      Issued {format(new Date(inv.issue_date), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">
                      ₹{inv.total_amount.toLocaleString('en-IN')}
                    </span>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Close Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmCloseOpen}
        onClose={() => setConfirmCloseOpen(false)}
        onConfirm={() => closeMutation.mutate()}
        title="Close Subscription"
        message="Are you sure you want to terminate this subscription contract? Ongoing recurring billing will stop."
        confirmText="Confirm Close"
        variant="danger"
        loading={closeMutation.isPending}
      />
    </div>
  );
};
