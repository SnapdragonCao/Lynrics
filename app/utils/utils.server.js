import { ObjectId } from "mongodb";
import { db } from "./db.server";

// CRUD for words
/**
 * Insert a word into the user's vocabulary.
 * @param {Object} newEntry
 * @param {string} newEntry.userId
 * @param {string} newEntry.word
 */
export async function insertWord({
  userId,
  word,
}) {
  try {
    const collection = db.collection("wordRecords");

    // query to check if existed
    const query = { userId, word };

    const options = { upsert: true };

    // the new word to be inserted
    const update = { 
      $setOnInsert: { // if existed, don't do anything
        word, 
        userId
      }
    };
  
    const result = await collection.updateOne(query, update, options);
    if (result.upsertedId) {
      console.log(`A new word record was inserted with the _id: ${result.upsertedId}`);
    } else {
      console.log(`The word "${word}" already existed.`);
    }
  } catch(error) {
    console.dir(error)
  }
}

/**
 * Delete specified word from the user's vocabulary.
 * @param {Object} entry
 * @param {string} entry.userId
 * @param {string} entry.word
 */
export async function deleteWord({
  userId,
  word,
}) {
  try {
    const collection = db.collection("wordRecords");
  
    const result = await collection.deleteOne({
      userId,
      word
    });
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.")
    } else {
      console.log("No documents matched the query. Deleted 0 documents.")
    }
  } catch(error) {
    console.dir(error)
  }
}

/**
 * Get all words from the user.
 * @param {Object} options
 * @param {string} options.userId
 * @param {"word"|"createdTime"} [options.filter="word"]
 * @param {boolean} [options.desc=false]
 * @returns {Promise<string[]>|null} Array of matched words, or `null` if no words matched
 */
export async function listWords({
  userId,
  filter = "word",
  desc = false
}) {
  try {
    const collection = db.collection("wordRecords");

    let filterField = "word";
    if (filter === "createdTime") {
      filterField = "_id"; // the _id filed in MongoDB contains the creation timestamp
    }
    const query = { userId };
    const options = {
      // return documents in specified order by filter
      sort: { [filterField]: (desc ? -1 : 1), },
      projection: { _id: 0, word: 1, }
    };

    // no documents matched
    if (await collection.countDocuments(query) === 0) {
      console.log("No documents found!");
      return null;
    } else {
      const cursor = collection.find(query, options);
      const allWords = await cursor.toArray();
      await cursor.close();
      return allWords.map(entry => entry.word);
    }
  } catch(error) {
    console.dir(error);
  }
}

/**
 * Delete all words of a user. Used when an account is deleted.
 * @param {string} userId 
 */
export async function clearWords(userId) {
  try {
    const collection = db.collection("wordRecords");

    const query = { userId };

    const result = await collection.deleteMany(query);
    console.log(`Deleted ${result.deletedCount} documents.`);
  } catch(error) {
    console.dir(error);
  }
}

// CRUD for lyrics
/**
 * Insert a piece of lyrics into the user's lyrics list.
 * @param {Object} newEntry
 * @param {string} newEntry.userId
 * @param {string} newEntry.title
 * @param {string} newEntry.artist
 * @param {string} newEntry.url
 * @param {string} newEntry.coverart
 * @param {string} newEntry.lyrics
 */
 export async function insertLyrics({
  userId,
  title, 
  artist,
  url,
  coverart,
  lyrics,
}) {
  try {
    const collection = db.collection("lyricsRecords");

    // query to check if existed
    const query = { userId, url };
    const options = { upsert: true };

    // the new word to be inserted
    const update = { 
      $setOnInsert: {
        title,
        artist,
        url,
        coverart,
        lyrics, 
        userId,
      }
    };
  
    const result = await collection.updateOne(query, update, options);
    if (result.upsertedId) {
      console.log(`A new lyrics record was inserted with the _id: ${result.upsertedId}`);
    } else {
      console.log(`The lyrics for "${title}" already existed.`);
    }
  } catch(error) {
    console.dir(error);
  }
}

/**
 * Delete specified lyrics from the user's vocabulary.
 * @param {Object} entry
 * @param {string} entry.userId
 * @param {string} entry.url
 */
export async function deleteLyrics({
  userId,
  url
}) {
  try {
    const collection = db.collection("lyricsRecords");
  
    const result = await collection.deleteOne({
      userId,
      url
    });
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.")
    } else {
      console.log("No documents matched the query. Deleted 0 documents.")
    }
  } catch(error) {
    console.dir(error);
  }
}

/**
 * Get all song information of lyrics records of one user.
 * @param {Object} options
 * @param {string} options.userId
 * @param {"word"|"createdTime"} [options.filter="word"]
 * @param {boolean} [options.desc=false]
 * @returns {Promise<Object[]>|null} Object array of song information
 */
export async function listLyricsTitle({
  userId,
  filter = "title",
  desc = false
}) {
  try {
    const collection = db.collection("lyricsRecords");

    let filterField = "word";
    if (filter === "createdTime") {
      filterField = "_id"; // the _id filed in MongoDB contains the creation timestamp
    }
    const query = { userId };
    const options = {
      // return documents in specified order by filter
      sort: { [filterField]: (desc ? -1 : 1), },
      projection: { lyrics: 0, }
    };

    // no documents matched
    if (await collection.countDocuments(query) === 0) {
      console.log("No documents found!");
      return null;
    } else {
      const cursor = collection.find(query, options);
      const allLyrics = await cursor.toArray();
      await cursor.close();
      return allLyrics;
    }
  } catch(error) {
    console.dir(error);
  }
}

/**
 * Get the lyrics details by record _id.
 * @param {string} lyricsId 
 * @returns {Promise<string>} sprcified lyrics text
 */
export async function showLyrics(lyricsId) {
  try {
    const collection = db.collection("lyricsRecords");

    const query = { _id: ObjectId(lyricsId) };
    const options = {
      projection: { lyrics: 1}
    }

    const result = await collection.findOne(query, options);
    return result.lyrics;
  } catch(error) {
    console.dir(error);
  }
}

/**
 * Delete all lyrics records of a user. Used when an account is deleted.
 * @param {string} userId
 */
export async function clearLyrics(userId) {
  try {
    const collection = db.collection("lyricsRecords");

    const query = { userId: userId };

    const result = await collection.deleteMany(query);
    console.log(`Deleted ${result.deletedCount} documents.`);
  } catch(error) {
    console.dir(error);
  }
}