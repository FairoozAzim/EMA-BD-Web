/* eslint-disable react/no-unescaped-entities */
import { useForm } from "react-hook-form";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="text-center">
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xs text-slate-600 md:text-base">
            Have a question, suggestion, or want to get in touch with our
            community? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:grid-cols-5">
          {/* Left Information */}
          <div className="relative overflow-hidden bg-[var(--navy-blue-color)] px-7 py-10 text-white sm:px-10 lg:col-span-2 lg:px-10 lg:py-12">
            {/* Decorative Circles */}
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-white/10" />
            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full border border-white/10" />

            <div className="relative">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
                Get in touch
              </p>

              <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
                We're here to help.
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/65">
                Whether you're an Erasmus Mundus student, alumnus, prospective
                applicant, or simply interested in our community, feel free to
                reach out to us.
              </p>

              {/* Contact Items */}
              <div className="mt-10 space-y-7">
                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.7"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="mt-1 text-sm text-white/55">
                      Reach out through the form
                    </p>
                  </div>
                </div>

                {/* Community */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.7"
                        d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 110 8 4 4 0 010-8zm6 4a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Community</p>
                    <p className="mt-1 text-sm text-white/55">
                      Connect with EMA BD
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.7"
                        d="M12 21s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"
                      />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="mt-1 text-sm text-white/55">Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-7 py-10 sm:px-10 lg:col-span-3 lg:px-12 lg:py-12">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900">
                Send us a message
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Fill out the form below and our team will get back to you.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Names */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    placeholder="Your first name"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.firstName
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#0F2A5F] focus:ring-[#0F2A5F]/10"
                    }`}
                  />

                  {errors.firstName && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    placeholder="Your last name"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.lastName
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#0F2A5F] focus:ring-[#0F2A5F]/10"
                    }`}
                  />

                  {errors.lastName && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-[#0F2A5F] focus:ring-[#0F2A5F]/10"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows={7}
                  placeholder="How can we help you?"
                  {...register("message", {
                    required: "Message is required",
                  })}
                  className={`w-full resize-none rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    errors.message
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-[#0F2A5F] focus:ring-[#0F2A5F]/10"
                  }`}
                />

                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#0F2A5F] px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[#0b214d] focus:outline-none focus:ring-2 focus:ring-[#0F2A5F] focus:ring-offset-2 sm:w-auto"
                >
                  Send Message
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Have a common question? Check our{" "}
            <span className="font-medium text-[#0F2A5F]">
              Frequently Asked Questions
            </span>{" "}
            before contacting us.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
