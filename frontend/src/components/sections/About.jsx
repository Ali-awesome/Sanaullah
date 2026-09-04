import DownloadCvButton from "../DownloadCvButton.jsx";

// Inlined (rather than <img src="/img/svg/rightarrow.svg">) so it can pick
// up `text-[var(--fg)]` via `fill="currentColor"` — the theme toggle can't
// reach into a hardcoded-black file loaded as a plain <img>, since that has
// no CSS `color` to inherit at all.
function RightArrowIcon({ className }) {
  return (
    <svg viewBox="0 0 386.258 386.258" className={className} fill="currentColor" aria-hidden="true">
      <polygon points="96.879,0 96.879,386.258 289.379,193.129" />
    </svg>
  );
}

function ProgressBar({ label, value }) {
  return (
    <div className="progress_inner mb-[17px] w-full last:mb-0" data-value={value}>
      <span className="mb-[5px] block w-full text-left text-[var(--fg)]">
        <span className="label">{label}</span>
        <span className="number float-right">{value}%</span>
      </span>
      <div className="background relative h-[3px] w-full min-w-full bg-[var(--fg)]/[0.09]">
        <div className="bar relative h-full w-full">
          <div
            className="bar_in absolute inset-y-0 left-0 overflow-hidden bg-[var(--fg)]"
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function ResumeList({ items }) {
  return (
    <div className="tokyo_tm_resume_list w-full">
      <ul className="relative m-0 inline-block list-none pt-[10px] before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-[var(--fg)]/[0.07] before:content-['']">
        {items.map((it, i) => (
          <li
            key={i}
            className="relative float-left w-full pb-[45px] pl-5 last:pb-0 before:absolute before:left-[-9px] before:top-2 before:h-[18px] before:w-[18px] before:rounded-full before:border before:border-[var(--border-strong)] before:bg-[var(--surface)] before:content-['']"
          >
            <div className="list_inner relative flex w-full">
              <div className="time w-1/2 pr-5">
                <span className="inline-block whitespace-nowrap rounded-full bg-[var(--fg)]/[0.05] px-[25px] py-[5px] text-sm">
                  {it.period}
                </span>
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
        <div className="tokyo_tm_about float-left w-full py-[100px] max-lg:pt-[130px] max-sm:pt-20">
          <div className="tokyo_tm_title">
            <div className="title_flex">
              <div className="left">
                <span>About</span>
                <h1>{about.heading}</h1>
              </div>
            </div>
          </div>
          <div className="top_author_image relative mb-[35px] float-left w-full">
            <img className="min-w-full max-h-[650px] lg:pr-24" src={profile.avatarImage} alt={profile.name} />
          </div>
          <div className="about_title float-left mb-[27px] w-full border-b border-[var(--border-strong)] pb-5">
            <h3 className="text-[22px] font-bold">{profile.name}</h3>
            <span>{about.role}</span>
          </div>
          <div className="about_text float-left mb-[30px] w-full border-b border-[var(--border-strong)] pb-[31px]">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="mb-[11px] last:mb-0">
                {p}
              </p>
            ))}
          </div>
          <div className="tokyo_tm_short_info mb-10 flex w-full border-b border-[var(--border-strong)] pb-[30px] max-sm:flex-col">
            <div className="left w-1/2 pr-[50px] max-sm:w-full max-sm:pr-0">
              <div className="tokyo_tm_info">
                <ul className="m-0 list-none">
                  {about.info.left.map((row, i) => (
                    <li key={i} className="m-0">
                      <span className="float-left mr-[10px] min-w-[100px] font-bold text-[var(--fg)]">{row.label}:</span>
                      <span className="text-[var(--fg-muted)] transition-colors duration-300 ease-in-out [&_a]:text-[var(--fg-muted)] [&_a:hover]:text-[var(--fg)]">
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
                      <span className="float-left mr-[10px] min-w-[100px] font-bold text-[var(--fg)]">{row.label}:</span>
                      <span className="text-[var(--fg-muted)]">{row.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <DownloadCvButton className="float-left w-full" />
        </div>
      </div>

      <div className="tokyo_tm_progressbox float-left w-full bg-[var(--bg)] pb-[100px] pt-[93px]">
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
                        <RightArrowIcon className="absolute left-0 top-1/2 h-[10px] w-[10px] -translate-y-1/2 text-[var(--fg)]" />
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
                        <RightArrowIcon className="absolute left-0 top-1/2 h-[10px] w-[10px] -translate-y-1/2 text-[var(--fg)]" />
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
