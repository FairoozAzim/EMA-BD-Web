import { FaGithub, FaLinkedinIn, FaEnvelope } from "react-icons/fa";

const developers = [
  {
    name: "Shaheen Alam Shuvo",
    role: "Full-Stack Web Developer",
    initials: "SS",
    img: "https://res.cloudinary.com/dfzgnncyc/image/upload/v1785941755/Shuvo_kd1lb3.jpg",
    bio: "Saheen Alam Shuvo is a Software Engineering student, Full-Stack Web Developer, and Erasmus+ Semester Exchange Student at Varna University of Management (VUM), Bulgaria. He specializes in modern web technologies, including React, Next.js, Node.js, and MongoDB, with experience building responsive web applications and scalable backend solutions.\n\nHe is currently serving as a Web Development and IT Intern at Erasmus Mundus Association Bangladesh (EMA BD), contributing to the organization's digital presence through website development, technical improvements, and IT initiatives.\n\nPassionate about technology, international collaboration, and continuous learning, Shaheen enjoys transforming ideas into practical digital solutions and contributing to projects that create meaningful impact.",
    github: "https://github.com/saheen-shuvo",
    linkedin: "https://www.linkedin.com/in/saheen-alam-shuvo-182-li",
    email: "saheenshuvo182@gmail.com",
  },
  {
    name: "Mahedi Islam",
    role: "Website Requirements Analyst",
    img: "https://res.cloudinary.com/dfzgnncyc/image/upload/v1794044825/Mahdi_Islam_laahb4.jpg",
    initials: "MI",
    bio: "Mahedi Islam is a key contributor to the planning and requirements analysis of the Erasmus Mundus Association Bangladesh (EMA BD) website. He plays an important role in understanding the organization's objectives, identifying its digital needs, and translating organizational expectations into clear and practical website requirements.\n\nAs the Website Requirements Analyst, he focuses on gathering and organizing functional requirements, understanding user needs, and coordinating ideas to ensure the website aligns with the association's goals and serves its members and visitors effectively.\n\nWith an interest in digital solutions, structured planning, and collaborative development, Mahedi contributes to bridging the gap between organizational vision and technical implementation, helping shape a more accessible, functional, and user-friendly digital platform for EMA Bangladesh.",
    github: "",
    linkedin: "https://www.linkedin.com/in/mahdiislam79",
    email: "mahdiiut079@gmail.com",
  },

  {
    name: "Sadad Mahmud",
    role: "Web Development & Technical Contributor",
    img: "https://res.cloudinary.com/dfzgnncyc/image/upload/v1794044887/Sadad_Mahamud_s1kirs.jpg",
    initials: "SM",
    bio: "Sadad Mahmud is an Erasmus Mundus alumnus and a dedicated leader in international education advocacy. He earned his Joint International Master's degree in Smart Systems Integrated Solutions (SSIs) under the Erasmus Mundus programme, completing his studies across three European institutions: Aalto University in Finland, the University of South-Eastern Norway, and the Budapest University of Technology and Economics.\n\nWith a strong technical background, Sadad has been actively involved in digital innovation and community engagement, previously serving Erasmus Mundus Association Bangladesh, where he played a key role in strengthening the organization's online presence and outreach.\n\nCurrently, Sadad serves as the Country Representative of EMA Bangladesh, leading national initiatives to promote the Erasmus Mundus programme, support prospective applicants, and foster a strong network of students and alumni.",
    github: "",
    linkedin: "https://www.linkedin.com/in/sadadmahamud/",
    email: "sadadankon@gmail.com",
  },
  {
    name: "Fairooz Azim",
    role: "Web Development & Technical Contributor",
    initials: "FA",
    bio: "Fairooz Azim is an Erasmus Mundus alumna who studied the Joint Master's Program in Language and Communication Technologies (LCT) across two universities: the University of Lorraine, Nancy, France, and the University of Malta, Malta. She holds a Bachelor's degree in Computer Science and Engineering from the University of Chittagong, Bangladesh.\n\nFairooz actively served in the IT sector of Erasmus Mundus Association Bangladesh for two years (2024–2025), where she developed the official website along with her teammates.",
    github: "",
    linkedin: "https://www.linkedin.com/in/fairooz-azim",
    email: "fairoozazim97@gmail.com",
  },
];

const Developers = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-6 md:pt-16">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            Meet the Developers
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-slate-600 md:text-base">
            Meet the people who contributed to planning, designing, and
            developing the digital presence of Erasmus Mundus Association
            Bangladesh.
          </p>
        </div>
      </section>

      {/* Developer Cards */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {developers.map((dev, index) => (
            <div
              key={dev.name}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl md:p-8"
            >
              {/* Profile Header */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#0F2A5F] text-2xl font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                  {dev.img ? (
                    <img
                      src={dev.img}
                      alt={dev.name}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span>{dev.initials}</span>
                  )}
                </div>

                {/* Name and Role */}
                <div>
                  <span className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0F2A5F]">
                    {dev.role}
                  </span>

                  <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                    {dev.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {index === 0
                      ? "Website Development & IT Intern"
                      : "Website Development Team"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-slate-100" />

              {/* Bio */}
              <div className="flex-1">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#0F2A5F]">
                  About
                </h3>

                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {dev.bio}
                </p>
              </div>

              {/* Social Links */}
              <div className="my-6 border-t border-slate-100" />

              <div className="flex items-center gap-3">
                {/* GitHub */}
                <a
                  href={dev.github || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${dev.name} GitHub`}
                  onClick={(e) => !dev.github && e.preventDefault()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-all hover:border-[#0F2A5F] hover:bg-[#0F2A5F] hover:text-white"
                >
                  <FaGithub size={18} />
                </a>

                {/* LinkedIn */}
                <a
                  href={dev.linkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${dev.name} LinkedIn`}
                  onClick={(e) => !dev.linkedin && e.preventDefault()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-all hover:border-[#0F2A5F] hover:bg-[#0F2A5F] hover:text-white"
                >
                  <FaLinkedinIn size={17} />
                </a>

                {/* Email */}
                <a
                  href={dev.email ? `mailto:${dev.email}` : "#"}
                  aria-label={`${dev.name} Email`}
                  onClick={(e) => !dev.email && e.preventDefault()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-all hover:border-[#0F2A5F] hover:bg-[#0F2A5F] hover:text-white"
                >
                  <FaEnvelope size={17} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Developers;
