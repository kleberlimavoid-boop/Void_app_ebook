import React, { useState } from 'react';
import { UserAccount, isProUser } from '../types';
import { User, Mail, ShieldCheck, Sparkles, X, Check, BookOpen, Pencil, LogOut, Crown } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onOpenPlans: () => void;
  onUpdateUserName?: (newName: string) => void;
  onLogout?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenPlans,
  onUpdateUserName,
  onLogout,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);

  if (!isOpen) return null;

  const isPro = isProUser(user.plan);
  const isAnnual = user.plan === 'pro_annual' || user.plan === 'pro_plus' || user.plan === 'premium';
  const hasActiveSub = user.hasActiveSubscription && user.plan !== 'gratis';
  const remaining = Math.max(0, user.monthlyLimit - user.ebooksCreatedCount);

  const planLabel = isAnnual
    ? 'Plano Pro+ Anual (VIP)'
    : user.plan === 'pro'
    ? 'Plano Pro Mensal'
    : user.plan === 'basico'
    ? 'Plano Básico'
    : 'Sem Plano Ativo';

  const planBadgeStyle = isAnnual
    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold flex items-center gap-1'
    : user.plan === 'pro'
    ? 'bg-purple-100 text-purple-800 border border-purple-300 font-bold'
    : user.plan === 'basico'
    ? 'bg-blue-100 text-blue-800 border border-blue-200 font-bold'
    : 'bg-slate-100 text-slate-600 border border-slate-200 font-semibold';

  const handleSaveName = () => {
    if (nameInput.trim() && onUpdateUserName) {
      onUpdateUserName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Perfil do Usuário</h3>
              <p className="text-[11px] text-slate-300">Sua conta e plano na plataforma</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
            {/* Name Field with Pencil */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" /> Nome
              </span>
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-2 py-0.5 rounded border border-blue-500 text-xs text-slate-900 font-bold focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                    title="Salvar Nome"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{user.name}</span>
                  <button
                    onClick={() => {
                      setNameInput(user.name);
                      setIsEditingName(true);
                    }}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-200/60 transition-colors"
                    title="Editar Nome do Usuário"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-2.5">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> E-mail
              </span>
              <span className="font-bold text-slate-800">{user.email || 'projeto.exodo.21@gmail.com'}</span>
            </div>

            {/* Plan Field with Pencil */}
            <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-2.5">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Plano Ativo
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${planBadgeStyle}`}>
                  {planLabel}
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenPlans();
                  }}
                  className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Alterar ou Fazer Upgrade de Plano"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1 text-slate-600">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                E-books criados este mês
              </span>
              <span className="text-blue-700 font-extrabold">
                {user.ebooksCreatedCount} de {user.monthlyLimit || 0}
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${user.monthlyLimit > 0 ? Math.min(100, (user.ebooksCreatedCount / user.monthlyLimit) * 100) : 0}%`,
                }}
              />
            </div>

            <p className="text-[11px] text-slate-500">
              {hasActiveSub ? (
                <>
                  Você ainda tem <strong className="text-blue-700">{remaining} cota(s)</strong> para gerar novos e-books este mês.
                </>
              ) : (
                <span className="text-amber-700 font-medium">
                  Nenhum plano ativo. Escolha um plano para começar a criar.
                </span>
              )}
            </p>
          </div>

          {/* Upgrade Action */}
          {!isAnnual && (
            <button
              onClick={() => {
                onClose();
                onOpenPlans();
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Crown className="w-4 h-4 text-amber-200 fill-amber-200" />
              Garantir Pro+ Anual por R$ 97 (Acesso VIP)
            </button>
          )}

          {/* Logout Action */}
          {onLogout && (
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full py-2 px-3 border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair da Conta
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
