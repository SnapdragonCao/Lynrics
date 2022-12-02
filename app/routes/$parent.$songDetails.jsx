import { getLyrics } from "genius-lyrics-api";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { ClientOnly } from "remix-utils";
import umi from "umi-request";
import LiveTranslation from "~/components/LiveTranslation.client";
import { requireUserId } from "~/utils/userSession.server";
import { deleteLyrics, insertLyrics, insertWord, showLyrics } from "~/utils/utils.server";

export async function action ({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log(intent);

  // handle request to search for lyrics
  if (intent === "search") {
    const title = formData.get("title");
    const artist = formData.get("artist");
    const coverart = formData.get("coverart");
    const url = formData.get("url");
    
    // query the Genius API
    const options = {
      apiKey: process.env.GENIUS_TOKEN,
      title: title,
      artist: artist,
      optimizeQuery: true,
    };

    const lyrics = await getLyrics(options);
    const songDetails = {
      title,
      artist,
      coverart,
      url,
      lyrics: lyrics ?? "No Match..."
    };
    return json(songDetails);
  }

  // handle request for live translation
  if (intent === "translate") {
    const originalText = formData.get("word");
    const language = formData.get("language");

    if (!originalText.length) { // prevent redundant API calls
      return null;
    }

    const result = await getTranslation(originalText, language);
    if (!result) {
      return json({
        originalText,
        translatedText: "Translation not found..."
      });
    }
    const translatedText = result[0]?.translations[0]?.text;
    // the result would return to the fetcher
    return json({
      originalText,
      translatedText
    });
  }

  // handle request for saving lyrics
  if (intent === "saveLyrics") {
    const userId = await requireUserId({ request });
    const title = formData.get("title");
    const artist = formData.get("artist");
    const coverart = formData.get("coverart");
    const url = formData.get("url");
    const lyrics = formData.get("lyrics"); 

    await insertLyrics({
      userId,
      title,
      artist,
      url,
      coverart,
      lyrics
    });

    return null;
  }

  // handle request for saving word
  if (intent === "saveWord") {
    const userId = await requireUserId({ request });
    const word = formData.get("word");

    if (!word) {
      return null;
    }

    await insertWord({
      userId,
      word
    });

    return null;
  }

  // handle request for retrieving lyrics
  if (intent === "retrieve") {
    const title = formData.get("title");
    const artist = formData.get("artist");
    const coverart = formData.get("coverart");
    const url = formData.get("url");
    const lyricsId = formData.get("lyricsId");
    console.log(lyricsId)
    const lyrics = await showLyrics(lyricsId);

    return json({
      title,
      artist,
      coverart,
      url,
      lyrics,
      saved: true,
    })
  }

  // handle request for deleting lyrics
  if (intent === "delete") {
    const userId = await requireUserId({ request });
    const url = formData.get("url");

    await deleteLyrics({
      userId,
      url
    });
    return redirect("/myLyrics");
  }

  return null;
}
  

export default function SongDetails() {
  const actionData = useActionData();
  
  return (
    <div>
      <div>
        <img
          src={actionData?.coverart}
          alt={actionData?.title}
          width="140"
          height="140"
        />
        <p>{actionData?.title}</p>
        <p>{actionData?.artist}</p>
      </div>
      <h1>Lyrics</h1>
      <ClientOnly fallback={<StaticLyrics lyrics={actionData?.lyrics} />}>
        {() => (
          <LiveTranslation
            title={actionData?.title}
            coverart={actionData?.coverart}
            artist={actionData?.artist}
            url={actionData?.url}
            lyrics={actionData?.lyrics}
            languages={languages}
            getTranslation={getTranslation}
            saved={actionData?.saved}
          />
        )}
      </ClientOnly>
    </div>
  );
}

function StaticLyrics({
  lyrics
}) {
  return (
    <pre>{lyrics}</pre>
  )
}

async function getTranslation(word, to) {
  const url = 'https://microsoft-translator-text.p.rapidapi.com/translate';
  const options = {
    params: {
      'to[0]': to,
      'api-version': '3.0',
      profanityAction: 'NoAction',
      textType: 'plain'
    },
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPID_MICROSOFT_TRANSLATOR_KEY,
      'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
    },
    data: `[{"Text": "${word}"}]`
  };

  try {
    const result = await umi.post(url, options);
    return result;
  } catch (error) {
    return null;
  }
}

const languages = [
  { nativeName: '简体中文', code: 'zh-Hans'},
  { nativeName: '繁体中文', code: 'zh-Hant'},
  { nativeName: '한국어', code: 'ko'},
  { nativeName: 'English', code: 'en'},
  { nativeName: '日本語', code: 'ja'},
  { nativeName: 'Deutsch', code: 'de'},
  { nativeName: 'Español', code: 'es'},
];