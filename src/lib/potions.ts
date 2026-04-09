/**
 * ÉcoBio Simple Potion System
 * Synthèse : 2 plantes + 1 solvant + optionnel 1 amplificateur
 */
  
// ===== PLANTES BASIQUES (Vraies plantes médicinales) =====

const PLANTS = {
  // === COMMON PLANTS (niveau basique) ===
  aloe_vera: {
    id: "aloe_vera",
    name: "Aloès Vera",
    effects: { healing: "low" },
    rarity: "common",
    description: "Gelée naturelle d'aloès, cicatrisation naturelle"
  },
  
  plantain_leaf: {
    id: "plantain_leaf", 
    name: "Feuille de plantain", 
    effects: { healing: "low" },
    rarity: "common",
    description: "Feuille de plantain, actions réparatrices rapides"
  },
  
  chickweed: {
    id: "chickweed", 
    name: "Grande patience", 
    effects: { healing: "low" },
    rarity: "uncommon", 
    description: "Herbes de chemins, aura calmante"
  },
  
  sage_leaf: {
    id: "sage_leaf",
    name: "Feuille de sauge", 
    generator: { hero_level: 1 },
    effects: { training: "weak", luck: "small" },
    power_levels: [10, 25, 50, 100],
    inspiration_level: 1
  } as PersonalityType;
  },
  
  // === UNCOMMON PLANTS (niveau intermédiaire) ===
  calendula: {
    id: "calendula",
    name: "Souci officinale", 
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Fleurs jaunes, puissants anti-inflammatoires"
  },
  
  yarrow_flower: {
    id: "yarrow_flower",
    name: "Fleur de grande achillée", 
    effects: { healing: "medium" },
    rarity: "uncommon",
    description: "Herbes blanches, accélération plaies" 
  },
  
  lavender: {
    id: "lavender",
    name: "Lavande",
    effects: { healing: "medium", magic: "calming" },
    rarity: "uncommon", 
    description: "Fleurs violettes, calme mental et apaisissant"
  },
  
  lillet_root: {
    id: "lillet_root", 
    name: "Lisette longue", 
    effects: { healing: "medium", magic: "rare" },  },
    rarity: "rare", 
    description: "Herbes médicinales natives, concentration alchimie de la plante"
  }
};