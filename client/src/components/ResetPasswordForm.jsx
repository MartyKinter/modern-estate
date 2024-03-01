import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
} from "../redux/user/userSlice";

const ResetPasswordForm = () => {
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      const res = await fetch(`api/auth/verifyToken?token=${token}`);
      const user = await res.json();
      setUserId(user.data);
    };

    verifyToken();

    // Clear the error message on page load
    dispatch(resetPasswordFailure(null));
    // Cleanup function
    return () => {
      // Clear the error message when the component is unmounted
      dispatch(resetPasswordFailure(null));
    };
  }, [token, dispatch]);

  const handleChange = (evt) => {
    setFormData({
      ...formData,
      [evt.target.id]: evt.target.value,
    });
  };

  const handleResetPassword = async (evt) => {
    evt.preventDefault();
    try {
      dispatch(resetPasswordStart());
      const requestBody = {
        ...formData,
        userId,
      };

      const res = await fetch(`api/auth/reset-password?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(resetPasswordFailure(data.message));
        return;
      }
      dispatch(resetPasswordSuccess(data));
      navigate("/sign-in");
      alert("password reset successfully");
    } catch (error) {
      dispatch(resetPasswordFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Reset Password
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="newPassword"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-3 rounded-lg"
          id="confirmNewPassword"
          onChange={handleChange}
        />
        <button
          className="bg-red-700 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Loading..." : "Reset"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default ResetPasswordForm;
