// CARTE SIMPLE ET PROPRE

interface Creature {
  id: string;
  name: string;
  currentHP: number;
  maxHP: number;
  geneticType?: string;
  personality?: string;
  position?: number;
  diseases?: any[];
  radioactiveCharges?: number;
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
        border: teamColor === "blue" ? "border-blue-500/30" : "border-red-500/30",
        badgeBg: "bg-blue-600/30",
        badgeText: "text-blue-300",
        borderT: "border-blue-600/30"
      }
    : {
        bg: "from-red-900/90 to-red-950",
        border: "border-red-500/30",
        badgeBg: "bg-red-600/30", 
        badgeText: "text-red-300",
        borderT: "border-red-600/30"
      };

  return (
    <div
      onClick={onClick}
      className={`relative bg-gradient-to-br ${colors.bg} rounded-xl p-2.5 cursor-pointer transition-all hover:scale-105 shadow-lg border-2 ${
        creature.currentHP <= 0 
          ? "opacity-40 grayscale " + colors.border
          : isAttacker 
            ? "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
            : colors.border
      }`}
    >
      {/* Dead overlay */}
      {creature.currentHP <= 0 && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
          <span className="text-xl">💀</span>
        </div>
      )}

      {/* Position */}
      <div className="absolute -top-1 -left-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded-full font-bold">
        #{creature.position}
      </div>

      {/* Attacker */}
      {isAttacker && creature.currentHP > 0 && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-lg animate-[pulse_1s_ease-in-out_infinite]">
          JOUE
        </div>
      )}

      {/* Diseases */}
      {creature.diseases && creature.diseases.length > 0 && (
        <div className="absolute top-6 -right-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded-full font-bold shadow-lg">
          ☠️ {creature.diseases.length}
        </div>
      )}

      {/* Content */}
      <div className="flex items-center gap-2">
        <img
          src="/ecobio-nextjs-ui/creatures/unknown.png"
          alt={creature.name}
          className={`w-14 h-14 object-contain ${isAttacker && creature.currentHP > 0 ? "animate-[pulse_1s_ease-in-out_infinite]" : ""}`}
        />
        
        <div className="flex-1">
          <div className="text-xs text-white font-bold truncate">{creature.name}</div>
          
          {/* Personality */}
          {creature.personality && (
            <div className="text-xs text-gray-300 mt-0.5">
              {creature.personality}
            </div>
          )}

          {/* HP */}
          <div className="text-xs text-gray-300 mt-0.5">
            <span className={`${creature.currentHP / creature.maxHP > 0.5 ? "text-green-400" : creature.currentHP / creature.maxHP > 0.25 ? "text-orange-400" : "text-red-400"}`}>
              {creature.currentHP}/{creature.maxHP}
            </span>
          </div>

          {/* Type */}
          <div className="text-xs text-gray-300 mt-0.5">
            <span className="text-cyan-400 capitalize">🔬 {creature.geneticType || 'unknown'}</span>
          </div>

          {/* Radioactive */}
          {creature.radioactiveCharges && creature.radioactiveCharges > 0 && (
            <div className="text-xs mt-0.5">
              <span className="text-green-400 font-bold">☢️ {creature.radioactiveCharges}c</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom badges */}
      <div className={`mt-1.5 pt-1.5 border-t ${colors.borderT}`}>
        <div className="flex gap-1">
          <div className={`w-6 h-6 ${colors.badgeBg} rounded border flex items-center justify-center ${colors.badgeText} text-xs`}>
            {teamColor === "blue" ? "+" : "-"}
          </div>
          <div className={`w-6 h-6 ${colors.badgeBg} rounded border flex items-center justify-center ${colors.badgeText} text-xs`}>
            "-"
          </div>
          {creature.radioactiveCharges && creature.radioactiveCharges > 0 && (
            <div className="w-6 h-6 bg-green-600/30 rounded border border-green-400/50 flex items-center justify-center text-green-300 text-xs font-bold">
              ☢️
            </div>
          )}
        </div>
      </div>
    </div>
  );
}