import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { premierLeagueTeams } from '../../data/teams';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export default function TeamSelect({ value, onChange, placeholder, className = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTeam = premierLeagueTeams.find(team => team.name === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-md bg-white ${
          isOpen ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-300'
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          {selectedTeam ? (
            <>
              <img src={selectedTeam.logoUrl} alt={selectedTeam.name} className="w-6 h-6" />
              <span>{selectedTeam.name}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {premierLeagueTeams.map((team) => (
            <button
              key={team.id}
              type="button"
              onClick={() => {
                onChange(team.name);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 ${
                value === team.name ? 'bg-primary-50' : ''
              }`}
            >
              <img src={team.logoUrl} alt={team.name} className="w-6 h-6" />
              <span>{team.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}