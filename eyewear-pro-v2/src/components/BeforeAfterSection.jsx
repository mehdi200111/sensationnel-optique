import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ImageRevealSlider() {
  const [pos, setPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const imageA =
    "https://res.cloudinary.com/dhpaxqja8/image/upload/v1771712303/IMG_7957_gca5ca.jpg";
  const imageB =
    "https://res.cloudinary.com/dhpaxqja8/image/upload/v1771712297/b30c5f35-ef28-45b6-af26-e035f8d4b60d_rplh9u.jpg";

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setIsDragging(true);
    handleMove(touch.clientX);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startX);
      const deltaY = Math.abs(touch.clientY - startY);
      
      // Si le mouvement est principalement horizontal, bloquer le défilement de la page
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
        handleMove(touch.clientX);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchend', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 0",
      }}
    >
      {/* Titre et sous-titre */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          padding: "0 20px",
        }}
      >
        <h2
          style={{
            fontFamily: '"BBH Hegarty", sans-serif', // Même police que Bestsellers
              fontWeight: 400,
              letterSpacing: '1.3',
              textAlign: 'center',
              color: '#0c0c0cff',
              textTransform: 'uppercase',
              margin: '0 0 20px 0',
              zIndex: 10,
          }}
        >
          Double Usage, Double Avantage : Vue & Soleil
        </h2>
        <p
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            textAlign: 'center',
            color: '#dfc379ff',
            fontSize: '1rem',
            lineHeight: '1.6',
            margin: '0',
            fontWeight: '400',
            letterSpacing: 'normal',
          }}
        >
          Passez de la précision de la vision à la protection solaire en un simple geste.
        </p>
      </div>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          height: "auto",
          minHeight: "300px",
          aspectRatio: "600/350",
          overflow: "hidden",
          borderRadius: "12px",
          border: "3px solid #e6d3a34d",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
          touchAction: "pan-y", // Permet le défilement vertical mais bloque le pan horizontal
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* IMAGE B (dessous) */}
        <img
          src={imageB}
          alt="After"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* IMAGE A (dessus, masquée) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pos}%`,
            overflow: "hidden",
          }}
        >
          <img
            src={imageA}
            alt="Before"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Ligne */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "4px",
            background: "3px solid #e6d3a34d",
            left: `${pos}%`,
            transform: "translateX(-2px)",
            zIndex: 10,
          }}
        />

        {/* Cercle */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${pos}%`,
            transform: "translate(-50%, -50%)",
            width: "48px",
            height: "48px",
            background: " #ffffffff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: "bold",
            boxShadow: "0 0 10px 999",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"/>
          </svg>
        </div>

        {/* Slider invisible - supprimé car le glissement se fait sur toute l'image */}

        {/* Labels */}
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "20px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "20px",
            fontWeight: "bold",
            zIndex: 40,
            fontSize: "12px",
          }}
        >
          <span>Before</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "10px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "20px",
            fontWeight: "bold",
            zIndex: 40,
            fontSize: "12px",
          }}
        >
          <span>After</span>
        </div>
      </div>

      {/* Bouton "Obtenir ce look" */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
          padding: "0 20px",
        }}
      >
        <button
          onClick={() => navigate('/collections')}
          style={{
            backgroundColor: "#E6D3A3",
            color: "#0c0c0c",
            border: "2px solid #E6D3A3",
            borderRadius: "50px",
            padding: "16px 32px",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "1px",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 8px 25px rgba(230, 211, 163, 0.3)",
            fontFamily: '"BBH Hegarty", sans-serif',
            position: "relative",
            overflow: "hidden",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            minWidth: "200px",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 35px rgba(230, 211, 163, 0.4)";
            e.currentTarget.style.borderColor = "#D4AF37";
            e.currentTarget.style.backgroundColor = "#d4c3a3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(230, 211, 163, 0.3)";
            e.currentTarget.style.borderColor = "#E6D3A3";
            e.currentTarget.style.backgroundColor = "#E6D3A3";
          }}
        >
          <span>Obtenir ce look</span>
          
          {/* Flèche */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              flexShrink: 0,
              transition: "transform 0.3s ease",
            }}
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
