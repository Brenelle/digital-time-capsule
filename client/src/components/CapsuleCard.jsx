import React from 'react';
import { Calendar, Lock, Unlock, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button } from './Button';

const CapsuleCard = ({
  id,
  title,
  message,
  unlockDate,
  isUnlocked,
  visibility,
  createdAt,
  onOpen,
  onShare,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilUnlock = () => {
    const today = new Date();
    const unlockDateTime = new Date(unlockDate);
    const diffTime = unlockDateTime.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilUnlock = getDaysUntilUnlock();

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'private':
        return <EyeOff className="w-4 h-4" />;
      case 'public':
        return <Eye className="w-4 h-4" />;
      case 'shareable':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <EyeOff className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{title}</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-gray-500">
              {getVisibilityIcon()}
            </div>
            <div className={`p-2 rounded-full ${isUnlocked ? 'bg-green-100' : 'bg-orange-100'}`}>
              {isUnlocked ? (
                <Unlock className="w-4 h-4 text-green-600" />
              ) : (
                <Lock className="w-4 h-4 text-orange-600" />
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {isUnlocked ? message : `This capsule will unlock on ${formatDate(unlockDate)}`}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {isUnlocked
              ? `Unlocked on ${formatDate(unlockDate)}`
              : daysUntilUnlock > 0
              ? `${daysUntilUnlock} days remaining`
              : 'Ready to unlock!'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Created {formatDate(createdAt)}
          </span>
          <div className="flex space-x-2">
            {visibility === 'shareable' && onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                Share
              </Button>
            )}
            <Button
              variant={isUnlocked || daysUntilUnlock <= 0 ? 'primary' : 'outline'}
              size="sm"
              onClick={onOpen}
              disabled={!isUnlocked && daysUntilUnlock > 0}
            >
              {isUnlocked || daysUntilUnlock <= 0 ? 'Open' : 'Locked'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapsuleCard;
