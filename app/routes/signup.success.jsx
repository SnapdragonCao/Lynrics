import { Link } from "react-router-dom";

export function meta() {
  return {
    refresh: {
      httpEquiv: "refresh",
      content: "5;url=/login",
    }
  }
}

export default function Success() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Thank you for registration. Please log in with your new account.</p>
      <p>We will turn to the login page soon.</p>
      <p>To redirect manually, click <Link to="/login">Login in</Link></p>
    </div>
  );
}