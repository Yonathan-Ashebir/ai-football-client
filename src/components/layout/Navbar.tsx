import {Link, useLocation} from 'react-router-dom';
import {Database, Brain, Award, Calendar, Goal, UserCircle} from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo/>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/upcoming-matches"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/upcoming-matches')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4"/>
                <span>Matches</span>
              </div>
            </Link>
            <Link
              to="/match-prediction"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/match-prediction')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Goal className="h-4 w-4"/>
                <span>Match Prediction</span>
              </div>
            </Link>
            <Link
              to="/player-analysis"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/player-analysis')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <div className="flex items-center space-x-1">
                <UserCircle className="h-4 w-4"/>
                <span>Player Analysis</span>
              </div>
            </Link>
            <Link
              to="/tournament"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/tournament')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4"/>
                <span>Tournament</span>
              </div>
            </Link>
            <Link
              to="/datasets"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/datasets')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Database className="h-4 w-4"/>
                <span>Datasets</span>
              </div>
            </Link>
            <Link
              to="/models"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/models')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Brain className="h-4 w-4"/>
                <span>Models</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}