import { Trophy } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center shadow-lg">
        <Trophy className="w-6 h-6 text-gold-400" />
      </div>
      <span className="font-bold text-xl text-gray-900">AL ZAEEM AI</span>
    </div>
  );
}