function ProgressBar({ label, value }) {
  return (
    <div className="progress_inner" data-value={value}>
      <span>
        <span className="label">{label}</span>
        <span className="number">{value}%</span>
      </span>
      <div className="background">
        <div className="bar">
          <div className="bar_in" style={{ width: `${value}%` }}></div>
        </div>
      </div>
    </div>
  );
}

function ResumeList({ items }) {
  return (
    <div className="tokyo_tm_resume_list">
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <div className="list_inner">
              <div className="time">
                <span>{it.period}</span>
              </div>
              <div className="place">
                <h3>{it.place}</h3>
                <span>{it.role || it.degree}</span>
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
      <div className="tokyo_tm_about">
        <div className="tokyo_tm_title">
          <div className="title_flex">
            <div className="left">
              <span>About</span>
              <h2>{about.heading}</h2>
            </div>
          </div>
        </div>
        <div className="top_author_image">
          <img src={profile.avatarImage} alt={profile.name} />
        </div>
        <div className="about_title">
          <h3>{profile.name}</h3>
          <span>{about.role}</span>
        </div>
        <div className="about_text">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="tokyo_tm_short_info">
          <div className="left">
            <div className="tokyo_tm_info">
              <ul>
                {about.info.left.map((row, i) => (
                  <li key={i}>
                    <span>{row.label}:</span>
                    <span>{row.href ? <a href={row.href}>{row.value}</a> : row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="right">
            <div className="tokyo_tm_info">
              <ul>
                {about.info.right.map((row, i) => (
                  <li key={i}>
                    <span>{row.label}:</span>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="tokyo_tm_button" data-position="left">
          <a href={profile.cvUrl} download>
            <span>Download CV</span>
          </a>
        </div>
      </div>
    </div>

    <div className="tokyo_tm_progressbox">
      <div className="container">
        <div className="in">
          <div className="left">
            <div className="tokyo_section_title">
              <h3>Technical Skills</h3>
            </div>
            <div className="tokyo_progress">
              {profile.technicalSkills.map((s) => (
                <ProgressBar key={s.label} {...s} />
              ))}
            </div>
          </div>
          <div className="right">
            <div className="tokyo_section_title">
              <h3>Language Skills</h3>
            </div>
            <div className="tokyo_progress">
              {profile.languageSkills.map((s) => (
                <ProgressBar key={s.label} {...s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="tokyo_tm_skillbox">
      <div className="container">
        <div className="in">
          <div className="left">
            <div className="tokyo_section_title">
              <h3>Knowledge</h3>
            </div>
            <div className="tokyo_tm_skill_list">
              <ul>
                {profile.knowledge.map((k) => (
                  <li key={k}>
                    <span>
                      <img className="svg" src="/img/svg/rightarrow.svg" alt="" />
                      {k}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="right">
            <div className="tokyo_section_title">
              <h3>Interests</h3>
            </div>
            <div className="tokyo_tm_skill_list">
              <ul>
                {profile.interests.map((k) => (
                  <li key={k}>
                    <span>
                      <img className="svg" src="/img/svg/rightarrow.svg" alt="" />
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

    <div className="tokyo_tm_resumebox">
      <div className="container">
        <div className="in">
          <div className="left">
            <div className="tokyo_section_title">
              <h3>Education</h3>
            </div>
            <ResumeList items={profile.education} />
          </div>
          <div className="right">
            <div className="tokyo_section_title">
              <h3>Experience</h3>
            </div>
            <ResumeList items={profile.experience} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
