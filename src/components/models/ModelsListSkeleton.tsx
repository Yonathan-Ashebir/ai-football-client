
export default function ModelsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden relative">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
              </div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
            </div>

            <div className="mt-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-2" />
              <div className="flex flex-wrap gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
          
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      ))}
    </div>
  );
}