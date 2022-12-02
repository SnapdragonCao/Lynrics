import { Form, useActionData } from "@remix-run/react";
import { validatePassword, badRequest } from "~/utils/inputUtils.server";
import { changePassword, checkPassword, requireUserId } from "~/utils/userSession.server";


export async function action({ request }) {
  const formData = await request.formData();
  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("comfirmPassword");
  const fields = { currentPassword, newPassword, confirmPassword };

  if (newPassword !== confirmPassword) {
    return badRequest({
      fields,
      fieldError: `Password inputs not matched.`
    })
  }

  const isInvalid = validatePassword(newPassword);
  if (isInvalid) {
    return badRequest({
      fields,
      fieldError: isInvalid
    })
  }

  // check if current password matches
  const userId = await requireUserId({ request });
  if (!await checkPassword({
    userId,
    password: currentPassword
  })) { // password does not match
    return badRequest({
      fields,
      formError: `Current password is incorrect`,
    });
  }

  await changePassword({
    userId,
    password: newPassword
  });

  return null; // TODO: give a success message.
}

export default function PasswordEditor() {
  const actionData = useActionData();
  return (
    <Form
      method="post"
    >
      <div>
        <label>
          Current Password:
          <input
            type="password"
            name="currentPassword"
          />
        </label>
      </div>
      <div>
        <label>
          New Password:
          <input
            type="password"
            name="newPassword"
          />
        </label>
      </div>
      <div>
        <label>
          Comfirm Password:
          <input 
            type="password"
            name="comfirmPassword"
          />
        </label>
        {actionData ? (
          <p>{actionData.fieldError ?? actionData.formError}</p>
        ) : null}
      </div>
      <button 
        type="submit"
      >Change password</button>
    </Form>
  )
}