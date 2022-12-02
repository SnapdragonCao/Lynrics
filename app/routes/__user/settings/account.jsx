import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { badRequest, validateEmail, validateUsername } from "~/utils/inputUtils.server";
import { changeEmail, changeUsername, getUser, getUserId, userExists } from "~/utils/userSession.server"

export async function loader({ request }) {
  // Retrieve current user information
  const user = await getUser(request);
  const { username, email } = user;

  return json({
    username,
    email
  })
}

export async function action({ request }) {
  const formData = await request.formData();
  const updateField = formData.get("updateField");
  const username = formData.get("username");
  const email = formData.get("email");
  const fields = { username, email };

  // validation
  const fieldErrors = {
    email: validateEmail(email),
    username: validateUsername(username),
  };
  // if errors exist
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fields,
      fieldErrors
    });
  }
  
  // update user according to request
  const userId = await getUserId(request);

  if (updateField === "username") {
    // update the username
    await changeUsername({
      userId: userId,
      username
    });
  }

  if (updateField === "email") {
    if (await userExists(email)) {
      return badRequest({
        email,
        formError: `User with email ${email} already exists.`,
      });
    }

    // update the username
    await changeEmail({
      userId: userId,
      email
    });
  }
  return null; // todo: inform that the update was successful
}

export default function UserInfo() {
  const userDetails = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <Form
        method="post"
      >
        <div>
          <label>
            Username:
            <input
              name="username"
              defaultValue={userDetails.username}
            />
          </label>
          {actionData?.fieldErrors?.username ? (
            <span>{actionData?.fieldErrors.username}</span>
          ) : null}
          <button
            type="submit"
            name="updateField"
            value="username"
          >Change useername</button>
        </div>
        <div>
          <label>
            Email:
            <input
              name="email"
              defaultValue={userDetails.email}
            />
          </label>
          {actionData?.fieldErrors?.email ? (
            <span>{actionData?.fieldErrors.email}</span>
          ) : null}
          {actionData?.formError ? (
            <p>{actionData.formError}</p>
          ) : null}
          <button
            type="submit"
            name="updateField"
            value="email"
          >Change email</button>
        </div>
      </Form>
    </div>
  )
}