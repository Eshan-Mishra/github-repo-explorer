function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700"
    >
      {message}
    </div>
  );
}

export default ErrorMessage;
