/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Play, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { RoundHistory } from '../types';

interface RoundSummaryModalProps {
  roundHistory: RoundHistory | null;
  onClose: () => void;
  onOpenLeaderboard?: () => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  roundHistory,
  onClose,
  onOpenLeaderboard,
}) => {
  if (!roundHistory) return null;

  const isFinalRound = roundHistory.roundNumber >= 10;

  const handleActionClick = () => {
    onClose();
    if (isFinalRound && onOpenLeaderboard) {
      onOpenLeaderboard();
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between ${
          isFinalRound 
            ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700' 
            : 'bg-gradient-to-r from-purple-700 to-indigo-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">
                {isFinalRound 
                  ? `🏆 Rodada #${roundHistory.roundNumber} Concluída — Fim de Jogo!` 
                  : `Rodada #${roundHistory.roundNumber} Concluída!`
                }
              </h2>
              <p className="text-xs text-purple-100 font-medium">
                {isFinalRound 
                  ? 'A 10ª e última rodada foi encerrada! Veja os resultados e acesse o Ranking Final.' 
                  : 'Cálculos de receitas, despesas e pagamentos de fornecedores computados.'
                }
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-purple-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Financial Summaries */}
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-3.5 bg-zinc-50">
          {roundHistory.results.map((res) => {
            const isPositive = res.netIncome >= 0;

            return (
              <div
                key={res.playerId}
                className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <h3 className="font-black text-base text-zinc-900">
                    {res.playerName}
                  </h3>
                  <div className={`flex items-center gap-1 font-mono font-black text-sm px-2.5 py-1 rounded-lg ${
                    isPositive 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{isPositive ? '+' : ''}R$ {res.netIncome.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-150">
                    <span className="text-zinc-500 font-bold block text-[10px] uppercase">Receita Base Empresa</span>
                    <span className="font-mono font-black text-zinc-900 text-sm">+R$ {res.baseProfit.toLocaleString()}</span>
                  </div>

                  <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-150">
                    <span className="text-rose-700 font-bold block text-[10px] uppercase">Fornecedores (R$ 50/emp)</span>
                    <span className="font-mono font-black text-rose-800 text-sm">-R$ {(res.supplierExpenses ?? 0).toLocaleString()}</span>
                  </div>

                  <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-150">
                    <span className="text-emerald-700 font-bold block text-[10px] uppercase">Bônus Fornecimento</span>
                    <span className="font-mono font-black text-emerald-800 text-sm">+R$ {res.incomingPayments.toLocaleString()}</span>
                  </div>

                  {(res.newCompaniesCost ?? 0) > 0 ? (
                    <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                      <span className="text-amber-800 font-bold block text-[10px] uppercase">Abertura Novas Empresas</span>
                      <span className="font-mono font-black text-amber-900 text-sm">-R$ {res.newCompaniesCost.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-150">
                      <span className="text-blue-700 font-bold block text-[10px] uppercase">Valor a Outros Jogadores</span>
                      <span className="font-mono font-black text-blue-800 text-sm">R$ {res.outgoingPayments.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
                  <span className="text-zinc-500 font-bold">Movimentação do Saldo:</span>
                  <div className="flex items-center gap-2 font-mono font-bold">
                    <span className="text-zinc-500 line-through">R$ {res.previousCoins.toLocaleString()}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-purple-700 font-black text-sm">R$ {res.newCoins.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t border-zinc-200 flex justify-end">
          <button
            onClick={handleActionClick}
            className={`px-6 py-3 text-white rounded-xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
              isFinalRound 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
            }`}
          >
            <span>{isFinalRound ? 'Ver Ranking Final (Fim de Jogo)' : `Iniciar Rodada #${roundHistory.roundNumber + 1}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
