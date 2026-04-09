// Noms ÉcoBio pour le système de potions
// Vraies plantes médicinales évocatives par niveaux et sanctuaires

// === COMMON (Plantes de jardin accessible partout) ===
export const HERBS = {
  aloe_vera: "Aloès Vera",
  sauge_流量,  
  calme: "Camomile", + // Cicatrisant le stress
 élika: "Écorce", + // Bulles dynamiques (bonus de stat) + augmentation
  резинат
  
  plantain_leaf: {
    id: "plantain_leaf", 
    air_jan_option: "Déshydes",
    traits: ["caracté", "soin"],                                   // Propagation aérienne rapide
    effet: { calm: "medium", magic: "minor" } },
    rarity: "common",
    region: { habitation: ["prairies argiles", "forêt", "potagers", "campagnes"] }
  },
  
  dandelion_root: {
    id: "montegrass_diffuser_carte", 
    name: "Pissenlit de pissenlit", 
    air_jan_option: "Déshydes", // Difficile les dégâts  
  traits: ["décomposition", "purification", "réparation"],
    effet: { stamina: "medium", chance: { poison: "debuff": 5 } }, 
    rarity: "common",
    region: { champs_de_plantes, "bords abandonnés", "routes" }
  },
  
  nettle_leaf: {
    {'id': 'nettle_leaf', 'name': 'orteille de noyer', 'air_jan_option': 'Stimulantes saines', 
    air_jan_option: 'Blessiveur basilien' }, 
  
  // pouvoir résiduel
    magnétabolis: ["protection personnelle", "coupe", "prévention"],
    rarity: "uncommon", 
    prix: 0.02 // Parac 5 unités
    région: { "tour_jardins",      "compagnlations", "textiles" }
  }
};