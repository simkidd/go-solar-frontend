import React from "react";

const LoginForm = () => {
  return (
    <form>
      <div className="input-group mb-3">
        <input type="email" className="htmlForm-control" placeholder="Email" />
      </div>
      <div className="input-group mb-4">
        <input
          type="password"
          className="htmlForm-control"
          placeholder="password"
        />
      </div>
      <div className="htmlForm-group text-left">
        <div className="checkbox checkbox-fill d-inline">
          <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" />
          <label htmlFor="checkbox-fill-a1" className="cr">
            {" "}
            Save credentials
          </label>
        </div>
      </div>
      <button className="btn btn-primary shadow-2 mb-4">Login</button>
      <p className="mb-2 text-muted">
        Forgot password?{" "}
        <a href="/datta-able/react/default/auth/reset-password-1">Reset</a>
      </p>
      <p className="mb-0 text-muted">
        Don’t have an account?{" "}
        <a href="/datta-able/react/default/auth/signup-1">Signup</a>
      </p>
    </form>
  );
};

export default LoginForm;
