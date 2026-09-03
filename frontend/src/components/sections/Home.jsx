import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Home({ profile }) {
  return (
    <div className="container">
      <div className="tokyo_tm_home relative flex min-h-screen w-full items-center justify-center">
        <div className="home_content flex items-center max-md:flex-col max-md:text-center">
          <div
            className="avatar relative min-h-[300px] min-w-[300px] rounded-full max-xl:min-h-[250px] max-xl:min-w-[250px] max-md:mb-[30px] max-sm:min-h-[200px] max-sm:min-w-[200px]"
            role="img"
            aria-label={`Photo of ${profile.name}`}
          >
            <div
              className="image animate-morph absolute inset-0 bg-cover bg-center bg-no-repeat shadow-[inset_0_0_0_9px_rgba(255,255,255,0.3)]"
              style={{ backgroundImage: `url(${profile.avatarImage})`, backgroundBlendMode: "multiply" }}
            ></div>
          </div>
          <div className="details ml-20 max-md:ml-0">
            <h1 className="name font-poppins mb-[14px] text-[55px] font-extrabold max-xl:mb-[10px] max-xl:text-[48px] max-sm:text-[30px]">
              {profile.name.split(" ")[0]} <span>{profile.name.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="job mb-[25px] max-w-[450px] font-heading font-medium max-xl:mb-[22px]">{profile.tagline}</p>
            <div className="social w-full float-left">
              <ul className="m-0 list-none">
                <li className="mr-4 inline-block last:mr-0">
                  <a href={`mailto:${profile.email}`} aria-label="Email" className="text-[20px] text-black">
                    <FaEnvelope />
                  </a>
                </li>
                <li className="mr-4 inline-block last:mr-0">
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-[20px] text-black">
                    <FaLinkedin />
                  </a>
                </li>
                <li className="mr-4 inline-block last:mr-0">
                  <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-[20px] text-black">
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
