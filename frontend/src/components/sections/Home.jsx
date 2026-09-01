import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Home({ profile }) {
  return (
    <div className="container">
      <div className="tokyo_tm_home">
        <div className="home_content">
          <div className="avatar" data-type="wave" role="img" aria-label={`Photo of ${profile.name}`}>
            <div className="image" style={{ backgroundImage: `url(${profile.avatarImage})` }}></div>
          </div>
          <div className="details">
            <h1 className="name">
              {profile.name.split(" ")[0]} <span>{profile.name.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="job">{profile.tagline}</p>
            <div className="social">
              <ul>
                <li>
                  <a href={`mailto:${profile.email}`} aria-label="Email">
                    <FaEnvelope />
                  </a>
                </li>
                <li>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <FaLinkedin />
                  </a>
                </li>
                <li>
                  <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                    <FaGithub />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
