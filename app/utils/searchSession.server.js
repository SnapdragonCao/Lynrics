import { createCookieSessionStorage, json } from "@remix-run/node";

const { NODE_ENV, SESSION_SECRET } = process.env;

// Read the session secret in .env
if (!SESSION_SECRET) {
  throw new Error("Please set the SESSION_SECRET.");
}

/**
 * The session storage to store current search results.
 * @method `getSession` 
 * @method `comitSession` 
 * @method `destroySession`
 */
const storage = createCookieSessionStorage({
  cookie: {
    name: "SearchSession",
    // This should normally be `secure: true`
    // but it doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    maxAge: 60 * 10, // the coockie age should last only for a short time (10 min)
    httpOnly: true,
  },
});

function getSearchSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}

/**
 * Retrieve previous search results stored in Cookies.
 * Typically used in a `loader()`.
 * @param {Request} request 
 * @returns previous search result (if any) or `null`
 */
export async function getSearchResults(request) {
  const session = await getSearchSession(request);
  const searchResults = session.get("searchResults");
  if (!searchResults) {
    return null;
  }
  return searchResults;
}

/**
 * Used to save new search results into the cookies.
 * Can be returned directly at the end of an `action()`.
 * @param {Array<Object>} searchResults 
 * @returns The search results with correct `Set-Cookie` headers.
 */
export async function saveSearchResults(searchResults) {
  console.log("Enter the save search result function");
  const session = await storage.getSession();
  session.set("searchResults", searchResults);
  return json(
    searchResults,
    {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      }
    }
  );
}

export async function clearSearchResults(request) {
  const session = await getSearchResults(request);
  return json(null, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    }
  })
}