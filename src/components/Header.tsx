/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Building2, 
  Table, 
  Trophy, 
  Settings, 
  RotateCcw,
  Undo2,
  Flag
} from 'lucide-react';

interface HeaderProps {
  round: number;
  isGameOver?: boolean;
  canUndo?: boolean;
  onUndoRound: () => void;
  onEndGame: () => void;
  onOpenSuppliers: () => void;
  onOpenLeaderboard: () => void;
  onOpenSetup: () => void;
  onResetApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  round,
  isGameOver = false,
  canUndo = false,
  onUndoRound,
  onEndGame,
  onOpenSuppliers,
  onOpenLeaderboard,
  onOpenSetup,
  onResetApp,
}) => {
  return (
    <header className="bg-white border-b border-zinc-200 shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-zinc-900 uppercase">
                Construindo Negócios
              </h1>
              <span className="text-[10px] font-extrabold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                Central de Controle
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">
              Controle de Cálculos
            </p>
          </div>
        </div>

        {/* Round Counter & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Round Counter Badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 border border-zinc-250 rounded-xl">
            <span className="text-xs font-bold uppercase text-zinc-500">
              {isGameOver ? 'Status' : 'Rodada'}
            </span>
            <span className={`text-sm sm:text-base font-black font-mono px-2 py-0.5 rounded-md border ${
              isGameOver 
                ? 'bg-amber-100 text-amber-800 border-amber-300' 
                : 'bg-purple-50 text-purple-600 border-purple-200'
            }`}>
              {isGameOver ? 'Partida Encerrada' : `#${round} / 10`}
            </span>
          </div>

          {/* Desfazer Rodada Button */}
          <button
            onClick={onUndoRound}
            disabled={!canUndo}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
              canUndo
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300 hover:border-zinc-400 active:scale-95'
                : 'bg-zinc-50 text-zinc-300 border-zinc-200 cursor-not-allowed opacity-50'
            }`}
            title={canUndo ? 'Desfazer a última rodada e voltar ao estado anterior' : 'Nenhuma rodada anterior para desfazer'}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desfazer Rodada</span>
            <span className="sm:hidden">Desfazer</span>
          </button>

          {/* Encerrar Partida Button */}
          {!isGameOver && (
            <button
              onClick={onEndGame}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 hover:border-rose-300 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95"
              title="Encerrar a partida no estado atual e visualizar a pontuação final"
            >
              <Flag className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Encerrar Partida</span>
              <span className="sm:hidden">Encerrar</span>
            </button>
          )}

          {/* Suppliers Overview */}
          <button
            onClick={onOpenSuppliers}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Table className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">Cadeia de Fornecedores</span>
            <span className="lg:hidden">Fornecedores</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={onOpenLeaderboard}
            className={`flex items-center gap-1.5 px-3 py-2 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs ${
              isGameOver 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 ring-2 ring-amber-400/50' 
                : 'bg-amber-500 hover:bg-amber-400'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isGameOver ? 'Ranking Final' : 'Ranking'}</span>
            <span className="sm:hidden">Ranking</span>
          </button>

          {/* Quick Reload Match Button */}
          <button
            onClick={onResetApp}
            className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-all cursor-pointer border border-zinc-250"
            title="Reiniciar Partida para o Estado Inicial (Rodada #1)"
          >
            <RotateCcw className="w-4 h-4 text-zinc-600" />
          </button>

          {/* Setup */}
          <button
            onClick={onOpenSetup}
            className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-all cursor-pointer border border-zinc-250"
            title="Configurar Jogadores / Opções"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
