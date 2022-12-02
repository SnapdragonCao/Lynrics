import { 
  Link,
  Form,
  useActionData,
  useSearchParams
} from "@remix-run/react";
import { login, createUserSession, getUserId } from "~/utils/userSession.server";
import {
  validateEmail,
  validatePassword,
  badRequest
} from "~/utils/inputUtils.server";
import { redirect } from "@remix-run/node";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const fields = { email, password }; // save the info for usage later

  // validate the input
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  // if errors exist
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fields,
      fieldErrors
    });
  }

  // talk with database
  const user = await login(fields);
  if (!user) { // user not found
    return badRequest({
      fields,
      formError: `Email/Password combination is incorrect`,
    });
  }
  
  // the user info matched
  return createUserSession(user._id, redirectTo);
}

export async function loader({ request }) {
  // If a user already logged in, redirect to home page
  const userId = await getUserId(request);
  if (userId) {
    return redirect('/');
  }
  return null;
}

export default function Login() {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  return (
    <div>
      <h1>Log In</h1>
      <Form
        method="post"
      >
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? undefined}
        />
        <div>
          <label>Email
            <input
              type="text"
              name="email"
              placeholder="username@domain.com"
            />
          </label>
          {/* Show an error message if not validated. */}
          {actionData?.fieldErrors?.email ? (
            <span>{actionData.fieldErrors.email}</span>
          ) : null}
        </div>
        <div>
          <label>Password
            <input
              type="password"
              name="password"
            />
          </label>
          {/* Show an error massage if not validated. */}
          {actionData?.fieldErrors?.password ? (
            <span>{actionData.fieldErrors.password}</span>
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

      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}