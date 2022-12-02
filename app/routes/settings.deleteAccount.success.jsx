
export function meta() {
  return {
    refresh: {
      httpEquiv: "refresh",
      content: "5;url=/",
    }
  }
}

export default function DeleteSuccess() {
  return (
    <div>
      <h1>
        Your account has been deleted.
      </h1>
      <p>We hope to see you again!</p>
    </div>
  )
}