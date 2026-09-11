/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Undo2, X, AlertTriangle } from 'lucide-react';

interface ConfirmUndoModalProps {
  currentRound: number;
  targetRound?: number;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmUndoModal: React.FC<ConfirmUndoModalProps> = ({
  currentRound,
  targetRound,
  onConfirm,
  onClose,
}) => {
  const displayTargetRound = targetRound !== undefined ? targetRound : Math.max(1, currentRound - 1);

  return (
    <div 
      id="confirm-undo-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-zinc-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Undo2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Desfazer Rodada
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                Confirmação de reversão de estado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-all cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed font-medium">
              Você está prestes a retornar do estado atual para a <strong>Rodada #{displayTargetRound}</strong>.
            </div>
          </div>

          <p className="text-sm text-zinc-700 font-medium leading-relaxed">
            Deseja realmente retornar ao estado da rodada anterior?
          </p>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Os saldos, vínculos de empresas e níveis dos jogadores voltarão exatamente a como estavam antes do último encerramento de rodada.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              id="btn-cancel-undo"
              onClick={onClose}
              className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-zinc-250 active:scale-95"
            >
              Cancelar
            </button>
            <button
              id="btn-confirm-undo"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1.5"
            >
              <Undo2 className="w-4 h-4" />
              Sim, Desfazer Rodada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
