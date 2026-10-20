import mongoose from 'mongoose';
import dns from 'dns';

// Configure reliable DNS servers to resolve MongoDB Atlas SRV records on Windows/Node environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[DB] Custom DNS setup warning:', dnsErr.message);
}

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Implements non-blocking connection handling so the Express server
 * and static resume endpoints remain available even if the database is offline.
 */
export const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[DB] MONGODB_URI is not set in environment variables. Database operations will be unavailable.');
    return null;
  }

  // Ensure default database name is set if missing from URI
  if (uri.endsWith('/')) {
    uri += 'portfolio?retryWrites=true&w=majority';
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    console.warn('[MongoDB] Running in offline database mode. Resumes and health check remain fully functional.');
    return null;
  }
};

export default connectDB;
