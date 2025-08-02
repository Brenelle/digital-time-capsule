import React, { useState, useRef } from 'react';
import { Upload, Calendar, Lock, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button } from '../components/Button';
import FileUpload from '../components/FileUpload';
import { db, storage, auth } from '../Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';

export const CreateCapsule = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    unlockDate: '',
    unlockTime: '',
    visibility: 'private',
  });

  const [mediaFile, setMediaFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileUploadRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let userId = null;
      let mediaUrl = null;
      const unlockDateTime = new Date(`${formData.unlockDate}T${formData.unlockTime}`);
      // Wait for auth
      await new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          if (user) {
            userId = user.uid;
            resolve();
          } else {
            reject(new Error('You must be logged in to create a capsule.'));
          }
        });
      });

      // Upload media file if it exists
      if (mediaFile) {
        const fileRef = ref(storage, `capsules/${userId}/${uuidv4()}_${mediaFile.name}`);
        const snapshot = await uploadBytes(fileRef, mediaFile);
        mediaUrl = await getDownloadURL(snapshot.ref);
      }

      // Create capsule
      await addDoc(collection(db, 'capsules'), {
        userId,
        title: formData.title,
        message: formData.message,
        unlockDate: unlockDateTime,
        visibility: formData.visibility,
        mediaUrl: mediaUrl || null,
        createdAt: serverTimestamp(),
        isUnlocked: false,
      });

      alert('Time capsule created successfully! 🎉');
      handleCancel();
    } catch (err) {
      console.error('Capsule creation failed:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      message: '',
      unlockDate: '',
      unlockTime: '',
      visibility: 'private',
    });
    setMediaFile(null);
    fileUploadRef.current?.reset?.(); // fallback for custom ref reset
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Create Your Time Capsule
          </h1>
          <p className="text-xl text-gray-600">
            Preserve your thoughts and memories for the future
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Capsule Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Give your time capsule a meaningful title..."
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={8}
              placeholder="Write your message to the future..."
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Media (Optional)</label>
            <FileUpload
              ref={fileUploadRef}
              onFileSelect={(file) => setMediaFile(file)}
              selectedFile={mediaFile}
              onFileRemove={() => {
                setMediaFile(null);
                if (fileUploadRef.current?.reset) fileUploadRef.current.reset();
              }}
            />
          </div>

          {/* Unlock Date */}
          <div className="mb-6">
            <label htmlFor="unlockDate" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Unlock Date
            </label>
            <input
              type="date"
              id="unlockDate"
              name="unlockDate"
              value={formData.unlockDate}
              onChange={handleInputChange}
              required
              min={getMinDate()}
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            />
            <p className="text-sm text-gray-500 mt-1">Choose when this capsule should be unlocked</p>
          </div>
          <div className="mb-6">
            <label htmlFor="unlockTime" className="block text-sm font-medium text-gray-700 mb-2">
              Unlock Time (24hr)
            </label>
            <input
              type="time"
              id="unlockTime"
              name="unlockTime"
              value={formData.unlockTime}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            />
            <p className="text-sm text-gray-500 mt-1">What time should this capsule unlock?</p>
          </div>

          {/* Visibility */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <Lock className="w-4 h-4 inline mr-2" />
              Visibility
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  value: 'private',
                  label: 'Private',
                  description: 'Only you can see this capsule',
                  icon: <EyeOff className="w-5 h-5" />,
                },
                {
                  value: 'public',
                  label: 'Public',
                  description: 'Anyone can discover this capsule',
                  icon: <Eye className="w-5 h-5" />,
                },
                {
                  value: 'shareable',
                  label: 'Shareable Link',
                  description: 'Share with specific people via link',
                  icon: <ExternalLink className="w-5 h-5" />,
                },
              ].map((option) => (
                <div key={option.value} className="relative">
                  <input
                    type="radio"
                    id={option.value}
                    name="visibility"
                    value={option.value}
                    checked={formData.visibility === option.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor={option.value}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${formData.visibility === option.value
                        ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-500/20'
                        : 'border-purple-200 hover:border-purple-300 hover:bg-purple-50/50'
                      }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`${formData.visibility === option.value ? 'text-purple-600' : 'text-gray-500'
                          }`}
                      >
                        {option.icon}
                      </div>
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? 'Creating Capsule...' : 'Create Time Capsule'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
              className="w-full md:w-auto hover:bg-red-100 hover:border-red-300 text-red-600 border-red-200"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
