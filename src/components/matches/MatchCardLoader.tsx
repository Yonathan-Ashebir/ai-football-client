import {motion} from 'framer-motion';

export default function MatchCardLoader() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-shadow">
      {/* Date and Time Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
          <div className="w-16 h-4 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
          <div className="w-16 h-4 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
        </div>
      </div>

      {/* Teams Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
          <div className="w-24 h-6 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
        </div>
        <div className="w-6 h-4 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
        <div className="flex items-center gap-2">
          <div className="w-24 h-6 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="w-full h-10 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>

      {/* Glowing Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}