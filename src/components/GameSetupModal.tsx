/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Users, RotateCcw, Plus, Trash2, Check, Settings, ShieldAlert } from 'lucide-react';
import { Player } from '../types';
import { PLAYER_COLORS } from '../constants';

interface GameSetupModalProps {
  players: Player[];
  currentRound: number;
  onClose: () => void;
  onSaveConfig: (updatedPlayers: Player[], startingCapital: number) => void;
  onResetMatch: (newPlayerNames: string[], startingCapital: number) => void;
}

export const GameSetupModal: React.FC<GameSetupModalProps> = ({
  players,
  currentRound,
  onClose,
  onSaveConfig,
  onResetMatch,
}) => {
  const [startingCapital, setStartingCapital] = useState<number>(5000);
  const [playerNames, setPlayerNames] = useState<string[]>(players.map(p => p.name));
  const [confirmReset, setConfirmReset] = useState(false);

  const handleAddPlayer = () => {
    if (playerNames.length < 6) {
      setPlayerNames([...playerNames, `Jogador ${playerNames.length + 1}`]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const handleNameChange = (index: number, val: string) => {
    const updated = [...playerNames];
    updated[index] = val;
    setPlayerNames(updated);
  };

  const handleSaveNames = () => {
    const updatedPlayers: Player[] = playerNames.map((name, idx) => {
      const existing = players[idx];
      if (existing) {
        return {
          ...existing,
          name: name.trim() || `Jogador ${idx + 1}`,
        };
      }
      return {
        id: idx + 1,
        name: name.trim() || `Jogador ${idx + 1}`,
        coins: startingCapital,
        color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
        companies: [],
        innovationCards: 0,
      };
    });
    onSaveConfig(updatedPlayers, startingCapital);
    onClose();
  };

  const handleExecuteReset = () => {
    onResetMatch(playerNames, startingCapital);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-zinc-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-700 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight">
                Configuração da Partida
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                Gerencie jogadores, capital inicial e reinicie a partida.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-5">
          
          {/* Starting Capital */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Capital Inicial por Jogador (R$)
            </label>
            <input
              type="number"
              step="500"
              value={startingCapital}
              onChange={(e) => setStartingCapital(parseFloat(e.target.value) || 5000)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-mono font-bold text-sm text-zinc-900 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Players Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-600" /> Jogadores ({playerNames.length})
              </label>
              {playerNames.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddPlayer}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Jogador
                </button>
              )}
            </div>

            <div className="space-y-2">
              {playerNames.map((name, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                  <div className={`w-3.5 h-3.5 rounded-full ${PLAYER_COLORS[idx % PLAYER_COLORS.length]} shrink-0`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    placeholder={`Jogador ${idx + 1}`}
                    className="flex-1 bg-white border border-zinc-300 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-900 focus:outline-none focus:border-purple-500"
                  />
                  {playerNames.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(idx)}
                      className="p-1 text-zinc-400 hover:text-rose-600 rounded transition-colors"
                      title="Remover jogador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reset Game Section */}
          <div className="pt-4 border-t border-zinc-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
              Reiniciar Partida Zerada
            </span>
            <p className="text-xs text-zinc-500 font-medium">
              Zera todas as empresas vinculadas, redefine os saldos para o capital inicial e volta para a Rodada #1.
            </p>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Reiniciar Nova Partida
              </button>
            ) : (
              <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Tem certeza? Todos os dados atuais da partida serão apagados.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExecuteReset}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-black text-xs transition-all cursor-pointer"
                  >
                    Sim, Reiniciar Agora
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-lg font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-zinc-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Fechar
          </button>
          <button
            onClick={handleSaveNames}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <Check className="w-4 h-4" /> Salvar Nomes
          </button>
        </div>

      </div>
    </div>
  );
};
