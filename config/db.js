import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ Error: MONGODB_URI no está definido");
    throw new Error("MONGODB_URI no definido");
  }
  console.log("🔌 Conectando a MongoDB Atlas...");
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const name = conn.connection.name || (conn.connection.db && conn.connection.db.databaseName) || "desconocida";
    const uriHost = (uri.split("@")[1] || "").split("/")[0] || "host-desconocido";
    console.log("✅ Conectado a MongoDB Atlas");
    console.log("📦 Base activa:", name);
    console.log("🌍 Cluster:", uriHost);
    return conn;
  } catch (err) {
    console.error("❌ Error al conectar con MongoDB:", err.message);
    throw err;
  }
};
