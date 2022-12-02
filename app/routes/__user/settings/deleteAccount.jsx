import { Form } from "@remix-run/react";
import { requireUserId, checkPassword, deleteUser, logout } from "~/utils/userSession.server";
import { badRequest } from "~/utils/inputUtils.server";
export async function action({ request }) {
  const formData = await request.formData();
  const password = formData.get("password");

  // check the password
  const userId = await requireUserId({ request });
  if (!await checkPassword({
    userId,
    password
  })) { // password does not match
    return badRequest({
      password,
      formError: `Current password is incorrect`,
    });
  }

  // Delete the user
  await deleteUser(userId);
  return await logout(request, "/settings/deleteAccount/success");
}

export default function DeleteAccount() {

  return (
    <div>
      <Form 
        method="post"
      >
        <h2>Warning:</h2>
        <p>
          By deleting your account, 
          all data related to this account would be removed permanently.
          This behavior is irreversable.
        </p>
        <p>
          If you fully understand the consequences and still want to proceed, 
          please check the box below and provide your password.
        </p>
          <div>
          <label>
            <input 
              type="checkbox"
              // Use required to force the agreement check
              required
            />
            I understand the consequences of deleting my account.
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              name="password"
              required
            />
          </label>
        </div>
        <button
          type="submit"
        >Delete my account</button>
      </Form>
    </div>
  )
}