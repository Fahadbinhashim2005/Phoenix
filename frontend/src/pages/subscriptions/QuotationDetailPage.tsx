import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  ChevronLeft,
  Printer,
  CheckCircle2,
  Send,
  Building2,
  Calendar,
  Sparkles,
  Repeat
} from 'lucide-react';
import { subscriptionsApi } from '../../api/subscriptions';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const QuotationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const quotationId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: quotation, isLoading } = useQuery({
    queryKey: ['quotation', quotationId],
    queryFn: () => subscriptionsApi.getQuotation(quotationId),
    enabled: !!quotationId,
  });

  const confirmMutation = useMutation({
    mutationFn: () => subscriptionsApi.confirmQuotation(quotationId),
    onSuccess: (sub) => {
      queryClient.invalidateQueries({ queryKey: ['quotation', quotationId] });
      toast.success(`Quotation accepted! Subscription ${sub.subscription_number} generated.`);
      navigate(`/subscriptions/${sub.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to convert quotation');
    },
  });

  const markSentMutation = useMutation({
    mutationFn: () => subscriptionsApi.updateQuotation(quotationId, { status: 'sent' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotation', quotationId] });
      toast.success('Quotation status set to Sent');
    },
  });

  if (isLoading || !quotation) {
    return <div className="p-12 text-center text-slate-400">Loading quotation document...</div>;
  }

  const subtotal = quotation.unit_price * quotation.quantity;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/quotations" className="hover:text-violet-600 transition flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Quotations</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900">{quotation.quotation_number}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => window.print()} icon={<Printer className="w-4 h-4" />}>
            Print / PDF
          </Button>

          {quotation.status === 'draft' && (
            <Button
              variant="outline"
              loading={markSentMutation.isPending}
              onClick={() => markSentMutation.mutate()}
              icon={<Send className="w-4 h-4" />}
            >
              Mark as Sent
            </Button>
          )}

          {['draft', 'sent'].includes(quotation.status) && (
            <Button
              loading={confirmMutation.isPending}
              onClick={() => confirmMutation.mutate()}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm → Create Subscription
            </Button>
          )}

          {quotation.status === 'accepted' && (
            <Link to="/subscriptions">
              <Button icon={<Repeat className="w-4 h-4" />}>
                Go to Subscriptions
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Real Document Printable Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-violet-600/30">
                <Sparkles className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Brightloop</span>
                <p className="text-xs text-slate-400">Team Syntax Enterprise SaaS</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Cyber City, DLF Phase 2<br />
              Gurugram, HR 122002, India<br />
              billing@brightloop.io
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <h1 className="text-2xl font-black text-violet-700 tracking-tight">
              {quotation.quotation_number}
            </h1>
            <div className="flex sm:justify-end py-1">
              <StatusBadge status={quotation.status} />
            </div>
            <p className="text-xs text-slate-500">
              Date: {format(new Date(quotation.created_at), 'dd MMM yyyy')}
            </p>
            {quotation.valid_until && (
              <p className="text-xs font-semibold text-rose-600">
                Valid Until: {format(new Date(quotation.valid_until), 'dd MMM yyyy')}
              </p>
            )}
          </div>
        </div>

        {/* Customer & Contract Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-6 rounded-2xl border border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quotation For:</span>
            <p className="font-bold text-slate-900 text-base mt-1">{quotation.customer?.name}</p>
            <p className="text-xs text-slate-600 font-medium">{quotation.customer?.company}</p>
            <p className="text-xs text-slate-500 mt-1">{quotation.customer?.email}</p>
            {quotation.customer?.address && (
              <p className="text-xs text-slate-500 mt-0.5">{quotation.customer?.address}</p>
            )}
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Plan Contract Terms:</span>
            <p className="font-bold text-slate-900 text-base mt-1">{quotation.plan?.name}</p>
            <p className="text-xs text-slate-600">
              Billing Cadence: <span className="capitalize font-semibold">{quotation.plan?.billing_frequency}</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Linked Platform: {quotation.product?.name || quotation.plan?.product?.name || 'Cloud Platform'}
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3">Item Description</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Unit Price</th>
                <th className="py-3 text-right">Discount</th>
                <th className="py-3 text-right">Tax</th>
                <th className="py-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              <tr>
                <td className="py-4 font-semibold text-slate-900">
                  {quotation.plan?.name || 'SaaS Subscription'}
                  <span className="block text-xs font-normal text-slate-400">
                    {quotation.product?.name}
                  </span>
                </td>
                <td className="py-4 text-center font-medium">{quotation.quantity}</td>
                <td className="py-4 text-right font-medium">₹{quotation.unit_price.toLocaleString('en-IN')}</td>
                <td className="py-4 text-right text-rose-600 font-medium">
                  -₹{quotation.discount_amount.toLocaleString('en-IN')}
                </td>
                <td className="py-4 text-right font-medium">
                  +₹{quotation.tax_amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </td>
                <td className="py-4 text-right font-extrabold text-slate-900">
                  ₹{quotation.total_amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-100 pt-6">
          <div className="max-w-xs space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notes & Terms:</span>
            <p className="text-xs text-slate-600 italic">
              {quotation.notes || 'Subject to Brightloop standard SaaS terms of service and SLA.'}
            </p>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {quotation.discount_amount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount:</span>
                <span>-₹{quotation.discount_amount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes:</span>
              <span>+₹{quotation.tax_amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline font-bold">
              <span className="text-base text-slate-900">Total:</span>
              <span className="text-2xl font-black text-violet-700">
                ₹{quotation.total_amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
