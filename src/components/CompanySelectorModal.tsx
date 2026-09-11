/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Building2, 
  Plus, 
  Coins, 
  ShoppingCart, 
  Package, 
  Stethoscope, 
  Wrench, 
  Cpu, 
  Factory, 
  Star 
} from 'lucide-react';
import { Sector, COMPANIES, Company } from '../constants';
import { Player } from '../types';
import { getAllCompanies } from '../utils/gameCalculations';

const SECTOR_ICONS: Record<Sector, React.ReactNode> = {
  [Sector.RETAIL]: <ShoppingCart className="w-4 h-4" />,
  [Sector.SERVICES]: <Package className="w-4 h-4" />,
  [Sector.HEALTH]: <Stethoscope className="w-4 h-4" />,
  [Sector.MANUFACTURING]: <Wrench className="w-4 h-4" />,
  [Sector.IT]: <Cpu className="w-4 h-4" />,
  [Sector.HEAVY_INDUSTRY]: <Factory className="w-4 h-4" />,
  [Sector.WILD]: <Star className="w-4 h-4" />,
};

interface CompanySelectorModalProps {
  player: Player | null;
  allPlayers: Player[];
  onClose: () => void;
  onLinkCompany: (playerId: number, company: Company) => void;
}

export const CompanySelectorModal: React.FC<CompanySelectorModalProps> = ({
  player,
  allPlayers,
  onClose,
  onLinkCompany,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  if (!player) return null;

  // Get list of unowned companies
  const unownedCompanies = useMemo(() => {
    const all = getAllCompanies();
    return all.filter(c => {
      // Check if owned by any player
      const isOwned = allPlayers.some(p => p.companies.some(pc => pc.companyId === c.id));
      if (isOwned) return false;

      // Filter by sector
      if (selectedSector !== 'ALL' && c.sector !== selectedSector) return false;

      // Filter by search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q);
      }

      return true;
    });
  }, [allPlayers, selectedSector, searchQuery]);

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${player.color} shrink-0`} />
            <div>
              <h2 className="text-lg font-black text-zinc-900 leading-tight">
                Vincular Empresa a <span className="text-purple-700">{player.name}</span>
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Selecione uma empresa disponível no tabuleiro físico para associar a este jogador.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Sector Filters */}
        <div className="p-4 border-b border-zinc-200 space-y-3 bg-white">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome da empresa ou setor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Sector Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            <button
              onClick={() => setSelectedSector('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedSector === 'ALL'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Todos os Setores
            </button>
            {Object.values(Sector).filter(s => s !== Sector.WILD).map(sector => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedSector === sector
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {SECTOR_ICONS[sector]}
                <span>{sector}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Company List */}
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
          {unownedCompanies.length === 0 ? (
            <div className="p-10 text-center text-zinc-500 text-xs font-medium">
              Nenhuma empresa disponível encontrada com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {unownedCompanies.map(c => (
                <div
                  key={c.id}
                  className="p-3.5 bg-white border border-zinc-200 hover:border-purple-300 rounded-xl flex flex-col justify-between space-y-3 shadow-xs transition-all hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                          {SECTOR_ICONS[c.sector]}
                        </div>
                        <h3 className="font-extrabold text-sm text-zinc-900 leading-tight">
                          {c.name}
                        </h3>
                      </div>
                      <span className="font-mono font-black text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
                        Custo: R$ {c.cost}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-zinc-500 block mb-2">
                      {c.sector}
                    </span>

                    {/* Profits per level table */}
                    <div className="bg-zinc-50 border border-zinc-200/80 rounded-lg p-2 text-[11px] space-y-1">
                      <span className="font-bold text-zinc-600 block text-[10px] uppercase">Lucros por Nível:</span>
                      <div className="grid grid-cols-3 gap-1 font-mono text-center">
                        <div className="bg-white p-1 rounded border border-zinc-200">
                          <span className="text-zinc-400 block text-[9px]">N1</span>
                          <span className="font-bold text-zinc-800">R${c.profits[1]}</span>
                        </div>
                        <div className="bg-white p-1 rounded border border-zinc-200">
                          <span className="text-zinc-400 block text-[9px]">N2</span>
                          <span className="font-bold text-zinc-800">R${c.profits[2]}</span>
                        </div>
                        <div className="bg-white p-1 rounded border border-zinc-200">
                          <span className="text-zinc-400 block text-[9px]">N3</span>
                          <span className="font-bold text-zinc-800">R${c.profits[3]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => onLinkCompany(player.id, c)}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Vincular a {player.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
