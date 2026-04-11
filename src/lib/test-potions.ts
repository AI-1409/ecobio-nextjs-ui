/**
 * Tests du système de potions
 */
import { createPotion, PLANTS, SOLVENTS, AMPLIFIERS } from './potions';

console.log("🧪 TESTS DE POTIONS");

// Test 1: Healing simple (aloe_vera + plantain + water)
console.log("\n--- Test 1: Healing Simple ---");
const result1 = createPotion("aloe_vera", "plantain_leaf", "pure_water");
console.log(result1);

// Test 2: Healing medium (calendula + lavender + moonlit_dew)  
console.log("\n--- Test 2: Healing Medium ---");
const result2 = createPotion("calendula", "lavender", "moonlit_dew");
console.log(result2);

// Test 3: Healing high avec amplificateur
console.log("\n--- Test 3: Healing High + Amplificateur ---");
const result3 = createPotion("ginseng_root", "mandrake_root", "dragon_blood", "amber_resin");
console.log(result3);

// Test 4: Legendary avec phoenix ash
console.log("\n--- Test 4: Potion Légendaire ---");
const result4 = createPotion("mandrake_root", "lotus_petal", "dragon_blood", "phoenix_ash");
console.log(result4);

// Test 5: Échec (pas d'effet commun)
console.log("\n--- Test 5: Échec (pas d'effet commun) ---");
// dandelion a healing + luck, chickweed n'a que healing → OK
// Mais aloe_vera (healing only) + chickweed (healing only) → OK aussi
// Essayons avec des effets incompatibles si on en avait
const result5 = createPotion("aloe_vera", "plantain_leaf", "pure_wood"); // wood n'existe pas
console.log(result5);

// Test 6: Ingrédients invalides
console.log("\n--- Test 6: Ingrédients invalides ---");
const result6 = createPotion("invalid_plant", "aloe_vera", "pure_water");
console.log(result6);

// Afficher les données disponibles
console.log("\n📋 Plantes disponibles:", Object.keys(PLANTS));
console.log("📋 Solvants disponibles:", Object.keys(SOLVENTS));
console.log("📋 Amplificateurs disponibles:", Object.keys(AMPLIFIERS));

console.log("\n🧪 FIN DES TESTS");
