import bcrypt from "bcrypt";
import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";

import { db } from "./db.server";
import { ObjectId } from "mongodb";
import { clearLyrics, clearWords } from "./utils.server";
const { SESSION_SECRET, NODE_ENV } = process.env;
const saltRounds = 10;

/**
 * Add a new user into database if the email 
 * hasn't been used.
 * @param {Object} newUser
 * @param {string} newUser.username
 * @param {string} newUser.eamil
 * @param {string} newUser.password
 * @returns {Promise<object>|null} The inserted user object if succeeded
 */
export async function register({
  username,
  email,
  password
}) {
  try {
    const collection = await db.collection("users");
  
    // Check if the email has been registered
    const query = { email };
    if (await collection.countDocuments(query) !== 0) {
      console.log(`User with email ${email} already existed.`);
      return null;
    } else {
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const newUser = {
        username,
        email,
        passwordHash: passwordHash,
      };
      const result = await collection.insertOne(newUser);
      console.log(`A new user was inserted with the _id: ${result.insertedId}`);
      return result;
    }
  } catch (error) {
    console.dir(error);
  }
}

/**
 * Check if the user exists.
 * @param {string} email 
 * @returns `true` if the user exists.
 */
export async function userExists (email) {
  try {
    const collection = await db.collection("users");
    const user = await collection.findOne({ email: email });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Compare the email-password combination of the input
 * user info, return null if there's no match.
 * @param {Object} UserInfo
 * @param {string} UserInfo.email
 * @param {string} UserInfo.password
 * @returns {Promise<Object>|null} The matched user object or null
 */
export async function login({
  email,
  password
}) {
  try {
    const collection = await db.collection("users");
    const user = await collection.findOne({ email });
    if (!user) { // User not exist
      return null;
    }
    const isCorrectPassword = await bcrypt.compare(
      password,
      user.passwordHash
    );
    if (!isCorrectPassword) { // password not matched
      return null;
    }
    return user;
  } catch (error) {
    console.dir(error);
  }
}

/**
 * Check whether the password given matches the password of specified userId
 * @param {Object} options
 * @param {string} options.userId
 * @param {string} options.password
 * @returns `true` if the password is correct
 */
export async function checkPassword({
  userId,
  password
}) {
  try {
    const collection = await db.collection("users");
    const user = await collection.findOne({ _id: ObjectId(userId) });
    if (!user) {
      return false;
    }
    const isCorrectPassword = await bcrypt.compare(
      password,
      user.passwordHash
    );
    if (!isCorrectPassword) {
      return false;
    }
    return true;
  } catch (error) {
    console.dir(error);
  }
}

// Read the session secret in .env
if (!SESSION_SECRET) {
  throw new Error("Please set the SESSION_SECRET.");
}

/**
 * The session storage to store current user session.
 * @method `getSession` 
 * @method `comitSession` 
 * @method `destroySession`
 */
const storage = createCookieSessionStorage({
  cookie: {
    name: "ProjectUserSession",
    // This should normally be `secure: true`
    // but it doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    // path: "/", // is this necessary?
    maxAge: 60 * 60 * 24 * 7, // the coockie age should last for a week
    httpOnly: true,
  },
});

function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) {
    return null;
  }
  return userId;
}

/**
 * Get the userId in Cookie, or redirect to login page.
 * @param {Object} options
 * @param {Request} options.request
 * @param {string} [options.redirectTo]
 * @returns {Promise<string>} The userId stored in Cookie
 */
export async function requireUserId({
  request,
  redirectTo = new URL(request.url).pathname
}) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

/**
 * Retrieve the user object based on userId stored in cookies.
 * @param {Request} request 
 * @returns the user object
 */
export async function getUser(request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const collection = await db.collection("users");
    const query = {
      _id: ObjectId(userId)
    }
    const user = await collection.findOne(query);
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request, redirectTo = "/login") {
  const session = await getUserSession(request);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

/**
 * Create the cookie user for logged in user.
 * @param {string} userId 
 * @param {string} redirectTo 
 * @returns A `redirect` response
 */
export async function createUserSession(
  userId,
  redirectTo
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

/**
 * Delete a user as well as all records related.
 * @param {string} userId 
 */
export async function deleteUser(userId) {
  try {
    const collection = await db.collection("users");
    const query = {
      _id: ObjectId(userId),
    };
    const result = await collection.deleteOne(query);
    console.log(`${result.deletedCount} user has been deleted.`);
    await clearLyrics(userId);
    await clearWords(userId);
  } catch (error) {
    console.dir(error);
  }
}

/**
 * Update the password for a specified user.
 * @param {Object} options
 * @param {string} options.userId
 * @param {string} options.password
 * @returns {Promise<Object>} The updated user object.
 */
export async function changePassword({
  userId,
  password
}) {
  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const collection = await db.collection("users");
    const query = {
      _id: ObjectId(userId)
    };
    const updateDoc = {
      $set: {
        passwordHash: passwordHash
      }
    }
    const result = await collection.findOneAndUpdate(query, updateDoc);
    return result;
  } catch (error) {
    console.dir(error);
  }
}

/**
 * Update the username for a specified user.
 * @param {Object} options
 * @param {string} options.userId
 * @param {string} options.username
 * @returns {Promise<Object>} The updated user object.
 */
 export async function changeUsername({
  userId,
  username
}) {
  try {
    const collection = await db.collection("users");
    const query = {
      _id: ObjectId(userId)
    };
    const updateDoc = {
      $set: {
        username
      }
    }
    const result = await collection.findOneAndUpdate(query, updateDoc);
    return result;
  } catch (error) {
    console.dir(error);
  }
}

/**
 * Update the email for a specified user.
 * @param {Object} options
 * @param {string} options.userId
 * @param {string} options.email
 * @returns {Promise<Object>|null} The updated user object if the email is NOT being used.
 */
 export async function changeEmail({
  userId,
  email
}) {
  try {
    const collection = await db.collection("users");

    // Check if the email is being used.
    if (await collection.countDocuments({ email }) !== 0) {
      console.log("The email is being used by other account.");
      return null;
    } 

    const query = {
      _id: ObjectId(userId)
    };
    const updateDoc = {
      $set: {
        email
      }
    }
    const result = await collection.findOneAndUpdate(query, updateDoc);
    return result;
  } catch (error) {
    console.dir(error);
  }
}