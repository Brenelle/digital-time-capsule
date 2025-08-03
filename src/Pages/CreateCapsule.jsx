import React, { useState } from 'react';
import { Calendar, Lock } from 'lucide-react';
import { Button } from '../components/Button';
import { db, auth } from '../Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const CreateCapsule = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    unlockDate: '',
    unlockTime: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    if (!formData.unlockDate) newErrors.unlockDate = 'Unlock date is required.';
    if (!formData.unlockTime) newErrors.unlockTime = 'Unlock time is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be logged in to create a capsule.');

      const unlockDateTime = new Date(`${formData.unlockDate}T${formData.unlockTime}`);

      await addDoc(collection(db, 'capsules'), {
        userId: user.uid,
        title: formData.title,
        message: formData.message,
        unlockDate: unlockDateTime,
        createdAt: serverTimestamp(),
        isUnlocked: false,
      });

      setSuccessMessage('🎉 Time capsule created successfully!');
      handleCancel();

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    } catch (err) {
      setErrors({ message: err.message || 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      message: '',
      unlockDate: '',
      unlockTime: '',
    });
    setErrors({});
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
              className={`w-full px-4 py-3 border ${
                errors.title ? 'border-red-400' : 'border-purple-200'
              } rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200`}
              placeholder="Give your time capsule a meaningful title..."
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
              rows={8}
              className={`w-full px-4 py-3 border ${
                errors.message ? 'border-red-400' : 'border-purple-200'
              } rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none`}
              placeholder="Write your message to the future..."
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
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
              min={getMinDate()}
              className={`w-full px-4 py-3 border ${
                errors.unlockDate ? 'border-red-400' : 'border-purple-200'
              } rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200`}
            />
            {errors.unlockDate && <p className="text-red-500 text-sm mt-1">{errors.unlockDate}</p>}
          </div>

          {/* Unlock Time */}
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
              className={`w-full px-4 py-3 border ${
                errors.unlockTime ? 'border-red-400' : 'border-purple-200'
              } rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200`}
            />
            {errors.unlockTime && <p className="text-red-500 text-sm mt-1">{errors.unlockTime}</p>}
          </div>

          {/* Info Note */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-600 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <Lock className="w-4 h-4 text-purple-600 mr-2" />
              This capsule is private and only visible to you.
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
          {successMessage && (
            <p className="mt-4 text-center text-green-600 font-medium">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};
