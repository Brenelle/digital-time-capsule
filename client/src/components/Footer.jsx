import React from 'react';
import { Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-purple-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lock&Look
            </span>
          </div>

          {/* Message */}
          <div className="flex item-center space-x-1 text-gray-600">
            <span>Made with 💖</span>
            <span>for preserving memories</span>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-6 pt-6 border-t border-purple-100 text-center text-sm text-gray-500">
          <p>&copy; 2025 Digital Time Capsule. Preserving your memories for the future.</p>
        </div>
      </div>
    </footer>
  );
};

 
