import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, MessageCircle, Calendar, Shield } from 'lucide-react';
import { Button } from '../components/Button.jsx';

export const Home = () => {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Write Messages',
      description: 'Compose heartfelt messages, thoughts, or memories to your future self or loved ones.'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Set Unlock Date',
      description: 'Choose when your capsule should be opened - days, months, or years in the future.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy Control',
      description: 'Keep capsules private, make them public, or create shareable links for specific people.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl">
              <Clock className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Lock & Look
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Preserve your memories, thoughts, and dreams for the future. Create beautiful time capsules 
            to be unlocked at just the right moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/create">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Create Your Capsule
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-20 left-10 opacity-20">
          <Clock className="w-16 h-16 text-pink-400 animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <MessageCircle className="w-20 h-20 text-purple-400 animate-bounce" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Creating and sharing time capsules is simple and magical
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Create Your First Time Capsule?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start preserving your memories today. Your future self will thank you.
          </p>
          <Link to="/create">
            <Button variant="primary" size="lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};


