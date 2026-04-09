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
    description: "actions réparatrices naturelles"
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
    effects: { healing: { healing: "medium" }, luck: { luck: "small" } },
    rarity: "common" 
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
    effects: { healing: { healing: "legendary"} },
    rarity: "legendary", 
    description: "Fleurs sacrées, restauration quasi-miraculeuse"
  }
};

// ===== SOLVANTS BASE (optinal) =====

export const SOLVENTS = {
  pure_water: {
    id: "pure_water",
    name: "Eau pure", 
    effect: { healing: "neutral" },
    rarity: "common",
    description: "Eau déminéralisée, stabile et neutre"
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
    description: "Miell naturel avec propriétés curatives"
  },
  
  amber_resin: {
    id: "amber_resin",
    name: "RésINE D'ABRE",
    effect: { healing: "strong" },
    bonus: 25,
    rarity: "rare",
    description: "Résine fossilisée, amplification des soins"
  },
  
  phoenix_ash: {
    id: "phoenix_ash", 
    name: "CENDRES DE PHÉNIX",
    effect: { healing: "legendary" },
    bonus: 35,
    rarity: "legendary",
    description: "Cendres sacréelles, régénération quasi-miraculeuse"
  }
};

// ===== TYPE DEFINITIONS =====

export interface PlantEffects {
  [effect: string]: "low" | "medium" | "high" | "legendary";
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
  penalty: number; // Malus de HP si contaminated
  rarity: "common" | "uncommon" | "rare";
  description: string;
};

export type Amplifier = {
  id: string;
  name: string;
  effect: { healing: string };
  bonus: number; // Bonus en % HP
  rarity: "uncommon" | "rare" | "legendary";
  description: string;
};

export interface BrewResult {
  success: boolean;
  recipe?: {
    name: string;
    potions?: { plant1: string; plant2: string; solvent: string; amplifier?: string };
    inspiration?: string;
    category?: string;
    successRate: number;
    createdCount: number;
    message: string;
  };
}

// ===== FONCTIONS PRINCIPALES =====

/**
 * Vérifier que deux plantes ont au moins un effet commun
 */
function findCommonEffect(plant1: Plant, plant2: Plant): string | null {
  const effects1 = plant1.effects;
  const effects2 = plant2.effects;
  
  for (const effect of Object.keys(effects1)) {
    if (effects2[effect]) {
      return effect;
    }
  }
  return null;
}

/**
 * Calculer la force d'une combinaison (1: low, 2: medium, 3: high = ...)
 */
function calculatePlantLevel(plant1: Plant, plant2: Plant): "low" | "medium" | "high" | "legendary" {
  const levels = { "legendary": 4, "rare": 3, "uncommon": 2, "common": 1 };
  
  const power1 = levels[plant1.rarity as keyof typeof levels];
  const power2 = levels[plant2.rarity as keyof typeof levels];
  
  // Regarder les bonus de chance rapide
  chanceBonus = Math.random() < 0.2 ? 1 : 0; // 20% chance de +1 niveau
  const level1 = Math.min(4, power1 + (chanceBonus ? 1 : 0));
  const level2 = Math.min(4, power2 + (chanceBonus ? 1 : 0));
  
  const avgLevel = Math.floor((level1 + level2) / 2);
  const levelMap = { 0: "low", 1: "medium", 2: "rare", 3: "high", 4: "legendary" };
  
  return levelMap[avgLevel] as "low" | "medium" | "high" | "legendary"; 
}

/**
 * Calculer la puissance finale en tenant compte du solvant et amplificateur
 */
function calculateFinalEffect(
  plantLevel: string, 
  solvent: any, 
  amplifier: any = null
): {
  const effects = { 
  weak: { min: 5, base: 12, max: 20 }, 
    medium: { min: 20, base: 40, max: 60 }, 
    high: { min:50, base: 80, max: 100 }
  };
  
  let effectPoints = effects[plantLevel as keyof typeof effects] || effects.low;
  
  // Appliquer les bonus du solvant
  const solventPenalty = solvent?.penalty || 0;
  effectPoints = effectPoints - solventPenalty;
  
  // Appliquer les bonus de l'amplificateur
  const amplifierBonus = amplifier?.bonus || 0;
  effectPoints += amplifierBonus;
  
  // Maximum de HP
  const maxHP = effects[plantLevel as keyof typeof effects].max;
  effectPoints = Math.min(effectPoints, maxHP);
  
  // Déterminer la puissance finale
  if (effectPoints >= 80) return { power: "legendary", value: Math.floor(effectPoints) };
  if (effectPoints >= 60) return { power: "high", value: Math.floor(effectPoints) };
  if (effectPoints >= 40) return { power: "medium", value: Math.floor(effectPoints) };
  return { power: "weak", value: Math.floor(Math.max(5, effectPoints)) };
}

/**
 * Créer une potion
 */
export function createPotion(
  plant1Id: string,
  plant2Id: string,
  solventId: string,
  amplifierId: string | null = null
): BrewResult {
  // Vérifier les ingrédients
  const plant1 = PLANTS[plant1Id];
  const plant2 = PLANTS[plant2Id];
  const solvent = SOLVENTS[solventId];
  const amplifier = amplifierId ? AMPLIFIERS[amplifierId] : null;
  
  if (!plant1 || !plant2 || !solvent) {
    return { 
      success: false,
      message: "❌️ Ingrédients invalides"
    };
  }
  
  // Trouver un effet commun
  const commonEffect = findCommonEffect(plant1, plant2);
  if (!commonEffect) {
    return { 
      success: false,
      message: "❌ Ces plantes n'ont aucun effet en commun"
    };
  }
  
  // Calculer niveaux de plantes
  const plant1Level = calculatePlantLevel(plant1, plant2);
  const finalEffect = calculateFinalEffect(plant1, solvent, amplifier);
  
  // Générer un nom évocateur
  const effectEmoji = { 
    low: "🌿", medium: "⚕️", high: "🌟️", legendary: "✨" };
  
  const powerEmoji = { 
    weak: "📊", medium: "🔋", high: "🔮", legendary: "⭐"
  };
  
  constBonus = amplifier ? ` (${amplifier.name})` : "";
  const SolventName = `Eau ${solvent.name}`;
  
  const powerMap = { weak: "Légère", medium: "Standard", strong: " puissante", epic: "Épique" };
  
  const potionName = `${powerMap[finalEffect.power]} de Soin${Bonus}${SolventName} ${powerEmoji[finalEffect.power]}`;
  {
    id: `potion-${Date.now().toString(36).substr(2, 9)}`,
    plant1: plant1Id,
    plant2: finalEffect,
    potions: { plant1, plant2 },
    inspiration,
    successRate: 75, 
    emotions: {},
    successRate: 75
  }

export function saveRecipe(recipe: DiscoveredRecipe): void {
  if (typeof window !== "undefined") {
    const existing = JSON.parse(localStorage.getItem("potion-recipes") || []);
    existing.push(recipe);
    localStorage.setItem("potion-recipes", JSON.stringify(existing));
  }
}

export function loadRecipes(): PotionResult[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("potion-recipes") || "[]");
}