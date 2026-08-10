import { useLoaderData, useParams } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaUniversity } from "react-icons/fa";
import { CiLink } from "react-icons/ci";
import { FiMail } from "react-icons/fi";

const Profile_Details = () => {
  const API = import.meta.env.VITE_API_URL;
  const { designation } = useParams();
  const { data } = useLoaderData();

  if (!data) return null;

  if (designation === "team") {
    const { linkedIn, url, name, position, email, about } = data;
    const linkedinUrl = linkedIn?.startsWith("http")
      ? linkedIn
      : `https://${linkedIn}`;

    return (
      <div className="min-h-screen py-8 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="bg-[#0F2A5F] h-36" />

            <div className="px-8 pb-10">
              <div className="-mt-20 flex flex-col items-center">
                <img
                  src={`${API}/uploads/${url}`}
                  alt={name}
                  className="h-40 w-40 rounded-full border-8 border-white object-cover shadow-lg"
                />

                <h1 className="mt-6 text-2xl md:text-4xl font-bold text-slate-900">
                  {name}
                </h1>

                <p className="mt-2 text-sm md:text-base rounded-full bg-blue-100 px-4 py-1 text-blue-700">
                  {position}
                </p>

                <div className="mt-6 flex gap-4">
                  {linkedIn && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-slate-100 p-3 transition hover:bg-[#0A66C2] hover:text-white"
                    >
                      <FaLinkedinIn size={20} />
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-8 md:mt-12 grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <h2 className="mb-4 text-2xl font-semibold">About</h2>

                  <p className="leading-5 md:leading-8 text-xs md:text-base text-slate-600 whitespace-pre-line text-justify">
                    {about}
                  </p>
                </div>

                <div>
                  <div className="mt-0 md:mt-8 border-t border-slate-200 pt-6">
                    <div className="flex items-center gap-3 text-slate-600">
                      <FiMail className="text-blue-700" />
                      <a
                        href={`mailto:${email}`}
                        className="hover:text-blue-700"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Alumni
  const {
    About,
    Email,
    FBLink,
    LinkedIn,
    Name,
    OtherLink,
    ProgramName,
    Session,
    UniName,
    ID,
    Image,
  } = data;

  const linkedinUrl = LinkedIn?.startsWith("http")
    ? LinkedIn
    : `https://${LinkedIn}`;

  const universities = UniName
    ? UniName.replace(/\d+\.\s*/g, "")
        .replace(/\s+and\s+/gi, ",")
        .split(/,\s*/)
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen py-8 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          {/* Cover */}
          <div className="h-36 bg-[#0F2A5F]" />

          <div className="px-8 pb-10">
            {/* Hero */}
            <div className="-mt-20 flex flex-col items-center">
              <img
                src={
                  Image
                    ? `${API}/uploads/${ID}.jpg`
                    : `${API}/uploads/avatar.jpg`
                }
                alt={Name}
                className="h-40 w-40 rounded-full border-8 border-white object-cover shadow-lg"
              />

              <h1 className="mt-6 text-center text-2xl font-bold text-slate-900 md:text-4xl">
                {Name}
              </h1>

              <p className="mt-3 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                {ProgramName}
              </p>

              <div className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                {Session}
              </div>

              <div className="mt-6 flex gap-4">
                {FBLink && (
                  <a
                    href={FBLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-slate-100 p-3 transition hover:bg-blue-600 hover:text-white"
                  >
                    <FaFacebookF size={18} />
                  </a>
                )}

                {LinkedIn && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-slate-100 p-3 transition hover:bg-[#0A66C2] hover:text-white"
                  >
                    <FaLinkedinIn size={18} />
                  </a>
                )}

                {OtherLink && (
                  <a
                    href={OtherLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-slate-100 p-3 transition hover:bg-slate-900 hover:text-white"
                  >
                    <CiLink size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="mt-12 grid gap-10 lg:grid-cols-3">
              {/* About */}
              <div className="lg:col-span-2">
                <h2 className="mb-4 text-2xl font-semibold">About</h2>

                <p className="whitespace-pre-line text-justify text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                  {About}
                </p>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="rounded-2xl shadow-md p-6">
                  <h3 className="mb-5 text-xl font-semibold">Contact</h3>

                  <div className="flex items-center gap-3 text-slate-600">
                    <FiMail className="text-blue-700" />

                    <a
                      href={`mailto:${Email}`}
                      className="break-all hover:text-blue-700"
                    >
                      {Email}
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl shadow-md p-6">
                  <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold">
                    <FaUniversity />
                    Universities
                  </h3>

                  <ul className="space-y-3 text-sm text-slate-600">
                    {universities.map((uni) => (
                      <li key={uni} className="flex gap-2">
                        <span className="mt-2 h-2 w-2 rounded-full bg-blue-600" />
                        <span>{uni}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile_Details;
