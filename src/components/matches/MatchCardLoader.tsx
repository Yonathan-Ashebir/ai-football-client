import { motion } from 'framer-motion';

export default function MatchCardLoader() {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-50" />

      {/* Content */}
      <div className="relative space-y-6">
        {/* Date and Time Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
            <div className="w-20 h-4 rounded-md bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
            <div className="w-20 h-4 rounded-md bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
          </div>
        </div>

        {/* Teams Skeleton */}
        <div className="flex items-stretch justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1 text-center space-y-3">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
            <div className="mx-auto w-24 h-6 rounded-md bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center space-y-3">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
            <div className="mx-auto w-24 h-6 rounded-md bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full h-12 rounded-lg bg-gradient-to-r from-primary-100 to-primary-50 animate-pulse" />
      </div>

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 skew-x-12"
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}