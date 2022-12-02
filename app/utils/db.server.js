import { MongoClient } from "mongodb";

const { MONGODB_URL, NODE_ENV } = process.env;

// Guard to prevent empty connection string.
if (!MONGODB_URL) {
  if (NODE_ENV === "production") {
    throw new Error(
      "Please define the MONGODB_URL environment variable."
    );
  } else {
    throw new Error(
      "Please define the MONGODB_URL environment variable inside an .env file."
    );
  }
} 

let client; // the MongoClient instance

// connection options
const options = {
  appname: "IT5007 Project",
  connectTimeoutMS: 5000,
}; 

if (NODE_ENV === "production") {
  client = new MongoClient(MONGODB_URL, options);
  console.log("MongoDB Client established. 🚀");
} else {
  /**
   * Remix purges the required cache on every request in DEV,
   * so we use `global.__client` to prevent repeated connections, 
   * which is similar to extending global object in TypeScript.
   * @see https://github.com/remix-run/remix/discussions/2198
   */
  if (!global.__client) { 
    global.__client = new MongoClient(MONGODB_URL, options);
    console.log("MongoDB Client established. 🚀");
  } 
  client = global.__client;
}

/**
 * No need to manually connect() now, the client is able to manage
 * the connection status as well as the connection pool.
 * @see https://www.mongodb.com/community/forums/t/mongo-isconnected-alternative-for-node-driver-v-4/117041/6
 * @return The MongoDB db handler from MongoClient.db()
 */
const db = client.db();
export { db };