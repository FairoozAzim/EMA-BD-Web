import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Invalid email or password.");
        }

        return data;
      })
      .then((data) => {
        if (data.email) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);

          login();
          setRole(data.role);

          setSuccess("Login successful! Redirecting...");

          setTimeout(() => {
            navigate("/dashboard");
          }, 800);
        } else {
          throw new Error("Invalid email or password.");
        }
      })
      .catch((error) => {
        setError(error.message || "Something went wrong. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 pt-12 md:pt-16 pb-16">
        <div className="mx-auto max-w-md">
          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
              Welcome Back!
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-5 text-slate-600 md:text-base">
              Please login to access the EMA Bangladesh dashboard.
            </p>
          </div>

          {/* Login Card */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all duration-300 focus:border-[#0F2A5F] focus:outline-none focus:ring-2 focus:ring-[#0F2A5F]/20"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all duration-300 focus:border-[#0F2A5F] focus:outline-none focus:ring-2 focus:ring-[#0F2A5F]/20"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-600">
                  {success}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#0F2A5F] px-5 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-[#0b214b] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0F2A5F] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;