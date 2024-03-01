import { useState } from "react";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleForgotPassword = async (evt) => {
    evt.preventDefault();
    try {
      const response = await fetch("api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setSendSuccess(true);
      console.log("Email sent for password reset");
    } catch (error) {
      // Check if the error is due to unexpected JSON input
      if (error instanceof SyntaxError) {
        console.error(
          "Unexpected end of JSON input. Raw response:",
          error.message
        );
      } else {
        console.error(error.message);
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Forgot Password
      </h1>
      <p className="text-center mb-2">
        Please enter your email for password reset
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
        <input
          className="border p-3 rounded-lg"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-red-700 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Send Reset Email
        </button>
        {sendSuccess ? (
          <p className="text-green-700 text-center">Email sent successfully</p>
        ) : null}
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
