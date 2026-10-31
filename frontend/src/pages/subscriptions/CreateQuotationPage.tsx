import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import {
  ChevronLeft,
  CheckCircle2,
  Building2,
  Layers,
  ArrowRight,
  ArrowLeft,
  Receipt,
  Sparkles,
  FileText
} from 'lucide-react';
import { authApi } from '../../api/auth';
import { catalogueApi } from '../../api/catalogue';
import { subscriptionsApi } from '../../api/subscriptions';
import { Customer, Plan, Tax, Discount } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const CreateQuotationPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Wizard Step
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [planId, setPlanId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [validUntil, setValidUntil] = useState<string>(format(addDays(new Date(), 30), 'yyyy-MM-dd'));

  // Step 2 Pricing
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(18.0);
  const [notes, setNotes] = useState<string>('');

  // Queries
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => authApi.getCustomers({ status: 'active' }),
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: () => catalogueApi.getPlans({ is_active: true }),
  });

  const { data: taxes = [] } = useQuery({
    queryKey: ['taxes'],
    queryFn: catalogueApi.getTaxes,
  });

  const selectedCustomer = customers.find((c) => c.id === Number(customerId));
  const selectedPlan = plans.find((p) => p.id === Number(planId));

  // Automatically update unit price when plan is picked
  const handleSelectPlan = (plan: Plan) => {
    setPlanId(plan.id);
    setUnitPrice(plan.price);
  };

  // Calculations
  const subtotal = (unitPrice || 0) * (quantity || 1);
  const discountedSubtotal = Math.max(0, subtotal - (discountAmount || 0));
  const taxAmount = (discountedSubtotal * (taxRate || 0)) / 100;
  const totalAmount = discountedSubtotal + taxAmount;

  const createMutation = useMutation({
    mutationFn: (status: 'draft' | 'sent') => {
      if (!customerId || !planId) throw new Error('Customer and Plan are required');
      return subscriptionsApi.createQuotation({
        customer_id: Number(customerId),
        plan_id: Number(planId),
        product_id: selectedPlan?.product_id || null,
        quantity: quantity,
        unit_price: unitPrice,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        status: status,
        valid_until: validUntil,
        notes: notes,
      });
    },
    onSuccess: (qt) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success(`Quotation ${qt.quotation_number} generated successfully`);
      navigate(`/quotations/${qt.id}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create quotation');
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/quotations" className="hover:text-violet-600 transition flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Quotations</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900">New Quotation</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Quotation Proposal</h1>
          <p className="text-sm text-slate-500">
            3-Step interactive wizard for configuring client proposals and subscriptions.
          </p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {[
            { stepNum: 1, label: 'Customer & Plan' },
            { stepNum: 2, label: 'Pricing & Taxes' },
            { stepNum: 3, label: 'Review & Send' },
          ].map((s, idx) => (
            <React.Fragment key={s.stepNum}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                    step >= s.stepNum
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {s.stepNum}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    step >= s.stepNum ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`flex-1 h-0.5 mx-3 ${
                    step > s.stepNum ? 'bg-violet-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Customer & Plan */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-violet-600" />
            <span>Select Customer & Subscription Plan</span>
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Target Customer *</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
              >
                <option value="">Choose a customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company ? `${c.company} (${c.email})` : c.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700">Choose Subscription Plan *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {plans.map((p) => {
                  const isSelected = planId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPlan(p)}
                      className={`p-4 rounded-2xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50/50 ring-2 ring-violet-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {p.billing_frequency}
                      </span>
                      <h3 className="font-bold text-slate-900 mt-2">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.product?.name}</p>
                      <p className="text-lg font-black text-slate-900 mt-3">
                        ₹{p.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Contract Seat / Quantity *"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              />
              <Input
                label="Proposal Valid Until *"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
            <Button
              disabled={!customerId || !planId}
              onClick={() => setStep(2)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Next: Pricing & Taxes
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Pricing Summary */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-violet-600" />
            <span>Pricing Calculations & Taxes</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Input
                label="Unit Price Override (₹) *"
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value) || 0)}
              />

              <Input
                label="Manual Discount Amount (₹)"
                type="number"
                step="0.01"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Tax Rule</label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
                >
                  {taxes.map((t) => (
                    <option key={t.id} value={t.percentage}>
                      {t.name} ({t.percentage}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Calculation Box */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Commercial Summary
              </h3>
              <div className="space-y-2 text-sm text-slate-600 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal ({quantity} × ₹{unitPrice.toLocaleString('en-IN')}):</span>
                  <span className="font-semibold text-slate-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({taxRate}%):</span>
                  <span>+₹{taxAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">Total Amount:</span>
                  <span className="text-2xl font-black text-violet-700">
                    ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-between gap-3 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} icon={<ArrowRight className="w-4 h-4" />}>
              Next: Review Document
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Send */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  Official Quotation Draft
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">Brightloop Commercial Proposal</h2>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>Valid Until: {format(new Date(validUntil), 'dd MMMM yyyy')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Bill To Client:</p>
                <p className="font-bold text-slate-900">{selectedCustomer?.name}</p>
                <p className="text-slate-600">{selectedCustomer?.company}</p>
                <p className="text-slate-500 text-xs">{selectedCustomer?.email}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Contract Tier:</p>
                <p className="font-bold text-slate-900">{selectedPlan?.name}</p>
                <p className="text-slate-600">Billing: {selectedPlan?.billing_frequency}</p>
                <p className="text-slate-500 text-xs">Quantity: {quantity} Unit(s)</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Proposal Terms & Notes</label>
              <textarea
                rows={3}
                placeholder="Include custom terms, SLA guarantees, or onboarding assistance details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Total box */}
            <div className="bg-violet-50 p-5 rounded-2xl border border-violet-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-violet-900 uppercase tracking-wider">Final Quotation Total</p>
                <p className="text-xs text-violet-700">Includes all applicable GST/Taxes</p>
              </div>
              <span className="text-2xl font-black text-violet-900">
                ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-6 flex justify-between gap-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  loading={createMutation.isPending}
                  onClick={() => createMutation.mutate('draft')}
                >
                  Save as Draft
                </Button>
                <Button
                  loading={createMutation.isPending}
                  onClick={() => createMutation.mutate('sent')}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Save & Mark as Sent
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
