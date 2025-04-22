const mongoose = require('mongoose');

class Db {
  static async connect() {
    const MONGO_URI = process.env.MONGO_URI;
        
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('🛡️  Conexión a MongoDB Atlas establecida');
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error.message);
      process.exit(1); // Termina el server si no puede conectar
    }
  }
}

module.exports = Db;
