import React, { useState } from 'react';
import ProductList from './ProductList';
import OrderForm from './OrderForm';
import ProductDetail from './ProductDetail';
import BrandsSection from './BrandsSection';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const ClientPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('auth_token');

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleOrderSubmit = (order) => {
    console.log('Commande créée:', order);
  };

  const handleCancelOrder = () => {
    setSelectedProduct(null);
  };

  const handleAdminAccess = () => {
    if (token && user) {
      const userData = JSON.parse(user);
      // Accepter les deux rôles : admin et super_admin
      if (userData.role === 'admin' || userData.role === 'super_admin') {
        navigate('/admin');
      } else {
        alert('Accès réservé aux administrateurs');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="w-full">
      {/* Si un produit est sélectionné, afficher la page de détail complète */}
      {selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          onBack={handleCancelOrder}
          onOrderSubmit={handleOrderSubmit}
        />
      ) : (
        <>
          {/* Navbar Améliorée */}
          <Navbar onAdminAccess={handleAdminAccess} />

          {/* Section Hero */}
          <section id="accueil" className="relative w-full h-screen bg-cover bg-center bg-no-repeat overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/hero-bg.jpg.jpg)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Contenu centré */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-4 max-w-3xl">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Bienvenue à ABC Informatique
            </h2>
            <p className="text-gray-100 text-lg md:text-xl mb-8 font-light">
              Découvrez notre sélection complète de produits informatiques de qualité. Livraison rapide et paiement à la livraison.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('articles');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              Voir nos produits
            </button>
          </div>
        </div>
      </section>

      {/* Section Marques */}
      <BrandsSection />

      {/* Section Articles Principales */}
      <section id="articles" className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Liste des produits */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span></span> Catalogue Produits
            </h3>
            <ProductList onSelectProduct={handleSelectProduct} />
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gauche - Contact Info & Social Media */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white mb-8">Contactez-nous</h2>
              
              {/* Téléphone */}
              <div className="mb-6">
                <p className="text-gray-300 text-lg mb-2">Téléphone</p>
                <p className="text-white font-semibold">0795734327</p>
              </div>
              
              {/* Email */}
              <div className="mb-8">
                <p className="text-gray-300 text-lg mb-2">Email</p>
                <p className="text-white font-semibold">lgsalah@gmail.com</p>
              </div>
              
              {/* Partager */}
              <div>
                <p className="text-gray-300 text-lg mb-4">Partagez notre site avec vos amis sur :</p>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform" title="Facebook">
                    <img src="/images/facebook.png" alt="Facebook" className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform" title="Instagram">
                    <img src="/images/instagram.png" alt="Instagram" className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform" title="TikTok">
                    <img src="/images/tiktok.png" alt="TikTok" className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform" title="WhatsApp">
                    <img src="/images/whatsapp.png" alt="WhatsApp" className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Droite - Google Maps */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4"> Notre Magasin</h3>
              <p className="text-gray-300 text-sm mb-4">Boulevard du Zéralda • PR6R+WM Zéralda</p>
              <a 
                href="https://www.google.com/maps/place/ABC+Informatique/@36.7122919,2.8391524,17z/data=!3m1!4b1!4m6!3m5!1s0x128fa3bd1eb3a62d:0x35a90be3f656ea55!8m2!3d36.7122919!4d2.8417273!16s%2Fg%2F11f9zh7btg?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <iframe 
                  width="100%" 
                  height="300" 
                  frameBorder="0" 
                  style={{ border: '0', borderRadius: '0.75rem' }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3245.2!2d2.8391524!3d36.7122919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fa3bd1eb3a62d:0x35a90be3f656ea55!2sABC%20Informatique!5e0!3m2!1sfr!2sdz!4v1711953600000" 
                  allowFullScreen="" 
                  loading="lazy"
                  title="Localisation ABC Informatique"
                ></iframe>
                <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                   Ouvrir sur Google Maps
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white text-lg mb-4">ABC Informatique</h3>
              <p className="text-sm">Votre partenaire de confiance pour tous vos besoins en produits informatiques de qualité.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg mb-4">Liens Rapides</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#accueil" className="hover:text-white transition">Accueil</a></li>
                <li><a href="#articles" className="hover:text-white transition">Articles</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg mb-4">Service</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-white transition">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <img src="/images/ahar.png" alt="ABC Informatique" className="w-full h-auto rounded-lg mb-4" />
              <div className="text-center text-gray-300 text-sm space-y-2">
                <p className="text-white font-semibold">Nous contacter :</p>
                <p><a href="tel:0699617486" className="hover:text-white transition">0699617486</a></p>
                <p><a href="tel:0542377300" className="hover:text-white transition">0542377300</a></p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2026 ABC Informatique. Tous droits réservés. Solutions digitales modernes.</p>
          </div>
        </div>
      </footer>
        </>
      )}
    </div>
  );
};

export default ClientPage;
