/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sector } from './constants';

export interface PlayerCompany {
  companyId: string;
  name: string;
  sector: Sector;
  level: 1 | 2 | 3;
  cost: number;
  selectedTISupplier?: string; // e.g., 'TI/IA 1', 'TI/IA 2', etc.
  isNew?: boolean; // True if newly linked in current round, pending opening cost deduction
}

export interface Player {
  id: number;
  name: string;
  coins: number;
  color: string;
  companies: PlayerCompany[];
  innovationCards: number;
  pendingOpeningCost?: number; // Custo de abertura retido de empresas abertas nesta rodada e negociadas
}

export interface RoundPlayerResult {
  playerId: number;
  playerName: string;
  baseProfit: number;
  supplierExpenses: number;
  incomingPayments: number;
  outgoingPayments: number;
  newCompaniesCost: number;
  netIncome: number;
  previousCoins: number;
  newCoins: number;
}

export interface RoundHistory {
  roundNumber: number;
  results: RoundPlayerResult[];
  timestamp: string;
}

export interface GameState {
  players: Player[];
  turn: number; // Current round counter
  roundHistory: RoundHistory[];
  isGameOver?: boolean;
}
