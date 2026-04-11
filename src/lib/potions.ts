/**
 * ÉcoBio Simple Potion System
 * Synthèse : 2 plantes + solvant (+ amplificateur optionnel)
 * Résultat : Potion de soin avec différents niveaux de puissance
 */

// ===== TYPES =====

export type EffectPower = "low" | "medium" | "high" | "legendary";

export interface PlantEffect {
  healing?: EffectPower;
  luck?: EffectPower;
  training?: EffectPower;
  [key: string]: EffectPower | undefined;
}

export interface Plant {
  id: string;
  name: string;
  effects: PlantEffect;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  description: string;
}

export interface Solvent {
  id: string;
  name: string;
  effect: { healing: string };
  penalty: number;
  rarity: "common" | "uncommon" | "rare";
  description: string;
}

export interface Amplifier {
  id: string;
  name: string;
  effect: { healing: string };
  bonus: number;
  rarity: "uncommon" | "rare" | "legendary";
  description: string;
}

export type PlantDict = Record<string, Plant>;
export type SolventDict = Record<string, Solvent>;
export type AmplifierDict = Record<string, Amplifier>;

export interface Potion {
  id: string;
  name: string;
  power: EffectPower;
  healingValue: number;
  description: string;
  ingredients: {
    plant1: string;
    plant2: string;
    solvent: string;
    amplifier?: string;
  };
}

export interface BrewResult {
  success: boolean;
  potion?: Potion;
  message: string;
}

// ===== PLANTES =====

export const PLANTS: PlantDict = {
  // === COMMON ===
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
    name: "Grande patience",
    effects: { healing: "low" },
    rarity: "common",
    description: "Herbe anti-inflammatoire"
  },
  
  dandelion: {
    id: "dandelion",
    name: "Pissenlit",
    effects: { healing: "medium", luck: "low" },
    rarity: "common",
    description: "Détoxification et purification"
  },

  // === UNCOMMON ===
  calendula: {
    id: "calendula",
    name: "Souci officinale",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Fleurs jaunes, puissants anti-inflammatoires"
  },
  
  yarrow_root: {
    id: "yarrow_root",
    name: "Achillée millefeuille",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Sang du dragon, purificateur"
  },
  
  lavender: {
    id: "lavender",
    name: "Lavande",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Fleurs violettes, relaxation mentale"
  },

  // === RARE ===
  valerian_root: {
    id: "valerian_root",
    name: "Valériane",
    effects: { healing: "medium" },
    rarity: "rare",
    description: "Racine rare, stabilisation émotionnelle"
  },
  
  ginseng_root: {
    id: "ginseng_root",
    name: "Ginseng",
    effects: { healing: "high" },
    rarity: "rare",
    description: "Racine millénaire, vitalité extrême"
  },

  // === LEGENDARY ===
  mandrake_root: {
    id: "mandrake_root",
    name: "Mandragore",
    effects: { healing: "high" },
    rarity: "legendary",
    description: "Plante toxique transformée, régénération cellulaire"
  },
  
  lotus_petal: {
    id: "lotus_petal",
    name: "Pétale de lotus",
    effects: { healing: "legendary" },
    rarity: "legendary",
    description: "Fleur sacrée, restauration quasi-miraculeuse"
  }
};

// ===== SOLVANTS =====

export const SOLVENTS: SolventDict = {
  pure_water: {
    id: "pure_water",
    name: "Eau pure",
    effect: { healing: "neutral" },
    penalty: 0,
    rarity: "common",
    description: "Eau déminéralisée, stable et neutre"
  },
  
  moonlit_dew: {
    id: "moonlit_dew",
    name: "Rosée lunaire",
    effect: { healing: "boost" },
    penalty: 0,
    rarity: "uncommon",
    description: "Rosée collectées sous la lune, amplifie les effets"
  },
  
  dragon_blood: {
    id: "dragon_blood",
    name: "Sang de dragon",
    effect: { healing: "boost" },
    penalty: -5,
    rarity: "rare",
    description: "Liquide légendaire, améliore la puissance"
  }
};

// ===== AMPLIFICATEURS =====

export const AMPLIFIERS: AmplifierDict = {
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
    name: "Résine d'ambre",
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

// ===== FONCTIONS =====

const RARITY_LEVEL: Record<string, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  legendary: 4
};

const EFFECT_VALUES: Record<EffectPower, { min: number; base: number; max: number }> = {
  low:    { min: 5,  base: 15, max: 25 },
  medium: { min: 20, base: 40, max: 60 },
  high:   { min: 50, base: 75, max: 95 },
  legendary: { min: 80, base: 100, max: 150 }
};

/**
 * Trouve un effet commun entre deux plantes
 */
function findCommonEffect(plant1: Plant, plant2: Plant): string | null {
  const effects1 = Object.keys(plant1.effects);
  const effects2 = Object.keys(plant2.effects);
  
  for (const effect of effects1) {
    if (effects2.includes(effect)) {
      return effect;
    }
  }
  return null;
}

/**
 * Détermine le niveau de puissance basé sur les deux plantes
 */
function calculatePowerLevel(plant1: Plant, plant2: Plant): EffectPower {
  const level1 = RARITY_LEVEL[plant1.rarity];
  const level2 = RARITY_LEVEL[plant2.rarity];
  
  const avgLevel = Math.floor((level1 + level2) / 2);
  
  const powerMap: Record<number, EffectPower> = {
    1: "low",
    2: "medium",
    3: "high",
    4: "legendary"
  };
  
  return powerMap[avgLevel] || "low";
}

/**
 * Calcule la valeur de soin finale
 */
function calculateHealingValue(
  power: EffectPower,
  solvent: Solvent,
  amplifier?: Amplifier
): number {
  const base = EFFECT_VALUES[power];
  let value = base.base;
  
  // Penalty du solvant
  value -= solvent.penalty;
  
  // Bonus de l'amplificateur
  if (amplifier) {
    value += amplifier.bonus;
  }
  
  // Clamp entre min et max
  return Math.floor(Math.max(base.min, Math.min(base.max, value)));
}

/**
 * Crée une potion à partir d'ingrédients
 */
export function createPotion(
  plant1Id: string,
  plant2Id: string,
  solventId: string,
  amplifierId?: string
): BrewResult {
  // Vérification des ingrédients
  const plant1 = PLANTS[plant1Id];
  const plant2 = PLANTS[plant2Id];
  const solvent = SOLVENTS[solventId];
  const amplifier = amplifierId ? AMPLIFIERS[amplifierId] : undefined;
  
  if (!plant1) {
    return { success: false, message: `❌ Plante inconnue: ${plant1Id}` };
  }
  if (!plant2) {
    return { success: false, message: `❌ Plante inconnue: ${plant2Id}` };
  }
  if (!solvent) {
    return { success: false, message: `❌ Solvant inconnu: ${solventId}` };
  }
  if (amplifierId && !amplifier) {
    return { success: false, message: `❌ Amplificateur inconnu: ${amplifierId}` };
  }
  
  // Vérifier effet commun
  const commonEffect = findCommonEffect(plant1, plant2);
  if (!commonEffect) {
    return {
      success: false,
      message: `❌ ${plant1.name} et ${plant2.name} n'ont aucun effet commun`
    };
  }
  
  // Calculer la puissance
  const power = calculatePowerLevel(plant1, plant2);
  const healingValue = calculateHealingValue(power, solvent, amplifier);
  
  // Générer le nom
  const powerNames: Record<EffectPower, string> = {
    low: "Infusion",
    medium: "Élixir",
    high: "Bacchus",
    legendary: "Philtre"
  };
  
  const names: Record<EffectPower, string> = {
    low: "Léger",
    medium: "Standard",
    high: "Puissant",
    legendary: "Épique"
  };
  
  const solventName = solvent.name;
  const ampName = amplifier ? ` ${amplifier.name}` : "";
  const potionName = `${powerNames[power]} de Soin ${names[power]}${ampName}`;
  
  // Créer la potion
  const potion: Potion = {
    id: `potion-${Date.now().toString(36)}`,
    name: potionName,
    power,
    healingValue,
    description: `Restaure ${healingValue} HP. Créé avec ${plant1.name}, ${plant2.name} et ${solventName}.`,
    ingredients: {
      plant1: plant1Id,
      plant2: plant2Id,
      solvent: solventId,
      ...(amplifierId && { amplifier: amplifierId })
    }
  };
  
  return {
    success: true,
    potion,
    message: `✅ ${potionName} créé ! +${healingValue} HP`
  };
}

/**
 * Liste toutes les plantes disponibles
 */
export function getAllPlants(): Plant[] {
  return Object.values(PLANTS);
}

/**
 * Liste tous les solvants disponibles
 */
export function getAllSolvents(): Solvent[] {
  return Object.values(SOLVENTS);
}

/**
 * Liste tous les amplificateurs disponibles
 */
export function getAllAmplifiers(): Amplifier[] {
  return Object.values(AMPLIFIERS);
}
