/**
 * ÉcoBio Plant Database
 * Vraies plantes médicinales pour le système de potions
 */
  
export const HEALING_PLANTS = {
  // === LOW RARITY (Common plants) ===
  aloe_vera: {
    id: "aloe_vera",
    name: "Aloès vera",
    effects: { healing: "low" },
    rarity: "common",
    description: "Plante grassouche, gelée cicatrisante naturelle"
  },
  
  comfrey_root: {
    id: "comfrey_root",
    name: "Consoude de grande ortie",
    effects: { healing: "low" },
    rarity: "common",
    description: "Racine de consoude, accélérateur de cicatrisation"
  },
  
  chickweed: {
    id: "chickweed",
    name: "Grande patience",
    effects: { healing: "low" },
    rarity: "common",
    description: "Plante des chemins, texture onctueuse anti-irritante"
  },
  
  plantain_leaf: {
    id: "plantain_leaf",
    name: "Feuille de plantain",
    effects: { healing: "low" },
    rarity: "common",
    description: "Feuille arbre, pouvoir calmant et adoucissant"
  },
  
  // === MEDIUM RARITY ===
  calendula: {
    id: "calendula",
    name: "Souci officinale",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Fleurs de calendula, propriétés anti-inflammatoires puissantes"
  },
  
  yarrow_root: {
    id: "yarrow_root",
    name: "Racine de grande achillée",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Purifie le sang, réduction toxique"
  },
  
  echinacea_purpurea: {
    id: "echinacea_purpurea",
    name: "Échinacée",
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Plante immunostimulante, boost système immunitaire"
  },
  
  ginseng_root: {
    id: "ginseng_root",
    name: "Ginseng panax",
    effects: { healing: "high" },
    rarity: "rare",
    description: "Racine adaptogène, vitalité et endurance exceptionnelles"
  },
  
  // === RARE & LEGENDARY ===
  mandrake_root: {
    id: "mandrake_root",
    name: "Mandragore",
    effects: { healing: "high" },
    rarity: "rare",
    description: "Racine toxique transformée, régénération cellulaire profonde"
  },
  
  dragon_blood: {
    id: "dragon_blood",
    name: "Sang de dragon",
    effects: { healing: "high" },
    rarity: "legendary",
    description: "Sacrée de créature légendaire, régénération quasi-miraculeuse"
  },
  
  lotus_petal: {
    id: "lotus_petal",
    name: "Pétale de lotus sacré",
    effects: { healing: "legendary" },
    rarity: "legendary",
    description: "Fleur divine, restauration presque instantanée"
  }
};