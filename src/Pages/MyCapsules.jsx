import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import CapsuleCard from '../components/CapsuleCard';
import { Button } from '../components/Button';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  limit,
  query,
  where
} from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { toast, Toaster } from 'sonner';

export const MyCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, unlocked: 0, locked: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCapsules(user);
      } else {
        setError('Please sign in to view your capsules');
        setCapsules([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchCapsules = async (user) => {
    setLoading(true);
    setError('');
    try {
      const q = query(
        collection(db, 'capsules'),
        where('userId', '==', user.uid),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const capsulesData = [];
      let unlocked = 0;
      let locked = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.isUnlocked) unlocked++;
        else locked++;

        let parsedDate = '';
        try {
          if (data.unlockDate?.seconds) {
            parsedDate = new Date(data.unlockDate.seconds * 1000).toISOString();
          } else {
            parsedDate = '';
          }
        } catch {
          parsedDate = '';
        }

        capsulesData.push({
          id: doc.id,
          ...data,
          unlockDate: parsedDate,
        });
      });

      setCapsules(capsulesData);
      setStats({ total: capsulesData.length, unlocked, locked });
    } catch (error) {
      console.error('Error fetching from Firestore:', error);
      setError('Failed to fetch capsules');
      toast.error('Failed to fetch capsules');
    } finally {
      setLoading(false);
    }
  };

  const filteredCapsules = capsules.filter((capsule) => {
    const matchesSearch =
      capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capsule.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'locked' && !capsule.isUnlocked) ||
      (filterStatus === 'unlocked' && capsule.isUnlocked);

    return matchesSearch && matchesFilter;
  });

  const handleOpenCapsule = (capsuleId) => {
    window.location.href = `/capsule/${capsuleId}`;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">My Capsules</h1>
          <Link to="/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or message..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md px-2 py-1"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="locked">Locked</option>
              <option value="unlocked">Unlocked</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6 mb-10 text-sm md:text-base">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span>Total: {stats.total}</span>
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>Unlocked: {stats.unlocked}</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>Locked: {stats.locked}</span>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {filteredCapsules.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No capsules found
            </h3>
            <p className="text-gray-500 mb-4">
              Start by creating a new capsule to store your memories.
            </p>
            <Link to="/create">
              <Button>Create Capsule</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCapsules.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                id={capsule.id}
                title={capsule.title}
                message={capsule.message}
                isUnlocked={capsule.isUnlocked}
                unlockDate={capsule.unlockDate}
                createdAt={capsule.createdAt}
                onOpen={() => handleOpenCapsule(capsule.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
