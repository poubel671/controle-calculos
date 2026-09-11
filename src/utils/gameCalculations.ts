/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COMPANIES, Company, Sector } from '../constants';
import { Player, PlayerCompany } from '../types';

export interface ScoreBreakdown {
  coinsScore: number;
  companyScore: number;
  verticalIntegrationScore: number;
  sectorDensityScore: number;
  total: number;
}

export interface PlayerEarnings {
  baseProfit: number;
  supplierExpenses: number;
  outgoingPayments: number;
  incomingPayments: number;
  newCompaniesCost: number;
  expectedPerRound: number;
}

export const getAllCompanies = (): Company[] => {
  return Object.values(COMPANIES).flat();
};

export const getCompanyData = (companyId: string): Company | undefined => {
  return getAllCompanies().find(c => c.id === companyId);
};

export const getScoreBreakdown = (player: Player): ScoreBreakdown => {
  const coinsScore = Math.ceil(player.coins);

  let companyScore = 0;
  player.companies.forEach(pc => {
    const multiplier = pc.level === 1 ? 1 : pc.level === 2 ? 1.5 : 2;
    companyScore += pc.cost * multiplier;
  });
  companyScore = Math.ceil(companyScore);

  let verticalIntegrationScore = 0;
  player.companies.forEach(pc => {
    const companyData = getCompanyData(pc.companyId);
    if (companyData && companyData.suppliers) {
      [1, 2, 3, 4].forEach(lvl => {
        const s = (companyData.suppliers as any)[lvl];
        if (!s) return;
        const names = Array.isArray(s) ? s : [s];
        names.forEach(name => {
          let targetName = name;
          if (name === 'TI/IA' && pc.selectedTISupplier) {
            targetName = pc.selectedTISupplier;
          }
          if (player.companies.some(owned => owned.name === targetName)) {
            verticalIntegrationScore += 500;
          }
        });
      });
    }
  });
  verticalIntegrationScore = Math.ceil(verticalIntegrationScore);

  let sectorDensityScore = 0;
  const sectorCounts: Record<string, number> = {};
  player.companies.forEach(c => {
    sectorCounts[c.sector] = (sectorCounts[c.sector] || 0) + 1;
  });

  Object.values(sectorCounts).forEach(count => {
    if (count === 2) sectorDensityScore += 500;
    else if (count === 3) sectorDensityScore += 1000;
    else if (count >= 4) sectorDensityScore += 1500;
  });
  sectorDensityScore = Math.ceil(sectorDensityScore);

  const total = coinsScore + companyScore + verticalIntegrationScore + sectorDensityScore;

  return {
    coinsScore,
    companyScore,
    verticalIntegrationScore,
    sectorDensityScore,
    total,
  };
};

/**
 * Calculates earnings for a player in a round:
 * - baseProfit: Sum of revenues from owned companies at current level (receita base empresa).
 * - supplierExpenses: General supplier payment deduction (50 dinheiros per owned company).
 * - outgoingPayments: Payments made to other players who own suppliers.
 * - incomingPayments: Payments received from other players who rely on suppliers owned by the target player.
 * - newCompaniesCost: Opening cost deduction for newly linked companies in the current round.
 * - expectedPerRound: baseProfit - supplierExpenses + incomingPayments - newCompaniesCost
 */
export const getPlayerEarnings = (targetPlayer: Player, allPlayers: Player[]): PlayerEarnings => {
  const baseProfit = targetPlayer.companies.reduce((acc, c) => {
    const companyData = getCompanyData(c.companyId);
    return acc + (companyData ? companyData.profits[c.level as 1 | 2 | 3] : 0);
  }, 0);

  // Desconto fixo de 50 por empresa vinculada referente ao pagamento geral de fornecedores
  const supplierExpenses = targetPlayer.companies.length * 50;

  // Desconto de abertura para novas empresas vinculadas nesta rodada
  // e empresas que foram abertas nesta rodada pelo jogador e posteriormente negociadas (o custo se mantém com ele)
  const ownedNewCompaniesCost = targetPlayer.companies
    .filter(c => c.isNew)
    .reduce((acc, c) => acc + (c.cost || 0), 0);
  const pendingOpeningCost = targetPlayer.pendingOpeningCost || 0;
  const newCompaniesCost = ownedNewCompaniesCost + pendingOpeningCost;

  let outgoingPayments = 0;
  targetPlayer.companies.forEach(company => {
    const companyData = getCompanyData(company.companyId);
    if (!companyData || !companyData.suppliers) return;

    [1, 2, 3, 4].forEach(level => {
      const supplierNameOrNames = (companyData.suppliers as any)[level];
      if (!supplierNameOrNames) return;

      const names = Array.isArray(supplierNameOrNames) ? supplierNameOrNames : [supplierNameOrNames];
      const paymentValue = level === 1 ? 20 : level === 2 ? 15 : level === 3 ? 10 : 5;

      names.forEach(name => {
        let targetName = name;
        if (name === 'TI/IA') {
          targetName = company.selectedTISupplier || 'TI/IA 1';
        }

        // Only count payments directed to OTHER players who own this supplier
        const supplierOwner = allPlayers.find(p => p.id !== targetPlayer.id && p.companies.some(oc => oc.name === targetName));
        if (supplierOwner) {
          outgoingPayments += paymentValue;
        }
      });
    });
  });

  let incomingPayments = 0;
  allPlayers.forEach((player) => {
    player.companies.forEach(company => {
      const companyData = getCompanyData(company.companyId);
      if (!companyData || !companyData.suppliers) return;

      [1, 2, 3, 4].forEach(level => {
        const supplierNameOrNames = (companyData.suppliers as any)[level];
        if (!supplierNameOrNames) return;

        const names = Array.isArray(supplierNameOrNames) ? supplierNameOrNames : [supplierNameOrNames];
        const paymentValue = level === 1 ? 20 : level === 2 ? 15 : level === 3 ? 10 : 5;

        names.forEach(name => {
          let targetName = name;
          if (name === 'TI/IA') {
            targetName = company.selectedTISupplier || 'TI/IA 1';
          }

          // Target player receives bonus if they own this required supplier
          const targetPlayerOwnsSupplier = targetPlayer.companies.some(oc => oc.name === targetName);
          if (targetPlayerOwnsSupplier) {
            incomingPayments += paymentValue;
          }
        });
      });
    });
  });

  const expectedPerRound = baseProfit - supplierExpenses + incomingPayments - newCompaniesCost;

  return {
    baseProfit,
    supplierExpenses,
    outgoingPayments,
    incomingPayments,
    newCompaniesCost,
    expectedPerRound,
  };
};
