import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../Firebase.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFirebaseError('');
    setSuccessMessage('');

    if (!email || !password) {
      setEmailTouched(true);
      setPasswordTouched(true);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage('You have successfully logged in!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      // Check error codes and display custom messages
      switch (err.code) {
        case 'auth/user-not-found':
          setFirebaseError('No user found with this email address.');
          break;
        case 'auth/wrong-password':
          setFirebaseError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setFirebaseError('The email address format is invalid.');
          break;
        default:
          setFirebaseError('Unable to log in. Please check your credentials.');
          break;
      }
    }
  };

  const inputErrorClass = 'border-red-500';
  const baseInputClass =
    'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        {successMessage && (
          <div className="mb-4 text-green-600 font-semibold text-center">
            {successMessage}
          </div>
        )}
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={`${baseInputClass} ${emailTouched && !email ? inputErrorClass : ''}`}
            />
            {emailTouched && !email && (
              <p className="text-red-600 text-sm mt-1">
                <strong>Email</strong> is required. Please fill the field...
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              className={`${baseInputClass} ${passwordTouched && !password ? inputErrorClass : ''}`}
            />
            {passwordTouched && !password && (
              <p className="text-red-600 text-sm mt-1">
                <strong>Password</strong> is required. Please fill the field...
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Log In
          </button>

          {firebaseError && (
            <p className="text-red-500 text-sm text-center mt-2">{firebaseError}</p>
          )}
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
