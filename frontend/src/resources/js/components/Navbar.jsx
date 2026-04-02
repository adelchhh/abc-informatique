import React, { useState, useEffect } from 'react';
import { FaHome, FaNewspaper, FaPhone, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onAdminAccess }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('accueil');
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('auth_token');

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile au clic sur un lien
  const handleLinkClick = (id) => {
    setActiveLink(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminClick = () => {
    setIsMobileMenuOpen(false);
    onAdminAccess();
  };

  const navLinks = [
    { id: 'accueil', label: 'Accueil', icon: FaHome },
    { id: 'articles', label: 'Articles', icon: FaNewspaper },
    { id: 'contact', label: 'Contact', icon: FaPhone },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/70 backdrop-blur-xl border-b border-white/10 py-2'
          : 'bg-black/40 backdrop-blur-md border-b border-white/20 py-4'
      }`}
      style={{
        animation: 'slideDown 0.5s ease-out',
        backgroundImage: 'url(/images/hero-bg.jpg.jpg)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay',
        filter: 'blur(0px)',
      }}
    >
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes underlineHover {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        
        nav {
          position: relative;
        }
        
        nav::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(/images/hero-bg.jpg.jpg);
          background-position: center;
          background-size: cover;
          background-attachment: fixed;
          filter: blur(3px);
          z-index: -1;
        }
        
        .nav-link {
          position: relative;
          text-decoration: none;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-link.active::after {
          width: 100%;
        }
        
        .logo-glow {
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.6));
          transition: filter 0.3s ease;
        }
        
        .logo-glow:hover {
          filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.8));
        }
        
        .admin-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4);
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: none;
          cursor: pointer;
        }
        
        .admin-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 32px rgba(124, 58, 237, 0.6);
        }
        
        .hamburger {
          transition: all 0.3s ease;
        }
      `}</style>

      <div className={`relative flex justify-between items-center px-4 sm:px-6 lg:px-8 transition-all duration-300 z-10 ${isScrolled ? 'py-1' : ''}`}>
        {/* Logo et branding */}
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png.png"
            alt="ABC Informatique"
            className="logo-glow h-10 w-10 object-contain"
          />
          <div className="hidden sm:flex flex-col">
            <h1 className="text-xl sm:text-2xl font-semibold text-white drop-shadow-lg">ABC Informatique</h1>
            <p className="text-xs text-gray-300 font-light">Solutions digitales modernes</p>
          </div>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-40">
          {navLinks.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleLinkClick(id)}
              className={`nav-link flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${
                activeLink === id
                  ? 'text-blue-400'
                  : 'text-gray-200 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Bouton Admin et Menu Hamburger */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden hamburg text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-black/90 border-t border-white/10 py-4 space-y-3 px-4"
          style={{
            animation: 'slideDown 0.3s ease-out',
          }}
        >
          {navLinks.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleLinkClick(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeLink === id
                  ? 'bg-blue-600/30 text-blue-400 border-l-4 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
          <button
            onClick={handleAdminClick}
            className="admin-btn w-full px-4 py-3 text-white rounded-lg font-semibold sm:hidden"
          >
            {token && user ? 'Admin' : 'Connexion'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
