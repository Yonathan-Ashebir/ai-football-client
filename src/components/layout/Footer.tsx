import {Github, Mail, Twitter} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            <p className="text-gray-600">
              AL ZAEEM AI provides cutting-edge AI-powered insights for football teams and players.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/match-prediction" className="text-gray-600 hover:text-primary-600">
                  Team Prediction
                </a>
              </li>
              <li>
                <a href="/player-analysis" className="text-gray-600 hover:text-primary-600">
                  Player Analysis
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
            <div className="space-y-2">
              <a href="mailto:contact@alzaeem.ai" className="flex items-center text-gray-600 hover:text-primary-600">
                <Mail className="h-5 w-5 mr-2" />
                contact@alzaeem.ai
              </a>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-600 hover:text-primary-600">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-primary-600">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} AL ZAEEM AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}