import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      setError(error.message);
    } else if (isSignUp) {
      setMessage('Account created! Check your email to confirm, then sign in.');
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>✈️ Travel Wishlist</h1>
        <p>{isSignUp ? 'Create an account to get started.' : 'Sign in to view your destinations.'}</p>
      </header>

      <form onSubmit={handleSubmit} className="destination-form" style={{ maxWidth: 420, margin: '0 auto' }}>
        <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>

        {error && <p className="form-error">{error}</p>}
        {message && <p style={{ color: '#16a34a', fontSize: '0.875rem', marginBottom: '1rem' }}>{message}</p>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
