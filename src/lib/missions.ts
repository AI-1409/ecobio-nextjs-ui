/**
 * ÉcoBio Mission System
 * Déploiement → Exploration automatique → Récolte → Retour
 */

export interface Mission {
  id: string;
  creatureId: string;
  creatureLevel: number;
  explorationLevel: number;
  startTime: number;
  duration: number; // minutes en millisecondes
  status: "preparing" | "active" | "completed" | "failed" | "dead";
  discoveries: MissionDiscovery[];
  currentHP: number;
  maxHP: number;
  XP: number;
  completionPercentage: number;
}

export interface MissionDiscovery {
  id: string;
  type: string; // Plus flexible maintenant
  category: "material" | "metal" | "plant" | "food" | "special" | "organic";
  quantity: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  discoveredAt: number;
}

export interface MissionStats {
  totalMissions: number;
  successfulMissions: number;
  discoveriesCount: number;
  totalXP: number;
  explorationLevel: number;
  currentXP: number;
  maxXPRank: number;
}

/**
 * Statistics d'exploration par niveau
 */
const EXPLORATION_STATS = {
  1: { duration: 3, discoveryRate: 0.15, damageChance: 0.1, radius: "petit" },
  2: { duration: 4, discoveryRate: 0.18, damageChance: 0.12, radius: "petit" },
  3: { duration: 5, discoveryRate: 0.20, damageChance: 0.14, radius: "moyen" },
  4: { duration: 6, discoveryRate: 0.22, damageChance: 0.16, radius: "moyen" },
  5: { duration: 7, discoveryRate: 0.25, damageChance: 0.18, radius: "moyen" },
  6: { duration: 8, discoveryRate: 0.28, damageChance: 0.20, radius: "grand" },
  7: { duration: 9, discoveryRate: 0.30, damageChance: 0.22, radius: "grand" },
  8: { duration: 10, discoveryRate: 0.32, damageChance: 0.24, radius: "grand" },
  9: { duration: 11, discoveryRate: 0.34, damageChance: 0.26, radius: "grand" },
  10: { duration: 12, discoveryRate: 0.35, damageChance: 0.28, radius: "trèsgrand" },
  // Niveaux 11-20 : progression similaire
};

const RESOURCE_TYPES = [
  // Matériaux de base
  { id: "wood", name: "Bois", weight: 25, rarity: "common" as const, category: "material" as const },
  { id: "stone", name: "Pierre", weight: 20, rarity: "common" as const, category: "material" as const },
  { id: "iron", name: "Fer", weight: 15, rarity: "common" as const, category: "metal" as const },
  { id: "copper", name: "Cuivre", weight: 12, rarity: "common" as const, category: "metal" as const },
  
  // Métaux avancés
  { id: "aluminum", name: "Aluminium", weight: 8, rarity: "uncommon" as const, category: "metal" as const },
  { id: "steel", name: "Acier", weight: 6, rarity: "uncommon" as const, category: "metal" as const },
  { id: "titanium", name: "Titane", weight: 3, rarity: "rare" as const, category: "metal" as const },
  { id: "uranium", name: "Uranium", weight: 1, rarity: "legendary" as const, category: "metal" as const },
  
  // Plantes médicinales
  { id: "herb", name: "Plante médicinale", weight: 15, rarity: "common" as const, category: "plant" as const },
  { id: "mushroom", name: "Champignon", weight: 8, rarity: "uncommon" as const, category: "plant" as const },
  { id: "flower", name: "Fleur rare", weight: 4, rarity: "rare" as const, category: "plant" as const },
  { id: "seed-sacred", name: "Graines sacrées", weight: 1, rarity: "legendary" as const, category: "plant" as const },
  
  // Nourriture base
  { id: "fruit", name: "Fruit", weight: 12, rarity: "common" as const, category: "food" as const },
  { id: "vegetable", name: "Légume", weight: 10, rarity: "common" as const, category: "food" as const },
  { id: "berry", name: "Baie", weight: 6, rarity: "uncommon" as const, category: "food" as const },
  { id: "nut", name: "Noix", weight: 4, rarity: "uncommon" as const, category: "food" as const },
  
  // Ressources spéciales
  { id: "crystal", name: "Cristal", weight: 5, rarity: "rare" as const, category: "special" as const },
  { id: "crystal-raw", name: "Cristal brut", weight: 3, rarity: "rare" as const, category: "special" as const },
  { id: "artifact", name: "Artefact", weight: 2, rarity: "legendary" as const, category: "special" as const },
  { id: "energy-core", name: "Noyau d'énergie", weight: 1, rarity: "legendary" as const, category: "special" as const },
  
  // Composants organiques
  { id: "hide", name: "Peau", weight: 8, rarity: "common" as const, category: "organic" as const },
  { id: "bone", name: "Os", weight: 6, rarity: "uncommon" as const, category: "organic" as const },
  { id: "venom", name: "Venom", weight: 3, rarity: "rare" as const, category: "organic" as const },
  { id: "gene-sample", name: "Échantillon d'ADN", weight: 1, rarity: "legendary" as const, category: "organic" as const },
];

/**
 * Créer une nouvelle mission
 */
export function createMission(creatureId: string, creatureLevel: number, explorationLevel: number): Mission {
  const creature = getCreatureById(creatureId);
  if (!creature) throw new Error("Creature not found");

  const stats = EXPLORATION_STATS[explorationLevel as keyof typeof EXPLORATION_STATS] || EXPLORATION_STATS[1];
  
  return {
    id: `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    creatureId,
    creatureLevel,
    explorationLevel,
    startTime: Date.now(),
    duration: stats.duration * 60 * 1000, // Convert minutes to milliseconds
    status: "preparing",
    discoveries: [],
    currentHP: creature.currentHP,
    maxHP: creature.maxHP,
    XP: 0,
    completionPercentage: 0,
  };
}

/**
 * Démarrer une mission
 */
export function startMission(mission: Mission): Mission {
  return {
    ...mission,
    status: "active",
    startTime: Date.now(),
  };
}

/**
 * Simuler un intervalle de mission (appelé toutes les minutes)
 */
export function processMissionTick(mission: Mission): {
  updatedMission: Mission;
  discoveries: MissionDiscovery[];
  damageEvents: { amount: number; type: string }[];
  logMessages: string[];
} {
  const discoveries: MissionDiscovery[] = [];
  const damageEvents: { amount: number; type: string }[] = [];
  const logMessages: string[] = [];

  if (mission.status !== "active") {
    return { updatedMission: mission, discoveries, damageEvents, logMessages };
  }

  const stats = EXPLORATION_STATS[mission.explorationLevel as keyof typeof EXPLORATION_STATS] || EXPLORATION_STATS[1];
  
  // Check pour découvertes
  if (Math.random() < stats.discoveryRate) {
    const newDiscoveries = generateDiscoveries(mission.explorationLevel);
    discoveries.push(...newDiscoveries);
    logMessages.push(`🎯 Découverte! ${newDiscoveries.length} ressources trouvées`);
  }

  // Check pour dégâts
  if (Math.random() < stats.damageChance) {
    const damageAmount = Math.floor(mission.maxHP * (0.05 + Math.random() * 0.1)); // 5-15% HP
    const currentHP = Math.max(0, mission.currentHP - damageAmount);
    
    damageEvents.push({
      amount: damageAmount,
      type: attackTypeString()
    });
    logMessages.push(`⚔️ Attaque ${damageEvents[damageEvents.length - 1].type}! -${damageAmount} HP`);

    mission.currentHP = currentHP;

    // Check si mort
    if (currentHP <= 0) {
      return {
        updatedMission: { ...mission, status: "dead", completionPercentage: 100 },
        discoveries,
        damageEvents,
        logMessages: [...logMessages, "💀 Créature morte en mission!"]
      };
    }
  }

  //calcul progression
  const elapsed = Date.now() - mission.startTime;
  const completionPercentage = Math.min(100, Math.floor((elapsed / mission.duration) * 100));

  // Check si mission terminée
  if (elapsed >= mission.duration) {
    const totalXP = calculateMissionXP(mission);
    return {
      updatedMission: {
        ...mission,
        status: "completed",
        XP: totalXP,
        completionPercentage: 100,
      },
      discoveries,
      damageEvents,
      logMessages: [...logMessages, `✅ Mission terminée! XP gagné: ${totalXP}`]
    };
  }

  return {
    updatedMission: {
      ...mission,
      discoveries: [...mission.discoveries, ...discoveries],
      completionPercentage,
    },
    discoveries,
    damageEvents,
    logMessages,
  };
}

/**
 * Générer des découvertes aléatoires
 */
function generateDiscoveries(explorationLevel: number): MissionDiscovery[] {
  const discoveryCount = Math.floor(Math.random() * 3) + 2; // 2-4 items
  const discoveries: MissionDiscovery[] = [];

  for (let i = 0; i < discoveryCount; i++) {
    const resource = selectWeightedResource(RESOURCE_TYPES, explorationLevel);
    const quantity = calculateQuantity(resource.rarity, explorationLevel);
    
    discoveries.push({
      id: `discovery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: resource.id,
      category: resource.category,
      quantity,
      rarity: resource.rarity,
      discoveredAt: Date.now(),
    });
  }

  return discoveries;
}

/**
 * Sélection pondérée de ressource
 */
function selectWeightedResource(resources: typeof RESOURCE_TYPES, explorationLevel: number): typeof RESOURCE_TYPES[0] {
  const totalWeight = resources.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * totalWeight;
  
  // Bonus niveau exploration pour ressources rares
  const adjustedResources = resources.map(r => ({
    ...r,
    weight: r.weight * (r.rarity === "rare" || r.rarity === "legendary" ? 1 + (explorationLevel * 0.05) : 1)
  }));

  for (const resource of adjustedResources) {
    random -= resource.weight;
    if (random <= 0) {
      return resources.find(r => r.id === resource.id)!;
    }
  }
  
  return resources[0];
}

/**
 * Calculer quantité ressource
 */
function calculateQuantity(rarity: string, explorationLevel: number): number {
  const baseQuantities = {
    common: Math.floor(Math.random() * 5) + 3, // 3-7
    uncommon: Math.floor(Math.random() * 3) + 2, // 2-4
    rare: Math.floor(Math.random() * 2) + 1, // 1-2
    legendary: 1,
  };

  return Math.floor((baseQuantities[rarity as keyof typeof baseQuantities] || 1) * (1 + explorationLevel * 0.1));
}

/**
 * Calcul XP mission
 */
function calculateMissionXP(mission: Mission): number {
  const baseXP = 10 + mission.explorationLevel * 2;
  const discoveriesBonus = mission.discoveries.length * 3;
  const completionBonus = Math.floor(mission.currentHP / mission.maxHP * 20);
  
  return baseXP + discoveriesBonus + completionBonus;
}

/**
 * Texte d'attaque
 */
function attackTypeString(): string {
  const attacks = ["drone", "créature sauvage", "piège", "embuscade", "acid rain"];
  return attacks[Math.floor(Math.random() * attacks.length)];
}

/**
 * Récupérer créature depuis storage
 */
function getCreatureById(creatureId: string) {
  if (typeof window === "undefined") return null;
  
  const collection = JSON.parse(localStorage.getItem("ecobio-collection") || "[]");
  return collection.find((c: any) => c.id === creatureId);
}

/**
 * Sauvegarder mission active
 */
export function saveActiveMission(mission: Mission): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ecobio-active-mission", JSON.stringify(mission));
}

/**
 * Charger mission active
 */
export function loadActiveMission(): Mission | null {
  if (typeof window === "undefined") return null;
  
  const saved = localStorage.getItem("ecobio-active-mission");
  if (!saved) return null;
  
  const mission = JSON.parse(saved);
  // Check si mission est expirée ou morte
  if ((mission.status === "active" && Date.now() > mission.startTime + mission.duration) || 
      mission.status === "dead") {
    localStorage.removeItem("ecobio-active-mission");
    return null;
  }
  
  return mission;
}

/**
 * Annuler mission
 */
export function cancelMission(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ecobio-active-mission");
}

/**
 * Update stats joueur
 */
export function updateMissionStats(stats: Partial<MissionStats>): void {
  if (typeof window === "undefined") return;
  
  const current = JSON.parse(localStorage.getItem("ecobio-mission-stats") || "{}");
  const updated = { ...current, ...stats };
  localStorage.setItem("ecobio-mission-stats", JSON.stringify(updated));
}

/**
 * Charger stats joueur
 */
export function getMissionStats(): MissionStats {
  if (typeof window === "undefined") {
    return {
      totalMissions: 0,
      successfulMissions: 0,
      discoveriesCount: 0,
      totalXP: 0,
      explorationLevel: 1,
      currentXP: 0,
      maxXPRank: 100,
    };
  }
  
  return JSON.parse(localStorage.getItem("ecobio-mission-stats") || "{}");
}