export const availableColors = [
    { name: 'Noir', hex: '#000000' },
    { name: 'Marron', hex: '#8B4513' },
    { name: 'Blanc', hex: '#FFFFFF', border: '1px solid #ccc' },
    { name: 'Bleu', hex: '#0000FF' },
    { name: 'Rouge', hex: '#FF0000' },
    { name: 'Or', hex: '#FFD700' },
    { name: 'Argent', hex: '#C0C0C0' },
    { name: 'Rose', hex: '#FF69B4' },
    { name: 'Écaille', hex: '#964B00', background: 'repeating-linear-gradient(45deg, #A0522D, #A0522D 10px, #D2B48C 10px, #D2B48C 20px)' },
];

export const productsData = [
    {
        id: 1,
        name: 'Lunetes Aviator',
        price: 990,
        originalPrice: 1150,
        promoPercentage: 22,
        colors: ['Noir', 'Marron'],
        gender: 'Homme',
        
        description: "Un classique intemporel revisité pour un style moderne et élégant. Idéal pour les sorties quotidiennes ou les occasions spéciales.",
        correctionInfo: "Disponible avec verres correcteurs adaptés à votre prescription, options anti-reflets et anti-rayures.",
        inStock: true,
        stockCount: 2,
        images: [ 
            'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766252227/Gemini_Generated_Image_t3jesrt3jesrt3je_etmd8j.png', 
            'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766252227/Gemini_Generated_Image_t3jesrt3jesrt3je_etmd8j.png', 
            'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766252227/Gemini_Generated_Image_t3jesrt3jesrt3je_etmd8j.png', 
        ], 
    },
    {
        id: 2,
        name: 'Lunettes Wayfarer Classique',
        price: 1290,
        originalPrice: 1500,
        promoPercentage: 15,
        colors: ['Noir', 'Bleu'],
        gender: 'Homme',
        
        description: "L'icône des années 50. Un style décontracté et élégant, idéal pour la ville et les activités quotidiennes.",
        correctionInfo: "Verres correcteurs disponibles avec options de protection UV et traitement anti-reflets.",
        inStock: true,
        stockCount: 10,
        images: [
            'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766252227/Gemini_Generated_Image_t3jesrt3jesrt3je_etmd8j.png', 
            'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766252227/Gemini_Generated_Image_t3jesrt3jesrt3je_etmd8j.png', 
            'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766252227/Gemini_Generated_Image_t3jesrt3jesrt3je_etmd8j.png', 
        ], 
    },
    {
        id: 4,
        name: 'Lunetes Aviator',
        price: 890,
        originalPrice: 1150,
        promoPercentage: 22,
        colors: ['Noir', 'Marron'],
        gender: 'Homme',
    
        description: "Un classique intemporel revisité pour un style moderne et élégant. Idéal pour les sorties quotidiennes ou les occasions spéciales.",
        correctionInfo: "Disponible avec verres correcteurs adaptés à votre prescription, options anti-reflets et anti-rayures.",
        inStock: true,
        stockCount: 2,
        images: [ 
            'https://i.imgur.com/47df43.jpg', 
            'https://i.imgur.com/47dee5.jpg', 
            'https://via.placeholder.com/300x300.png?text=Aviator+Profile',
        ], 
    },
];