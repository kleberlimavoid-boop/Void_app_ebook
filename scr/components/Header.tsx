import React from 'react';
import { UserAccount, isProUser } from '../types';
import { Sparkles, Crown, Folder, UserCheck, PlusCircle, User, Home, Zap } from 'lucide-react';
import { VoidLogo } from './VoidLogo';

interface HeaderProps {
  user: UserAccount;
  onOpenPlans: () => void;
  onOpenLibrary: () => void;
  onOpenProfile: () => void;
  onNewEbook: () => void;
  onGoHome?: () => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenPlans,
  onOpenLibrary,
  onOpenProfile,
  onNewEbook,
  onGoHome,
  onOpenAuth,
}) => {
  const isPro = isProUser(user.plan);
  const isAnnual = user.plan === 'pro_annual' || user.plan === 'pro_plus' || user.plan === 'premium';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Vectorized Brand Logo */}
        <div
          onClick={onGoHome || onNewEbook}
          className="flex items-center cursor-pointer group select-none"
        >
          <VoidLogo size="md" textColor="#0F172A" />
        </div>

        {/* Navigation & User Profile Controls */}
        <div className="flex items-center gap-2">
          {/* Home Button */}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/60 cursor-pointer"
              title="Voltar para a Tela Inicial"
            >
              <Home className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Início</span>
            </button>
          )}

          {/* New Ebook Button */}
          <button
            onClick={onNewEbook}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg border border-blue-200/80 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Novo E-book</span>
          </button>

          {/* My Ebooks Button */}
          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/60 cursor-pointer"
            title="Sua biblioteca de e-books salvos"
          >
            <Folder className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Meus E-books</span>
          </button>

          {/* Plan Badge */}
          <button
            onClick={onOpenPlans}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
              isAnnual
                ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100/80 text-amber-900 shadow-2xs'
                : isPro
                ? 'border-purple-200 bg-purple-50 hover:bg-purple-100/80 text-purple-900'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            {isAnnual ? (
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-900">
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                Pro+ Anual (VIP)
              </span>
            ) : isPro ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-purple-900">
                <Crown className="w-3 h-3 text-purple-600 fill-purple-500" />
                Plano Pro
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-slate-700 font-semibold">
                <UserCheck className="w-3 h-3 text-slate-500" />
                Plano Básico
              </span>
            )}
            <Sparkles className="w-3 h-3 text-amber-500" />
          </button>

          {/* User Profile Avatar Button or Login Button */}
          {user.isLoggedIn ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 rounded-full transition-colors cursor-pointer"
              title="Ver Perfil do Usuário"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[11px] font-bold text-slate-800 leading-none">{user.name}</p>
                <p className="text-[9px] text-slate-500 leading-none mt-0.5 truncate max-w-[120px]">{user.email}</p>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Entrar / Cadastrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


