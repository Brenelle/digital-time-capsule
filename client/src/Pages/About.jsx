import React from 'react';
import {
  Clock,
  Shield,
  Users,
  Calendar,
  MessageCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const About = () => {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Preserve Memories',
      description: 'Write heartfelt messages, attach photos and videos, and capture moments that matter to you.',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Time-Based Unlocking',
      description: 'Set specific dates for your capsules to unlock, creating anticipation and meaningful reveals.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy Control',
      description: 'Choose who can see your capsules - keep them private, make them public, or share with specific people.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Share with Others',
      description: 'Create shareable links to send capsules to friends, family, or your future self.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create',
      description: 'Write your message and choose when it should be unlocked',
    },
    {
      number: '02',
      title: 'Seal',
      description: 'Your capsule is securely stored until the unlock date',
    },
    {
      number: '03',
      title: 'Unlock',
      description: 'When the time comes, rediscover your memories',
    },
  ];

  const useCases = [
    {
      title: 'Future Self Letters',
      description: 'Write to yourself 1, 5, or 10 years from now',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: 'Special Occasions',
      description: 'Capture wedding days, graduations, or birthdays',
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      title: 'Goal Tracking',
      description: 'Set resolutions and check your progress later',
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: 'Family Memories',
      description: 'Share stories across generations',
      icon: <Users className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl">
              <Clock className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            About Lock&Look
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            A modern way to preserve your memories, thoughts, and dreams for the future. 
            Create meaningful connections between your past, present, and future self.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to create and preserve your digital memories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-[-40px] transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-purple-300 mx-auto" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Digital Time Capsule?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make memory preservation meaningful and secure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Perfect For</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the many ways you can use Digital Time Capsule
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 hover:border-purple-300 transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white mr-3">
                    {useCase.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Start Your Journey Through Time</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Begin preserving your memories today. Your future self will thank you for capturing these moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Create Your First Capsule
              </Button>
            </Link>
            <Link to="/my-capsules">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Your Capsules
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
