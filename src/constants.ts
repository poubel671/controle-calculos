/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Sector {
  RETAIL = 'Varejo e Comércio Eletrônico',
  SERVICES = 'Serviços',
  HEALTH = 'Saúde e Biociências',
  MANUFACTURING = 'Indústria Manufatureira',
  IT = 'Tecnologia da Informação (TI) e Inteligência Artificial (IA)',
  HEAVY_INDUSTRY = 'Indústria Pesada',
  WILD = 'Coringa',
}

export const PLAYER_COLORS = [
  'bg-blue-600',
  'bg-red-600',
  'bg-emerald-600',
  'bg-amber-400',
  'bg-purple-600',
  'bg-cyan-500',
];

export interface Company {
  id: string;
  name: string;
  sector: Sector;
  cost: number;
  profits: {
    1: number;
    2: number;
    3: number;
  };
  suppliers: {
    1: string | string[];
    2?: string | string[];
    3?: string | string[];
    4?: string | string[];
  };
}

export const COMPANIES: Record<Sector, Company[]> = {
  [Sector.RETAIL]: [
    { 
      id: 'ret1', 
      name: 'Supermercado', 
      sector: Sector.RETAIL, 
      cost: 300, 
      profits: { 1: 200, 2: 240, 3: 280 },
      suppliers: { 1: 'Indústria Alimentícia', 2: 'Restaurante', 3: 'Logística', 4: 'Energia elétrica' }
    },
    { 
      id: 'ret2', 
      name: 'Comércio Eletrônico', 
      sector: Sector.RETAIL, 
      cost: 270, 
      profits: { 1: 180, 2: 216, 3: 252 },
      suppliers: { 1: 'TI/IA', 2: 'Indústria de Eletroeletrônicos', 3: 'Manufatura de Roupa/Uniforme/EPI', 4: 'Logística' }
    },
    { 
      id: 'ret3', 
      name: 'Lojas de Roupas', 
      sector: Sector.RETAIL, 
      cost: 210, 
      profits: { 1: 140, 2: 168, 3: 196 },
      suppliers: { 1: 'Manufatura de Roupa/Uniforme/EPI', 2: 'Mídia Digital', 3: 'TI/IA', 4: 'Logística' }
    },
    { 
      id: 'ret4', 
      name: 'Farmácias', 
      sector: Sector.RETAIL, 
      cost: 165, 
      profits: { 1: 110, 2: 132, 3: 154 },
      suppliers: { 1: 'Indústria Farmacêutica', 2: 'Indústria Alimentícia', 3: 'Logística', 4: 'TI/IA' }
    },
    { 
      id: 'ret5', 
      name: 'Restaurante', 
      sector: Sector.RETAIL, 
      cost: 180, 
      profits: { 1: 120, 2: 144, 3: 168 },
      suppliers: { 1: 'Indústria Alimentícia', 2: 'Mídia Digital', 3: 'Indústria de Eletroeletrônicos', 4: 'Energia elétrica' }
    },
  ],
  [Sector.SERVICES]: [
    { 
      id: 'srv1', 
      name: 'Escola/Universidade', 
      sector: Sector.SERVICES, 
      cost: 195, 
      profits: { 1: 130, 2: 156, 3: 182 },
      suppliers: { 1: 'Restaurante', 2: 'Construção Civil', 3: 'TI/IA', 4: 'Energia elétrica' }
    },
    { 
      id: 'srv2', 
      name: 'Mídia Digital', 
      sector: Sector.SERVICES, 
      cost: 150, 
      profits: { 1: 100, 2: 120, 3: 140 },
      suppliers: { 1: 'TI/IA', 2: 'Indústria de Eletroeletrônicos', 3: 'Escola/Universidade', 4: 'Energia elétrica' }
    },
    { 
      id: 'srv3', 
      name: 'Logística', 
      sector: Sector.SERVICES, 
      cost: 225, 
      profits: { 1: 150, 2: 180, 3: 210 },
      suppliers: { 1: 'TI/IA', 2: 'Indústria de Combustíveis e Solventes', 3: 'Siderurgia / Metalurgia', 4: 'Energia elétrica' }
    },
    { 
      id: 'srv4', 
      name: 'Energia elétrica', 
      sector: Sector.SERVICES, 
      cost: 350, 
      profits: { 1: 170, 2: 204, 3: 238 },
      suppliers: { 1: 'Construção Civil', 2: 'Manufatura de Roupa/Uniforme/EPI', 3: 'Escola/Universidade', 4: 'Siderurgia / Metalurgia' }
    },
  ],
  [Sector.HEALTH]: [
    { 
      id: 'hea1', 
      name: 'Indústria Farmacêutica', 
      sector: Sector.HEALTH, 
      cost: 225, 
      profits: { 1: 150, 2: 180, 3: 210 },
      suppliers: { 1: 'TI/IA', 2: 'Compostos Químicos', 3: 'Polímeros', 4: 'Energia elétrica' }
    },
    { 
      id: 'hea2', 
      name: 'Hospitais', 
      sector: Sector.HEALTH, 
      cost: 225, 
      profits: { 1: 150, 2: 180, 3: 210 },
      suppliers: { 1: 'Indústria Farmacêutica', 2: 'Escola/Universidade', 3: 'Construção Civil', 4: 'Energia elétrica' }
    },
    { 
      id: 'hea3', 
      name: 'Academia', 
      sector: Sector.HEALTH, 
      cost: 165, 
      profits: { 1: 110, 2: 132, 3: 154 },
      suppliers: { 1: 'Mídia Digital', 2: 'Restaurante', 3: 'Indústria de Eletroeletrônicos', 4: 'Indústria Alimentícia' }
    },
    { 
      id: 'hea4', 
      name: 'Estética', 
      sector: Sector.HEALTH, 
      cost: 150, 
      profits: { 1: 100, 2: 120, 3: 140 },
      suppliers: { 1: 'Indústria Farmacêutica', 2: 'Indústria de Eletroeletrônicos', 3: 'Mídia Digital', 4: 'Energia elétrica' }
    },
  ],
  [Sector.MANUFACTURING]: [
    { 
      id: 'man1', 
      name: 'Indústria Alimentícia', 
      sector: Sector.MANUFACTURING, 
      cost: 270, 
      profits: { 1: 180, 2: 216, 3: 252 },
      suppliers: { 1: 'Polímeros', 2: 'Compostos Químicos', 3: 'Logística', 4: 'Energia elétrica' }
    },
    { 
      id: 'man2', 
      name: 'Indústria de Combustíveis e Solventes', 
      sector: Sector.MANUFACTURING, 
      cost: 210, 
      profits: { 1: 140, 2: 168, 3: 196 },
      suppliers: { 1: 'TI/IA', 2: 'Compostos Químicos', 3: 'Polímeros', 4: 'Energia elétrica' }
    },
    { 
      id: 'man3', 
      name: 'Manufatura de Roupa/Uniforme/EPI', 
      sector: Sector.MANUFACTURING, 
      cost: 195, 
      profits: { 1: 130, 2: 156, 3: 182 },
      suppliers: { 1: 'TI/IA', 2: 'Indústria de Combustíveis e Solventes', 3: 'Polímeros', 4: 'Logística' }
    },
    { 
      id: 'man4', 
      name: 'Indústria de Eletroeletrônicos', 
      sector: Sector.MANUFACTURING, 
      cost: 225, 
      profits: { 1: 150, 2: 180, 3: 210 },
      suppliers: { 1: 'Siderurgia / Metalurgia', 2: 'Indústria de Combustíveis e Solventes', 3: 'TI/IA', 4: 'Polímeros' }
    },
  ],
  [Sector.IT]: [
    { 
      id: 'it1', 
      name: 'TI/IA 1', 
      sector: Sector.IT, 
      cost: 270, 
      profits: { 1: 180, 2: 216, 3: 252 },
      suppliers: { 1: 'Siderurgia / Metalurgia', 2: 'Polímeros', 3: 'Compostos Químicos', 4: 'Energia elétrica' }
    },
    { 
      id: 'it2', 
      name: 'TI/IA 2', 
      sector: Sector.IT, 
      cost: 270, 
      profits: { 1: 180, 2: 216, 3: 252 },
      suppliers: { 1: 'Siderurgia / Metalurgia', 2: 'Polímeros', 3: 'Compostos Químicos', 4: 'Energia elétrica' }
    },
    { 
      id: 'it3', 
      name: 'TI/IA 3', 
      sector: Sector.IT, 
      cost: 270, 
      profits: { 1: 180, 2: 216, 3: 252 },
      suppliers: { 1: 'Siderurgia / Metalurgia', 2: 'Polímeros', 3: 'Compostos Químicos', 4: 'Energia elétrica' }
    },
    { 
      id: 'it4', 
      name: 'TI/IA 4', 
      sector: Sector.IT, 
      cost: 270, 
      profits: { 1: 180, 2: 216, 3: 252 },
      suppliers: { 1: 'Siderurgia / Metalurgia', 2: 'Polímeros', 3: 'Compostos Químicos', 4: 'Energia elétrica' }
    },
  ],
  [Sector.HEAVY_INDUSTRY]: [
    { 
      id: 'hvy1', 
      name: 'Siderurgia / Metalurgia', 
      sector: Sector.HEAVY_INDUSTRY, 
      cost: 225, 
      profits: { 1: 150, 2: 180, 3: 210 },
      suppliers: { 1: 'Mineradora', 2: 'TI/IA', 3: 'Logística', 4: 'Energia elétrica' }
    },
    { 
      id: 'hvy2', 
      name: 'Polímeros', 
      sector: Sector.HEAVY_INDUSTRY, 
      cost: 235, 
      profits: { 1: 150, 2: 180, 3: 210 },
      suppliers: { 1: 'TI/IA', 2: 'Compostos Químicos', 3: 'Logística', 4: 'Energia elétrica' }
    },
    { 
      id: 'hvy3', 
      name: 'Compostos Químicos', 
      sector: Sector.HEAVY_INDUSTRY, 
      cost: 225, 
      profits: { 1: 150, 2: 180, 3: 210 },
      suppliers: { 1: 'Mineradora', 2: 'Manufatura de Roupa/Uniforme/EPI', 3: 'TI/IA', 4: 'Energia elétrica' }
    },
    { 
      id: 'hvy4', 
      name: 'Construção Civil', 
      sector: Sector.HEAVY_INDUSTRY, 
      cost: 210, 
      profits: { 1: 140, 2: 168, 3: 196 },
      suppliers: { 1: 'Mineradora', 2: 'Indústria de Combustíveis e Solventes', 3: 'Compostos Químicos', 4: 'Logística' }
    },
    { 
      id: 'hvy5', 
      name: 'Mineradora', 
      sector: Sector.HEAVY_INDUSTRY, 
      cost: 195, 
      profits: { 1: 130, 2: 156, 3: 182 },
      suppliers: { 1: 'Construção Civil', 2: 'Escola/Universidade', 3: 'Siderurgia / Metalurgia', 4: 'Energia elétrica' }
    },
  ],
  [Sector.WILD]: [],
};

export const BOARD_TILES = [
  Sector.MANUFACTURING, Sector.MANUFACTURING, // 1, 2 (Top left-to-right)
  Sector.HEAVY_INDUSTRY, Sector.HEAVY_INDUSTRY, Sector.HEAVY_INDUSTRY, Sector.HEAVY_INDUSTRY, // 3, 4, 5, 6
  Sector.SERVICES, Sector.SERVICES, // 7, 8
  Sector.SERVICES, Sector.SERVICES, // 9, 10 (Right top-to-bottom)
  Sector.WILD, Sector.WILD, Sector.WILD, Sector.WILD, // 11, 12, 13, 14
  Sector.HEALTH, Sector.HEALTH, // 15, 16
  Sector.HEALTH, Sector.HEALTH, // 17, 18 (Bottom right-to-left)
  Sector.RETAIL, Sector.RETAIL, Sector.RETAIL, Sector.RETAIL, // 19, 20, 21, 22
  Sector.IT, Sector.IT, // 23, 24
  Sector.IT, Sector.IT, // 25, 26 (Left bottom-to-top)
  Sector.WILD, Sector.WILD, Sector.WILD, Sector.WILD, // 27, 28, 29, 30
  Sector.MANUFACTURING, Sector.MANUFACTURING, // 31, 32
];

export const INITIAL_CAPITAL = 5000;
export const WIN_GOAL = 10000;
export const MAX_ROUNDS = 10;
