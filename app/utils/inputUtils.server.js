import { json } from "@remix-run/node";

export function validateEmail(email) {
  if (typeof email !== "string" || !email.includes("@")) {
    return "That doesn't look like an email address";
  }
}

export function validateUsername(username) {
  if (typeof username !== "string" || username.length < 3) {
    return `Username must be at least 3 characters long`;
  }
}

export function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters long";
  }
}

export function badRequest(data) {
  return json(data, { status: 422 });
}