'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AuthModal({ isOpen, onClose, onSuccess, colors }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
          }
        });

        if (error) throw error;

        if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            setError('This email is already registered. Please login instead.');
            setMode('login');
          } else {
            alert('Success! Check your email to confirm your account.');
            onClose();
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          onSuccess && onSuccess(data.user);
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      alert('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #1a1a28 0%, #0f0f18 100%)',
          borderRadius: '24px',
          maxWidth: '400px',
          width: '100%',
          border: `2px solid ${colors.gold}`,
          boxShadow: `0 0 40px ${colors.gold}30`,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <div style={{ padding: '40px 28px 28px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </div>
            <div style={{ fontSize: '13px', color: colors.muted }}>
              {mode === 'login' ? 'Sign in to access your account' : 'Sign up to save your calculations'}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth}>
            {/* Email Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: colors.muted, marginBottom: '6px', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: colors.inputBg,
                  border: `2px solid ${colors.inputBorder}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: colors.text,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: colors.muted, marginBottom: '6px', fontWeight: '600' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: colors.inputBg,
                  border: `2px solid ${colors.inputBorder}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: colors.text,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Forgot Password Link */}
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.gold,
                    fontSize: '11px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '16px',
                fontSize: '12px',
                color: '#ef4444',
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? colors.muted : `linear-gradient(135deg, ${colors.gold} 0%, #c9a947 100%)`,
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                color: loading ? '#666' : '#000',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '12px',
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Mode */}
          <div style={{ textAlign: 'center', fontSize: '13px', color: colors.muted }}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: colors.gold,
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
