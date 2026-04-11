/**
 * ÉcoBio Simple Potion System
 * Synthèse basée : 2 plantes + 1 solvant (ex: "eau pure")
 * Simples mais évolutifs de possibilité : 2 plantes + 1 amplificateur (ex: "miel")
 * Résultats : 15% 25% 35% 45% 60% 85% 95%
 */
const PLANTS = {
  // === COMMON (facile de jardin / herboriste) ===
  plantain_leaf: {
    id: "plantain_leaf",
    name: "Feuille de plantain",
    effects: { healing: "low" },
    rarity: "common",
    description: "Feuille de plantain, couture et réparation rapide"
  },

  chickweed: {
    id: "chickweed",
    name: "Grande patience",
    effects: { healing: "low" },
    rarity: "uncommon",
    description: "Herbe sauvage, propriétés anti-inflammatoires basiques"
  },

  calendula: {
    id: "calendula",
    name: "Souci officinale",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Fleurs jaunes, puissants anti-inflammatoires"
  },

  dandelion: {
    id: "dandelion_root",
    name: "Pissenlit de pissenlit",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Pissenlits de pissenlit, purification des toxines"
  },

  // === Special (nouveau test) ===
  aloe_vera: {
    id: "aloe_vera", name: "Aloès vera", effects: { healing: "low" }, rarity: "common", description: "Gelée pure, cicatrisation rapide"
  },
  lavender: {
    id: "lavender", name: "Lavande", effects: { healing: "medium" }, rarity: "uncommon", description: "Fleurs violettes, calme mental et bien-être"
  }
};

// ===== SOLVANTS (drogues) =====

export const RIVER_TYPES = {
  rainwater: {
    id: "rainwater",
    name: "Eau de pluie pure",
    risk: { low: 0.05, attack: 0.02 },
    resources: ["tree_fruits", "herbs", "craft_materials"],
    discovery_rate: 0.8,
    treasures: [], // Voir si applicable
    locations: ["forest_edge", "gardens"]
  },

  pond_water: {
    id: "pond_water",
    name: "Eau d'étang",
    risk: { low: 0.01, attack: 0.01 },
    resources: ["fish", "aquatic_plants"],
    discovery_rate: 0.9,
    treasures: ["pearls", "fossils"],
    locations: ["ponds", "lakes"]
  },

  river: {
    id: "river",
    name: "Eau de rivière",
    risk: { low: 0.03, attack: 0.05 },
    resources: ["river_seeds", "water_elements"],
    discovery_rate: 0.8,
    treasures: ["minerals", "artefacts"]
  },

  swamp: {
    id: "swamp_water",
    name: "Eau sale/boue",
    risk: { low: 0.1, attack: 0.08 },
    resources: ["herbs", "mushroom varieties"],
    discovery_rate: 0.3,
    treasures: ["toxic_relics", "artifacts"]
  }
};

// ===== AMPLIFICATEURS (amélioration) =====

export const AMPLIFIERS = {
  honey: {
    id: "honey",
    name: "Miel",
    bonus: 15, // +15% HP
    rarity: "common",
    description: "Miel apicole, bonus curatif 20min"
  },

  amber_resin: {
    id: "amber",
    name: "Résine d'ambre",
    bonus: 25, // +25% HP
    rarity: "rare",
    description: "Résine fossilisée, conserve les organiques"
  },

  dragon_scale: {
    id: "dragon_scale",
    name: "Écailles d'oscale",
    bonus: 35, // +35% HP
    rarity: "legendary",
    description: "Écailles fossilisées, favorise les organismes vivants"
  },

  phoenix_feather: {
    id: "phoenix_feather",
    name: "Plumes de phénix",
    bonus: 35, // +35% HP
    rarity: "legendary",
    description: "Plumes sacrées, configuration Knights Swift et Scout"
  }
};

// ===== TYPES =====

export interface Plant {
  id: string; name: string; effects: PlantEffects; rarity: Rarity; description: string;
}

export type PlantEffects = { [effect: string]: "low" | "universel" | "high" | "legendary" };
export type PlantEffect = PlantEffects[keyof PlantEffects];
export type Rarity = "common" | "uncommon" | "rare" | "legendary";
export type RiverType = "rainwater" | "pond_water" | "river" | "swamp_water";

export type Amplifier = {
  id: string; name: string; bonus: number; rarity: "uncommon" | "rare" | "legendary"; description: string;
};

export interface DiscoveryItem {
  id: string; name: string; category: string; quantity: number; rarity: string;
  playerFound: boolean; timeFound?: number; playerAccess: boolean;
}
