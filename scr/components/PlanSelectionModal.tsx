import React, { useState, useEffect, useRef } from 'react';
import { UserAccount, PlanType } from '../types';
import { activatePlanInFirestore } from '../lib/authService';
import {
  Check,
  Crown,
  Zap,
  Sparkles,
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Copy,
  Lock,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface PlanSelectionModalProps {
  user: UserAccount;
  onSelectPlan: (plan: PlanType) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  user,
  onSelectPlan,
  onClose,
  isOpen,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // Success animation inside modal
  const [showGreenAnimation, setShowGreenAnimation] = useState(false);

  // Form fields
  const [cardName, setCardName] = useState(user.name || '');
  const [cpf, setCpf] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Transparent payment states
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeBase64: string; paymentId: string } | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const planPrice =
    selectedPlan === 'pro_annual' || selectedPlan === 'pro_plus' || selectedPlan === 'premium'
      ? 'R$ 97,00'
      : selectedPlan === 'pro'
      ? 'R$ 49,90'
      : 'R$ 19,90';

  const planTitle =
    selectedPlan === 'pro_annual' || selectedPlan === 'pro_plus' || selectedPlan === 'premium'
      ? 'Plano Pro+ Anual (Acesso VIP 365 Dias)'
      : selectedPlan === 'pro'
      ? 'Plano Pro'
      : 'Plano Básico';

  const handleCopyPix = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const startPixPolling = (paymentId: string, plan: PlanType) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/mercadopago/payment-status/${paymentId}`);
        const data = await res.json();

        if (data.success && data.status === 'approved') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          handlePaymentApproved(plan);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);
  };

  const handlePaymentApproved = async (plan: PlanType) => {
    setShowGreenAnimation(true);
    if (user.id) {
      await activatePlanInFirestore(user.id, plan);
    }
    setTimeout(() => {
      onSelectPlan(plan);
      setShowGreenAnimation(false);
      setSelectedPlan(null);
      if (onClose) onClose();
    }, 2500);
  };

  const handleGeneratePix = async () => {
    if (!selectedPlan) return;
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length < 11) {
      setPaymentError('Informe um CPF válido com 11 dígitos para emitir o Pix.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    setPixData(null);

    try {
      const res = await fetch('/api/mercadopago/process-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          userId: user.id,
          userEmail: user.email,
          name: user.name || cardName || 'Cliente VOID',
          cpf: cleanCpf,
        }),
      });

      const data = await res.json();
      if (data.success && (data.qrCodeBase64 || data.qrCode)) {
        setPixData({
          qrCode: data.qrCode || '',
          qrCodeBase64: data.qrCodeBase64 || '',
          paymentId: String(data.paymentId),
        });
        startPixPolling(String(data.paymentId), selectedPlan);
      } else {
        setPaymentError(data.error || 'Não foi possível gerar o PIX no Mercado Pago.');
      }
    } catch (err: any) {
      console.error('Error generating PIX:', err);
      setPaymentError('Erro ao comunicar com o Mercado Pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayCard = async () => {
    if (!selectedPlan) return;
    const cleanCpf = cpf.replace(/\D/g, '');
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv || cleanCpf.length < 11) {
      setPaymentError('Preencha todos os campos do cartão e o CPF do titular.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const res = await fetch('/api/mercadopago/process-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          userId: user.id,
          userEmail: user.email,
          name: cardName,
          cpf: cleanCpf,
          cardNumber,
          cardExpiry,
          cardCvv,
        }),
      });

      const data = await res.json();
      if (data.success && data.status === 'approved') {
        await handlePaymentApproved(selectedPlan);
      } else {
        setPaymentError(data.error || 'Pagamento recusado pelo Mercado Pago.');
      }
    } catch (err: any) {
      console.error('Error processing card:', err);
      setPaymentError('Erro ao processar cartão de crédito.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      {/* Green Activation Overlay */}
      {showGreenAnimation && (
        <div className="fixed inset-0 z-50 bg-emerald-600 text-white flex flex-col items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 sm:p-12 rounded-3xl text-center max-w-lg w-full shadow-2xl animate-scaleUp">
            <div className="w-20 h-20 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              {selectedPlan === 'pro'
                ? 'PLANO PRO ATIVADO! ⚡'
                : 'PLANO BÁSICO ATIVADO! 🎉'}
            </h1>

            <p className="mt-3 text-sm text-emerald-100 font-medium leading-relaxed">
              Pagamento confirmado com sucesso no Mercado Pago! Seus limites de e-books foram atualizados.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider text-white">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Atualizando sua conta...
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={() => {
              setSelectedPlan(null);
              setPixData(null);
              setPaymentError(null);
              if (pollingRef.current) clearInterval(pollingRef.current);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {!selectedPlan ? (
          /* STEP 1: PLAN SELECTION GRID */
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                Alterar ou Atualizar Assinatura
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Qual plano melhor atende você?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Escolha o plano para atualizar seus limites mensais e recursos de e-books.
              </p>
            </div>

            {/* Plans Grid with 3 Tiers including Pro+ Anual */}
            <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch pt-2">
              {/* Plano Básico */}
              <div
                className={`bg-white rounded-3xl border-2 p-6 flex flex-col justify-between transition-all relative ${
                  user.plan === 'basico'
                    ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {user.plan === 'basico' && (
                  <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                    Plano Ativo Atual
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Iniciante</span>
                      <h3 className="text-lg font-black text-slate-900">Plano Básico</h3>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="my-3 pb-3 border-b border-slate-100">
                    <span className="text-3xl font-black text-slate-900">R$ 19,90</span>
                    <span className="text-slate-500 font-semibold text-xs"> / mês</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Renovação a cada 30 dias</p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700 mb-6 font-medium">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Até <strong>3 e-books/mês</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>E-books de até <strong>12 páginas</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Diagramações Essenciais</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Editor e capas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Exportação em <strong>PDF HD</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Conteúdo direto & resumido</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Acesso ao <strong>Grupo VIP</strong></span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan('basico');
                    setPaymentError(null);
                    setPixData(null);
                  }}
                  disabled={user.plan === 'basico'}
                  className={`w-full py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                    user.plan === 'basico'
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md cursor-pointer'
                  }`}
                >
                  {user.plan === 'basico' ? 'Plano Atual Ativo' : 'Selecionar Básico (R$ 19,90/mês)'}
                </button>
              </div>

              {/* Plano Pro+ Anual (O PLANO IRRESISTÍVEL / MAIOR DESTAQUE) */}
              <div
                className={`bg-gradient-to-b from-amber-500/10 via-white to-amber-500/5 rounded-3xl border-2 p-6 flex flex-col justify-between shadow-xl relative scale-100 lg:-translate-y-2 ${
                  user.plan === 'pro_annual' || user.plan === 'pro_plus' || user.plan === 'premium'
                    ? 'border-amber-600 ring-2 ring-amber-600/30'
                    : 'border-amber-500'
                }`}
              >
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase px-3.5 py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200 animate-pulse" />
                  🔥 Mais Vantajoso (Economize R$ 500+)
                </span>

                <div>
                  <div className="flex items-center justify-between mb-3 mt-1">
                    <div>
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Acesso Anual VIP</span>
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                        Pro+ Anual
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-xs">
                      <Sparkles className="w-5 h-5 text-amber-600 fill-amber-500" />
                    </div>
                  </div>

                  <div className="my-2.5 pb-3 border-b border-amber-200/60">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-slate-900">R$ 97,00</span>
                      <span className="text-amber-800 font-bold text-xs">/ ano único</span>
                    </div>
                    <p className="text-[11px] text-amber-900 font-bold mt-1 bg-amber-100/80 px-2 py-0.5 rounded-md inline-block">
                      Equivalente a <span className="underline">R$ 8,08/mês</span> (365 dias de acesso)
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-800 mb-6 font-medium">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Até <strong>20 e-books/mês (renovados a cada 30 dias)</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Acesso por <strong>365 Dias (1 Ano Completo)</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>E-books de até <strong>18 páginas</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Editor e capas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Todas as <strong>6 Diagramações PRO</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Modo Conteúdo Profundo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Ilustrações com gráficos visuais</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Exportação em <strong>PDF HD</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Acesso ao <strong>Grupo VIP</strong></span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan('pro_annual');
                    setPaymentError(null);
                    setPixData(null);
                  }}
                  disabled={user.plan === 'pro_annual' || user.plan === 'pro_plus' || user.plan === 'premium'}
                  className={`w-full py-3.5 rounded-xl font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
                    user.plan === 'pro_annual' || user.plan === 'pro_plus' || user.plan === 'premium'
                      ? 'bg-amber-100 text-amber-900 cursor-default'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-xl cursor-pointer'
                  }`}
                >
                  <Crown className="w-4 h-4 text-amber-200 fill-amber-200" />
                  {user.plan === 'pro_annual' || user.plan === 'pro_plus' || user.plan === 'premium'
                    ? 'Plano Atual Ativo'
                    : 'Garantir Pro+ Anual por R$ 97'}
                </button>
              </div>

              {/* Plano PRO Mensal */}
              <div
                className={`bg-white rounded-3xl border-2 p-6 flex flex-col justify-between transition-all relative ${
                  user.plan === 'pro'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-md'
                    : 'border-purple-300 hover:border-purple-500 shadow-md'
                }`}
              >
                {user.plan === 'pro' && (
                  <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                    Plano Ativo Atual
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Mensal</span>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                        Plano Pro
                        <Crown className="w-4 h-4 text-purple-600 fill-purple-500" />
                      </h3>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4 fill-purple-600" />
                    </div>
                  </div>

                  <div className="my-3 pb-3 border-b border-slate-100">
                    <span className="text-3xl font-black text-slate-900">R$ 49,90</span>
                    <span className="text-slate-500 font-semibold text-xs"> / mês</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Renovação a cada 30 dias</p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700 mb-6 font-medium">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Até <strong>10 e-books/mês</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>E-books de até <strong>18 páginas</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Editor e capas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Todas as <strong>6 Diagramações PRO</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Modo Conteúdo Profundo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Ilustrações com gráficos visuais</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Exportação em <strong>PDF HD</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Acesso ao <strong>Grupo VIP</strong></span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan('pro');
                    setPaymentError(null);
                    setPixData(null);
                  }}
                  disabled={user.plan === 'pro'}
                  className={`w-full py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                    user.plan === 'pro'
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-purple-700 hover:bg-purple-800 text-white shadow-md cursor-pointer'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  {user.plan === 'pro' ? 'Plano Atual Ativo' : 'Selecionar Pro (R$ 49,90/mês)'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: EMBEDDED CHECKOUT FORM INSIDE MODAL */
          <div className="overflow-y-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <button
                onClick={() => {
                  setSelectedPlan(null);
                  setPixData(null);
                  setPaymentError(null);
                  if (pollingRef.current) clearInterval(pollingRef.current);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Trocar de Plano
              </button>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Plano Selecionado
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  {planTitle} — <strong className="text-blue-600">{planPrice}/mês</strong>
                </span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Escolha a Forma de Pagamento Transparente:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('pix');
                    setPaymentError(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/30 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">PIX (Instantâneo)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Liberação Imediata</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('card');
                    setPaymentError(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/30 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Cartão de Crédito</div>
                    <div className="text-[10px] text-slate-500 font-normal">Aprovação Imediata</div>
                  </div>
                </button>
              </div>
            </div>

            {/* ERROR ALERT */}
            {paymentError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-extrabold block mb-0.5">Erro no Pagamento:</strong>
                  <span>{paymentError}</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PIX */}
            {paymentMethod === 'pix' && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5 text-center">
                {!pixData ? (
                  <div className="space-y-3 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        CPF do Titular (Exigido pelo Mercado Pago Pix):
                      </label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs font-bold text-slate-900"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleGeneratePix}
                      disabled={isProcessing}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Gerando PIX no Mercado Pago...</span>
                        </>
                      ) : (
                        <span>Gerar PIX Mercado Pago ({planPrice})</span>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                      <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                      PIX Transparente Mercado Pago ({planPrice})
                    </div>

                    <div className="w-40 h-40 bg-white p-2.5 rounded-2xl border border-slate-200 mx-auto shadow-sm flex flex-col items-center justify-center">
                      {pixData.qrCodeBase64 ? (
                        <img
                          src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`}
                          alt="Pix QR Code Mercado Pago"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pixData.qrCode)}`}
                          alt="Pix QR Code"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 font-medium">
                        Escaneie o QR Code no seu aplicativo do banco ou use o código abaixo:
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5 text-emerald-600" />
                        {copiedPix ? 'Código Pix Copiado!' : 'Copiar Código Pix Copia e Cola'}
                      </button>
                    </div>

                    <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                      <span>Aguardando confirmação do banco...</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: CREDIT CARD */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nome no Cartão</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Nome no cartão"
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CPF do Titular</label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Validade (MM/AA)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePayCard}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-3"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processando no Mercado Pago...</span>
                    </>
                  ) : (
                    <span>Pagar {planPrice} e Ativar {planTitle}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Checkout Transparente seguro com criptografia Mercado Pago.</span>
        </div>
      </div>
    </div>
  );
};
