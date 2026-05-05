'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Rank, CREATURES, PERSONALITIES, PersonalityType, generateRandomPersonality, applyLevelScaling } from "@/lib/database";
import { rollRandomGeneticType } from "@/lib/genetic-types";
import { getVarianceRange, BattleStats, generateIndividualStats } from "@/lib/battle";
import { SimpleCard } from "./CARD_TEMPLATE";
import { BattleCleanSection } from "./BATTLE_CLEAN";
import { getGeneticType } from "@/lib/genetic-types";

// Imports des fonctions battle
import {
  getEffectiveStats,
  calculateFinalStats,
  createBattleCreature,
  calculateScaledStats,
  getRankMultiplier,
  BattleTeam,
  BattleElement,
  BattleLogEntry,
  BattleCreature,
  tickCooldownsAndBuffs,
  tickStatusEffects
} from "@/lib/battle";
import {
  executeCreatureTurn,
  isTeamBattleOver,
  getTeamBattleWinner,
  createBattleTeam,
  getAllBattleElements
} from "@/lib/battle-multi";

/* === TYPES SIMPLES === */

interface Disease {
  remainingTurns: number;
  pool: number;
  id: string;
}

/* === INTERFACE PROPRE === */

interface ExtendedBattleCreature extends BattleCreature {
  maxHP: number;
  diseases: Disease[];
  radioactiveCharges?: number;
  finalStats: BattleStats;
  level: number;
  creatureId: string;
  geneticType?: string;
  hasTriggeredSauvetage?: boolean;
  relative?: boolean;
  grand?: boolean;
  hostile?: boolean;
}

/* === FONCTIONS SIMPLIFIÉES === */

// Fonction améliorée pour créer une créature aléatoire
const spawnCreatureForBattle = (): BattleCreature => {
  // Liste des créatures disponibles
  const creatureIds = ["ravaryn", "polyops", "gravaille", "maworm", "cornegrive", "oxydrabe", "verdogre"];
  const creatureId = creatureIds[Math.floor(Math.random() * creatureIds.length)];
  const baseCreature = CREATURES[creatureId];

  // Safety check: creature exists
  if (!baseCreature) {
    console.error(`[spawnCreature] Creature not found for ID: ${creatureId}`, {
      creatureId,
      availableIds: Object.keys(CREATURES)
    });

    // Fallback: use first available creature
    const fallbackId = Object.keys(CREATURES)[0];
    if (!fallbackId || !CREATURES[fallbackId]) {
      throw new Error("No valid creatures found in CREATURES database!");
    }
    return spawnCreatureForBattleForId(fallbackId);
  }

  return spawnCreatureForBattleForId(creatureId);
};

// Helper to spawn specific creature by ID
const spawnCreatureForBattleForId = (creatureId: string): BattleCreature => {
  const baseCreature = CREATURES[creatureId];

  if (!baseCreature) {
    console.error(`[spawnCreature] Creature not found for ID: ${creatureId}`);
    throw new Error(`Creature ID ${creatureId} not found in CREATURES`);
  }

  // RNG rang avec distribution réaliste
  const rand = Math.random();
  let rank: Rank;
  if (rand < 0.4) rank = "E";
  else if (rand < 0.7) rank = "D";
  else if (rand < 0.88) rank = "C";
  else if (rand < 0.97) rank = "B";
  else if (rand < 0.995) rank = "A";
  else if (rand < 0.999) rank = "S";
  else rank = "S+";

  // RNG personnalité
  const personalities: PersonalityType[] = ["agressif", "protecteur", "rapide", "stratège", "précis", "mystérieux"];
  const personality = personalities[Math.floor(Math.random() * personalities.length)];

  // RNG type génétique
  const geneticType = rollRandomGeneticType();

  // Génération de stats avec variance
  const finalStats = generateIndividualStats(baseCreature.baseStats, rank);
  const hp = finalStats.hp;

  // Création du BattleCreature
  const battleCreature = createBattleCreature(
    baseCreature,
    finalStats,
    baseCreature.name,
    [],
    0
  );

  battleCreature.currentHP = hp;
  (battleCreature as any).creatureId = creatureId;
  (battleCreature as any).geneticType = geneticType;
  (battleCreature as any).level = 1;

  return battleCreature;
};

// Fonction simple pour calculer la distance
const calculateDistance = (_attacker: BattleCreature, _defender: BattleCreature): number => {
  return 1;
};

// Fonction simple pour générer HP réaliste
const generateRealisticHP = (stats: any): number => {
  const baseHP = stats.hp || 100;
  const randomVariance = Math.floor(Math.random() * (baseHP * 0.2)) - (baseHP * 0.1);
  return Math.max(1, baseHP + randomVariance);
};

// Fonction simple pour les images de créatures
const getCreatureImage = (creatureId: string, rank: string = "E", geneticType?: string): string => {
  if (geneticType && creatureId === "ravaryn") {
    const normalizedType = geneticType.toLowerCase().replace("é", "e").replace("è", "e");
    return `/ecobio-nextjs-ui/images/creatures/ravaryn_${normalizedType}_e.png`;
  }
  return `/ecobio-nextjs-ui/images/creatures/unknown.png`;
};

interface BattleState {
  playerTeam: BattleTeam;
  enemyTeam: BattleTeam;
  turn: number;
  log: BattleLogEntry[];
  winner: "player" | "enemy" | "draw" | null;
  turnOrder: BattleElement[];
  currentAttackerIndex: number;
}

interface DamageNumber {
  id: string;
  damage: number;
}

/* === FONCTIONS UTILITAIRES === */

const getPersonalityEmoji = (personality: PersonalityType): string => {
  const emojis: Record<PersonalityType, string> = {
    agressif: "🦁",
    protecteur: "🛡️", 
    rapide: "⚡",
    stratège: "♟️",
    précis: "🎯",
    mystérieux: "?"
  };
  return emojis[personality] || "?";
};

/* === HOOKS === */

function useBattleState() {
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [currentAttacker, setCurrentAttacker] = useState<ExtendedBattleCreature | null>(null);
  const [selectedCreature, setSelectedCreature] = useState<ExtendedBattleCreature | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  return {
    battleState,
    setBattleState,
    currentAttacker,
    setCurrentAttacker,
    selectedCreature,
    setSelectedCreature,
    isProcessing,
    setIsProcessing,
    damageNumbers,
    setDamageNumbers,
    showLogs,
    setShowLogs
  };
}

/* === COMPOSANT PRINCIPAL === */

export default function BattlePage() {
  const {
    battleState,
    setBattleState,
    currentAttacker,
    setCurrentAttacker,
    selectedCreature,
    setSelectedCreature,
    isProcessing,
    setIsProcessing,
    damageNumbers,
    setDamageNumbers,
    showLogs,
    setShowLogs
  } = useBattleState();

  // Initialiser la bataille
  useEffect(() => {
    if (!battleState) {
      initializeBattle();
    }
  }, []);

  // IDs de l'équipe depuis sessionStorage, puis charger les créatures complètes
  const getSelectedCreatures = () => {
    if (typeof window === 'undefined') return [];
    
    const selectedIds = JSON.parse(sessionStorage.getItem('battle-team') || '[]');
    const collection = JSON.parse(
      typeof localStorage !== 'undefined' 
        ? localStorage.getItem('ecobio-collection') || '[]'
        : '[]'
    );
    
    return selectedIds
      .map((id: string) => collection.find((c: any) => c.id === id))
      .filter(Boolean);
  };

  // Création équipe ennemie aléatoire (5 créatures)
  const spawnRandomEnemyTeam = (): BattleCreature[] => {
    const enemies: BattleCreature[] = [];
    for (let i = 1; i <= 5; i++) {
      const creature = spawnCreatureForBattle();
      enemies.push(creature);
    }
    return enemies;
  };

  // Fonction pour initialiser la bataille
  const initializeBattle = () => {
    const selectedCreatureObjects = getSelectedCreatures();
    initializeBattleState(selectedCreatureObjects, spawnRandomEnemyTeam());
  };

  const initializeBattleState = (
    playerObjects: any[], 
    enemyObjects: BattleCreature[]
  ) => {
    // Créer les configurations des équipes
    const playerConfigs = playerObjects.map((c) => ({
      creatureTemplate: {
        id: c.id,
        name: c.name,
        rank: c.rank || c.finalStats?.rank || "E" as Rank,
        baseStats: c.baseStats || c.finalStats || {
          hp: c.customStats?.hp || 100,
          attack: c.customStats?.attack || 10,
          defense: c.customStats?.defense || 10,
          speed: c.customStats?.speed || 10,
          crit: c.customStats?.crit || 5
        },
        desc: `Créature de combat: ${c.name}`,
        creatureId: c.creatureId || c.creatureId || "unknown",
        geneticType: c.geneticType || "resilient",
        personality: c.personality || generateRandomPersonality(),
        level: c.level || c.customStats?.level || 1,
        traits: c.traits || []
      },
      stats: getEffectiveStats(c),
      name: c.name,
      traits: c.traits || []
    }));
    
    const enemyConfigs = enemyObjects.map((creature, i) => {
      const creatureAny = creature as any;
      return {
        creatureTemplate: {
          id: creature.id,
          name: creature.name,
          rank: (creature.stats?.rank || "E") as Rank,
          baseStats: creature.stats,
          desc: `Ennemi: ${creature.name}`,
          creatureId: creatureAny.creatureId || "unknown",
          geneticType: creatureAny.geneticType || "resilient",
          personality: creatureAny.personality || generateRandomPersonality(),
          level: creatureAny.level || 1,
          traits: []
        },
        stats: creature.stats,
        name: creature.name,
        traits: []
      };
    });
    
    const playerTeam = createBattleTeam(playerConfigs, "player");
    const enemyTeam = createBattleTeam(enemyConfigs, "enemy");
    
    // Ajouter les propriétés de compatibilité pour les créatures
    [...playerTeam.creatures, ...enemyTeam.creatures].forEach(creature => {
      const isPlayer = playerTeam.creatures.includes(creature);
      const originalObject = isPlayer ? 
        playerObjects.find(c => c.id === creature.id) :
        enemyObjects.find(c => c.id === creature.id);
      
      if (originalObject) {
        Object.assign(creature, {
          creatureId: originalObject.creatureId || "unknown",
          geneticType: originalObject.geneticType || "resilient",
          level: originalObject.level || originalObject.customStats?.level || 1,
          maxHP: creature.stats.hp,
          finalStats: creature.stats,
          hasTriggeredSauvetage: false,
          radioactiveCharges: 0,
          diseases: []
        });
      }
    });
    
    // Définir l'ordre de tour avec tous les éléments
    const allElements = getAllBattleElements(playerTeam, enemyTeam);
    
    setBattleState({
      playerTeam,
      enemyTeam,
      turn: 1,
      log: [{ text: "⚔️ Début du combat!", type: "info" }],
      winner: null,
      turnOrder: allElements,
      currentAttackerIndex: allElements.findIndex(el => el.team === "player")
    });
    
    // Définir le premier attaquant
    const firstAttacker = allElements[allElements.findIndex(el => el.team === "player")];
    setCurrentAttacker(firstAttacker?.creature as ExtendedBattleCreature || null);
  };

  // Compter les créatures vivantes
  const playerAlive = battleState?.playerTeam.creatures.filter(c => c.currentHP > 0).length || 0;
  const enemyAlive = battleState?.enemyTeam.creatures.filter(c => c.currentHP > 0).length || 0;

  // Exécuter un tour de combat
  const processTurn = () => {
    if (isProcessing || !battleState || battleState.winner) return;
    
    setIsProcessing(true);
    
    try {
      const currentElement = battleState.turnOrder[battleState.currentAttackerIndex];
      
      if (!currentElement || !currentElement.creature || currentElement.creature.currentHP <= 0) {
        advanceTurn();
        return;
      }

      const logEntries = executeCreatureTurn(
        currentElement.creature,
        battleState.playerTeam,
        battleState.enemyTeam,
        currentElement.team === "enemy",
        5
      );
      
      const updatedLog = [...battleState.log, ...logEntries];
      
      const updatedPlayerCreatures = battleState.playerTeam.creatures.map(creature => {
        tickCooldownsAndBuffs(creature);
        return creature;
      });
      const updatedEnemyCreatures = battleState.enemyTeam.creatures.map(creature => {
        tickCooldownsAndBuffs(creature);
        return creature;
      });
      
      const updatedPlayerTeam = { ...battleState.playerTeam, creatures: updatedPlayerCreatures };
      const updatedEnemyTeam = { ...battleState.enemyTeam, creatures: updatedEnemyCreatures };
      
      updatedPlayerCreatures.forEach(creature => tickStatusEffects(creature, updatedLog));
      updatedEnemyCreatures.forEach(creature => tickStatusEffects(creature, updatedLog));
      
      const battleOver = isTeamBattleOver(updatedPlayerTeam, updatedEnemyTeam);
      const winner = battleOver ? getTeamBattleWinner(updatedPlayerTeam, updatedEnemyTeam) : null;
      
      setBattleState({
        ...battleState,
        playerTeam: updatedPlayerTeam,
        enemyTeam: updatedEnemyTeam,
        log: updatedLog,
        winner
      });
      
      if (!battleOver) {
        setTimeout(() => {
          advanceTurn();
        }, 1500);
      } else {
        setIsProcessing(false);
      }
      
    } catch (error) {
      console.error("Erreur lors du tour:", error);
      setIsProcessing(false);
    }
  };
  
  const advanceTurn = () => {
    if (!battleState) return;
    
    let nextIndex = (battleState.currentAttackerIndex + 1) % battleState.turnOrder.length;
    let attempts = 0;
    
    while (attempts < battleState.turnOrder.length) {
      const element = battleState.turnOrder[nextIndex];
      if (element?.creature?.currentHP > 0) {
        const isNewRound = nextIndex < battleState.currentAttackerIndex;
        
        setBattleState({
          ...battleState,
          turn: isNewRound ? battleState.turn + 1 : battleState.turn,
          currentAttackerIndex: nextIndex
        });
        
        const newAttacker = element.creature as ExtendedBattleCreature;
        setCurrentAttacker(newAttacker);
        break;
      }
      nextIndex = (nextIndex + 1) % battleState.turnOrder.length;
      attempts++;
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/arena" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Retour à l'arène
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ⚔️ Arène de Combat ⚔️
          </h1>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            📜 {showLogs ? 'Cacher' : 'Voir'} les logs
          </button>
        </div>

        {/* État de la bataille */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-purple-500/30">
          <div className="flex justify-between items-center">
            <span className="text-blue-400 font-bold">
              Tour {battleState?.turn || 1}
            </span>
            <div className="flex gap-4">
              <span className="text-blue-400 text-sm">
                Joueur: {playerAlive}/5 vivants
              </span>
              <span className="text-red-400 text-sm">
                Ennemi: {enemyAlive}/5 vivants
              </span>
            </div>
            <span className="text-yellow-400 font-bold">
              {battleState?.winner ? 
                (battleState.winner === 'player' ? '🏆 Victoire Joueur!' : 
                 battleState.winner === 'enemy' ? '💀 Victoire Ennemi!' : 
                 '🤝 Match Nul!') : 
                '⚔️ En cours...'
              }
            </span>
          </div>
        </div>

        {/* Zone de combat */}
        {battleState && (
          (() => {
            console.log("[page.tsx] About to render BattleCleanSection with:", {
              hasBattleState: !!battleState,
              playerTeam: battleState.playerTeam,
              playerTeamCreatures: battleState.playerTeam?.creatures,
              enemyTeam: battleState.enemyTeam,
              enemyTeamCreatures: battleState.enemyTeam?.creatures,
              playerTeamType: typeof battleState.playerTeam,
              playerTeamCreaturesType: typeof battleState.playerTeam?.creatures
            });
            return (
              <BattleCleanSection
                battleState={{
                  ...battleState,
                  playerTeam: battleState.playerTeam,
                  enemyTeam: battleState.enemyTeam
                }}
                currentAttacker={currentAttacker}
                setSelectedCreature={setSelectedCreature}
                damageNumbers={damageNumbers}
              />
            );
          })()
        )}

        {/* Boutons de contrôle */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={processTurn}
            disabled={isProcessing || !battleState || battleState.winner !== null}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? '⚡ En cours...' : '🗡️ ATTAQUER'}
          </button>
          
          <button
            onClick={initializeBattle}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all"
          >
            🔄 Nouvelle Bataille
          </button>
        </div>

        {/* Logs de combat */}
        {showLogs && (
          <div className="mt-6 p-4 bg-black/50 rounded-xl max-h-60 overflow-y-auto">
            <h3 className="text-yellow-400 font-bold mb-2">⚔️ Journal de Combat</h3>
            <div className="space-y-1">
              {battleState?.log.map((logEntry, index) => (
                <div key={index} className="text-sm text-gray-300">
                  {typeof logEntry === 'string' ? logEntry : logEntry.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de détails de créature */}
        {selectedCreature && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCreature(null)}
          >
            <div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-purple-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Détails de {selectedCreature.name}</h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Type Génétique:</span>
                  <span className="ml-2 text-cyan-400">
                    {(() => {
                      const gt = getGeneticType((selectedCreature.geneticType || "resilient") as any);
                      return gt ? `${gt.emoji} ${gt.name}` : (selectedCreature.geneticType || "unknown");
                    })()}
                  </span>
                </div>
                
                {selectedCreature.personality && (
                  <div>
                    <span className="text-gray-400">Personnalité:</span>
                    <span className="ml-2 text-purple-400">
                      {getPersonalityEmoji(selectedCreature.personality)} {PERSONALITIES[selectedCreature.personality]?.name}
                    </span>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-400">HP:</span>
                  <span className={`ml-2 ${selectedCreature.currentHP / selectedCreature.maxHP > 0.5 ? 'text-green-400' : selectedCreature.currentHP / selectedCreature.maxHP > 0.25 ? 'text-orange-400' : 'text-red-400'}`}>
                    {selectedCreature.currentHP}/{selectedCreature.maxHP}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400">Stats:</span>
                  <div className="ml-2 text-gray-300">
                    <div>ATK: {selectedCreature.finalStats.attack}</div>
                    <div>DEF: {selectedCreature.finalStats.defense}</div>
                    <div>VIT: {selectedCreature.finalStats.speed}</div>
                    <div>CRIT: {selectedCreature.finalStats.crit}%</div>
                  </div>
                </div>

                {selectedCreature.radioactiveCharges && selectedCreature.radioactiveCharges > 0 && (
                  <div className="mt-3 p-3 bg-green-900/30 rounded-lg border border-green-500/50">
                    <span className="text-green-400 font-bold">
                      ☢️ Radioactif: {selectedCreature.radioactiveCharges} charges
                    </span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSelectedCreature(null)}
                className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
