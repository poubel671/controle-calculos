/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Coins, 
  Lightbulb, 
  Plus, 
  Minus, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Cpu, 
  ShoppingCart, 
  Package, 
  Stethoscope, 
  Wrench, 
  Factory, 
  ExternalLink,
  Info,
  ArrowRightLeft
} from 'lucide-react';
import { Sector, COMPANIES, Company } from '../constants';
import { Player, PlayerCompany } from '../types';
import { getScoreBreakdown, getPlayerEarnings, getCompanyData } from '../utils/gameCalculations';

const SECTOR_ICONS: Record<Sector, React.ReactNode> = {
  [Sector.RETAIL]: <ShoppingCart className="w-4 h-4" />,
  [Sector.SERVICES]: <Package className="w-4 h-4" />,
  [Sector.HEALTH]: <Stethoscope className="w-4 h-4" />,
  [Sector.MANUFACTURING]: <Wrench className="w-4 h-4" />,
  [Sector.IT]: <Cpu className="w-4 h-4" />,
  [Sector.HEAVY_INDUSTRY]: <Factory className="w-4 h-4" />,
  [Sector.WILD]: <Star className="w-4 h-4" />,
};

const SECTOR_COLORS: Record<Sector, string> = {
  [Sector.RETAIL]: 'bg-[#70A078] text-white',
  [Sector.SERVICES]: 'bg-[#DB91BA] text-white',
  [Sector.HEALTH]: 'bg-[#789CC8] text-white',
  [Sector.MANUFACTURING]: 'bg-[#A54B54] text-white',
  [Sector.IT]: 'bg-[#4878A8] text-white',
  [Sector.HEAVY_INDUSTRY]: 'bg-[#E3936C] text-white',
  [Sector.WILD]: 'bg-[#A0C0B8] text-white',
};

const TI_SUPPLIER_OPTIONS = ['TI/IA 1', 'TI/IA 2', 'TI/IA 3', 'TI/IA 4'];

interface PlayerCardProps {
  player: Player;
  allPlayers: Player[];
  onAddBalance: (playerId: number, amount: number) => void;
  onRemoveBalance: (playerId: number, amount: number) => void;
  onUpdateInnovationCards: (playerId: number, delta: number) => void;
  onOpenLinkCompanyModal: (playerId: number) => void;
  onOpenTradeCompanyModal: (playerId: number, companyId: string) => void;
  onUnlinkCompany: (playerId: number, companyId: string) => void;
  onUpgradeCompanyLevel: (playerId: number, companyId: string) => void;
  onDowngradeCompanyLevel: (playerId: number, companyId: string) => void;
  onChangeTISupplier: (playerId: number, companyId: string, tiSupplier: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  allPlayers,
  onAddBalance,
  onRemoveBalance,
  onUpdateInnovationCards,
  onOpenLinkCompanyModal,
  onOpenTradeCompanyModal,
  onUnlinkCompany,
  onUpgradeCompanyLevel,
  onDowngradeCompanyLevel,
  onChangeTISupplier,
}) => {
  const [balanceInput, setBalanceInput] = useState<string>('100');
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  const scoreBreakdown = getScoreBreakdown(player);
  const earnings = getPlayerEarnings(player, allPlayers);

  const handleAddBalance = () => {
    const amount = parseFloat(balanceInput);
    if (!isNaN(amount) && amount > 0) {
      onAddBalance(player.id, amount);
    }
  };

  const handleRemoveBalance = () => {
    const amount = parseFloat(balanceInput);
    if (!isNaN(amount) && amount > 0) {
      onRemoveBalance(player.id, amount);
    }
  };

  const companyUsesTISupplier = (pc: PlayerCompany) => {
    const companyData = getCompanyData(pc.companyId);
    if (!companyData || !companyData.suppliers) return false;
    return [1, 2, 3, 4].some(level => {
      const s = (companyData.suppliers as any)[level];
      if (!s) return false;
      const names = Array.isArray(s) ? s : [s];
      return names.includes('TI/IA');
    });
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      
      {/* Player Header Banner */}
      <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${player.color} border border-white shadow-xs shrink-0`} />
          <div>
            <h3 className="font-extrabold text-base text-zinc-900 leading-tight">
              {player.name}
            </h3>
            <span className="text-[11px] font-semibold text-zinc-500">
              {player.companies.length} empresa{player.companies.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Score Badge */}
        <div className="relative">
          <button
            onClick={() => setShowScoreDetails(!showScoreDetails)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl font-bold text-xs transition-all cursor-pointer"
            title="Clique para ver detalhamento da pontuação"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{scoreBreakdown.total.toLocaleString()} pts</span>
            <Info className="w-3 h-3 text-amber-600" />
          </button>

          {/* Score Breakdown Popover */}
          {showScoreDetails && (
            <div className="absolute right-0 top-10 w-64 bg-zinc-900 text-white rounded-xl p-3.5 shadow-xl text-xs z-20 space-y-2 border border-zinc-700">
              <div className="flex justify-between items-center border-b border-zinc-700 pb-1.5 font-bold">
                <span>Detalhamento dos Pontos</span>
                <button 
                  onClick={() => setShowScoreDetails(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1 text-zinc-300">
                <div className="flex justify-between">
                  <span>💰 Saldo (1 pt = R$1):</span>
                  <span className="font-mono font-bold text-amber-400">+{scoreBreakdown.coinsScore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>🏢 Valor Empresas (Nível):</span>
                  <span className="font-mono font-bold text-blue-400">+{scoreBreakdown.companyScore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>🔗 Integração Vertical:</span>
                  <span className="font-mono font-bold text-emerald-400">+{scoreBreakdown.verticalIntegrationScore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>📊 Densidade de Setores:</span>
                  <span className="font-mono font-bold text-purple-400">+{scoreBreakdown.sectorDensityScore.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-700 flex justify-between font-black text-sm text-amber-300">
                <span>TOTAL:</span>
                <span>{scoreBreakdown.total.toLocaleString()} pts</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1">
        
        {/* 1. Saldo & Manual Adjustment */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" /> Saldo Atual
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowScoreDetails(prev => !prev)}
                className="flex items-center gap-1 font-bold text-xs bg-white px-2 py-1 rounded-lg border border-zinc-200 hover:border-purple-300 transition-all cursor-pointer shadow-2xs"
                title="Clique para ver detalhamento do Lucro por Rodada"
              >
                <span className="text-zinc-500">Lucro/Rodada:</span>
                <span className={`font-mono ${earnings.expectedPerRound >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {earnings.expectedPerRound >= 0 ? '+' : ''}R$ {earnings.expectedPerRound.toLocaleString()}
                </span>
                <Info className="w-3 h-3 text-zinc-400" />
              </button>
            </div>
          </div>

          <div className="text-2xl font-black font-mono text-zinc-900 tracking-tight">
            R$ {player.coins.toLocaleString()}
          </div>

          {/* Detailed Earnings Summary Bar */}
          <div className="bg-white border border-zinc-200/80 rounded-lg p-2 text-[11px] space-y-1">
            <div className="flex justify-between items-center text-zinc-700">
              <span>Receita Base Empresa:</span>
              <span className="font-mono font-bold text-emerald-700">+R$ {earnings.baseProfit.toLocaleString()}</span>
            </div>
            {earnings.supplierExpenses > 0 && (
              <div className="flex justify-between items-center text-rose-700">
                <span>Pagamento Geral de Fornecedores:</span>
                <span className="font-mono font-bold">-R$ {earnings.supplierExpenses.toLocaleString()}</span>
              </div>
            )}
            {earnings.incomingPayments > 0 && (
              <div className="flex justify-between items-center text-purple-700">
                <span>Bônus Recebido como Fornecedor:</span>
                <span className="font-mono font-bold">+R$ {earnings.incomingPayments.toLocaleString()}</span>
              </div>
            )}
            {earnings.newCompaniesCost > 0 && (
              <div className="flex justify-between items-center text-amber-700">
                <div>
                  <span>Abertura de Novas Empresas (a descontar):</span>
                  {player.pendingOpeningCost && player.pendingOpeningCost > 0 ? (
                    <span className="text-[10px] text-amber-600 block">
                      (inclui R$ {player.pendingOpeningCost.toLocaleString()} de empresa(s) negociada(s) nesta rodada)
                    </span>
                  ) : null}
                </div>
                <span className="font-mono font-bold">-R$ {earnings.newCompaniesCost.toLocaleString()}</span>
              </div>
            )}
            {earnings.outgoingPayments > 0 && (
              <div className="flex justify-between items-center text-blue-700">
                <span>Valor Direcionado a Outros Jogadores:</span>
                <span className="font-mono font-bold">R$ {earnings.outgoingPayments.toLocaleString()}</span>
              </div>
            )}
            <p className="text-[10px] text-zinc-400 pt-1 border-t border-zinc-100 leading-tight">
              💡 Desconto fixo de R$ 50 por empresa vinculada para fornecedores. Novas empresas têm seu custo de abertura debitado ao encerrar a rodada.
            </p>
          </div>

          {/* Balance adjustment controls */}
          <div className="space-y-2 pt-1 border-t border-zinc-200/70">
            <span className="text-[11px] font-bold text-zinc-500 block">Ajuste Manual de Saldo:</span>
            
            {/* 1. Buttons row (Adicionar / Remover) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddBalance}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Adicionar valor digitado ao saldo do jogador"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>

              <button
                onClick={handleRemoveBalance}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Remover valor digitado do saldo do jogador"
              >
                <Minus className="w-3.5 h-3.5" /> Remover
              </button>
            </div>

            {/* 2. Input field below buttons (full width, right above Innovation Cards) */}
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-zinc-400">R$</span>
              <input
                type="number"
                min="1"
                step="10"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                placeholder="Digite o valor..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm font-mono font-bold text-zinc-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* 2. Cartas de Inovação Tracker */}
        <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 block leading-tight">
                Cartas de Inovação
              </span>
              <span className="text-[11px] text-amber-700 font-medium">
                {player.innovationCards} carta{player.innovationCards !== 1 ? 's' : ''} possuída{player.innovationCards !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-amber-300 rounded-lg p-1">
            <button
              onClick={() => onUpdateInnovationCards(player.id, -1)}
              disabled={player.innovationCards <= 0}
              className="p-1 text-zinc-600 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-zinc-600 rounded transition-colors cursor-pointer"
              title="Remover 1 carta de inovação"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-black text-sm text-zinc-900 px-1 min-w-[20px] text-center">
              {player.innovationCards}
            </span>
            <button
              onClick={() => onUpdateInnovationCards(player.id, 1)}
              className="p-1 text-zinc-600 hover:text-emerald-600 rounded transition-colors cursor-pointer"
              title="Adicionar 1 carta de inovação"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Empresas Vinculadas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-purple-600" /> Empresas Vinculadas ({player.companies.length})
            </span>

            <button
              onClick={() => onOpenLinkCompanyModal(player.id)}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Vincular Empresa
            </button>
          </div>

          {player.companies.length === 0 ? (
            <div className="p-6 text-center bg-zinc-50 border border-dashed border-zinc-300 rounded-xl text-zinc-500 text-xs font-medium">
              Nenhuma empresa vinculada a este jogador.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {player.companies.map((pc) => {
                const companyData = getCompanyData(pc.companyId);
                const currentProfit = companyData ? companyData.profits[pc.level] : 0;
                const usesTI = companyUsesTISupplier(pc);

                return (
                  <div
                    key={pc.companyId}
                    className="p-3 bg-white border border-zinc-200 rounded-xl space-y-2 hover:border-zinc-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${SECTOR_COLORS[pc.sector] || 'bg-zinc-600 text-white'}`}>
                          {SECTOR_ICONS[pc.sector]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-extrabold text-xs text-zinc-900">
                              {pc.name}
                            </h4>
                            {pc.isNew && (
                              <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-mono">
                                Nova (Custo: R$ {pc.cost})
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-semibold text-zinc-500 block">
                            {pc.sector}
                          </span>
                        </div>
                      </div>

                      {/* Unlink button */}
                      <button
                        onClick={() => onUnlinkCompany(player.id, pc.companyId)}
                        className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Desvincular empresa deste jogador"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Level & Profits row */}
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                          Nível {pc.level}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700">
                          R$ {currentProfit}/rodada
                        </span>
                      </div>

                      {/* Upgrade / Downgrade level controls & Trade button */}
                      <div className="flex items-center gap-1.5">
                        {pc.level > 1 && (
                          <button
                            onClick={() => onDowngradeCompanyLevel(player.id, pc.companyId)}
                            className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                            title="Reduzir nível da empresa"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        )}
                        {pc.level < 3 && (
                          <button
                            onClick={() => onUpgradeCompanyLevel(player.id, pc.companyId)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                            title="Subir empresa de nível (Nível +1)"
                          >
                            <ChevronUp className="w-3.5 h-3.5" /> Subir Nível
                          </button>
                        )}
                        <button
                          onClick={() => onOpenTradeCompanyModal(player.id, pc.companyId)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Negociar e vender esta empresa para outro jogador"
                        >
                          <ArrowRightLeft className="w-3 h-3" /> Negociar Empresa
                        </button>
                      </div>
                    </div>

                    {/* TI Supplier Selection if applicable */}
                    {usesTI && (
                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-bold text-zinc-600 shrink-0">Fornecedor TI/IA:</span>
                        <select
                          value={pc.selectedTISupplier || 'TI/IA 1'}
                          onChange={(e) => onChangeTISupplier(player.id, pc.companyId, e.target.value)}
                          className="bg-zinc-50 border border-zinc-300 rounded px-2 py-1 font-bold text-zinc-800 focus:outline-none focus:border-purple-500 text-[11px]"
                        >
                          {TI_SUPPLIER_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
