import { motion } from 'framer-motion';

interface Player {
  id: string;
  name: string;
  position: [number, number]; // [x, y] as percentages
  number: number;
}

interface Props {
  formation: Player[];
  showNumbers?: boolean;
}

export default function FormationDisplay({ formation, showNumbers = true }: Props) {
  return (
    <div className="relative w-full h-[600px] bg-primary-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pitch-lines.svg')] bg-cover opacity-20" />
      
      {formation.map((player) => (
        <motion.div
          key={player.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute"
          style={{
            left: `${player.position[0]}%`,
            top: `${player.position[1]}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
              {showNumbers && (
                <span className="text-primary-900 font-bold">{player.number}</span>
              )}
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">
                {player.name}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}