import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { getUserId } from "~/utils/userSession.server";

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }) {
  // Determine whether a user is logged in
  const userId = await getUserId(request);
  if (!userId) {
    return null;
  }

  return json({
    userId
  });
}

export default function App() {
  const userInfo = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <nav>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="myLyrics">My Lyrics</NavLink>
            </li>
            <li>
              <NavLink to="myVocabulary">My Vocabulary</NavLink>
            </li>
            <li>
              <NavLink to="settings/account">Account settings</NavLink>
            </li>
          </nav>
          <div>
            {userInfo ? 
              (
                <Form
                  method="post"
                  action="logout"
                >
                  <button
                    type="submit"
                  >Logout</button>
                </Form>
              ) :
              <Link to="login">Login/Signup</Link>}
          </div>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
