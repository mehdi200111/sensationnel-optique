import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090');

// Désactiver l'auto-cancellation pour éviter les erreurs lors de la navigation
pb.autoCancellation(false);

// Optional: Add request hooks for debugging
pb.beforeSend = function (url, options) {
    console.log('Sending request to:', url);
    return { url, options };
};

pb.afterSend = function (response, data) {
    console.log('Response status:', response.status);
    return data;
};

export default pb;
