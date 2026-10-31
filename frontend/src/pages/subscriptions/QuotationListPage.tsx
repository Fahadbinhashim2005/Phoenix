import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format, isPast } from 'date-fns';
import {
  FileSpreadsheet,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';
import { subscriptionsApi } from '../../api/subscriptions';
import { Quotation } from '../../types';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export const QuotationListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusTab, setStatusTab] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmingQt, setConfirmingQt] = useState<Quotation | null>(null);

  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ['quotations', statusTab, search],
    queryFn: () =>
      subscriptionsApi.getQuotations({
        status: statusTab === 'all' ? undefined : statusTab,
        search: search || undefined,
      }),
  });

  const confirmMutation = useMutation({
    mutationFn: (id: number) => subscriptionsApi.confirmQuotation(id),
    onSuccess: (sub) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success(`Quotation accepted! Subscription ${sub.subscription_number} created.`);
      setConfirmingQt(null);
      navigate(`/subscriptions/${sub.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to confirm quotation');
    },
  });

  const allCount = quotations.length;
  const draftCount = quotations.filter((q) => q.status === 'draft').length;
  const sentCount = quotations.filter((q) => q.status === 'sent').length;
  const acceptedCount = quotations.filter((q) => q.status === 'accepted').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quotations Pipeline</h1>
          <p className="text-sm text-slate-500">
            Generate customized commercial proposals and convert approved quotes to active subscriptions.
          </p>
        </div>
        <Button onClick={() => navigate('/quotations/new')} icon={<Plus className="w-4 h-4" />}>
          New Quotation
        </Button>
      </div>

      {/* Summary Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Quotations', count: allCount },
          { id: 'draft', label: 'Draft', count: draftCount },
          { id: 'sent', label: 'Sent to Client', count: sentCount },
          { id: 'accepted', label: 'Accepted & Converted', count: acceptedCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-2 ${
              statusTab === tab.id
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quotations by number (QT-2026-...) or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">QT Number</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Plan Name</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Valid Until</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Loading quotations...
                  </td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                    <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No quotations found.</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">
                      Create your first subscription proposal for prospective clients.
                    </p>
                    <Button onClick={() => navigate('/quotations/new')} icon={<Plus className="w-4 h-4" />}>
                      Create Quotation
                    </Button>
                  </td>
                </tr>
              ) : (
                quotations.map((qt) => {
                  const isExpired = qt.valid_until && isPast(new Date(qt.valid_until)) && qt.status !== 'accepted';

                  return (
                    <tr
                      key={qt.id}
                      onClick={() => navigate(`/quotations/${qt.id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition group"
                    >
                      <td className="px-6 py-4 font-bold text-violet-600 group-hover:underline">
                        {qt.quotation_number}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {qt.customer?.name || 'Customer'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700">
                          {qt.plan?.name || 'Plan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-900">
                        ₹{qt.total_amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className={isExpired ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                          {qt.valid_until ? format(new Date(qt.valid_until), 'dd MMM yyyy') : 'No expiry'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={isExpired ? 'expired' : qt.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/quotations/${qt.id}`}
                          className="inline-flex p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {['draft', 'sent'].includes(qt.status) && (
                          <button
                            onClick={() => setConfirmingQt(qt)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition"
                            title="Confirm Quotation"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Convert</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Conversion Dialog */}
      <ConfirmDialog
        isOpen={!!confirmingQt}
        onClose={() => setConfirmingQt(null)}
        onConfirm={() => confirmingQt && confirmMutation.mutate(confirmingQt.id)}
        title="Confirm Quotation & Create Subscription"
        message={`Convert ${confirmingQt?.quotation_number} for ${confirmingQt?.customer?.name} into an active subscription? This will trigger contract activation.`}
        confirmText="Confirm & Activate"
        variant="warning"
        loading={confirmMutation.isPending}
      />
    </div>
  );
};
