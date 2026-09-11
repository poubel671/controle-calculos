/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Play, 
  Table, 
  Trophy, 
  Settings, 
  Sparkles,
  RotateCcw,
  Undo2,
  Flag
} from 'lucide-react';
import { Company, PLAYER_COLORS } from './constants';
import { Player, PlayerCompany, GameState, RoundHistory, RoundPlayerResult } from './types';
import { Header } from './components/Header';
import { PlayerCard } from './components/PlayerCard';
import { CompanySelectorModal } from './components/CompanySelectorModal';
import { SupplierOverviewModal } from './components/SupplierOverviewModal';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GameSetupModal } from './components/GameSetupModal';
import { ConfirmUndoModal } from './components/ConfirmUndoModal';
import { ConfirmEndGameModal } from './components/ConfirmEndGameModal';
import { TradeCompanyModal } from './components/TradeCompanyModal';
import { getPlayerEarnings } from './utils/gameCalculations';

const getInitialGameState = (): GameState => ({
  players: [
    { id: 1, name: 'Jogador 1', coins: 5000, color: PLAYER_COLORS[0], companies: [], innovationCards: 0, pendingOpeningCost: 0 },
    { id: 2, name: 'Jogador 2', coins: 5000, color: PLAYER_COLORS[1], companies: [], innovationCards: 0, pendingOpeningCost: 0 },
    { id: 3, name: 'Jogador 3', coins: 5000, color: PLAYER_COLORS[2], companies: [], innovationCards: 0, pendingOpeningCost: 0 },
    { id: 4, name: 'Jogador 4', coins: 5000, color: PLAYER_COLORS[3], companies: [], innovationCards: 0, pendingOpeningCost: 0 },
    { id: 5, name: 'Jogador 5', coins: 5000, color: PLAYER_COLORS[4], companies: [], innovationCards: 0, pendingOpeningCost: 0 },
    { id: 6, name: 'Jogador 6', coins: 5000, color: PLAYER_COLORS[5], companies: [], innovationCards: 0, pendingOpeningCost: 0 },
  ],
  turn: 1,
  roundHistory: [],
  isGameOver: false,
});

export default function App() {
  // Always initialize with fresh starting state when app reloads
  const [gameState, setGameState] = useState<GameState>(getInitialGameState);
  const [pastStates, setPastStates] = useState<GameState[]>([]);

  // Modals state
  const [linkingPlayerId, setLinkingPlayerId] = useState<number | null>(null);
  const [tradeTarget, setTradeTarget] = useState<{ sellerId: number; companyId: string } | null>(null);
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showConfirmUndoModal, setShowConfirmUndoModal] = useState(false);
  const [showConfirmEndGameModal, setShowConfirmEndGameModal] = useState(false);
  const [activeRoundSummary, setActiveRoundSummary] = useState<RoundHistory | null>(null);

  // Balance adjust
  const handleAddBalance = (playerId: number, amount: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, coins: Math.round(p.coins + amount) } : p
      ),
    }));
  };

  const handleRemoveBalance = (playerId: number, amount: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, coins: Math.max(0, Math.round(p.coins - amount)) } : p
      ),
    }));
  };

  // Innovation Cards adjust
  const handleUpdateInnovationCards = (playerId: number, delta: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, innovationCards: Math.max(0, p.innovationCards + delta) } : p
      ),
    }));
  };

  // Link company
  const handleLinkCompany = (playerId: number, company: Company) => {
    const defaultTISupplier = 'TI/IA 1';

    const newPlayerCompany: PlayerCompany = {
      companyId: company.id,
      name: company.name,
      sector: company.sector,
      level: 1,
      cost: company.cost,
      selectedTISupplier: defaultTISupplier,
      isNew: true,
    };

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId 
          ? { ...p, companies: [...p.companies, newPlayerCompany] } 
          : p
      ),
    }));

    setLinkingPlayerId(null);
  };

  // Unlink company
  const handleUnlinkCompany = (playerId: number, companyId: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId 
          ? { ...p, companies: p.companies.filter(c => c.companyId !== companyId) } 
          : p
      ),
    }));
  };

  // Upgrade Level
  const handleUpgradeCompanyLevel = (playerId: number, companyId: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => {
        if (p.id !== playerId) return p;
        return {
          ...p,
          companies: p.companies.map(c => {
            if (c.companyId !== companyId) return c;
            const nextLevel = Math.min(3, c.level + 1) as 1 | 2 | 3;
            return { ...c, level: nextLevel };
          }),
        };
      }),
    }));
  };

  // Downgrade Level
  const handleDowngradeCompanyLevel = (playerId: number, companyId: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => {
        if (p.id !== playerId) return p;
        return {
          ...p,
          companies: p.companies.map(c => {
            if (c.companyId !== companyId) return c;
            const nextLevel = Math.max(1, c.level - 1) as 1 | 2 | 3;
            return { ...c, level: nextLevel };
          }),
        };
      }),
    }));
  };

  // Change TI Supplier
  const handleChangeTISupplier = (playerId: number, companyId: string, tiSupplier: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => {
        if (p.id !== playerId) return p;
        return {
          ...p,
          companies: p.companies.map(c => {
            if (c.companyId !== companyId) return c;
            return { ...c, selectedTISupplier: tiSupplier };
          }),
        };
      }),
    }));
  };

  // Negociar / Vender Empresa entre jogadores
  const handleConfirmTradeCompany = (
    sellerId: number, 
    buyerId: number, 
    companyId: string, 
    agreedPrice: number
  ) => {
    setGameState(prev => {
      const seller = prev.players.find(p => p.id === sellerId);
      if (!seller) return prev;
      const targetCompany = seller.companies.find(c => c.companyId === companyId);
      if (!targetCompany) return prev;

      // Se a empresa foi aberta nesta rodada pelo vendedor, o custo de abertura se mantém com ele
      const openingCostToRetain = targetCompany.isNew ? (targetCompany.cost || 0) : 0;

      // Transfer company maintaining its level, TI supplier, and with isNew = false (already founded)
      const transferredCompany: PlayerCompany = {
        ...targetCompany,
        isNew: false, // The buyer does not pay the opening cost because the company was already founded
      };

      const updatedPlayers = prev.players.map(p => {
        if (p.id === sellerId) {
          return {
            ...p,
            coins: Math.round(p.coins + agreedPrice),
            companies: p.companies.filter(c => c.companyId !== companyId),
            // Custo de abertura retido no vendedor para dedução no fim da rodada
            pendingOpeningCost: (p.pendingOpeningCost || 0) + openingCostToRetain,
          };
        }
        if (p.id === buyerId) {
          return {
            ...p,
            coins: Math.max(0, Math.round(p.coins - agreedPrice)),
            companies: [...p.companies, transferredCompany],
          };
        }
        return p;
      });

      return {
        ...prev,
        players: updatedPlayers,
      };
    });

    setTradeTarget(null);
  };

  // Encerrar Rodada (End Round & Compute Earnings)
  const handleEndRound = () => {
    if (gameState.isGameOver) {
      setShowLeaderboardModal(true);
      return;
    }

    // Save snapshot of current state before finishing this round
    setPastStates(prev => [...prev, JSON.parse(JSON.stringify(gameState))]);

    const roundResults: RoundPlayerResult[] = gameState.players.map(player => {
      const earnings = getPlayerEarnings(player, gameState.players);
      const previousCoins = player.coins;
      const newCoins = Math.max(0, Math.round(previousCoins + earnings.expectedPerRound));

      return {
        playerId: player.id,
        playerName: player.name,
        baseProfit: earnings.baseProfit,
        supplierExpenses: earnings.supplierExpenses,
        incomingPayments: earnings.incomingPayments,
        outgoingPayments: earnings.outgoingPayments,
        newCompaniesCost: earnings.newCompaniesCost,
        netIncome: earnings.expectedPerRound,
        previousCoins,
        newCoins,
      };
    });

    const newRoundHistoryEntry: RoundHistory = {
      roundNumber: gameState.turn,
      results: roundResults,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Apply new coins to players, mark companies as no longer newly linked, and reset pending opening costs
    const updatedPlayers = gameState.players.map(p => {
      const res = roundResults.find(r => r.playerId === p.id);
      return {
        ...p,
        coins: res ? res.newCoins : p.coins,
        companies: p.companies.map(c => ({
          ...c,
          isNew: false,
        })),
        pendingOpeningCost: 0,
      };
    });

    const isLastRound = gameState.turn >= 10;
    const nextTurn = isLastRound ? 10 : gameState.turn + 1;

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      turn: nextTurn,
      isGameOver: isLastRound,
      roundHistory: [newRoundHistoryEntry, ...prev.roundHistory],
    }));

    // Show round summary modal
    setActiveRoundSummary(newRoundHistoryEntry);
  };

  // Desfazer Rodada - Solicitar confirmação
  const handleRequestUndoRound = () => {
    if (pastStates.length === 0) return;
    setShowConfirmUndoModal(true);
  };

  // Desfazer Rodada - Executar após confirmação (Revert to previous round state)
  const handleExecuteUndoRound = () => {
    if (pastStates.length === 0) return;
    const previousState = pastStates[pastStates.length - 1];
    setPastStates(prev => prev.slice(0, prev.length - 1));
    setGameState(previousState);
    setActiveRoundSummary(null);
    setShowConfirmUndoModal(false);
  };

  // Encerrar Partida - Solicitar confirmação
  const handleRequestEndGame = () => {
    setShowConfirmEndGameModal(true);
  };

  // Encerrar Partida - Executar após confirmação (End game permanently in current state without ability to undo)
  const handleExecuteEndGame = () => {
    // Clear past states to eliminate the possibility of undoing the match end
    setPastStates([]);
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
    }));
    setShowConfirmEndGameModal(false);
    setShowLeaderboardModal(true);
  };

  // Save config / names
  const handleSaveConfig = (updatedPlayers: Player[], startingCapital: number) => {
    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
    }));
  };

  // Reset match
  const handleResetMatch = (newPlayerNames: string[], startingCapital: number) => {
    const newPlayers: Player[] = newPlayerNames.map((name, idx) => ({
      id: idx + 1,
      name: name.trim() || `Jogador ${idx + 1}`,
      coins: startingCapital,
      color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
      companies: [],
      innovationCards: 0,
      pendingOpeningCost: 0,
    }));

    setPastStates([]);
    setGameState({
      players: newPlayers,
      turn: 1,
      roundHistory: [],
      isGameOver: false,
    });
  };

  // Reset App / Reset Match to pristine state
  const handleResetApp = () => {
    setPastStates([]);
    setGameState(getInitialGameState());
  };

  const linkingPlayer = gameState.players.find(p => p.id === linkingPlayerId) || null;
  const tradingSeller = tradeTarget 
    ? gameState.players.find(p => p.id === tradeTarget.sellerId) || null 
    : null;
  const tradingCompany = tradingSeller && tradeTarget
    ? tradingSeller.companies.find(c => c.companyId === tradeTarget.companyId) || null
    : null;

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans flex flex-col selection:bg-purple-500/20">
      
      {/* Top Header & Navigation */}
      <Header
        round={gameState.turn}
        isGameOver={gameState.isGameOver}
        canUndo={!gameState.isGameOver && pastStates.length > 0}
        onUndoRound={handleRequestUndoRound}
        onEndGame={handleRequestEndGame}
        onOpenSuppliers={() => setShowSuppliersModal(true)}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        onOpenSetup={() => setShowSetupModal(true)}
        onResetApp={handleResetApp}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Banner Quick Status */}
        {gameState.isGameOver ? (
          <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-amber-500/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Partida Encerrada
                </span>
                <span className="text-xs font-semibold text-zinc-300">
                  • Encerrada na Rodada #{gameState.turn}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Pontuação Final Computada no Estado Atual
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowLeaderboardModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
              >
                <Trophy className="w-4 h-4 fill-white" /> Ver Ranking Final
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-zinc-900 to-purple-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-purple-400 bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                  Painel do Controlador
                </span>
                <span className="text-xs font-semibold text-zinc-400">
                  • {gameState.players.length} Jogadores Ativos
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Gerenciamento dos Jogadores
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Desfazer Rodada */}
              {pastStates.length > 0 && (
                <button
                  onClick={handleRequestUndoRound}
                  className="px-3.5 py-2.5 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  title="Desfazer última rodada e restaurar o estado anterior"
                >
                  <Undo2 className="w-3.5 h-3.5 text-zinc-300" /> 
                  <span className="hidden sm:inline">Desfazer Rodada</span>
                  <span className="sm:hidden">Desfazer</span>
                </button>
              )}

              {/* Encerrar Partida */}
              <button
                onClick={handleRequestEndGame}
                className="px-3.5 py-2.5 bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800/80 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title="Encerrar partida no estado atual (sem computar alterações pendentes da rodada)"
              >
                <Flag className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Encerrar Partida</span>
                <span className="sm:hidden">Encerrar</span>
              </button>

              {/* Encerrar Rodada */}
              <button
                onClick={handleEndRound}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" /> 
                {gameState.turn === 10 ? 'Encerrar Rodada Final (#10)' : `Encerrar Rodada #${gameState.turn}`}
              </button>
            </div>
          </div>
        )}

        {/* Player Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameState.players.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              allPlayers={gameState.players}
              onAddBalance={handleAddBalance}
              onRemoveBalance={handleRemoveBalance}
              onUpdateInnovationCards={handleUpdateInnovationCards}
              onOpenLinkCompanyModal={(id) => setLinkingPlayerId(id)}
              onOpenTradeCompanyModal={(playerId, companyId) => setTradeTarget({ sellerId: playerId, companyId })}
              onUnlinkCompany={handleUnlinkCompany}
              onUpgradeCompanyLevel={handleUpgradeCompanyLevel}
              onDowngradeCompanyLevel={handleDowngradeCompanyLevel}
              onChangeTISupplier={handleChangeTISupplier}
            />
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-4 text-center text-xs text-zinc-500">
        <p className="font-semibold">
          Central de Controle do Jogo Físico — Construindo Negócios © 2026
        </p>
      </footer>

      {/* Modals */}
      {linkingPlayerId !== null && (
        <CompanySelectorModal
          player={linkingPlayer}
          allPlayers={gameState.players}
          onClose={() => setLinkingPlayerId(null)}
          onLinkCompany={handleLinkCompany}
        />
      )}

      {showSuppliersModal && (
        <SupplierOverviewModal
          allPlayers={gameState.players}
          onClose={() => setShowSuppliersModal(false)}
        />
      )}

      {showLeaderboardModal && (
        <LeaderboardModal
          allPlayers={gameState.players}
          isGameOver={gameState.isGameOver}
          onClose={() => setShowLeaderboardModal(false)}
        />
      )}

      {showSetupModal && (
        <GameSetupModal
          players={gameState.players}
          currentRound={gameState.turn}
          onClose={() => setShowSetupModal(false)}
          onSaveConfig={handleSaveConfig}
          onResetMatch={handleResetMatch}
        />
      )}

      {showConfirmUndoModal && (
        <ConfirmUndoModal
          currentRound={gameState.turn}
          targetRound={pastStates.length > 0 ? pastStates[pastStates.length - 1].turn : undefined}
          onConfirm={handleExecuteUndoRound}
          onClose={() => setShowConfirmUndoModal(false)}
        />
      )}

      {showConfirmEndGameModal && (
        <ConfirmEndGameModal
          currentRound={gameState.turn}
          onConfirm={handleExecuteEndGame}
          onClose={() => setShowConfirmEndGameModal(false)}
        />
      )}

      {activeRoundSummary && (
        <RoundSummaryModal
          roundHistory={activeRoundSummary}
          onClose={() => setActiveRoundSummary(null)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        />
      )}

      {tradingSeller && tradingCompany && (
        <TradeCompanyModal
          seller={tradingSeller}
          company={tradingCompany}
          allPlayers={gameState.players}
          onClose={() => setTradeTarget(null)}
          onConfirmTrade={handleConfirmTradeCompany}
        />
      )}

    </div>
  );
}
