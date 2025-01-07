import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, UserCircle, TrendingUp, Brain, Target, Zap, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMatches } from '../hooks/useMatches';
import MatchesList from '../components/matches/MatchesList';

const features = [
  {
    icon: TrendingUp,
    title: 'Accurate Winning Predictions',
    description: 'Get precise match predictions powered by advanced algorithms'
  },
  {
    icon: Brain,
    title: 'AI-Powered Player Analysis',
    description: 'Discover optimal player positions using machine learning'
  },
  {
    icon: Zap,
    title: 'Real-Time Results',
    description: 'Instant insights for informed decision-making'
  }
];

const carouselImages = [
  {
    url: 'https://www.albawaba.com/sites/default/files/styles/d08_standard/public/im/Sport/al_ain_squad_2018-2019.jpg',
    caption: 'Championship Team'
  },
  {
    url: 'https://files.structurae.net/files/photos/5180/2975_b.jpg',
    caption: 'World-Class Stadium'
  }
  ,
  {
    url: 'https://files.structurae.net/files/photos/5180/2975_b.jpg',
    caption: 'World-Class Stadium'
  }
];

export default function Home() {
  const { matches, loading, predictMatch } = useMatches();
  const upcomingMatches = matches.slice(0, 3);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section with Carousel */}
      <div className="relative overflow-hidden">
        <div className="relative h-[600px]">
          {carouselImages.map((image, index) => (
            <div
              key={image.url}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
            </div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Your Ultimate Tool for Premier League Insights
              </h1>
              <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
                Predict team winning probabilities and uncover the best-suited positions for players using cutting-edge AI.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/team-prediction"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Predict Team Winning Probability
                </Link>
                <Link
                  to="/player-analysis"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <UserCircle className="w-5 h-5 mr-2" />
                  Analyze Player's Position
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50 relative">
        <div className="absolute inset-0">
          <img 
            src="https://files.structurae.net/files/photos/5180/2975_b.jpg" 
            alt="Stadium" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose AL ZAEEM AI?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-primary-100"
                >
                  <div className="p-3 bg-primary-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}