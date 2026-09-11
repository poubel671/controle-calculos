/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Table, 
  CheckCircle, 
  AlertCircle, 
  Search, 
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
import { getAllCompanies, getPlayerEarnings } from '../utils/gameCalculations';

const SECTOR_ICONS: Record<Sector, React.ReactNode> = {
  [Sector.RETAIL]: <ShoppingCart className="w-4 h-4" />,
  [Sector.SERVICES]: <Package className="w-4 h-4" />,
  [Sector.HEALTH]: <Stethoscope className="w-4 h-4" />,
  [Sector.MANUFACTURING]: <Wrench className="w-4 h-4" />,
  [Sector.IT]: <Cpu className="w-4 h-4" />,
  [Sector.HEAVY_INDUSTRY]: <Factory className="w-4 h-4" />,
  [Sector.WILD]: <Star className="w-4 h-4" />,
};

interface SupplierOverviewModalProps {
  allPlayers: Player[];
  onClose: () => void;
}

export const SupplierOverviewModal: React.FC<SupplierOverviewModalProps> = ({
  allPlayers,
  onClose,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const companiesList = useMemo(() => {
    return getAllCompanies().filter(c => {
      if (selectedSector !== 'ALL' && c.sector !== selectedSector) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedSector, searchQuery]);

  const getOwnerPlayer = (companyId: string) => {
    return allPlayers.find(p => p.companies.some(pc => pc.companyId === companyId));
  };

  const getPlayerCompanyInstance = (companyId: string) => {
    for (const p of allPlayers) {
      const pc = p.companies.find(c => c.companyId === companyId);
      if (pc) return { player: p, playerCompany: pc };
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-900 leading-tight">
                Cadeia de Fornecedores & Relações do Tabuleiro
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Consulte as empresas vinculadas aos jogadores e a cadeia de fornecedores. Pagamentos ocorrem apenas quando empresa e fornecedor estão vinculados a jogadores.
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

        {/* Players Summary Table */}
        <div className="p-4 bg-purple-50/50 border-b border-purple-100 flex flex-wrap gap-3">
          {allPlayers.map(p => {
            const earnings = getPlayerEarnings(p, allPlayers);
            return (
              <div key={p.id} className="bg-white border border-purple-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
                <div className={`w-3 h-3 rounded-full ${p.color}`} />
                <div>
                  <span className="font-extrabold text-xs text-zinc-900 block leading-tight">{p.name}</span>
                  <span className="text-[10px] text-zinc-500 font-semibold">
                    Lucro/Rodada: <strong className={earnings.expectedPerRound >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {earnings.expectedPerRound >= 0 ? '+' : ''}R${earnings.expectedPerRound}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-zinc-200 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por nome da empresa ou setor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
            />
          </div>

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

        {/* Table Content */}
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-100 border-b border-zinc-200 font-extrabold text-zinc-700 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Empresa</th>
                  <th className="p-3">Dono</th>
                  <th className="p-3">Nível</th>
                  <th className="p-3">Lucro Base</th>
                  <th className="p-3">Fornecedores Requeridos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {companiesList.map(c => {
                  const instance = getPlayerCompanyInstance(c.id);
                  const owner = instance?.player;
                  const pc = instance?.playerCompany;

                  return (
                    <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-3 font-bold text-zinc-900">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded bg-zinc-100 text-zinc-700">
                            {SECTOR_ICONS[c.sector]}
                          </span>
                          <div>
                            <span>{c.name}</span>
                            <span className="text-[10px] text-zinc-500 font-normal block">{c.sector}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        {owner ? (
                          <span className="flex items-center gap-1.5 font-bold text-zinc-900">
                            <span className={`w-2.5 h-2.5 rounded-full ${owner.color}`} />
                            {owner.name}
                          </span>
                        ) : (
                          <span className="text-zinc-400 font-semibold italic">Livre</span>
                        )}
                      </td>

                      <td className="p-3 font-mono font-bold">
                        {pc ? (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-black">
                            Nível {pc.level}
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>

                      <td className="p-3 font-mono font-bold text-emerald-700">
                        R$ {pc ? c.profits[pc.level] : c.profits[1]}
                      </td>

                      <td className="p-3 space-y-1">
                        {[1, 2, 3, 4].map(lvl => {
                          const val = (c.suppliers as any)[lvl];
                          if (!val) return null;
                          const names = Array.isArray(val) ? val : [val];
                          const paymentVal = lvl === 1 ? 20 : lvl === 2 ? 15 : lvl === 3 ? 10 : 5;

                          return names.map(name => {
                            let targetName = name;
                            if (name === 'TI/IA' && pc?.selectedTISupplier) {
                              targetName = pc.selectedTISupplier;
                            }

                            // Find supplier owner
                            const supplierOwner = allPlayers.find(p => p.companies.some(oc => oc.name === targetName));
                            const isSelf = owner && supplierOwner && owner.id === supplierOwner.id;

                            return (
                              <div key={`${lvl}-${targetName}`} className="flex items-center gap-1 text-[11px]">
                                <span className="font-bold text-zinc-400 text-[10px]">N{lvl} (R${paymentVal}):</span>
                                <span className="font-semibold text-zinc-800">{targetName}</span>
                                {owner && supplierOwner ? (
                                  isSelf ? (
                                    <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${supplierOwner.color}`} />
                                      Próprio (Bônus Fornecedor +R${paymentVal})
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${supplierOwner.color}`} />
                                      Paga R${paymentVal} para {supplierOwner.name}
                                    </span>
                                  )
                                ) : supplierOwner ? (
                                  <span className="text-[9px] font-medium text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${supplierOwner.color}`} />
                                    Dono: {supplierOwner.name} (Empresa livre — sem transferência)
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                                    Sem dono
                                  </span>
                                )}
                              </div>
                            );
                          });
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
