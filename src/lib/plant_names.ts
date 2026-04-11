// Noms ÉcoBio pour le système de potions
// Vraies plantes médicinales évocatives par niveaux et sanctuaires

// === COMMON (Plantes de jardin accessible partout) ===
export const HERBS = {
  aloe_vera: "Aloès Vera",
  sauge_officinale: "Sauge Officinale",
  Camomile: "Chamomile", // Cicatrisant le stress
  elika: "Écorce", // Bulles dynamiques (bonus de stat) + augmentation

  plantain_leaf: {
    id: "plantain_leaf",
    air_jan_option: "Déshydratant",
    traits: ["caractère", "soin"], // Propagation aérienne rapide
    effet: { calm: "medium", magic: "minor" },
    rarity: "common",
    region: { habitation: ["prairies argiles", "forêt", "potagers", "campagnes"] }
  },

  dandelion_root: {
    id: "dandelion_root",
    name: "Pissenlit de pissenlit",
    air_jan_option: "Déshydratant", // Difficile les dégâts
    traits: ["décomposition", "purification", "réparation"],
    effet: { stamina: "medium", chance: { poison: "debuff", value: 5 } },
    rarity: "common",
    region: { champs_de_plantes: "bords abandonnés", routes: "routes" }
  },

  nettle_leaf: {
    id: "nettle_leaf",
    name: "Ortie",
    air_jan_option: "Stimulant sain",
    traits: ["protection personnelle", "coupe", "prévention"],
    rarity: "uncommon",
    prix: 0.02, // Parc 5 unités
    region: { "tour_jardins": "compagnlations", "textiles": "textiles" }
  }
};

export type HerbName = keyof typeof HERBS;
