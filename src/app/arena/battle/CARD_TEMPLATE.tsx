// CARTE SIMPLE ET PROPRE

interface Creature {
  id: string;
  name: string;
  currentHP: number;
  maxHP: number;
  geneticType?: string;
  personality?: string;
  creatureId?: string;
  finalStats?: any;
}

export function SimpleCard({ creature, isAttacker, onClick, teamColor }: {
  creature: Creature;
  isAttacker?: boolean;
  onClick?: () => void;
  teamColor: "blue" | "red";
}) {
  const colors = teamColor === "blue" 
    ? {
        bg: "from-blue-900/90 to-blue-950",
        border: "border-blue-500/30",
        borderHighlight: "border-blue-500/50",
        hpHigh: "text-green-300",
        hpMed: "text-yellow-300",
        hpLow: "text-red-300"
      }
    : {
        bg: "from-red-900/90 to-red-950",
        border: "border-red-500/30",
        borderHighlight: "border-red-500/50",
        hpHigh: "text-green-300",
        hpMed: "text-yellow-300",
        hpLow: "text-red-300"
      };

  // Safety: Prevent division by zero or undefined
  const safeMaxHP = creature.maxHP || 1;
  const safeCurrentHP = creature.currentHP || 0;
  const hpPercent = safeCurrentHP / safeMaxHP;
  const hpColor = hpPercent > 0.5 ? colors.hpHigh : hpPercent > 0.25 ? colors.hpMed : colors.hpLow;

  console.log("[SimpleCard] Rendering creature:", {
    id: creature.id,
    name: creature.name,
    currentHP: creature.currentHP,
    maxHP: creature.maxHP,
    hpPercent,
    finalStats: creature.finalStats
  });

  return (
    <div
      onClick={onClick}
      className={`relative bg-gradient-to-br ${colors.bg} rounded-xl p-3 cursor-pointer transition-all hover:scale-105 shadow-lg border-2 ${
        creature.currentHP <= 0 
          ? "opacity-40 grayscale " + colors.border
          : isAttacker 
            ? "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
            : colors.border
      }`}
    >
      {/* Header: Name & HP */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-white truncate pr-2">
          {creature.name}
        </span>
        <span className={`text-xs font-bold ${hpColor}`}>
          {creature.currentHP}/{creature.maxHP}
        </span>
      </div>

      {/* Genetic Type */}
      {creature.geneticType && (
        <div className="mb-2">
          <span className="text-xs text-cyan-400 capitalize">
            🔬 {creature.geneticType}
          </span>
        </div>
      )}

      {/* Personality */}
      {creature.personality && (
        <div className="mb-2">
          <span className="text-xs text-purple-400 capitalize">
            {creature.personality}
          </span>
        </div>
      )}

      {/* Stats compact */}
      <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
        <div>ATK: <span className="text-white font-semibold">{creature.finalStats?.attack || 0}</span></div>
        <div>DEF: <span className="text-white font-semibold">{creature.finalStats?.defense || 0}</span></div>
        <div>VIT: <span className="text-white font-semibold">{creature.finalStats?.speed || 0}</span></div>
        <div>CRIT: <span className="text-white font-semibold">{creature.finalStats?.crit || 0}%</span></div>
      </div>
    </div>
  );
}
