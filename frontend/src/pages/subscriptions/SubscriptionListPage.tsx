import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Repeat,
  Plus,
  Search,
  LayoutGrid,
  List,
  Pause,
  Play,
  RotateCw,
  XCircle,
  Eye,
  Calendar,
  Building2
} from 'lucide-react';
import { subscriptionsApi } from '../../api/subscriptions';
import { Subscription } from '../../types';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export const SubscriptionListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Dialog State
  const [closeTarget, setCloseTarget] = useState<Subscription | null>(null);
  const [closeReason, setCloseReason] = useState('Customer requested termination');

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions', statusFilter, search],
    queryFn: () =>
      subscriptionsApi.getSubscriptions({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
      }),
  });

  const pauseMutation = useMutation({
    mutationFn: (id: number) => subscriptionsApi.pauseSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription paused');
    },
  });

  const resumeMutation = useMutation({
    mutationFn: (id: number) => subscriptionsApi.resumeSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription resumed');
    },
  });

  const renewMutation = useMutation({
    mutationFn: (id: number) => subscriptionsApi.renewSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription term extended & renewed');
    },
  });

  const closeMutation = useMutation({
    mutationFn: () => {
      if (!closeTarget) return Promise.reject();
      return subscriptionsApi.closeSubscription(closeTarget.id, closeReason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription closed');
      setCloseTarget(null);
    },
  });

  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const pausedCount = subscriptions.filter((s) => s.status === 'paused').length;
  const closedCount = subscriptions.filter((s) => s.status === 'closed').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Active Subscriptions</h1>
          <p className="text-sm text-slate-500">
            Monitor client recurring contracts, renewals, and lifecycle changes.
          </p>
        </div>
        <Button onClick={() => navigate('/quotations/new')} icon={<Plus className="w-4 h-4" />}>
          New Subscription
        </Button>
      </div>

      {/* Filter Tabs & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All', count: subscriptions.length },
            { id: 'active', label: 'Active', count: activeCount },
            { id: 'paused', label: 'Paused', count: pausedCount },
            { id: 'closed', label: 'Closed', count: closedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-2 ${
                statusFilter === tab.id
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-violet-100 text-violet-700' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-violet-100 text-violet-700' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subscriptions by number (SUB-2026-...) or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* View Mode: CARD VIEW */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 p-12 text-center text-slate-400">Loading subscriptions...</div>
          ) : subscriptions.length === 0 ? (
            <div className="col-span-3 bg-white rounded-3xl p-16 text-center border border-slate-200">
              <Repeat className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-700">No subscriptions found</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Accept a quotation to create the first active subscription.</p>
              <Button onClick={() => navigate('/quotations/new')}>Create Quotation</Button>
            </div>
          ) : (
            subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Customer Avatar & Number */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white font-bold text-sm flex items-center justify-center shadow-sm shadow-violet-600/30">
                        {sub.customer?.name?.slice(0, 2).toUpperCase() || 'CU'}
                      </div>
                      <div>
                        <Link
                          to={`/subscriptions/${sub.id}`}
                          className="font-bold text-slate-900 hover:text-violet-600 transition block text-sm"
                        >
                          {sub.customer?.name}
                        </Link>
                        <span className="text-xs font-semibold text-violet-600">
                          {sub.subscription_number}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={sub.status} />
                  </div>

                  {/* Plan Badge & Date range */}
                  <div className="pt-2 space-y-2">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
                      {sub.plan?.name || 'Subscription Plan'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {format(new Date(sub.start_date), 'dd MMM yyyy')} →{' '}
                        {sub.end_date ? format(new Date(sub.end_date), 'dd MMM yyyy') : 'Perpetual'}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{sub.total_amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        /{sub.plan?.billing_frequency || 'month'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/subscriptions/${sub.id}`}
                    className="flex-1 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 text-center hover:bg-slate-50 transition"
                  >
                    Details
                  </Link>
                  {sub.status === 'active' && (
                    <button
                      onClick={() => pauseMutation.mutate(sub.id)}
                      className="p-1.5 rounded-xl text-amber-600 hover:bg-amber-50 transition"
                      title="Pause Subscription"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  )}
                  {sub.status === 'paused' && (
                    <button
                      onClick={() => resumeMutation.mutate(sub.id)}
                      className="p-1.5 rounded-xl text-emerald-600 hover:bg-emerald-50 transition"
                      title="Resume Subscription"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  {sub.status !== 'closed' && (
                    <>
                      <button
                        onClick={() => renewMutation.mutate(sub.id)}
                        className="p-1.5 rounded-xl text-violet-600 hover:bg-violet-50 transition"
                        title="Renew Subscription"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCloseTarget(sub)}
                        className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition"
                        title="Close / Cancel"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* View Mode: TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">SUB ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Amount / Period</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">Next Billing</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-violet-600">
                      <Link to={`/subscriptions/${sub.id}`}>{sub.subscription_number}</Link>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{sub.customer?.name}</td>
                    <td className="px-6 py-4">{sub.plan?.name}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{sub.total_amount.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-400">
                        /{sub.plan?.billing_frequency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {format(new Date(sub.start_date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {sub.next_billing_date ? format(new Date(sub.next_billing_date), 'dd MMM yyyy') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <Link
                        to={`/subscriptions/${sub.id}`}
                        className="inline-flex p-1.5 text-slate-500 hover:text-violet-600 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Close Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!closeTarget}
        onClose={() => setCloseTarget(null)}
        onConfirm={() => closeMutation.mutate()}
        title="Close Subscription Contract"
        message={`Are you sure you want to close subscription ${closeTarget?.subscription_number}? Recurring billing will be stopped immediately.`}
        confirmText="Confirm Close"
        variant="danger"
        loading={closeMutation.isPending}
      />
    </div>
  );
};
