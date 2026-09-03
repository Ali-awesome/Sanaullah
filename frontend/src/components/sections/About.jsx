function ProgressBar({ label, value }) {
  return (
    <div className="progress_inner mb-[17px] w-full last:mb-0" data-value={value}>
      <span className="mb-[5px] block w-full text-left text-black">
        <span className="label">{label}</span>
        <span className="number float-right">{value}%</span>
      </span>
      <div className="background relative h-[3px] w-full min-w-full bg-black/9">
        <div className="bar relative h-full w-full">
          <div className="bar_in absolute inset-y-0 left-0 overflow-hidden bg-black" style={{ width: `${value}%` }}></div>
        </div>
      </div>
    </div>
  );
}

function ResumeList({ items }) {
  return (
    <div className="tokyo_tm_resume_list w-full">
      <ul className="relative m-0 inline-block list-none pt-[10px] before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-black/7 before:content-['']">
        {items.map((it, i) => (
          <li
            key={i}
            className="relative float-left w-full pb-[45px] pl-5 last:pb-0 before:absolute before:left-[-9px] before:top-2 before:h-[18px] before:w-[18px] before:rounded-full before:border before:border-[#ccc] before:bg-white before:content-['']"
          >
            <div className="list_inner relative flex w-full">
              <div className="time w-1/2 pr-5">
                <span className="inline-block whitespace-nowrap rounded-full bg-black/5 px-[25px] py-[5px] text-sm">{it.period}</span>
              </div>
              <div className="place w-1/2 pl-5">
                <h3 className="mb-[2px] text-base font-semibold">{it.place}</h3>
                <span className="text-sm">{it.role || it.degree}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function About({ profile }) {
  const { about } = profile;
  return (
    <>
      <div className="container">
        <div className="tokyo_tm_about float-left w-full py-[100px] max-lg:pt-[130px]">
          <div className="tokyo_tm_title">
            <div className="title_flex">
              <div className="left">
                <span>About</span>
                <h1 className="text-[30px] font-bold">{about.heading}</h1>
              </div>
            </div>
          </div>
          <div className="top_author_image relative mb-[35px] float-left w-full">
            <img className="min-w-full" src={profile.avatarImage} alt={profile.name} />
          </div>
          <div className="about_title float-left mb-[27px] w-full border-b border-[#dfdfdf] pb-5">
            <h3 className="text-[22px] font-bold">{profile.name}</h3>
            <span>{about.role}</span>
          </div>
          <div className="about_text float-left mb-[30px] w-full border-b border-[#dfdfdf] pb-[31px]">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="mb-[11px] last:mb-0">
                {p}
              </p>
            ))}
          </div>
          <div className="tokyo_tm_short_info mb-10 flex w-full border-b border-[#dfdfdf] pb-[30px] max-sm:flex-col">
            <div className="left w-1/2 pr-[50px] max-sm:w-full max-sm:pr-0">
              <div className="tokyo_tm_info">
                <ul className="m-0 list-none">
                  {about.info.left.map((row, i) => (
                    <li key={i} className="m-0">
                      <span className="float-left mr-[10px] min-w-[100px] font-bold text-black">{row.label}:</span>
                      <span className="text-[#767676] transition-colors duration-300 ease-in-out [&_a]:text-[#767676] [&_a:hover]:text-black">
                        {row.href ? <a href={row.href}>{row.value}</a> : row.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="right w-1/2 pl-[50px] max-sm:w-full max-sm:pl-0">
              <div className="tokyo_tm_info">
                <ul className="m-0 list-none">
                  {about.info.right.map((row, i) => (
                    <li key={i} className="m-0">
                      <span className="float-left mr-[10px] min-w-[100px] font-bold text-black">{row.label}:</span>
                      <span className="text-[#767676]">{row.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="tokyo_tm_button float-left w-full" data-position="left">
            <a href={profile.cvUrl} download>
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </div>

      <div className="tokyo_tm_progressbox float-left w-full bg-white pb-[100px] pt-[93px]">
        <div className="container">
          <div className="in flex w-full max-sm:flex-col">
            <div className="left w-1/2 pr-[50px] max-sm:mb-[60px] max-sm:w-full max-sm:pr-0">
              <div className="tokyo_section_title mb-10 w-full">
                <h3 className="text-xl font-bold">Technical Skills</h3>
              </div>
              <div className="tokyo_progress w-full">
                {profile.technicalSkills.map((s) => (
                  <ProgressBar key={s.label} {...s} />
                ))}
              </div>
            </div>
            <div className="right w-1/2 pl-[50px] max-sm:w-full max-sm:pl-0">
              <div className="tokyo_section_title mb-10 w-full">
                <h3 className="text-xl font-bold">Language Skills</h3>
              </div>
              <div className="tokyo_progress w-full">
                {profile.languageSkills.map((s) => (
                  <ProgressBar key={s.label} {...s} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tokyo_tm_skillbox float-left w-full py-[90px]">
        <div className="container">
          <div className="in flex w-full max-sm:flex-col">
            <div className="left w-1/2 pr-[50px] max-sm:mb-[60px] max-sm:w-full max-sm:pr-0">
              <div className="tokyo_section_title mb-10 w-full">
                <h3 className="text-xl font-bold">Knowledge</h3>
              </div>
              <div className="tokyo_tm_skill_list w-full">
                <ul className="m-0 list-none">
                  {profile.knowledge.map((k) => (
                    <li key={k} className="relative pl-[25px]">
                      <span>
                        <img
                          className="svg absolute left-0 top-1/2 h-[10px] w-[10px] -translate-y-1/2 text-black"
                          src="/img/svg/rightarrow.svg"
                          alt=""
                        />
                        {k}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="right w-1/2 pl-[50px] max-sm:w-full max-sm:pl-0">
              <div className="tokyo_section_title mb-10 w-full">
                <h3 className="text-xl font-bold">Interests</h3>
              </div>
              <div className="tokyo_tm_skill_list w-full">
                <ul className="m-0 list-none">
                  {profile.interests.map((k) => (
                    <li key={k} className="relative pl-[25px]">
                      <span>
                        <img
                          className="svg absolute left-0 top-1/2 h-[10px] w-[10px] -translate-y-1/2 text-black"
                          src="/img/svg/rightarrow.svg"
                          alt=""
                        />
                        {k}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tokyo_tm_resumebox float-left w-full py-[93px]">
        <div className="container">
          <div className="in flex w-full max-sm:flex-col">
            <div className="left w-1/2 pr-[50px] max-sm:mb-[60px] max-sm:w-full max-sm:pr-0">
              <div className="tokyo_section_title mb-10 w-full">
                <h3 className="text-xl font-bold">Education</h3>
              </div>
              <ResumeList items={profile.education} />
            </div>
            <div className="right w-1/2 pl-[50px] max-sm:w-full max-sm:pl-0">
              <div className="tokyo_section_title mb-10 w-full">
                <h3 className="text-xl font-bold">Experience</h3>
              </div>
              <ResumeList items={profile.experience} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
