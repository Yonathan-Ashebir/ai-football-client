import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
      <p className="text-sm text-gray-600">Loading datasets...</p>
    </div>
  );
}