import React from 'react';
import whatsappIcon from '../assets/whatsapp.png';
const WhatsAppButton = () => {
  const phoneNumber = '212678559897'; // Remplace par ton numéro avec l'indicatif pays
  const message = encodeURIComponent('Bonjour 👋');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '5px',
        width: '60px',
        height: '60px',
        backgroundColor: '#ffffffff',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        zIndex: 999,
        cursor: 'pointer',
      }}
    >
      <img
        src={whatsappIcon} // Tu peux mettre l'icône WhatsApp que tu veux
        alt="WhatsApp"
        style={{ width: '90px', height: '90px' }}
      />
    </a>
  );
};

export default WhatsAppButton;
