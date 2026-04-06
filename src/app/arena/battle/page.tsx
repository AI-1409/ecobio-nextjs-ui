'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Rank, CREATURES, PERSONALITIES, PersonalityType, generateRandomPersonality, applyLevelScaling } from "@/lib/database";
import { rollRandomGeneticType } from "@/lib/genetic-types";
import { getVarianceRange, BattleStats } from "@/lib/battle";
import { SimpleCard } from "./CARD_TEMPLATE";
import { BattleCleanSection } from "./BATTLE_CLEAN";

// Imports des fonctions battle
import {
  getEffectiveStats,
  calculateFinalStats,
  createBattleCreature,
  calculateScaledStats,
  generateIndividualStats,
  getRankMultiplier
} from "@/lib/battle";

/* === TYPES SIMPLES === */

interface Disease {
  remainingTurns: number;
  pool: number;
  id: string;
}

/* === INTERFACE PROPRE === */

interface BattleCreature {
  id: string;
  name: string;
  currentHP: number;
  maxHP: number;
  geneticType?: string;
  personality?: PersonalityType;
  position?: number;
  diseases: Disease[];
  radioactiveCharges?: number;
  finalStats: BattleStats;
  level: number;
  creatureId: string;
  hasTriggeredSauvetage?: boolean;
  relative?: boolean;
  grand?: boolean;
  hostile?: boolean;
}

/* === FONCTIONS SIMPLIFIÉES === */

// Fonction simple pour créer une créature aléatoire
const spawnCreatureForBattle = (): BattleCreature => {
  // Générer une créature aléatoire simple
  const rank: Rank = Math.random() < 0.95 ? "E" : Math.random() < 0.98 ? "D" : Math.random() < 0.99 ? "C" : Math.random() < 0.997 ? "B" : "A";
  const personality: PersonalityType = ["agressif", "protecteur", "rapide", "stratège", "précis", "mystérieux"][Math.floor(Math.random() * 6)] as PersonalityType;
  const geneticType = rollRandomGeneticType();
  
  const finalStats = generateIndividualStats(rank as any);
  
  const hp = finalStats.hp;
  
  return {
    id: `enemy-${Math.random().toString(36).substr(2, 9)}`,
    name: `Creature ${geneticType}`,
    creatureId: 'housefly', // pour tests
    geneticType,
    personality,
    finalStats,
    level: 1,
    currentHP: hp,
    maxHP: hp,
    diseases: [],
    radioactiveCharges: 0,
    hasTriggeredSauvetage: false,
    relative: true,
    grand: false,
    hostile: true
  };
};

// Fonction simple pour calculer la distance
const calculateDistance = (_attacker: BattleCreature, _defender: BattleCreature): number => {
  return 1; // Distance simple pour le moment
};

// Fonction simple pour générer HP réaliste
const generateRealisticHP = (stats: any): number => {
  const baseHP = stats.hp || 100;
  const randomVariance = Math.floor(Math.random() * (baseHP * 0.2)) - (baseHP * 0.1);
  return Math.max(1, baseHP + randomVariance);
};

// Fonction simple pour les images de créatures
const getCreatureImage = (creatureId: string, rank: string = "E", geneticType?: string): string => {
  // Pour le moment, retourne une image par défaut
  return "/ecobio-nextjs-ui/creatures/unknown.png";
};

interface BattleState {
  playerTeam: BattleCreature[];
  enemyTeam: BattleCreature[];
  turn: number;
  log: string[];
  winner: "player" | "enemy" | null;
  turnOrder: BattleCreature[];
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
  const [currentAttacker, setCurrentAttacker] = useState<BattleCreature | null>(null);
  const [selectedCreature, setSelectedCreature] = useState<BattleCreature | null>(null);
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

  // Équipe des joueurs depuis localStorage
  const playerTeam = (typeof window !== 'undefined' && localStorage.getItem('battleTeam')) 
    ? JSON.parse(localStorage.getItem('battleTeam') || '[]')
    : [];

  // Création équipe ennemie aléatoire (5 créatures)
  const spawnRandomEnemyTeam = (): BattleCreature[] => {
    const enemies: BattleCreature[] = [];
    for (let i = 1; i <= 5; i++) {
      const creature = spawnCreatureForBattle();
      enemies.push(creature);
    }
    return enemies;
  };

  const enemyTeam = battleState?.enemyTeam || spawnRandomEnemyTeam();

  // Fonction pour initialiser la bataille
  const initializeBattle = () => {
    // Créer les personnages avec les stats
    initializeBattleState(playerTeam, spawnRandomEnemyTeam());
  };

  const initializeBattleState = (
    players: any[], 
    enemies: BattleCreature[]
  ) => {
    const playerCreatures: BattleCreature[] = players.map((c, i) => {
      const stats = getEffectiveStats(c);
      const hp = generateRealisticHP(stats);
      
      return {
        id: c.id,
        name: c.name,
        creatureId: c.creatureId,
        geneticType: c.geneticType || "resilient",
        personality: c.personality || generateRandomPersonality(),
        finalStats: stats,
        level: c.level || c.customStats?.level || 1,
        currentHP: hp,
        maxHP: hp,
        position: i + 1,
        hasTriggeredSauvetage: false,
        radioactiveCharges: 0,
        diseases: []
      };
    });

    // Définir l'ordre de tour en fonction de la vitesse
    const allCreatures = [...playerCreatures, ...enemies];
    const sortedCreatures = allCreatures.sort((a, b) => b.finalStats.speed - a.finalStats.speed);
    
    setBattleState({
      playerTeam: playerCreatures,
      enemyTeam: enemies,
      turn: 1,
      log: ["🎵 Début du combat!"],
      winner: null,
      turnOrder: sortedCreatures,
      currentAttackerIndex: sortedCreatures.findIndex(c => playerCreatures.some(pc => pc.id === c.id))
    });
    
    setCurrentAttacker(sortedCreatures[sortedCreatures.findIndex(c => playerCreatures.some(pc => pc.id === c.id))]);
  };

  // Compter les créatures vivantes
  const playerAlive = battleState?.playerTeam.filter(c => c.currentHP > 0).length || 0;
  const enemyAlive = battleState?.enemyTeam.filter(c => c.currentHP > 0).length || 0;

  // TODO: Implémenter la logique de combat (processTurn, etc.)
  const processTurn = () => {
    if (isProcessing || !battleState) return;
    
    setIsProcessing(true);
    
    // Logique de combat à implémenter...
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
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
              {battleState?.winner ? `Vainqueur: ${battleState.winner === 'player' ? 'Joueur' : 'Ennemi'}` : 'En cours...'}
            </span>
          </div>
        </div>

        {/* Zone de combat */}
        {battleState && (
          <BattleCleanSection 
            battleState={battleState}
            currentAttacker={currentAttacker}
            setSelectedCreature={setSelectedCreature}
            damageNumbers={damageNumbers}
          />
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
              {battleState?.log.map((log, index) => (
                <div key={index} className="text-sm text-gray-300">
                  {log}
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
                  <span className="ml-2 text-cyan-400">🔬 {selectedCreature.geneticType}</span>
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