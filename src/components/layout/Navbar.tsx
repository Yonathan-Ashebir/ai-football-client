import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Brain, Award, Calendar, Goal, UserCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const navItems = [
  { path: '/', label: 'Home', icon: null },
  { path: '/upcoming-matches', label: 'Matches', icon: Calendar },
  { path: '/match-prediction', label: 'Match Prediction', icon: Goal },
  { path: '/player-analysis', label: 'Player Analysis', icon: UserCircle },
  { path: '/tournament', label: 'Tournament', icon: Award },
  { path: '/datasets', label: 'Datasets', icon: Database },
  { path: '/models', label: 'Models', icon: Brain },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      !isScrolled
        ? 'bg-white shadow-md'
        : 'bg-white/80 backdrop-blur-md border-b border-primary-100/50 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive(item.path)
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </div>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-primary-600 focus:outline-none
                transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden"
          >
            <div className={`px-4 pt-2 pb-4 space-y-1 border-t border-primary-100/50`}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}