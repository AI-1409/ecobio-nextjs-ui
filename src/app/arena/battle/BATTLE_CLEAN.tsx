import { SimpleCard } from "./CARD_TEMPLATE";

// Helper to transform BattleCreature to SimpleCard interface
// Added safety checks and error logging
const transformBattleCreature = (creature: any, index: number, team: string): any => {
  try {
    // Safety check: if creature is null/undefined
    if (!creature) {
      console.error(`[BATTLE_CLEAN] creature at index ${index} (${team} team) is null/undefined`, creature);
      return {
        id: `missing-${index}`,
        name: "DEBUG: Missing Creature",
        currentHP: 0,
        maxHP: 100,
        finalStats: { attack: 0, defense: 0, speed: 0, crit: 0 }
      };
    }

    // Safety check: if creature.stats is null/undefined
    if (!creature.stats) {
      console.error(`[BATTLE_CLEAN] creature ${creature.id || index} (${team} team) has no stats property`, creature);
      return {
        id: creature.id || `no-stats-${index}`,
        name: creature.name || "DEBUG: No Stats",
        currentHP: creature.currentHP || 0,
        maxHP: 100,
        finalStats: { attack: 0, defense: 0, speed: 0, crit: 0 },
        geneticType: (creature as any).geneticType,
        personality: creature.personality
      };
    }

    // Normal transformation with safe fallbacks
    const result = {
      id: creature.id,
      name: creature.name,
      currentHP: creature.currentHP ?? creature.stats?.hp ?? 100,
      maxHP: creature.maxHP ?? creature.stats?.hp ?? 100,
      geneticType: (creature as any).geneticType,
      personality: creature.personality,
      finalStats: creature.stats || { attack: 0, defense: 0, speed: 0, crit: 0 }
    };

    return result;
  } catch (error) {
    console.error(`[BATTLE_CLEAN] Error transforming creature at index ${index} (${team} team):`, error, creature);
    // Return a fallback to prevent crashes
    return {
      id: `error-${index}`,
      name: "DEBUG: Error",
      currentHP: 0,
      maxHP: 100,
      finalStats: { attack: 0, defense: 0, speed: 0, crit: 0 }
    };
  }
};

export function BattleCleanSection({ battleState, currentAttacker, setSelectedCreature, damageNumbers }: any) {
  try {
    // Safety check: battleState structure
    if (!battleState) {
      console.error("[BATTLE_CLEAN] battleState is null/undefined", battleState);
      return <div className="text-red-500">Error: battleState is missing</div>;
    }

    // Safety check: playerTeam
    const playerTeamCreatures = Array.isArray(battleState.playerTeam)
      ? battleState.playerTeam
      : battleState.playerTeam?.creatures || [];

    // Safety check: enemyTeam
    const enemyTeamCreatures = Array.isArray(battleState.enemyTeam)
      ? battleState.enemyTeam
      : battleState.enemyTeam?.creatures || [];

    console.log("[BATTLE_CLEAN] Rendering with:", {
      playerCount: playerTeamCreatures.length,
      enemyCount: enemyTeamCreatures.length,
      playerTeam: playerTeamCreatures,
      enemyTeam: enemyTeamCreatures
    });

    return (
      <div className="grid grid-cols-5 gap-x-4 mb-4">
        {/* Player Team */}
        <div className="col-span-2 flex flex-col gap-1.5">
          {playerTeamCreatures.map((creature: any, index: number) => {
            const isAttacker = currentAttacker?.id === creature.id;
            const transformedCreature = transformBattleCreature(creature, index, "player");

            return (
              <SimpleCard
                key={creature.id || `player-${index}`}
                creature={transformedCreature}
                isAttacker={isAttacker}
                onClick={() => !battleState.winner && setSelectedCreature(creature)}
                teamColor="blue"
              />
            );
          })}
        </div>

        {/* VS Separator */}
        <div className="col-span-1 flex items-center justify-center">
          <div className="text-3xl animate-[pulse_2s_ease-in-out_infinite]">⚔️</div>
        </div>

        {/* Enemy Team */}
        <div className="col-span-2 flex flex-col gap-1.5">
          {enemyTeamCreatures.map((creature: any, index: number) => {
            const isAttacker = currentAttacker?.id === creature.id;
            const transformedCreature = transformBattleCreature(creature, index, "enemy");

            return (
              <SimpleCard
                key={creature.id || `enemy-${index}`}
                creature={transformedCreature}
                isAttacker={isAttacker}
                onClick={() => !battleState.winner && setSelectedCreature(creature)}
                teamColor="red"
              />
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error("[BATTLE_CLEAN] Fatal error in BattleCleanSection:", error, { battleState, currentAttacker });
    return <div className="text-red-500 p-4">Error rendering battle section - check console</div>;
  }
}
