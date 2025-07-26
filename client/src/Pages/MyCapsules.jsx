import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import CapsuleCard from '../components/CapsuleCard';
import { Button } from '../components/Button';
import ApiService from '../services/api';

export const MyCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, locked, unlocked
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, unlocked: 0, locked: 0 });

  useEffect(() => {
    const fetchCapsules = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await ApiService.getUserCapsules();
        setCapsules(data.capsules || []);
        setStats({
          total: data.total || 0,
          unlocked: data.unlocked || 0,
          locked: data.locked || 0
        });
      } catch (error) {
        console.error('Error fetching capsules:', error);
        setError(error.message || 'Failed to load your capsules');
        setCapsules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, []);

  const filteredCapsules = capsules.filter(capsule => {
    const matchesSearch = capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capsule.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'locked' && !capsule.isUnlocked) ||
                         (filterStatus === 'unlocked' && capsule.isUnlocked);

    return matchesSearch && matchesFilter;
  });

  const handleOpenCapsule = (capsuleId) => {
    window.location.href = `/capsule/${capsuleId}`;
  };

  const handleShareCapsule = (capsuleId) => {
    const capsule = capsules.find(c => c.id === capsuleId);
    if (capsule && capsule.slug) {
      const shareUrl = `${window.location.origin}/shared/${capsule.slug}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } else {
      alert('This capsule cannot be shared');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-2xl h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Time Capsules</h1>
            <p className="text-xl text-gray-600">Preserve your memories for the future</p>
          </div>
          <Link to="/create" className="mt-4 md:mt-0">
            <Button variant="primary" className="w-full md:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              New Capsule
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.total}</div>
            <div className="text-gray-600 flex items-center justify-center">
              <Clock className="w-4 h-4 mr-1" />
              Total Capsules
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.unlocked}</div>
            <div className="text-gray-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 mr-1" />
              Unlocked
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.locked}</div>
            <div className="text-gray-600 flex items-center justify-center">
              <Clock className="w-4 h-4 mr-1" />
              Waiting to Unlock
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your capsules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-purple-200 rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white"
              >
                <option value="all">All Capsules</option>
                <option value="unlocked">Unlocked</option>
                <option value="locked">Locked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Capsules Grid */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {filteredCapsules.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No capsules found' : 'No time capsules yet'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Create your first time capsule to start preserving memories for the future'
              }
            </p>
            {!searchTerm && (
              <Link to="/create">
                <Button variant="primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Capsule
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCapsules.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                {...capsule}
                onOpen={() => handleOpenCapsule(capsule.id)}
                onShare={capsule.visibility === 'shareable' ? () => handleShareCapsule(capsule.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


