import {
  Link,
  Form,
  useActionData,
} from "@remix-run/react";
import {
  register,
  userExists,
} from "~/utils/userSession.server";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  badRequest
} from "~/utils/inputUtils.server";
import { redirect } from "@remix-run/node";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");

  // Save field data if needed later
  const fields = { email, username, password };

  const fieldErrors = {
    email: validateEmail(email),
    username: validateUsername(username),
    password: validatePassword(password),
  };

  // if errors exist
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fields,
      fieldErrors
    });
  }

  // Check if the user already existed
  if (await userExists(email)) {
    return badRequest({
      fields,
      formError: `User with email ${email} already exists.`,
    })
  }

  await register(fields);
  // return to login page after create a user
  return redirect("signup/success");
}

export default function Signup() {
  const actionData = useActionData();
  return (
    <div>
      <h1>Sign Up</h1>
      <Form
        method="post"
      >
        <div>
          <label>Email
            <input
              type="text"
              name="email"
              placeholder="username@domain.comm"
            />
          </label>
          {actionData?.fieldErrors?.email ? (
            <span>{actionData?.fieldErrors.email}</span>
          ) : null}
        </div>
        <div>
          <label>Username
            <input
              type="text"
              name="username"
            />
          </label>
          {actionData?.fieldErrors?.username ? (
            <span>{actionData?.fieldErrors.username}</span>
          ) : null}
        </div>
        <div>
          <label>Password
            <input
              type="password"
              name="password"
            />
          </label>
          {actionData?.fieldErrors?.password ? (
            <span>{actionData?.fieldErrors.password}</span>
          ) : null}
        </div>
        <div id="form-validation-error">
            {actionData?.formError ? (
              <p>{actionData.formError}</p>
            ) : null}
        </div>
        <button type="submit">
          Submit
        </button>
      </Form>
      
      <p>It will go to example user page after submitting. 
        Will implement keeping user session and talk with database later.
      </p>

      <Link to="/">Home</Link>
          
    </div>
  )
}