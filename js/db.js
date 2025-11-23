// ============================================
// NearBuy - Mock Database
// Stores and Products Data
// ============================================

export const DB = {
  stores: [
    {
      id: 1,
      name: "Brookie",
      category: "Restaurant",
      whatsappNumber: "923018806666",
      imageUrl: "/assets/images/brookie/brookielogo.jpg"
    },
  ],

  products: [
    // Brookie Products (Store ID: 1)
    {
      id: 101,
      storeId: 1,
      name: "Triple Chocolate",
      price: 280,
      imageUrl: "/assets/images/brookie/triplechocolate.jpg"
    },
    {
      id: 102,
      storeId: 1,
      name: "Classic Chocolate Chip",
      price: 250,
      imageUrl: "/assets/images/brookie/classic_chocolate_chip.jpg"
    },
    {
      id: 103,
      storeId: 1,
      name: "Lotus",
      price: 300,
      imageUrl: "/assets/images/brookie/lotus.webp"
    },
    {
      id: 104,
      storeId: 1,
      name: "Nutella",
      price: 280,
      imageUrl: "/assets/images/brookie/nutella.jpg"
    },
    {
      id: 104,
      storeId: 1,
      name: "Peanut Butter",
      price: 300,
      imageUrl: "/assets/images/brookie/PeanutButter.webp"
    },
  ],

  // Helper methods
  getStoreById(id) {
    return this.stores.find(store => store.id === id);
  },

  getProductsByStoreId(storeId) {
    return this.products.filter(product => product.storeId === storeId);
  },

  getProductById(id) {
    return this.products.find(product => product.id === id);
  },

  getStoresByCategory(category) {
    if (category === 'All') {
      return this.stores;
    }
    return this.stores.filter(store => store.category === category);
  },

  getAllCategories() {
    const categories = ['All', ...new Set(this.stores.map(store => store.category))];
    return categories;
  }
};
