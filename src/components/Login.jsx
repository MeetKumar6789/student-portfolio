import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const expired = location.state?.expired;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        await api.register({ email, password });
      }

      const result = await api.login({ email, password });
      api.setAuthToken(result.token);
      navigate('/projects', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-heading-row">
          <span className="auth-mark" aria-hidden="true">TM</span>
          <div>
            <p className="auth-eyebrow">TASK MANAGER</p>
            <h1 id="auth-title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          </div>
        </div>

        {expired && <p className="auth-notice" role="status">Your session expired. Sign in again to continue.</p>}

        <div className="auth-mode-switch" role="group" aria-label="Authentication mode">
          <button type="button" aria-pressed={mode === 'login'} onClick={() => switchMode('login')}>Sign in</button>
          <button type="button" aria-pressed={mode === 'register'} onClick={() => switchMode('register')}>Register</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;