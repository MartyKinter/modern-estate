import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFalure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (evt) => {
    setFormData(
      {
        ...formData,
        [evt.target.id]: evt.target.value
      }
    );
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try{
      dispatch(signInStart());

      const res = await fetch('api/auth/signin', {
        method:'POST',
        headers:{
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if(data.success === false){
        dispatch(signInFalure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    }catch(error){
      dispatch(signInFalure(error.message));
    }
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Navigate to the password reset page
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button 
          disabled={loading} 
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>{"Don't have an account?"}</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      <div className="mt-3">
        <button
          onClick={handleForgotPassword}
          className="text-blue-700 hover:underline focus:outline-none"
        >
          Forgot Password?
        </button>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
