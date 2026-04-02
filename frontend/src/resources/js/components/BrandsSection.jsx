import React from 'react';

const BrandsSection = () => {
  // Les logos doivent être dans: public/images/brands/
  const brands = [
    { id: 1, name: 'Apple', src: '/images/brands/logo-apple.png' },
    { id: 2, name: 'ASUS', src: '/images/brands/asus.png' },
    { id: 3, name: 'Acer', src: '/images/brands/acer.png' },
    { id: 4, name: 'HP', src: '/images/brands/hp.png' },
    { id: 5, name: 'Lenovo', src: '/images/brands/lenovo.png' },
    { id: 6, name: 'Samsung', src: '/images/brands/samsung.png' },
    { id: 7, name: 'Xiaomi', src: '/images/brands/xiaomi.png' },
    { id: 8, name: 'Huawei', src: '/images/brands/huawei.png' },
    { id: 9, name: 'Microsoft', src: '/images/brands/microsoft.png' },
    { id: 10, name: 'Dell', src: '/images/brands/dell.png' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Glass morphism background blur effect */}
      <div className="absolute inset-0 backdrop-blur-3xl -backdrop-hue-rotate-15"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-purple-50/20"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <style>{`
          @keyframes slideLeft {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .brands-container {
            overflow: hidden;
            background: linear-gradient(90deg, 
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.5) 10%,
              rgba(255,255,255,0.5) 90%,
              rgba(255,255,255,0) 100%
            );
            border-radius: 16px;
            padding: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.6);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.5);
          }

          .brands-track {
            display: flex;
            animation: slideLeft 20s linear infinite;
            gap: 24px;
          }

          .brands-track:hover {
            animation-play-state: paused;
          }

          .brand-item {
            min-width: 180px;
            padding: 28px 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            flex-shrink: 0;
          }

          .brand-item:hover {
            transform: translateY(-8px) scale(1.12);
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 12px 32px rgba(59, 130, 246, 0.2), 
                        0 0 20px rgba(147, 112, 219, 0.15);
            border: 1px solid rgba(147, 112, 219, 0.3);
          }

          .brand-item img {
            max-height: 64px;
            max-width: 100%;
            object-fit: contain;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            opacity: 0.85;
            filter: brightness(0.95);
          }

          .brand-item:hover img {
            opacity: 1;
            filter: brightness(1.1) drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4));
            transform: scale(1.08);
          }
        `}</style>

        {/* Section Title avec breathing space */}
        <div className="text-center mb-4 pb-2">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
            Nous disposons de toutes les marques que vous désirez
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium">
            — Bienvenue chez nous !
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        <div className="brands-container">
          <div className="brands-track">
            {/* Premier set de logos */}
            {brands.map((brand) => (
              <div key={`${brand.id}-1`} className="brand-item">
                <img 
                  src={brand.src} 
                  alt={brand.name}
                  title={brand.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
            
            {/* Deuxième set pour la boucle continue */}
            {brands.map((brand) => (
              <div key={`${brand.id}-2`} className="brand-item">
                <img 
                  src={brand.src} 
                  alt={brand.name}
                  title={brand.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
