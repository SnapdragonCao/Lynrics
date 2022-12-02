import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/userSession.server";
import { deleteWord, listWords } from "~/utils/utils.server";

export async function loader({ request }) {
  const userId = await requireUserId({ request });
  const words = await listWords({
    userId
  });
  return json(words);
}

export async function action({ request }) {
  const formData = await request.formData();
  const word = formData.get("word");
  const userId = await requireUserId({ request });

  await deleteWord({
    userId,
    word
  });

  return null;
}

export default function MyVocabulary() {
  const words = useLoaderData();
  return (
    <div>
      <h1>My Vocabulary</h1>
      <ul>
        {words ? words.map(word => (
          <li
            key={word}
          >
            <Form
              method="post"
            >
              <input
                type="text"
                name="word"
                readOnly
                value={word}
              />
              <button
                type="submit"
                name="intent"
                value="delete"
              >Delete</button>
            </Form>
          </li>
        )) : <p>No words saved yet.</p>}
      </ul>
    </div>
  );
}