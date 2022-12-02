import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import umi from "umi-request";
import { getSearchResults, saveSearchResults } from "~/utils/searchSession.server";

export async function loader({ request }) {
  // Load the previous research results if applicable.
  const searchResults = await getSearchResults(request);
  if (searchResults) {
    return json(searchResults);
  }
  return null;
}

export async function action({ request }) {
  const formData = await request.formData();
  const songFile = formData.get("songFile");
  const songTitle = formData.get("songTitle");

  // variables to store the result
  let tracksByFile = [];
  let tracksByTitle = [];

  // query the REST API
  if (songFile?.size) { // search by song, add a guard in case JS is not enabled.
    const songData = new FormData();
    songData.append("file", songFile);
    const url = 'https://shazam-core.p.rapidapi.com/v1/tracks/recognize';
    const options = {
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_SHAZAM_CORE_KEY,
        'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com',
      },
      data: songData
    };

    const result = await umi.post(url, options)
      .catch(error => console.log(error));
    if (result.matches.length) { // when the file matches a song
      // ↓ When tested with Ikiru by Tokyo Jihen, a different format of data is returned
      const track = result.track ?? result; 
      tracksByFile = [{
        key: track.key,
        title: track.title,
        subtitle: track.subtitle,
        url: track.url,
        // Use ?. to prevent error, see https://zh.javascript.info/optional-chaining
        coverart: track?.images?.coverart ?? "https://upload.wikimedia.org/wikipedia/commons/f/f8/No-image-available-4X3.png",
      }];
    }
  }

  if (songTitle?.length) { // search by title
    const url = 'https://shazam.p.rapidapi.com/search';
    const options = {
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_SHAZAM_KEY,
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
      },
      params: {
        term: songTitle, 
        locale: 'en-US', 
        offset: '0', 
        limit: '5'
      }, //parameters
    }
    const result = await umi.get(url, options)
      .catch(error => console.log(error));
    if (Object.keys(result).length) { // when the title matches any song
      // filter out unnecessary data to reduce transition size
      tracksByTitle = result.tracks.hits.map(trackObject => {
        const track = trackObject.track;
        return ({
          key: track.key,
          title: track.title,
          subtitle: track.subtitle,
          url: track.url,
          coverart: track?.images?.coverart ?? "https://upload.wikimedia.org/wikipedia/commons/f/f8/No-image-available-4X3.png",
        })
      });
    }
  }
  // Determine which result to return
  if (tracksByFile.length || tracksByTitle.length) {
    const searchResults = tracksByFile.length ? tracksByFile : tracksByTitle;
    return await saveSearchResults(searchResults);
  }
  return null; // indicate no match
}

export default function SearchResults() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const tracks = actionData ?? loaderData;
  
  return (
    <div>
      <h1>Searching Result</h1>
      <div>
        { tracks ? tracks.map(track => (
        <Form
          key={track.key}
          action={track.title.replaceAll(' ', '')}
          method="post"
        >
          <button 
            type="submit"
            name="intent"
            value="search"
          >
            <img
              src={track.coverart}
              width={140}
              height={140}
              alt={track.title}
            />
            <input
              type="hidden"
              name="coverart"
              value={track.coverart}
            />
            <input 
              type="hidden"
              name="url"
              value={track.url}
            />
            <input 
              name="title"
              readOnly
              value={track.title}
            />
            <input 
              name="artist"
              readOnly
              value={track.subtitle}
            />
            <p><Link to={track.url}>Open in Shazam</Link></p>
          </button>
        </Form>
        )) : (
          <p>No Match...</p>
        )}
      </div>
    </div>
  )
}