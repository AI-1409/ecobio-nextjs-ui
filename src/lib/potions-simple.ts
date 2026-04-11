/**
 * ÉcoBio Simple Potion System - Version simplifiée
 * Synthèse basée : 2 plantes + solvant (+amplificateur optionnel)
 */

// ===== PLANTES BASIQUES (13 plantes) =====

export const PLANTS = {
  // === COMMON (niveau basique) ===
  aloe_vera: {
    id: "aloe_vera",
    name: "Aloès vera",
    effects: { healing: "low" },
    rarity: "common",
    description: "Gelée d'aloès, cicatrisation rapide"
  },

  plantain_leaf: {
    id: "plantain_leaf",
    name: "Feuille de plantain",
    effects: { healing: "low" },
    rarity: "common",
    description: "Actions réparatrices naturelles"
  },

  chickweed: {
    id: "chickweed",
    name: "Petit grande patience",
    effects: { healing: "low" },
    rarity: "common",
    description: "Herbe anti-inflammatoire"
  },

  dandelion: {
    id: "dandelion_root",
    name: "Pissenlit de pissenlit",
    effects: { healing: "medium", luck: "small" },
    rarity: "common",
    description: "Pissenlit de pissenlit, detoxification et purification"
  },

  // === UNCOMMON (niveau intermédiaire) ===
  calendula: {
    id: "calendula",
    name: "Souci officinale",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Fleurs jaunes, puissants anti-inflammatoires"
  },

  yarrow_root: {
    id: "yarrow_root",
    name: "Racine d'achillée",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Sang du sang, purificateur et renforcement"
  },

  lavender: {
    id: "lavender",
    name: "Lavande",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Fleurs violettes, relaxation mentale et calm"
  },

  valerian_root: {
    id: "valerian_root",
    name: "Grande valériane",
    effects: { healing: "medium" },
    rarity: "rare",
    description: "Racine rare précieuse, stabilisation émotionnelle"
  },

  // === RARE (très précieux) ===
  ginseng_root: {
    id: "ginseng_root",
    name: "Ginseng pur panax",
    effects: { healing: "high" },
    rarity: "rare",
    description: "Racine millénaire, vitalité extrême"
  },

  mandrake_root: {
    id: "mandrake_root",
    name: "Mandragore",
    effects: { healing: "high" },
    rarity: "legendary",
    description: "Plante toxique transformée, régénération cellulaire"
  },

  lotus_petal: {
    id: "lotus_petal",
    name: "Pétales de lotus",
    effects: { healing: "legendary" },
    rarity: "legendary",
    description: "Fleurs sacrées, restauration quasi-miraculeuse"
  }
};

// ===== SOLVANTS BASE (optional) =====

export const SOLVENTS = {
  pure_water: {
    id: "pure_water",
    name: "Eau pure",
    effect: { healing: "neutral" },
    rarity: "common",
    description: "Eau déminéralisée, stable et neutre"
  }
};

// ===== AMPLIFICATEURS OPTIONNELS =====

export const AMPLIFIERS = {
  honey: {
    id: "honey",
    name: "Miel",
    effect: { healing: "moderate" },
    bonus: 15,
    rarity: "uncommon",
    description: "Miel naturel avec propriétés curatives"
  },

  amber_resin: {
    id: "amber_resin",
    name: "Résine d'arbre",
    effect: { healing: "strong" },
    bonus: 25,
    rarity: "rare",
    description: "Résine fossilisée, amplification des soins"
  },

  phoenix_ash: {
    id: "phoenix_ash",
    name: "Cendres de phénix",
    effect: { healing: "legendary" },
    bonus: 35,
    rarity: "legendary",
    description: "Cendres sacrées, régénération quasi-miraculeuse"
  }
};

// ===== TYPE DEFINITIONS =====

export interface PlantEffects {
  [effect: string]: "low" | "medium" | "high" | "legendary" | "small";
}

export type PlantEffect = PlantEffects[keyof PlantEffects];

export type Plant = {
  id: string;
  name: string;
  effects: PlantEffects;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  description: string;
};

export type Solvent = {
  id: string;
  name: string;
  effect: { healing: string };
  penalty?: number;
  rarity: "common" | "uncommon" | "rare";
  description: string;
};

export type Amplifier = {
  id: string;
  name: string;
  effect: { healing: string };
  bonus: number;
  rarity: "uncommon" | "rare" | "legendary";
  description: string;
};

export interface BrewResult {
  success: boolean;
  message?: string;
  potion?: {
    id: string;
    name: string;
    healingPower: number;
    powerLevel: "weak" | "medium" | "high" | "legendary";
  };
}
