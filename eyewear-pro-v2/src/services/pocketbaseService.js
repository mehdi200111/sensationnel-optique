import pb from "../pocketbase.js";

// Authentication service
export const authService = {
    // Login with email and password
    async login(email, password) {
        try {
            console.log('PocketBase Service: Début validation connexion avec:', { email, password });
            console.log('PocketBase Service: URL PocketBase:', import.meta.env.VITE_PB_URL);
            
            // Logique de validation manuelle avec authWithPassword
            console.log('PocketBase Service: 1. Tentative d\'authentification...');
            const authData = await pb.collection('users').authWithPassword(email, password);
            
            console.log('PocketBase Service: 1. Authentification réussie');
            console.log('PocketBase Service: 2. Utilisateur trouvé:', authData.record.email);
            console.log('PocketBase Service: 3. Accès accordé');
            console.log('PocketBase Service: Connexion réussie:', authData);
            
            return { success: true, data: authData };
            
        } catch (error) {
            console.error('PocketBase Service: Erreur de connexion détaillée:', error);
            console.error('PocketBase Service: Status:', error.status);
            console.error('PocketBase Service: Message:', error.message);
            console.error('PocketBase Service: Data:', error.data);
            
            // Logique de validation explicite selon l'erreur
            if (error.status === 400) {
                if (error.message.includes('Failed to authenticate')) {
                    console.log('PocketBase Service: Analyse - Mot de passe incorrect');
                    return { success: false, error: 'Le mot de passe est incorrect' };
                } else if (error.message.includes('invalid')) {
                    console.log('PocketBase Service: Analyse - Identifiants invalides');
                    return { success: false, error: 'Les identifiants sont invalides' };
                } else {
                    console.log('PocketBase Service: Analyse - Erreur 400 générique');
                    return { success: false, error: 'Identifiants incorrects' };
                }
            } else if (error.status === 404) {
                console.log('PocketBase Service: Analyse - Email non trouvé');
                return { success: false, error: 'Cet email n\'existe pas dans notre base de données' };
            } else {
                console.log('PocketBase Service: Analyse - Erreur serveur');
                return { success: false, error: 'Erreur de connexion. Veuillez réessayer plus tard.' };
            }
        }
    },

    // Register new user
    async register(email, password, name) {
        try {
            const userData = await pb.collection('users').create({
                email,
                password,
                name,
                emailVisibility: true,
            });
            return { success: true, data: userData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Logout
    logout() {
        pb.authStore.clear();
    },

    // Get current user
    getCurrentUser() {
        return pb.authStore.record;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return pb.authStore.isValid;
    },

    // Listen to auth changes
    onAuthChange(callback) {
        return pb.authStore.onChange(callback);
    }
};

// Generic CRUD service for any collection
export const createCrudService = (collectionName) => ({
    // Get all records with pagination
    async getList(page = 1, perPage = 20, options = {}) {
        try {
            const result = await pb.collection(collectionName).getList(page, perPage, options);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get all records (no pagination)
    async getFullList(options = {}) {
        try {
            const result = await pb.collection(collectionName).getFullList(options);
            return { success: true, data: result };
        } catch (error) {
            console.error(`PocketBase Error in getFullList for ${collectionName}:`, error);
            return { success: false, error: error.message };
        }
    },

    async getFirstListItem(filter, options = {}) {
        try {
            const result = await pb.collection(collectionName).getFirstListItem(filter, options);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get single record by ID
    async getById(id, options = {}) {
        try {
            const result = await pb.collection(collectionName).getOne(id, options);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Create new record
    async create(data, options = {}) {
        try {
            const result = await pb.collection(collectionName).create(data, options);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update existing record
    async update(id, data, options = {}) {
        try {
            const result = await pb.collection(collectionName).update(id, data, options);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete record
    async delete(id, options = {}) {
        try {
            await pb.collection(collectionName).delete(id, options);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Subscribe to real-time changes
    subscribe(topic, callback, options = {}) {
        return pb.collection(collectionName).subscribe(topic, callback, options);
    },

    // Unsubscribe from real-time changes
    unsubscribe(topic) {
        pb.collection(collectionName).unsubscribe(topic);
    }
});

// Example: Create services for specific collections
export const productsService = createCrudService('products');
export const ordersService = createCrudService('orders');
export const categoriesService = createCrudService('categories');

const normalizeProductRecord = (record) => {
    console.log('DEBUG raw PocketBase record', record);
    console.log('DEBUG originalPrice value:', record?.originalPrice, 'type:', typeof record?.originalPrice);
    console.log('DEBUG price value:', record?.price, 'type:', typeof record?.price);
    const colors = Array.isArray(record?.colors) ? record.colors : (typeof record?.colors === 'string' ? [record.colors] : []);
    const images = Array.isArray(record?.images)
        ? record.images
        : (typeof record?.images === 'string' && record.images ? [record.images] : []);

    const toPublicUrl = (value) => {
        if (!value) return '';
        if (typeof value !== 'string') return '';
        if (/^https?:\/\//i.test(value)) return value;
        return pb.files.getURL(record, value);
    };

    const img = toPublicUrl(record?.img) || toPublicUrl(images[0]);
    const imageUrls = images.map(toPublicUrl).filter(Boolean);

    // Garder le tableau gender complet pour le filtrage inclusif
    const gender = Array.isArray(record?.gender) 
        ? record.gender.map(g => typeof g === 'string' ? g.toLowerCase() : g)
        : (typeof record?.gender === 'string' ? [record.gender.toLowerCase()] : []);
    const type = Array.isArray(record?.type) ? record.type[0] : record?.type;

    const normalized = {
        id: record?.legacyId ?? record?.id,
        pbId: record?.id,
        legacyId: record?.legacyId,
        name: record?.name,
        img,
        images: imageUrls.length ? imageUrls : (img ? [img] : []),
        price: record?.price,
        originalPrice: record?.originalPrice,
        promoPercentage: record?.promoPercentage,
        colors,
        gender: gender, // Conserver le tableau pour le filtrage inclusif
        type: type, // Extraire la première valeur du tableau
        description: record?.description,
        correctionInfo: record?.correctionInfo,
        inStock: record?.inStock,
        stockCount: record?.stockCount,
    };
    
    console.log('DEBUG normalized product:', normalized);
    return normalized;
};

export const productsApi = {
    async getShopList({ gender, type, bestseller } = {}) {
        const options = {};
        const filters = [];
        
        if (gender) {
            filters.push(pb.filter('gender ~ {:gender}', { gender }));
        }
        
        if (type) {
            filters.push(pb.filter('type ~ {:type}', { type }));
        }
        
        if (bestseller !== undefined) {
            filters.push(pb.filter('bestseller = {:bestseller}', { bestseller }));
        }
        
        if (filters.length > 0) {
            options.filter = filters.join(' && ');
        }

        const res = await productsService.getFullList(options);
        if (!res.success) return res;

        return {
            success: true,
            data: res.data.map(normalizeProductRecord),
        };
    },

    async getByLegacyId(legacyId) {
        const idNum = Number(legacyId);
        const filter = pb.filter('legacyId = {:id}', { id: idNum });
        const res = await productsService.getFirstListItem(filter);
        if (!res.success) return res;

        return {
            success: true,
            data: normalizeProductRecord(res.data),
        };
    },
};

// Historique des commandes service
export const historiqueCommandesService = {
    // Récupérer toutes les commandes de l'utilisateur connecté
    async getUserHistoriqueCommandes() {
        try {
            const user = pb.authStore.model;
            if (!user) {
                return { success: false, error: 'Utilisateur non connecté' };
            }

            const records = await pb.collection('commandes').getFullList({
                filter: `email = "${user.email}"`,
                sort: '-dateCommande',
            });

            return { success: true, data: records };
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des commandes:', error);
            
            // Gestion spécifique des erreurs
            let errorMessage = 'Erreur lors de la récupération de l\'historique des commandes';
            
            if (error.status === 401) {
                errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            } else if (error.status === 403) {
                errorMessage = 'Accès refusé. Permissions insuffisantes.';
            } else if (error.status === 404) {
                errorMessage = 'Collection des commandes non trouvée.';
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'Erreur de connexion au serveur PocketBase.';
            } else if (error.name === 'SyntaxError') {
                errorMessage = 'Erreur de format des données reçues.';
            } else if (error.status >= 500) {
                errorMessage = 'Erreur serveur PocketBase. Veuillez réessayer plus tard.';
            }
            
            return { 
                success: false, 
                error: errorMessage
            };
        }
    },

    // Mettre à jour le statut d'une commande
    async updateStatut(commandeId, nouveauStatut) {
        try {
            const updatedRecord = await pb.collection('commandes').update(commandeId, {
                statut: nouveauStatut
            });

            return { success: true, data: updatedRecord };
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            
            // Gestion spécifique des erreurs de mise à jour
            let errorMessage = 'Erreur lors de la mise à jour du statut';
            
            if (error.status === 404) {
                errorMessage = 'Commande non trouvée. Elle peut avoir été supprimée.';
            } else if (error.status === 403) {
                errorMessage = 'Permission refusée pour modifier cette commande.';
            } else if (error.status === 400) {
                errorMessage = 'Données invalides. Vérifiez le statut fourni.';
            } else if (error.status === 422) {
                errorMessage = 'Statut invalide. Valeurs autorisées: En attente, En cours, Livré.';
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'Erreur de connexion au serveur lors de la mise à jour.';
            } else if (error.status >= 500) {
                errorMessage = 'Erreur serveur lors de la mise à jour. Veuillez réessayer.';
            }
            
            return { 
                success: false, 
                error: errorMessage
            };
        }
    }
};

// Commandes service (pour les commandes actives)
export const commandesService = {
    // Récupérer toutes les commandes actives de l'utilisateur connecté
    async getUserCommandes() {
        try {
            const user = pb.authStore.model;
            if (!user) {
                return { success: false, error: 'Utilisateur non connecté' };
            }

            const records = await pb.collection('commandes').getFullList({
                filter: `user_id = "${user.id}"`,
                sort: '-dateCommande',
            });

            return { success: true, data: records };
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            return { 
                success: false, 
                error: 'Erreur lors de la récupération des commandes' 
            };
        }
    },

    // Archiver une commande dans l'historique
    async archiverCommande(commandeId) {
        try {
            // Récupérer la commande à archiver
            const commande = await pb.collection('commandes').getOne(commandeId);
            
            // Créer l'enregistrement dans l'historique
            const historiqueRecord = await pb.collection('historique_commandes').create({
                user_id: commande.user_id,
                order_id: commande.id,
                status: commande.statut,
                date: commande.dateCommande,
                total: commande.total,
                items: commande.produits
            });

            // Supprimer la commande de la collection active
            await pb.collection('commandes').delete(commandeId);

            return { success: true, data: historiqueRecord };
        } catch (error) {
            console.error('Erreur lors de l\'archivage de la commande:', error);
            return { 
                success: false, 
                error: 'Erreur lors de l\'archivage de la commande' 
            };
        }
    },

    // Mettre à jour le statut d'une commande active
    async updateStatut(commandeId, nouveauStatut) {
        try {
            const updatedRecord = await pb.collection('commandes').update(commandeId, {
                statut: nouveauStatut
            });

            return { success: true, data: updatedRecord };
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            return { 
                success: false, 
                error: 'Erreur lors de la mise à jour du statut' 
            };
        }
    }
};

export default pb;
