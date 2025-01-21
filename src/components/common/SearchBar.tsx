import {Search} from "lucide-react";

interface Props {
  large?: boolean;
  searchQuery: string;
  disabled?: boolean;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({searchQuery, setSearchQuery, disabled = false, large = false, placeholder}: Props) {
  if (large) return <div className="relative mb-6">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400"/>
    <input
      type="text"
      placeholder={placeholder ?? "Search..."}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      disabled={disabled}
      className="w-full pl-10 pr-4 py-3 bg-primary-50 text-primary-900 placeholder-primary-400 rounded-lg border border-primary-100 focus:border-primary focus:ring-2 focus:ring-primary-200 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
    />
  </div>

  return <div className="relative flex-1">
    <Search className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
    <input
      type="text"
      placeholder={placeholder ?? "Search..."}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg bg-white/80 backdrop-blur-sm
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200
            placeholder-primary-300"
    />
  </div>
}