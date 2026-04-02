import React, { useState, useEffect } from 'react';

const CarouselOptimizedImage = ({ src, alt, className, style, preloadImages = [], ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Précharger toutes les images du carrousel
  useEffect(() => {
    preloadImages.forEach(imageSrc => {
      if (imageSrc && imageSrc !== src) {
        const img = new Image();
        img.src = imageSrc;
      }
    });
  }, [preloadImages, src]);

  // Réinitialiser l'état seulement si la source change vraiment
  useEffect(() => {
    if (src !== currentSrc) {
      setCurrentSrc(src);
      setIsLoaded(false);
      setHasError(false);
    }
  }, [src, currentSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true); // Arrêter le skeleton même en cas d'erreur
  };

  return (
    <div 
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        ...style
      }}
      className={className}
    >
      {/* Skeleton uniquement pour le premier chargement */}
      {!isLoaded && !hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 0.5s infinite',
            zIndex: 1
          }}
        />
      )}

      {/* Image */}
      <img
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          display: isLoaded ? 'block' : 'none',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transition: 'opacity 0.2s ease',
          opacity: isLoaded ? 1 : 0
        }}
        {...props}
      />

      {/* Placeholder en cas d'erreur */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#999',
            fontSize: '14px',
            textAlign: 'center'
          }}
        >
          Image non disponible
        </div>
      )}

      {/* Animation shimmer plus rapide pour le carrousel */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CarouselOptimizedImage;
