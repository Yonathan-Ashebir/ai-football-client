import {motion} from 'framer-motion';
import {Database} from 'lucide-react';

export default function DatasetCardSkeleton() {
  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-sm overflow-hidden border border-purple-100"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Database className="w-5 h-5 text-purple-200"/>
            </div>
            <div className="space-y-2">
              {/* Dataset Name Skeleton */}
              <div className="h-6 w-32 bg-purple-100/50 rounded-lg animate-pulse"/>
              {/* Dataset Info Skeleton */}
              <div className="h-4 w-24 bg-purple-100/30 rounded-lg animate-pulse"/>
            </div>
          </div>
          {/* Upload Time Skeleton */}
          <div className="h-6 w-28 bg-purple-100/30 rounded-full animate-pulse"/>
        </div>

        {/* Columns Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {/* Columns Icon Skeleton */}
              <div className="w-4 h-4 bg-purple-100/50 rounded animate-pulse"/>
              {/* Columns Text Skeleton */}
              <div className="h-4 w-24 bg-purple-100/50 rounded animate-pulse"/>
            </div>
          </div>
          {/* Column Tags Skeleton */}
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-6 w-16 bg-purple-100/30 rounded-lg animate-pulse"
                style={{
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
            {/* More Columns Button Skeleton */}
            <div className="h-6 w-20 bg-purple-100/50 rounded-lg animate-pulse"/>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="px-6 py-4 bg-gradient-to-b from-white to-purple-50 border-t border-purple-100">
        <div className="flex items-center justify-between">
          {/* Action Buttons Skeleton */}
          <div className="flex items-center space-x-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="w-9 h-9 bg-purple-100/30 rounded-lg animate-pulse"
                style={{
                  animationDelay: `${i * 150}ms`
                }}
              />
            ))}
          </div>
          {/* Delete Button Skeleton */}
          <div className="w-9 h-9 bg-red-100/30 rounded-lg animate-pulse"/>
        </div>
      </div>

      {/* Loading Overlay Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
           style={{
             backgroundSize: '200% 100%',
             animation: 'shimmer 2s infinite linear'
           }}
      />
      {/*@ts-ignore*/}
      <style jsx>{`
          @keyframes shimmer {
              0% {
                  background-position: 200% 0;
              }
              100% {
                  background-position: -200% 0;
              }
          }
      `}</style>
    </motion.div>
  );
}