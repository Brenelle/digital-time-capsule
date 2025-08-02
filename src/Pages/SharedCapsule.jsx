import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Lock, Unlock, Heart, MessageCircle, Clock, Share2, Eye } from 'lucide-react';
import { Button } from '../components/Button';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';

export const SharedCapsule = () => {
  const { id: slug } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCapsule = async () => {
      if (!slug) {
        setError('No capsule slug provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const docRef = doc(db, 'capsules', slug);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          setError('Capsule not found or was removed');
          return;
        }

        const data = snapshot.data();

        // Compute unlocked state
        const currentTime = new Date();
        const unlockTime = new Date(data.unlockDate);
        const isUnlocked = currentTime >= unlockTime;

        setCapsule({
          ...data,
          isUnlocked,
        });
      } catch (error) {
        console.error('Error fetching capsule:', error);
        setError(error.message || 'Failed to load capsule');
      } finally {
        setLoading(false);
      }
    };

    fetchCapsule();
  }, [slug]);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: capsule.title,
          text: `Check out this shared time capsule: "${capsule.title}"`,
          url: window.location.href,
        });
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared time capsule...</p>
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
          <Button variant="primary" onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
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
            This shared time capsule doesn't exist or may have been removed.
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Shared Time Capsule Locked
            </h1>
            <p className="text-xl text-gray-600 mb-2">"{capsule.title}"</p>
            <p className="text-sm text-gray-500 mb-6">Shared by {capsule.sharedBy}</p>

            <div className="bg-orange-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-600 mr-2" />
                <span className="text-lg font-semibold text-orange-800">Time Remaining</span>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {timeRemaining}
              </div>
              <p className="text-orange-700">
                This capsule will unlock on {formatDate(capsule.unlockDate)}
              </p>
            </div>

            <p className="text-gray-600 mb-8">
              Come back when the time is right to read this shared message.
            </p>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Go to Home
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Check Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-white text-center relative">
            <div className="absolute top-4 right-4">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                <Share2 className="w-4 h-4 mr-1" />
                Shared
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <Unlock className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold mb-2">{capsule.title}</h1>
            <p className="text-blue-100 text-lg mb-2">
              Shared by {capsule.sharedBy}
            </p>
            <p className="text-blue-100">
              Unlocked on {formatDate(capsule.unlockDate)}
            </p>
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
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-l-4 border-blue-500">
                <MessageCircle className="w-8 h-8 text-blue-500 mb-4" />
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {capsule.message}
                </div>
              </div>
              {capsule?.media && (
                <div className="my-6 flex justify-center">
                  {capsule.media.endsWith('.mp4') || capsule.media.includes('video') ? (
                    <video
                      controls
                      className="w-full max-w-xl rounded-xl shadow"
                      src={capsule.media}
                    />
                  ) : (
                    <img
                      src={capsule.media}
                      alt="Capsule Media"
                      className="w-full max-w-xl rounded-xl shadow"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center text-blue-800 mb-2">
              <Eye className="w-4 h-4 mr-2" />
              <span className="font-semibold">You're viewing a shared time capsule</span>
            </div>
            <p className="text-blue-700 text-sm">
              This memory was shared with you by {capsule.sharedBy}. You can share this link with others too!
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Create Your Own
            </Button>
            <Button variant="primary" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share This Capsule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


