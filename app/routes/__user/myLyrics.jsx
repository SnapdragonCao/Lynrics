import { json } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { requireUserId } from "~/utils/userSession.server"
import { deleteLyrics, listLyricsTitle } from "~/utils/utils.server"

export async function loader({ request }) {
  const userId = await requireUserId({ request });
  const tracks = await listLyricsTitle({
    userId
  });
  return json(tracks);
}

export async function action({ request }) {
  const userId = await requireUserId({ request });
  const formData = await request.formData();
  const url = formData.get("url");

  await deleteLyrics({
    userId,
    url
  });

  return null;
}

export default function MyLyrics() {
  const tracks = useLoaderData();
  return (
    <div>
      <h1>My Lyrics</h1>
      <ul>
          { tracks ? tracks.map(track => (
        <li key={track.url}>
          <Form
            key={track.url}
            action={track.title.replaceAll(' ', '')}
            method="post"
          >
            <button 
              type="submit"
              name="intent"
              value="retrieve"
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
                type="hidden"
                name="lyricsId"
                value={track._id}
              />
              <input 
                name="title"
                readOnly
                value={track.title}
              />
              <input 
                name="artist"
                readOnly
                value={track.artist}
              />
              <p><Link to={track.url}>Open in Shazam</Link></p>
            </button>
          </Form>
          <Form
            method="post"
          >
            <input 
              type="hidden"
              name="url"
              value={track.url}
            />
            <button
                type="submit"
                name="intent"
                value="delete"
            >Delete</button>
          </Form>
        </li>
        )) : (
          <p>No Lyrics Saved...</p>
        )}
      </ul>
    </div>
  )
}