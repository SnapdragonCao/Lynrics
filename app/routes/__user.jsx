import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "../utils/userSession.server";

export async function loader({ request }) {
  // redirect to login page when accessing user-only features without a user session
  const userId = await requireUserId({request});
  return json(userId);
}

export default function UserId() {
  return (
      <Outlet />
  )
}