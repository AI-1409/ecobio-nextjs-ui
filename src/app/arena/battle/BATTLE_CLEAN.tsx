import { SimpleCard } from "./CARD_TEMPLATE";

// Helper to transform BattleCreature to SimpleCard interface
const transformBattleCreature = (creature: any): any => ({
  id: creature.id,
  name: creature.name,
  currentHP: creature.currentHP || creature.stats?.hp || 100,
  maxHP: creature.maxHP || creature.stats?.hp || 100,
  geneticType: (creature as any).geneticType,
  personality: creature.personality || (creature.baseCreature as any)?.personality,
  finalStats: creature.stats || creature.finalStats || {}
});

export function BattleCleanSection({ battleState, currentAttacker, setSelectedCreature, damageNumbers }: any) {
  return (
    <div className="grid grid-cols-5 gap-x-4 mb-4">
      {/* Player Team */}
      <div className="col-span-2 flex flex-col gap-1.5">
        {[...battleState.playerTeam]
          .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
          .map((creature: any) => {
            const isAttacker = currentAttacker?.id === creature.id;
            const transformedCreature = transformBattleCreature(creature);

            return (
              <SimpleCard
                key={creature.id}
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
        {[...battleState.enemyTeam]
          .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
          .map((creature: any) => {
            const isAttacker = currentAttacker?.id === creature.id;
            const transformedCreature = transformBattleCreature(creature);

            return (
              <SimpleCard
                key={creature.id}
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
}