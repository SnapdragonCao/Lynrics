import { Link, Outlet } from "@remix-run/react";
export default function UserSettings() {

  return (
    <div>
      <h1>Account Settings</h1>
      <ul>
        <li><Link to="account">Personal Details</Link></li>
        <li><Link to="password">Password Settings</Link></li>
        <li><Link to="deleteAccount">Delete My Account</Link></li>
      </ul>
      <Outlet />
    </div>
  )
}