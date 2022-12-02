import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function LiveTranslation({
  languages,
  title, 
  artist,
  url,
  coverart,
  lyrics,
  saved
}) {
  const [selectedText, setSelectedText] = useState('');
  const [language, setLanguage] = useState(languages[0].code);
  const translationFetcher = useFetcher(); // fetcher for live translation
  const buttonFetcher = useFetcher(); // fetcher for adding to user collections
  
  useEffect(() => {
    translationFetcher.submit({
      word: selectedText,
      language,
      intent: "translate"
    }, {
      method: "post",
    });
  }, [language, selectedText]);
  // WARNING: Do NOT place the fetcher inside
  // the dependency list above.
  // Otherwise you'll encounter an infinite loop!

  // Handle save lyrics
  function saveLyrics() {
    buttonFetcher.submit({
      title,
      artist,
      url,
      coverart,
      lyrics,
      intent: "saveLyrics"
    }, {
      method: "post"
    })
  }

  // handle save text
  function saveWord() {
    buttonFetcher.submit({
      word: translationFetcher.data?.originalText,
      intent: "saveWord"
    }, {
      method: "post"
    })
  }

  // handle delete lyrics
  function deleteLyrics() {
    buttonFetcher.submit({
      url,
      intent: "delete"
    }, {
      method: "post"
    })
  }

  // determine which button to show
  let lyricsButton;
  if (saved) {
    lyricsButton = (
      <button
        type="button"
        onClick={deleteLyrics}
      >Delete from My Lyrics</button>
    )
  } else {
    lyricsButton = (
      <button
        type="button"
        onClick={saveLyrics}
      >Add to My Lyrics</button>
    )
  }
  
  return (
    <div>
      <div>
        <pre 
          onMouseUp={() => setSelectedText(window.getSelection().toString())}
        >{lyrics}</pre>
        {lyricsButton}
      </div>
      <div>
        <select
          onChange={e => setLanguage(e.target.value)}
        >
          {languages.map(language => (
            <option
              key={language.code}
              value={language.code}
            >
              {language.nativeName}
            </option>
          ))}
        </select>
        <p>{translationFetcher.data?.originalText}</p>
        <p>{translationFetcher.data?.translatedText}</p>
        <button
          type="button"
          onClick={saveWord}
        >Add to My Word List</button>
      </div>
    </div>
  )
}