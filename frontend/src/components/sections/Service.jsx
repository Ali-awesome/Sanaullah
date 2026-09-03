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
        <div className="tokyo_tm_services float-left w-full py-[100px] max-lg:pt-[130px] max-sm:pt-20">
          <div className="tokyo_tm_title">
            <div className="title_flex">
              <div className="left">
                <span>Services</span>
                <h1>What I Do</h1>
              </div>
            </div>
          </div>
          <div className="list float-left w-full">
            <ul className="w-[calc(100%+2.5rem)] -ml-10 flex list-none flex-wrap max-sm:ml-0 max-sm:w-full">
              {profile.services.map((s, i) => (
                <li key={s.number} className="mb-10 w-1/3 pl-10 max-md:w-1/2 max-sm:w-full max-sm:pl-0">
                  <div className="list_inner group flex h-full flex-col border border-black/10 bg-white px-[30px] pb-10 pt-[45px] transition-all duration-300 ease-in-out hover:border-black/20">
                    <span className="number relative mb-[25px] inline-block h-[60px] w-[60px] rounded-full bg-black/3 text-center font-heading font-bold leading-[60px] text-black transition-colors duration-300 ease-in-out group-hover:bg-black/8">
                      {s.number}
                    </span>
                    <h3 className="title mb-[15px] text-lg font-bold text-black">{s.title}</h3>
                    <p className="text line-clamp-3 min-h-[4.5em]">{s.text}</p>
                    <div className="tokyo_tm_read_more mt-auto pt-5">
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
      {portalTarget &&
        createPortal(
          <div className={`tokyo_tm_modalbox${open ? " opened" : ""}`} onClick={() => setOpenIndex(null)}>
            <div className="box_inner" onClick={(e) => e.stopPropagation()}>
              <div className="close">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenIndex(null);
                  }}
                  aria-label="Close"
                >
                  <FaTimes />
                </a>
              </div>
              {displayedIndex !== null && (
                <div className="description_wrap">
                  <div className="service_popup_informations w-full">
                    <div className="main_title float-left mb-[23px] w-full">
                      <h3 className="text-[23px] font-semibold">{profile.services[displayedIndex].title}</h3>
                    </div>
                    <div className="descriptions float-left w-full">
                      <p>{profile.services[displayedIndex].details}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>,
          portalTarget
        )}

      <div className="tokyo_tm_partners float-left w-full bg-white py-[100px]">
        <div className="container">
          <div className="tokyo_section_title mb-10 w-full">
            <h3 className="text-xl font-bold">Tools &amp; Platforms</h3>
          </div>
          <div className="partners_inner tool_badges flex flex-wrap justify-center gap-3 overflow-hidden border-2 border-[#eee] p-6">
            {["SQL", "Python", "Power BI", "Excel", "Git", "MongoDB", "Firebase", "ClickUp"].map((t) => (
              <span
                className="tool_badge rounded-full border border-black/15 px-[18px] py-2 text-[13px] tracking-wide"
                key={t}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="tokyo_tm_facts float-left w-full pb-[60px] pt-[100px]">
        <div className="container">
          <div className="tokyo_section_title mb-10 w-full">
            <h3 className="text-xl font-bold">Impact Highlights</h3>
          </div>
          <div className="list float-left w-full">
            <ul className="-ml-10 list-none max-sm:ml-0">
              {profile.impactStats.map((stat) => (
                <li key={stat.label} className="float-left mb-10 w-1/3 pl-10 max-sm:w-full max-sm:pl-0">
                  <div className="list_inner relative border border-black/10 px-5 py-10 text-center">
                    <h3 className="mb-[3px] text-xl font-semibold">{stat.value}</h3>
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
