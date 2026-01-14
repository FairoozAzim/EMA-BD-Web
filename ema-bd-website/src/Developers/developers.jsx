
const developers = [
  {
    name: "Sadad Mahmud",
    bio: "Sadad Mahamud is an Erasmus Mundus alumnus and a dedicated leader in international education advocacy. He earned his Joint International Master’s degree in Smart Systems Integrated Solutions (SSIs) under the Erasmus Mundus programme, completing his studies across three European institutions: Aalto University in Finland, the University of South-Eastern Norway, and the Budapest University of Technology and Economics. \n \n With a strong technical background Sadad has been actively involved in digital innovation and community engagement, previously serving Erasmus Mundus Association Bangladesh (EMA BD), where he played a key role in strengthening the organization’s online presence and outreach. \n \n Currently, Sadad serves as the Country Representative of EMA Bangladesh, leading national initiatives to promote the Erasmus Mundus programme, support prospective applicants, and foster a strong network of students and alumni. Passionate about empowering young talents, he is committed to expanding access to global education and believes in the power of international collaboration to drive meaningful change.",
    email: "sadadankon@gmail.com",
  },
  {
    name: "Fairooz Azim",
    bio: "Fairooz Azim is an Erasmus Mundus alumnus, who studied the Joint Master's Program Language Communication Technologies(LCT) across two universities in two countries: University of Lorraine, Nancy, France and University of Malta, Malta. She has a Bachelor's in Computer Science and Engineering from the University of Chittagong, Bangladesh. \n\n Fairooz has served actively for two years (2024-2025) in the IT sector of Erasmus Mundus Association Bangaldesh, where she developed the official website along with her teammates.  ",
    email: "fairoozazim97@gmail.com",
  }
];

const Developers = () => {
  return (
    <div style={{ padding: "40px", background: "#f5f6fa", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "25px", textAlign: "center", marginBottom: "30px" }}>
        Meet the Developers
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {developers.map((dev, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h1 style={{ fontSize: "25px", marginBottom: "10px" }}>{dev.name}</h1>
            <p style={{ color: "#4b5563", marginBottom: "15px", whiteSpace : "pre-line" }}>{dev.bio}</p>
            Email Address:<a href={`mailto:${dev.email}`} style={{ color: "#2563eb" }}>
              {dev.email}
            </a> <br/>
            LinkedIn: <a href={`mailto:${dev.email}`} style={{ color: "#2563eb" }}>
              {dev.email}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Developers;
