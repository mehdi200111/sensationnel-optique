import React from 'react';

const slides = [
  {
    image: 'https://res.cloudinary.com/dhpaxqja8/image/upload/v1765682918/PROMPT_PHOTO_R_ALIST-197453_vv5up1.png',
  },
  {
    image: 'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766269221/Gemini_Generated_Image_1io9va1io9va1io9_raiuld.png',
  },
  {
    image: 'https://res.cloudinary.com/dhpaxqja8/image/upload/v1765683548/Gemini_Generated_Image_xj61cyxj61cyxj61_zbr4me.png',
  },
];

const HeroCarouselMobile = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
       
        height: '100%',
        overflow: 'hidden',
        bottom: '2px',
      }}
    >
      {/* IMAGE */}
      <img
        src={slides[currentIndex].image}
        alt="Hero slide"
        style={{
          
          width: '105.6vw',
          height: '500px',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: 'scale(1.05)',
          
        }}
      />

      {/* OVERLAY */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0,0,0,0.6))',
        }}
      />

      {/* ===== TITRE FIXE ===== */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '52%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          textAlign: 'center',
        
        }}
      >
        <h1    
  style={{
    margin: 0,
    fontFamily: "'Rubik Glitch', system-ui",
    fontSize: '1.6rem',
    fontWeight: '400', // Rubik Glitch n’a qu’un poids
    letterSpacing: '2px',
    color: '#fdfdfd8e',
    textTransform: 'uppercase',
    textShadow: '0 4px 20px rgba(0,0,0,0.6)',
    whiteSpace: 'nowrap',
  }}
>
  Sensationnel Optique
</h1>

      </div>

      {/* FLÈCHE GAUCHE */}
      <button
        onClick={() =>
          setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
        }
        style={arrowStyle('left')}
      >
        ‹
      </button>

      {/* FLÈCHE DROITE */}
      <button
        onClick={() =>
          setCurrentIndex((prev) => (prev + 1) % slides.length)
        }
        style={arrowStyle('right')}
      >
        ›
      </button>
    </div>
  );
};

/* ===== STYLE DU BOUTON ===== */
const buyButtonStyle = {
  padding: '14px 36px',
  fontFamily: '"BBH Hegarty", sans-serif',
  fontSize: '0.80rem',
  fontWeight: '400',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  color: '#ffffffff',
  backgroundColor: '#CCA042',
  border: 'none',
  borderRadius: '999px',
  cursor: 'pointer',
  boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
  transition: 'transform 0.3s ease',
};

/* ===== STYLE FLÈCHES ===== */
const arrowStyle = (side) => ({
  position: 'absolute',
  top: '50%',
  [side]: side === 'left' ? '25px' : '12px',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.45)',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '42px',
  height: '42px',
  fontSize: '22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 10,
});

export default HeroCarouselMobile;
