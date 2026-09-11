/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trophy, Star, Coins, Building2, Layers, Award } from 'lucide-react';
import { Player } from '../types';
import { getScoreBreakdown } from '../utils/gameCalculations';

interface LeaderboardModalProps {
  allPlayers: Player[];
  isGameOver?: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  allPlayers,
  isGameOver = false,
  onClose,
}) => {
  // Sort players by total score descending
  const sortedPlayers = [...allPlayers].sort((a, b) => {
    return getScoreBreakdown(b).total - getScoreBreakdown(a).total;
  });

  const winner = sortedPlayers[0];

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between ${
          isGameOver 
            ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700' 
            : 'bg-amber-500'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {isGameOver ? '🏆 Fim de Jogo — Ranking Final' : 'Placar Geral & Pontuação'}
                </h2>
                {isGameOver && (
                  <span className="text-[10px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30 uppercase">
                    Partida Finalizada
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-100 font-medium">
                {isGameOver 
                  ? 'A partida foi finalizada! Posição final dos jogadores calculada por pontuação.' 
                  : 'Ranking em tempo real baseado nas regras estratégicas do jogo.'
                }
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-amber-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-4 bg-zinc-50">
          
          {/* Winner announcement callout if game over */}
          {isGameOver && winner && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-md border border-amber-400 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-amber-100 shrink-0">
                  <Award className="w-7 h-7 text-yellow-200" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-100 bg-black/20 px-2 py-0.5 rounded-md">
                    👑 Campeão da Partida
                  </span>
                  <h3 className="text-xl font-black mt-0.5">
                    {winner.name}
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    Parabéns pela vitória com a maior pontuação acumulada!
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono">
                <span className="text-[10px] uppercase font-bold text-amber-200 block">Pontuação Vitória</span>
                <span className="text-2xl font-black text-white">
                  {getScoreBreakdown(winner).total.toLocaleString()} pts
                </span>
              </div>
            </div>
          )}

          {sortedPlayers.map((player, index) => {
            const breakdown = getScoreBreakdown(player);
            const rank = index + 1;

            return (
              <div
                key={player.id}
                className={`p-4 rounded-xl border bg-white shadow-xs space-y-3 transition-all ${
                  rank === 1 ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                      rank === 1 ? 'bg-amber-500 text-white' :
                      rank === 2 ? 'bg-zinc-300 text-zinc-800' :
                      rank === 3 ? 'bg-amber-700 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      #{rank}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full ${player.color}`} />
                      <h3 className="font-extrabold text-base text-zinc-900">
                        {player.name}
                      </h3>
                      {rank === 1 && (
                        <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                          <Award className="w-3 h-3" /> 1º Lugar
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-400 block uppercase">Pontuação Total</span>
                    <span className="font-mono font-black text-lg text-amber-600">
                      {breakdown.total.toLocaleString()} pts
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Bar / Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-100 text-xs">
                  <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-bold block text-[10px] uppercase">Moedas (Saldo)</span>
                    <span className="font-mono font-black text-amber-600 text-xs">
                      +{breakdown.coinsScore.toLocaleString()} pts
                    </span>
                  </div>

                  <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-bold block text-[10px] uppercase">Valor Empresas</span>
                    <span className="font-mono font-black text-blue-600 text-xs">
                      +{breakdown.companyScore.toLocaleString()} pts
                    </span>
                  </div>

                  <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-bold block text-[10px] uppercase">Integração Vertical</span>
                    <span className="font-mono font-black text-emerald-600 text-xs">
                      +{breakdown.verticalIntegrationScore.toLocaleString()} pts
                    </span>
                  </div>

                  <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-bold block text-[10px] uppercase">Densidade de Setor</span>
                    <span className="font-mono font-black text-purple-600 text-xs">
                      +{breakdown.sectorDensityScore.toLocaleString()} pts
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
