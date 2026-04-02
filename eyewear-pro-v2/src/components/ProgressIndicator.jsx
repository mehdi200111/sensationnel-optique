import React from 'react';

const ProgressIndicator = ({ displayedCount, totalCount, onLoadMore }) => {
  const progressPercentage = totalCount > 0 ? (displayedCount / totalCount) * 100 : 0;
  const isMobile = window.innerWidth <= 768;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '40px 20px' : '60px 40px',
    margin: '0 auto',
    maxWidth: '600px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const textStyle = {
    fontSize: isMobile ? '14px' : '16px',
    color: '#666666',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    marginBottom: '16px',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: '0.5px'
  };

  const progressBarContainerStyle = {
    width: '100%',
    height: '4px',
    backgroundColor: '#f0f0f0',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '32px'
  };

  const progressBarStyle = {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
    width: `${progressPercentage}%`
  };

  const buttonStyle = {
    padding: isMobile ? '16px 32px' : '18px 40px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #000000',
    borderRadius: '4px',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '500',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#000000',
    color: '#ffffff'
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div style={containerStyle}>
      <div style={textStyle}>
        Vous avez consulté {displayedCount} de {totalCount} des produits
      </div>
      
      <div style={progressBarContainerStyle}>
        <div style={progressBarStyle} />
      </div>

      {displayedCount < totalCount && (
        <button
          style={isHovered ? buttonHoverStyle : buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onLoadMore}
        >
          Charger plus
        </button>
      )}
    </div>
  );
};

export default ProgressIndicator;
