import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Si déjà connecté, rediriger
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://abcinformatique.org/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Erreur de connexion. Vérifiez vos identifiants.');
        setLoading(false);
        return;
      }

      // Stocker le token et données utilisateur
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirection vers le dashboard admin
      navigate('/admin');
    } catch (err) {
      setError('Erreur de connexion. Vérifiez que le serveur est en marche.');
      console.error('Erreur:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Container avec Vidéo */}
      <div className="login-bg-container">
        <video
          className="login-bg-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/login-bg.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo HTML5.
        </video>
      </div>
      <style>{`
        /* BACKGROUND VIDEO */
        .login-bg-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
        }

        .login-bg-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
        }

        /* Overlay avec gradient */
        .login-bg-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: -1;
        }

        /*  CARD PREMIUM */
        .login-card-premium {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          animation: slideUpIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUpIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ANIMATIONS INPUTS */
        .input-premium {
          background: rgba(255, 255, 255, 0.1);
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 12px 14px 12px 42px;
          font-size: 15px;
          font-family: 'Inter', -apple-system, sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          color: #ffffff;
        }

        .input-premium::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .input-premium:focus {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
          color: #ffffff;
        }

        /* Icon Animation */
        .input-icon {
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.7);
        }

        .input-premium:focus ~ .input-icon,
        input:focus ~ .input-icon {
          color: rgba(255, 255, 255, 0.9);
          transform: scale(1.15);
        }

        /*  SHOW PASSWORD BUTTON */
        .toggle-password-btn {
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-password-btn:hover {
          color: rgba(255, 255, 255, 1);
          transform: scale(1.15);
        }

        .toggle-password-btn:active {
          transform: scale(0.95);
        }

        /*  BUTTON PREMIUM CTA */
        .btn-submit-premium {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%);
          background-size: 200% 200%;
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          color: white;
          font-weight: 600;
          font-size: 16px;
          font-family: 'Inter', -apple-system, sans-serif;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-submit-premium:hover:not(:disabled) {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 40px rgba(124, 58, 237, 0.5);
          background-position: 200% 0;
        }

        .btn-submit-premium:active:not(:disabled) {
          transform: translateY(-2px) scale(0.98);
        }

        .btn-submit-premium:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        /* Loading Spinner */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        /*  DEMO CREDENTIALS CARD */
        .demo-card {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 14px;
          padding: 16px;
          animation: fadeInUp 0.8s ease 0.3s backwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .demo-credential-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: white;
          border-radius: 8px;
          margin-bottom: 8px;
          font-size: 13px;
          font-family: 'Monaco', 'Courier New', monospace;
          transition: all 0.2s ease;
        }

        .demo-credential-item:last-child {
          margin-bottom: 0;
        }

        .demo-credential-item:hover {
          background: rgba(124, 58, 237, 0.05);
          transform: translateX(4px);
        }

        .copy-btn {
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          margin-left: 8px;
        }

        .copy-btn:hover {
          background: #a855f7;
          transform: scale(1.05);
        }

        .copy-btn:active {
          transform: scale(0.95);
        }

        .copy-btn.copied {
          background: #10b981;
        }

        /*  HEADER ANIMATIONS */
        .login-header {
          animation: fadeInDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-icon {
          font-size: 56px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .login-title {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          opacity: 0.8;
          font-weight: 500;
        }

        /* Error Message Enhancement */
        .error-message-premium {
          animation: slideInLeft 0.4s ease;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-left: 4px solid #ef4444;
          border-radius: 12px;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Return Link */
        .return-link {
          color: #7c3aed;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 14px;
        }

        .return-link:hover {
          color: #a855f7;
          text-decoration: underline;
          transform: translateX(-4px);
        }
      `}</style>

      {/* Background Container */}
      <div className="login-bg-container" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-lg px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10 login-header">
          <img src="/images/logo.png.png" alt="ABC Informatique" className="h-20 w-20 object-contain mx-auto mb-4" />
          <h1 className="login-title mb-3">Espace réservé au personnel</h1>
          <p className="login-subtitle text-gray-600 text-sm">Espace du personnel</p>
        </div>

        {/* Main Card */}
        <div className="login-card-premium p-10 sm:p-12 mb-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 error-message-premium flex gap-3">
              <span className="text-red-600 text-xl flex-shrink-0">!</span>
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                Adresse Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full input-premium"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full input-premium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 toggle-password-btn"
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-submit-premium flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <>
                  <span className="spinner">·</span>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Accéder au dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Section */}
          {/* SUPPRIMÉ */}

          {/* Return Link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="return-link hover:underline border-none bg-transparent"
            >
              ← Retour au magasin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
