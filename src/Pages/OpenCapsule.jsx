import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Lock, Unlock, Heart, MessageCircle, Clock, Download } from 'lucide-react';
import { Button } from '../components/Button';
import ApiService from '../services/api';

export const OpenCapsule = () => {
  const { id } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCapsule = async () => {
      if (!id) {
        setError('No capsule ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await ApiService.getCapsule(id);
        setCapsule(data);
      } catch (error) {
        console.error('Error fetching capsule:', error);
        setError(error.message || 'Failed to load time capsule');
      } finally {
        setLoading(false);
      }
    };

    fetchCapsule();
  }, [id]);

  useEffect(() => {
    if (capsule && !capsule.isUnlocked) {
      const updateTimeRemaining = () => {
        const now = new Date().getTime();
        const unlockTime = new Date(capsule.unlockDate).getTime();
        const distance = unlockTime - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining('Ready to unlock!');
          setCapsule(prev => ({ ...prev, isUnlocked: true }));
        }
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000);

      return () => clearInterval(interval);
    }
  }, [capsule]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = capsule.mediaUrl;
    link.download = capsule.mediaName || 'capsule-file';
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your time capsule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Capsule Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="primary" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Capsule Not Found</h1>
          <p className="text-gray-600 mb-6">
            The time capsule you're looking for doesn't exist or may have been removed.
          </p>
          <Button variant="primary" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!capsule.isUnlocked) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-200 text-center">
            <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Lock className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Time Capsule Locked</h1>
            <p className="text-xl text-gray-600 mb-6">"{capsule.title}"</p>

            <div className="bg-orange-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-600 mr-2" />
                <span className="text-lg font-semibold text-orange-800">Time Remaining</span>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{timeRemaining}</div>
              <p className="text-orange-700">
                This capsule will unlock on {formatDate(capsule.unlockDate)}
              </p>
            </div>

            <p className="text-gray-600 mb-8">
              Come back when the time is right to read your message from the past.
            </p>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>Check Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-green-200">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <Unlock className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold mb-2">{capsule.title}</h1>
            <p className="text-green-100 text-lg">Unlocked on {formatDate(capsule.unlockDate)}</p>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Created {formatDate(capsule.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                <span>From {capsule.author}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-purple-500">
                <MessageCircle className="w-8 h-8 text-purple-500 mb-4" />
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{capsule.message}</div>
              </div>

              {capsule.mediaUrl && (
                <div className="mt-8 text-center">
                  <p className="text-gray-700 font-medium mb-2">Attached Media:</p>
                  <img
                    src={capsule.mediaUrl}
                    alt="Capsule Media"
                    className="mx-auto rounded-lg shadow-md max-w-xs"
                  />

                  <Button variant="secondary" className="mt-4" onClick={handleDownload}>
                    <Download className="w-5 h-5 mr-2" /> Save to Device
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <Button variant="outline" onClick={() => window.history.back()}>Back to Capsules</Button>
              <Button variant="primary" onClick={() => navigator.share && navigator.share({
                title: capsule.title,
                text: 'Check out this time capsule message!',
                url: window.location.href,
              })}>
                Share Memory
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
