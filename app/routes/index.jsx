import { Form, useSubmit } from "@remix-run/react";
import { useState, useRef } from "react";
import { ClientOnly } from "remix-utils";
import Recorder from "~/components/Recorder.client";
import { clearSearchResults } from "~/utils/searchSession.server";

export async function loader({ request }) {
  // clear previous search results here
  return await clearSearchResults(request);
}

export default function Home() {

  const [songFile, setSongFile] = useState(new Blob());
  const formRef = useRef(null);
  const submit = useSubmit();
  // handle the submit manully
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(formRef.current); // get current form data
    formData.append("songFile", songFile, "input.mp3");
    submit(
      formData,
      { method: "post", action: "searchResults", encType: "multipart/form-data" }
    );
  }

  return (
    <div>
      <p>This is the project made by Clan of Coding Zen</p>
      <Form 
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        action="searchResults"
        ref={formRef}
      >
        <ClientOnly fallback={<p>You neet to enable Javascript to use the recorder.</p>}>
          {/* The recorder should be rendered only on client side */}
          {() => (
            <Recorder 
              setSongFile={setSongFile} 
              name="songData"
              submit={submit}
            />
          )}
        </ClientOnly>
        <input type="text" name="songTitle" />
        <button type="submit">Search song</button>
      </Form>
    </div>
  );
}
