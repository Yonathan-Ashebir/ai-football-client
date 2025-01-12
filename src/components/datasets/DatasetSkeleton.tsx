
export default function DatasetSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            </th>
            <th className="px-6 py-3 text-left">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
            </th>
            <th className="px-6 py-3 text-right">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20 ml-auto" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="relative overflow-hidden">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </td>
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}