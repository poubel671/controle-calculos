/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flag, X, AlertTriangle, Trophy } from 'lucide-react';

interface ConfirmEndGameModalProps {
  currentRound: number;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmEndGameModal: React.FC<ConfirmEndGameModalProps> = ({
  currentRound,
  onConfirm,
  onClose,
}) => {
  return (
    <div 
      id="confirm-end-game-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <Flag className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Encerrar Partida
              </h2>
              <p className="text-xs text-rose-300 font-medium">
                Rodada atual: #{currentRound} de 10
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-rose-300 hover:text-white rounded-lg hover:bg-rose-900/60 transition-all cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-950 leading-relaxed font-medium">
              Você está na <strong>Rodada #{currentRound}</strong>. Ao encerrar a partida agora, a pontuação final será computada com base nos saldos atuais e <strong>o encerramento não poderá ser desfeito</strong>.
            </div>
          </div>

          <p className="text-sm font-semibold text-zinc-800 leading-relaxed">
            Deseja realmente finalizar o jogo antes da décima rodada?
          </p>

          <p className="text-xs text-zinc-500 leading-relaxed">
            As alterações da rodada que ainda não foram aplicadas (sem clicar em encerrar rodada) não serão computadas, e o placar final com o ranking de vencedores será exibido imediatamente.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              id="btn-cancel-end-game"
              onClick={onClose}
              className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-zinc-250 active:scale-95"
            >
              Continuar Jogando
            </button>
            <button
              id="btn-confirm-end-game"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-rose-600/25 active:scale-95 flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4" />
              Sim, Encerrar Partida
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
