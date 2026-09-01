import { useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { useModalTransition } from "../../hooks/useModalTransition.js";
import { usePortalTarget } from "../../hooks/usePortalTarget.js";

export default function Service({ profile }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [displayedIndex, open] = useModalTransition(openIndex);
  const portalTarget = usePortalTarget();

  return (
    <>
      <div className="container">
        <div className="tokyo_tm_services">
          <div className="tokyo_tm_title">
            <div className="title_flex">
              <div className="left">
                <span>Services</span>
                <h2>What I Do</h2>
              </div>
            </div>
          </div>
          <div className="list">
            <ul>
              {profile.services.map((s, i) => (
                <li key={s.number}>
                  <div className="list_inner">
                    <span className="number">{s.number}</span>
                    <h3 className="title">{s.title}</h3>
                    <p className="text">{s.text}</p>
                    <div className="tokyo_tm_read_more">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenIndex(i);
                        }}
                      >
                        <span>Read More</span>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Portaled into .tokyo_tm_all_wrap (see usePortalTarget), not
          document.body: #service is `position: absolute` with its own
          z-index (.tokyo_tm_section in style.css), which makes it a
          stacking context, so this modal's z-index would otherwise only
          rank *within* that section instead of against the sidebar
          (.leftpart, z-index 12) globally. Portaling into .tokyo_tm_all_wrap
          instead of document.body also keeps this a real descendant of it,
          so its `box-sizing: border-box` reset still applies — see the
          longer note in Portfolio.jsx, where both issues were first found
          (visible there against a full-bleed photo; invisible here since
          both the sidebar and this popup are white-on-white).
          This shell renders unconditionally from first mount (matching the
          original theme's own markup, which always has the popup div in the
          DOM, hidden by .tokyo_tm_modalbox's own CSS) so the "opened" class
          always has a previously-painted closed state to transition from —
          see useModalTransition for why that matters. Only the inner
          content is conditional, gated on displayedIndex. */}
      {portalTarget && createPortal(
        <div className={`tokyo_tm_modalbox${open ? " opened" : ""}`} onClick={() => setOpenIndex(null)}>
          <div className="box_inner" onClick={(e) => e.stopPropagation()}>
            <div className="close">
              <a href="#" onClick={(e) => { e.preventDefault(); setOpenIndex(null); }} aria-label="Close">
                <FaTimes />
              </a>
            </div>
            {displayedIndex !== null && (
              <div className="description_wrap">
                <div className="service_popup_informations">
                  <div className="main_title">
                    <h3>{profile.services[displayedIndex].title}</h3>
                  </div>
                  <div className="descriptions">
                    <p>{profile.services[displayedIndex].details}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>,
        portalTarget
      )}

      <div className="tokyo_tm_partners">
        <div className="container">
          <div className="tokyo_section_title">
            <h3>Tools &amp; Platforms</h3>
          </div>
          <div className="partners_inner tool_badges">
            {["SQL", "Python", "Power BI", "Excel", "Git", "MongoDB", "Firebase", "ClickUp"].map((t) => (
              <span className="tool_badge" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="tokyo_tm_facts">
        <div className="container">
          <div className="tokyo_section_title">
            <h3>Impact Highlights</h3>
          </div>
          <div className="list">
            <ul>
              {profile.impactStats.map((stat) => (
                <li key={stat.label}>
                  <div className="list_inner">
                    <h3>{stat.value}</h3>
                    <span>{stat.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
