import { FaLinkedinIn } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";

const Profile = ({ designation, data }) => {
  const API = import.meta.env.VITE_API_URL;
  if (designation === "team") {
    const { _id, linkedIn, url, name, position } = data;
    const linkedinUrl = linkedIn?.startsWith("http")
      ? linkedIn
      : `https://${linkedIn}`;
    return (
      <Link to={`/profile/${_id}/${designation}`}>
        <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex flex-1 flex-col items-center p-6">
            <Link
              to={`/profile/${_id}/${designation}`}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:bg-[#0F2A5F] hover:text-white"
            >
              <FiArrowUpRight size={20} />
            </Link>
            <div className="relative">
              <img
                src={`${API}/uploads/${url}`}
                alt={name}
                className="h-28 w-28 rounded-full border-4 border-blue-100 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {linkedIn && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-lg transition hover:scale-110"
                >
                  <FaLinkedinIn />
                </a>
              )}
            </div>

            <h3 className="mt-6 text-center text-xl font-semibold text-slate-900">
              {name}
            </h3>

            <p className="mt-2 text-center text-sm text-slate-500">
              {position}
            </p>
          </div>
        </div>
      </Link>
    );
  } else if (designation === "alumni") {
    const { ID, _id, Name, ProgramName, LinkedIn, Image, Session } = data;

    const linkedinUrl = LinkedIn?.startsWith("http")
      ? LinkedIn
      : `https://${LinkedIn}`;

    const imageUrl = Image
      ? `${API}/uploads/${ID}.jpg`
      : `${API}/uploads/avatar.jpg`;

    return (
      <Link to={`/profile/${_id}/${designation}`}>
        <div className="group flex h-full flex-col relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          {/* Details Arrow */}
          <Link
            to={`/profile/${_id}/${designation}`}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:bg-[#0F2A5F] hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <FiArrowUpRight size={18} />
          </Link>

          <div className="flex flex-col items-center flex-1">
            <div className="relative">
              <img
                src={imageUrl}
                alt={Name}
                className="h-28 w-28 rounded-full border-4 border-blue-100 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {LinkedIn && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-lg transition hover:scale-110"
                >
                  <FaLinkedinIn />
                </a>
              )}
            </div>

            <h3 className="mt-6 text-center text-xl font-semibold text-slate-900">
              {Name}
            </h3>

            <p className="mt-2 text-center text-sm font-medium text-slate-500">
              {ProgramName}
            </p>

            <span className="mt-3 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              Session {Session}
            </span>
          </div>
        </div>
      </Link>
    );
  }
  return null;
};

export default Profile;
