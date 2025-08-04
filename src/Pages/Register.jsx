import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../Firebase.js';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [firebaseError, setFirebaseError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const[isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setFirebaseError('');
    setSuccessMessage('');
    setIsLoading(true);

    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!email || !password || !confirm) {
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setFirebaseError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    if (password !== confirm) {
      setFirebaseError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage('✅ Successfully registered!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setFirebaseError('This email is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setFirebaseError('Please enter a valid email address.');
      } else {
        setFirebaseError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  const inputErrorClass = 'border-red-500';
  const baseInputClass =
    'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        {successMessage && (
          <div className="mb-4 text-green-600 text-sm font-semibold text-center">
            {successMessage}
          </div>
        )}
        {firebaseError && (
          <div className="mb-4 text-red-600 text-sm font-semibold text-center">
            {firebaseError}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={`${baseInputClass} ${emailTouched && !email ? inputErrorClass : ''}`}
              required
            />
            {emailTouched && !email && (
              <p className="text-red-600 text-sm mt-1">Email is required.</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password (min 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              className={`${baseInputClass} ${passwordTouched && !password ? inputErrorClass : ''}`}
              required
            />
            {passwordTouched && !password && (
              <p className="text-red-600 text-sm mt-1">Password is required.</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setConfirmTouched(true)}
              className={`${baseInputClass} ${confirmTouched && !confirm ? inputErrorClass : ''}`}
              required
            />
            {confirmTouched && !confirm && (
              <p className="text-red-600 text-sm mt-1">Please confirm your password.</p>
            )}
            {confirmTouched && confirm && password !== confirm && (
              <p className="text-red-600 text-sm mt-1">Passwords do not match.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md transition duration-300 ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
          >
            {isLoading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
