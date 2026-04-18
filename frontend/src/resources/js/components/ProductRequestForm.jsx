import React, { useState, useEffect } from 'react';

const ProductRequestForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    description_produit: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    } else if (formData.prenom.length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le numéro de téléphone est requis';
    } else if (!/^[0-9+\s\-()]+$/.test(formData.telephone)) {
      newErrors.telephone = 'Le numéro de téléphone n\'est pas valide';
    } else if (formData.telephone.replace(/\D/g, '').length < 8) {
      newErrors.telephone = 'Le numéro doit contenir au moins 8 chiffres';
    }

    if (!formData.description_produit.trim()) {
      newErrors.description_produit = 'La description du produit est requise';
    } else if (formData.description_produit.length < 10) {
      newErrors.description_produit = 'La description doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://abcinformatique.org/api/product-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          nom: '',
          prenom: '',
          telephone: '',
          description_produit: '',
        });
        setTimeout(() => {
          setSuccess(false);
        }, 4000);
      } else {
        setError(data.message || 'Erreur lors de l\'envoi de la demande');
      }
    } catch (err) {
      setError('Erreur lors de la connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoomParallax {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
          }
        }

        @keyframes floatUp {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .product-request-section {
          position: relative;
          width: 100%;
          min-height: auto;
          padding: 30px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }

        .product-request-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/images/demande.jpg.jpg');
          background-size: 100% auto;
          background-position: center;
          background-attachment: fixed;
          background-repeat: no-repeat;
          animation: zoomParallax 20s ease-in-out infinite;
        }

        .product-request-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.5) 100%);
          backdrop-filter: blur(1px);
        }

        .product-request-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 500px;
          padding: 20px 0;
          animation: ${isVisible ? 'fadeInUp' : 'none'} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .product-request-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 24px 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.05);
          animation: floatUp 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }

        .product-request-card:hover {
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(255, 255, 255, 0.08);
        }

        .product-request-icon {
          font-size: 48px;
          text-align: center;
          margin-bottom: 8px;
          animation: slideInDown 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .product-request-title {
          text-align: center;
          color: #ffffff;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 6px;
          animation: slideInDown 0.8s ease-out 0.3s forwards;
          opacity: 0;
          letter-spacing: -0.5px;
        }

        .product-request-subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          line-height: 1.4;
          margin-bottom: 10px;
          animation: slideInDown 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .product-request-note {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          animation: slideInDown 0.8s ease-out 0.45s forwards;
          opacity: 0;
        }

        .product-request-form {
          animation: fadeInUp 0.8s ease-out 0.5s forwards;
          opacity: 0;
        }

        .form-group {
          margin-bottom: 10px;
          position: relative;
        }

        .form-label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 4px;
          display: block;
          letter-spacing: 0.3px;
        }

        .form-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-icon {
          position: absolute;
          left: 16px;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          pointer-events: none;
          transition: color 0.3s ease;
        }

        .form-input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          background: rgba(255, 255, 255, 0.08);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05);
          padding-left: 48px;
        }

        .form-input:focus ~ .form-icon {
          color: rgba(59, 130, 246, 1);
          transform: scale(1.1);
        }

        .form-textarea {
          width: 100%;
          padding: 10px 14px 10px 40px;
          background: rgba(255, 255, 255, 0.08);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.9rem;
          font-family: inherit;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
          resize: none;
          min-height: 80px;
        }

        .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-textarea:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05);
        }

        .form-error {
          color: #ff6b6b;
          font-size: 0.75rem;
          margin-top: 3px;
          display: flex;
          align-items: center;
          gap: 4px;
          animation: slideInDown 0.3s ease-out;
        }

        .form-hint {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          margin-top: 3px;
        }

        .submit-button {
          width: 100%;
          padding: 10px 16px;
          margin-top: 10px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .submit-button:hover::before {
          left: 100%;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5);
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0px);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .alert {
          padding: 10px 14px;
          border-radius: 12px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
          animation: slideInDown 0.4s ease-out;
          backdrop-filter: blur(10px);
        }

        .alert-error {
          background: rgba(220, 38, 38, 0.2);
          border: 1.5px solid rgba(220, 38, 38, 0.4);
          color: #fca5a5;
        }

        .alert-success {
          background: rgba(34, 197, 94, 0.2);
          border: 1.5px solid rgba(34, 197, 94, 0.4);
          color: #86efac;
        }

        @media (max-width: 768px) {
          .product-request-section {
            min-height: auto;
            padding: 40px 20px;
          }

          .product-request-container {
            max-width: 100%;
          }

          .product-request-card {
            padding: 32px 20px;
          }

          .product-request-title {
            font-size: 1.5rem;
          }

          .product-request-subtitle {
            font-size: 0.9rem;
          }

          .form-input,
          .form-textarea {
            padding: 12px 14px 12px 44px;
            font-size: 16px;
          }

          .form-icon {
            left: 14px;
            font-size: 16px;
          }
        }
      `}
    </style>

    <div className="product-request-section">
      <div className="product-request-bg"></div>
      <div className="product-request-overlay"></div>

      <div className="product-request-container">
        <div className="product-request-card">
          <div className="product-request-icon"></div>

          <h2 className="product-request-title">
            Vous ne trouvez pas ?
          </h2>

          <p className="product-request-subtitle">
            Vous recherchez un produit informatique spécifique qui n'est pas dans notre catalogue ? Dites-nous ce que vous cherchez et nous ferons notre possible de l'ajouter pour vous.
          </p>

          <div className="product-request-note">
            <span>Nous vous contacterons rapidement pour valider votre demande</span>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span>Demande envoyée ! Nous vous contacterons très bientôt.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="product-request-form">
            {/* Nom */}
            <div className="form-group">
              <label className="form-label">Votre Nom <span style={{ color: '#ff6b6b' }}>*</span></label>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className={`form-input ${errors.nom ? 'border-red-500' : ''}`}
                />
                <span className="form-icon"></span>
              </div>
              {errors.nom && <p className="form-error">{errors.nom}</p>}
            </div>

            {/* Prénom */}
            <div className="form-group">
              <label className="form-label">Votre Prénom <span style={{ color: '#ff6b6b' }}>*</span></label>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Jean"
                  className={`form-input ${errors.prenom ? 'border-red-500' : ''}`}
                />
                <span className="form-icon"></span>
              </div>
              {errors.prenom && <p className="form-error">{errors.prenom}</p>}
            </div>

            {/* Téléphone */}
            <div className="form-group">
              <label className="form-label">Téléphone <span style={{ color: '#ff6b6b' }}>*</span></label>
              <div className="form-input-wrapper">
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+213 5XX XXX XXX"
                  className={`form-input ${errors.telephone ? 'border-red-500' : ''}`}
                />
                <span className="form-icon"></span>
              </div>
              {errors.telephone && <p className="form-error">{errors.telephone}</p>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Décrivez le produit <span style={{ color: '#ff6b6b' }}>*</span></label>
              <div className="form-input-wrapper">
                <textarea
                  name="description_produit"
                  value={formData.description_produit}
                  onChange={handleChange}
                  placeholder="Ex: Laptop Dell XPS 15, MacBook Pro 16, Imprimante HP LaserJet, etc."
                  className={`form-textarea ${errors.description_produit ? 'border-red-500' : ''}`}
                />
                <span className="form-icon" style={{ top: '20px' }}></span>
              </div>
              {errors.description_produit && (
                <p className="form-error">{errors.description_produit}</p>
              )}
              <p className="form-hint">Minimum 10 caractères</p>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductRequestForm;
