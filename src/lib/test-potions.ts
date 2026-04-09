/**
 * Tests du système de potions
 */
import { createPotion, loadDiscoveredRecipes, saveDiscoveredRecipe } from './potions';

console.log("🧪 TESTS DE POTIONS");

// Test 1: Healing simple (herb + mushroom + water)
console.log("\n--- Test 1: Healing Simple ---");
const result1 = createPotion("herb", "mushroom", "water");
console.log(result1);

// Test 2: Energy amplifiée (berry + caffeine_berry + crystal_powder) 
console.log("\n--- Test 2: Energy (mauvais catalyseur) ---");
const result2 = createPotion("berry", "caffeine_berry", "crystal_powder");
console.log(result2);

// Test 3: Energy amplifiée correcte (berry + caffeine_berry + beast_heart)
console.log("\n--- Test 3: Energy Amplifiée ---");
const result3 = createPotion("berry", "caffeine_berry", "beast_heart");
console.log(result3);

// Test 4: Mix healing/energy (ginseng + sacred_herb + honey)
console.log("\n--- Test 4: Mix Healing/Energy ---");
const result4 = createPotion("ginseng", "sacred_herb", "honey");
console.log(result4);

// Test 5: Échec (herb + berry = healing + energy, pas d'effet commun)
console.log("\n--- Test 5: Échec ---");
const result5 = createPotion("herb", "berry", "water");
console.log(result5);

// Test 6: Recette puissante (sacred_herb + ginseng + crystal_powder)
console.log("\n--- Test 6: Potion Épique ---");
const result6 = createPotion("sacred_herb", "ginseng", "crystal_powder");
console.log(result6);

// Test 7: Ingrédients invalides
console.log("\n--- Test 7: Ingrédients invalides ---");
const result7 = createPotion("invalid_plant", "herb", "water");
console.log(result7);

console.log("\n🧪 FIN DES TESTS");