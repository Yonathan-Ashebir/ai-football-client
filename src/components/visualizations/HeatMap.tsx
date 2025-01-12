import { motion } from 'framer-motion';

interface Position {
  x: number;
  y: number;
  intensity: number;
}

interface Props {
  positions: Position[];
  width: number;
  height: number;
}

export default function HeatMap({ positions, width, height }: Props) {
  const maxIntensity = Math.max(...positions.map(p => p.intensity));

  return (
    <div className="relative" style={{ width, height }}>
      <div className="absolute inset-0 bg-[url('/pitch.svg')] bg-cover bg-center opacity-20" />
      {positions.map((pos, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          className="absolute rounded-full"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: '30px',
            height: '30px',
            transform: 'translate(-50%, -50%)',
            background: `rgba(239, 68, 68, ${pos.intensity / maxIntensity})`,
            filter: 'blur(10px)',
          }}
        />
      ))}
    </div>
  );
}