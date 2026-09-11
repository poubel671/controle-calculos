/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  X, 
  Building2, 
  Coins, 
  User, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Player, PlayerCompany } from '../types';
import { getCompanyData } from '../utils/gameCalculations';
import { Sector } from '../constants';

interface TradeCompanyModalProps {
  seller: Player;
  company: PlayerCompany;
  allPlayers: Player[];
  onClose: () => void;
  onConfirmTrade: (sellerId: number, buyerId: number, companyId: string, agreedPrice: number) => void;
}

const SECTOR_COLORS: Record<Sector, string> = {
  [Sector.RETAIL]: 'bg-[#70A078] text-white',
  [Sector.SERVICES]: 'bg-[#DB91BA] text-white',
  [Sector.HEALTH]: 'bg-[#789CC8] text-white',
  [Sector.MANUFACTURING]: 'bg-[#A54B54] text-white',
  [Sector.IT]: 'bg-[#4878A8] text-white',
  [Sector.HEAVY_INDUSTRY]: 'bg-[#E3936C] text-white',
  [Sector.WILD]: 'bg-[#A0C0B8] text-white',
};

export const TradeCompanyModal: React.FC<TradeCompanyModalProps> = ({
  seller,
  company,
  allPlayers,
  onClose,
  onConfirmTrade,
}) => {
  const eligibleBuyers = allPlayers.filter(p => p.id !== seller.id);
  const [selectedBuyerId, setSelectedBuyerId] = useState<number | null>(
    eligibleBuyers.length > 0 ? eligibleBuyers[0].id : null
  );
  const [agreedPriceInput, setAgreedPriceInput] = useState<string>(company.cost.toString());

  const selectedBuyer = allPlayers.find(p => p.id === selectedBuyerId) || null;
  const companyData = getCompanyData(company.companyId);
  const currentProfit = companyData ? companyData.profits[company.level] : 0;

  const priceNum = parseFloat(agreedPriceInput);
  const isValidPrice = !isNaN(priceNum) && priceNum >= 0;
  const price = isValidPrice ? Math.round(priceNum) : 0;

  const buyerHasEnough = selectedBuyer ? selectedBuyer.coins >= price : false;

  const handleConfirm = () => {
    if (!selectedBuyerId || !isValidPrice) return;
    onConfirmTrade(seller.id, selectedBuyerId, company.companyId, price);
  };

  return (
    <div 
      id="trade-company-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Negociar Empresa
              </h2>
              <p className="text-xs text-indigo-300 font-medium">
                Transferência de propriedade e ajuste financeiro
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-300 hover:text-white rounded-lg hover:bg-indigo-900/60 transition-all cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          
          {/* 1. Company Information Card */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${SECTOR_COLORS[company.sector] || 'bg-zinc-700 text-white'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-zinc-900 leading-tight">
                    {company.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-zinc-500">
                    Setor: {company.sector}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 inline-block">
                  Nível {company.level}
                </span>
                <span className="block text-[11px] font-bold text-emerald-700 mt-0.5">
                  +R$ {currentProfit}/rodada
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
              <span>Proprietário atual (Vendedor):</span>
              <span className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${seller.color}`} />
                {seller.name} (Saldo: R$ {seller.coins.toLocaleString()})
              </span>
            </div>
          </div>

          {/* 2. Select Buyer Player */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-700">
              1. Selecione o Jogador Comprador:
            </label>

            {eligibleBuyers.length === 0 ? (
              <p className="text-xs text-zinc-500 bg-zinc-100 p-3 rounded-xl text-center">
                Não há outros jogadores disponíveis para negociar.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {eligibleBuyers.map(buyer => {
                  const isSelected = buyer.id === selectedBuyerId;
                  return (
                    <button
                      key={buyer.id}
                      type="button"
                      onClick={() => setSelectedBuyerId(buyer.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-xs' 
                          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-3.5 h-3.5 rounded-full ${buyer.color} shrink-0 border border-white shadow-2xs`} />
                        <div className="min-w-0">
                          <span className="text-xs font-black text-zinc-900 block truncate">
                            {buyer.name}
                          </span>
                          <span className="text-[11px] font-bold text-zinc-500 font-mono">
                            Saldo: R$ {buyer.coins.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Agreed Price Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700">
                2. Valor da Venda / Negociação:
              </label>
              <span className="text-[11px] text-zinc-500 font-medium">
                Custo de Fundação Original: R$ {company.cost}
              </span>
            </div>

            <div className="relative w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-zinc-400">
                R$
              </span>
              <input
                id="trade-price-input"
                type="number"
                min="0"
                step="50"
                value={agreedPriceInput}
                onChange={(e) => setAgreedPriceInput(e.target.value)}
                placeholder="0"
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-base font-mono font-bold text-zinc-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              />
            </div>
          </div>

          {/* 4. Financial Summary & Balance Preview */}
          {selectedBuyer && isValidPrice && (
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-950 uppercase tracking-wider">
                <Coins className="w-4 h-4 text-indigo-600" />
                Resumo da Transação Financeira
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Seller Balance Change */}
                <div className="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
                  <span className="font-bold text-zinc-700 block text-[11px] mb-1">
                    Vendedor ({seller.name}):
                  </span>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-zinc-500 line-through">R$ {seller.coins.toLocaleString()}</span>
                    <span className="text-emerald-700 font-extrabold text-sm">
                      ➔ R$ {(seller.coins + price).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
                    (+ R$ {price.toLocaleString()} recebidos)
                  </span>
                </div>

                {/* Buyer Balance Change */}
                <div className="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
                  <span className="font-bold text-zinc-700 block text-[11px] mb-1">
                    Comprador ({selectedBuyer.name}):
                  </span>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-zinc-500 line-through">R$ {selectedBuyer.coins.toLocaleString()}</span>
                    <span className={`font-extrabold text-sm ${selectedBuyer.coins - price < 0 ? 'text-rose-600' : 'text-zinc-900'}`}>
                      ➔ R$ {(selectedBuyer.coins - price).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 block mt-0.5">
                    (- R$ {price.toLocaleString()} pagos)
                  </span>
                </div>
              </div>

              {/* Informational Rules Note */}
              <div className="flex items-start gap-2 pt-1 text-[11px] text-indigo-900 font-medium leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span>
                    A empresa será transferida mantendo seu <strong>Nível {company.level}</strong>. Como já foi fundada, o comprador <strong>não pagará</strong> a taxa de abertura.
                  </span>
                  {company.isNew && (
                    <span className="block font-bold text-amber-900 bg-amber-100/80 px-2 py-1 rounded-md border border-amber-300/80">
                      ⚠️ Esta empresa foi aberta nesta rodada por {seller.name}. O custo de abertura de R$ {company.cost.toLocaleString()} se mantém com {seller.name} e será debitado no encerramento da rodada.
                    </span>
                  )}
                </div>
              </div>

              {!buyerHasEnough && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 rounded-lg p-2 text-xs text-amber-900 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Aviso: O saldo atual do comprador é de R$ {selectedBuyer.coins.toLocaleString()}, inferior a R$ {price.toLocaleString()}.
                  </span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95"
          >
            Cancelar
          </button>
          
          <button
            id="btn-confirm-trade"
            type="button"
            onClick={handleConfirm}
            disabled={!selectedBuyerId || !isValidPrice}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-black text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95 flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Confirmar Venda
          </button>
        </div>
      </div>
    </div>
  );
};
