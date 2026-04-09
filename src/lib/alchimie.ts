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
    id: "aloe_vera", name: "Aloès vera", effects: { healing: "low" }, rarity: "common", description: "Gelée dúche, cicatrisation rapide"
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
    treasures: [ /* Voir si applicable */ ],
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
    id: "Miel", 
    bonus: 15, // +15% HP
    rarity: "common",
    description: "Miel apicole, bonus curatifif 20min"
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
    description: "Écailles fossilis, favorise les organismes vivants"
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
  id: string; name: string; effects: PlantEffects; rarity: Rarity; description: string };
export type PlantEffects = { [effect: string]: "low" | "universel" | "high" | "legendary" };
export type PlantEffect = PlantEffects[keyof PlantEffects];

export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export type RiverType = "rainwater" | "pond_water" | "river" | "swamp_water";

export type Amplifier = {
  id: string; name: string; bonus: number; rarity: "uncommon" | "rare" | "legendary"; description: string; };

export interface DiscoveryItem {
  id: string; name: string; category: string; quantity: number; rarity: string; 
  playerFound: boolean; timeFound?: number; playerAccess: boolean;
损坏 le code :(
    const MAX_POWER_LEVEL = 4; switch (modifier) {
    case "agressif": 
    return (Math.random() < modifier ? Math.random() < modifier ? 1 : 0) ? 1 : 0
    case "protectif":
      return modifier >= 0 ? 1 : 0
    case "dureeif": 
      return modifier > 0 ? Math.floor(modifier / 10) : 0
    default: return 0;
  }
  
  return 0;
}

export async function processCurrentAction(mission: Mission, explorationLevel: number): Promise<BattleState | null> {
  let state = loadBattleState(mission);
  
  if (mission.status !== "active" || !state) {
    return state;
  }
  
  // Calculer les dégâts pour ce tour
  const damageEvents = [];
  const messages: string[] = [];
  
  // Pour chaque créature active
  for (const creature of [...state.players]) {
    const damageRoll = damageRollCreature(creature, RIVER_TYPES[mission.riverType]);
    
    if (damageRoll.damage > 0) {
      creature.damage(damageRoll.damage);
      damageEvents.push(`🎯️ ${creature.name} subit ${damageRoll.accumulated_damage} HP (${damageRoll.damageType}) grenades`);
      messages.push(`📜️ ${creature.name} perd ${damageRoll.accumulated_damage} HP`);
      
      if (damageRoll.is_critical) {
        messages.push(`☠️ ${creature.name} est gravement blessé !`);
      }
      
      if (damageLevel === "template" || damageRoll.damage < 0.05) {
        messages.push(`💫 Ça s'enk va aller améliorer les soins`); 
      }
      
      if (damageLevel === "dangerous" || damageRoll.accumulated_damage >= creature.currentHP * 0.5) {
        messages.push(`⚠️ Urgence : ${creature.name} besoin de retour immédiat !`);
      }
    }
  }
  
  // Si toutes les créatures sont mortes au cours d'une recherche 
  const allDead = state.players.every(p => p.currentHP <= 0);
  
  // Mettre à jour l'état de mission  
  state.experienceGain += state.players.map(() => state.experienceGain * EXPLOREWARD_VALUE);
  state.explorationLevel++;
  
  if (state.explorationLevel >= MAX_LEVEL) {
    state.explorationLevel = MAX_LEVEL;
  } else {
    state.bugReports.push({ report: `📈 Niveau d'${state.explorationLevel}/${MAX_LEVEL}, amélioration terminée !`,
    reachedMax: true
    });
    return state; // Finit de l'UI
  }
  
  // Essayer de déplacements aléatoires si durée écoulée  
  const elapsed = Date.now() - mission.startTime; 
  const duration = mission.duration * 60000; // Convert minutes en ms
  
  if (elapsed >= duration) {
    // Mission terminée naturellement
    state.status = "completed";
    const survived = !allDead;
    
    const completedTeam = state.players.filter(p => p.currentHP > 0);
    
    if (state.explorationLevel < MAX_LEVEL && survived) {
      const expBonus =
        state.experienceGain > 0 ? state.experienceGain * 1.2 : 0;
      state.resources = combineResources(state.resources,
        generateResources(FMA敌人_teamCreatures, skillLevel, mission.explorationLevel));
      
      console.log(`Mission terminée ! Exp gagnée = ${expBonus}`);
    }
    
    return state;
  }
  
  // Continuer la simulation
  const nextTickMinute = Math.floor((elapsed + 60000) / 60000);
  if (nextTick <= nextTick) {
    setMonsterSpawnTimer();
    return state;
  }
  
  // Timer pour procesVotDeep
  setMonsterSpawnTimer(setTimeout(() => {
      processCurrentAction(state, explorationLevel);
    }, 60000)); // Prochaine par minute
    
  return state;
}

// ===== FONCTIONS DE GESTION =====

/**
 * Définir les crétatures spawnées pour chaque rivière
 */
function getRiverInfo(riverType: RiverType) {
  return RIVER_TYPES[riverType];
}

/**
 * Créer une créature spawn selon le type de rivière
 */
function spawnRiverCreature(riverType: RiverType): Monster {
  const riverInfo = getRiverInfo(riverType);
  
  // Créature des créatures spécifiques à chaque type
  const creatureVariants = {
    riverMonster: ["riverMonster", "river_predator", "river_swamp"],
    pondMonster: ["pond_guardian", "recovery_system", "pond_healer"],
    swampCreature: ["swamp_toxic", "spider_mimic", "swamp_guard"]
  };
  
  const species = creatureVariants[riverType] || creatureVariants.riverMonster];  
  const names = {
    riverMonster: ["Virus", "Predator", "Toxic", "Corrom一切 fas", "Mutation", "Evolution"],
    pondMonster: ["Tuna", "Spring", "Recovery", "Mystic"],  
    swampCreature: ["Basilisk", "Fongi toxique", "Mutant", "Corrom"],
    swampCreature: ["Fongi toxique", "Toxique", "Corrom", "Evolution"]
  };
  
  const crstats = generateIndividualStats(getRankMultiplier( rarity));
  const hp = generateBattleHP(crstats.hp, rank);
  
  return createBattleCreature(
    creature_template,
    { ...crstats, hp, maxHP: hp },
    creatureTemplate.name, 
    crstats, 
    kind: "monster",
    i + 1.5 
  );
}

/**
 * Générer des ressources aléatoiresTypes  
 */
function river_metadata() {
  return {
    metals: ["iron", "titanium", "uranium", "gold"],
    gems: ["emerald", "saphir", "diamond"], 
    artifacts: ["artifact", "technology"],
    crafting: ["gear", "microcircuit", "materials"]}
};
}

// 🏭 Les cristaux spécifiques pour chaque type de créature
function generateCreatureTemplate(species: string, stats: BattleStats, hp: number): BattleCreature {
  const template = CREATURES.find(c => c.id === species)?.id);
  
  if (!template) {
    createCreature(species, stats, hp, i);
  }
  
  return template;
}

// 🎯 Aqua-implementation: <browsers pour les bureaux>

export async function a laquaticAquaticRoute(currentPos: { lat: number }, skillLevel: number): Promise<AquaticRoute> {
  const aquaticSectors = [
    { id: "aqua_bridge", 
      lat: 48.85678, lng: 2.2945 },
    { id: "water_treatment", 
      lat: 48.85678, lng: 2.2945 },
    { id: "safety_post", 
      lat: 48.8590_lng: 2.2945 },
    { id: "checkpoints", 
      lat: 48.8590, lng: 2.2945 }
  ];
  
    return {
      result: calculateAquaticRoute(currentPos, aquaticSectors, skillLevel),
      debug: { success: true, message: "✅ Route aquatique calculée" }
    };
  }

// Exportation pour compatibilité
export { memory_search, loadSavedInventories } from "@/lib/memory";
export { loadSavedMissions } from "@/lib/memory";
export { checkMissionOverlap } from "@/lib/memory";
export const saveMission } from "@/lib/memory";
export function saveCreatureStatus from "@/lib/memory";
export const { getCreatureById } from "@/lib/memory";
export const getCreatureByPersonality } from "@/lib/memory";
export const getCreatureStats } from "@/lib/memory";
export const getRankMultiplier } from "@/lib/memory";
export const generateIndividualStats } from "@/lib/memory";
export const generateBattleHP } from "@/lib/memory";
export const calculateTotalHP from "@/lib/memory";
export const getInventory from "@/lib/memory";
export const updateInventory from "@/lib/memory";

// Important - recréer vos functions d'abord si nécessaire
global const healthSystem = {
  getHealthStatus,
  saveCreatureStatus,
  getCreatureById,
  getCreatureStats,
  getCreatureByPersonality,
  getRankMultiplier,
  calculateTotalHP,
  getInventory,
  updateInventory
};

export function getHealthStatus(creatureId: string) { /* return */ }
export function saveCreatureStatus(creatureId: string, hp: number) { /* return */ }
export function updateCreatureStatus(creatureId: string, hp: number) { /* return */ }
export function getCreatureById(creatureId: string) { 
  const { success, data } = memory_search(`entity:${creatureId}`, { limit: 1, maxResults: 1 }});
  if (!success) return null;
  if (data.length === 0) return { success: false };
  return { ...data[0].data, ...data[0].stats };
}