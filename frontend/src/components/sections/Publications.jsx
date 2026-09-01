import { useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { useModalTransition } from "../../hooks/useModalTransition.js";
import { usePortalTarget } from "../../hooks/usePortalTarget.js";

export default function Publications({ posts }) {
  const [selected, setSelected] = useState(null);
  const [displayed, open] = useModalTransition(selected);
  const portalTarget = usePortalTarget();

  return (
    <>
      <div className="container">
        <div className="tokyo_tm_news float-left w-full pb-[45px] pt-[100px] max-lg:pt-[130px]">
          <div className="tokyo_tm_title">
            <div className="title_flex">
              <div className="left">
                <span>News</span>
                <h2>Publications &amp; Learning</h2>
              </div>
            </div>
          </div>

          {!posts.length && <p className="text-[#767676]">No posts yet.</p>}

          <ul className="-ml-[50px] flex list-none flex-wrap max-sm:ml-0">
            {posts.map((pub) => (
              <li key={pub.id || pub.title} className="mb-[50px] flex w-1/2 pl-[50px] max-sm:w-full max-sm:pl-0">
                <div className="list_inner group flex h-[540px] w-full flex-col shadow-[0_0_20px_rgba(0,0,0,0.07)] transition-shadow duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(0,0,0,0.12)]">
                  <div className="image relative overflow-hidden">
                    <img src="/img/thumbs/40-25.jpg" alt="" className="min-w-full opacity-0" />
                    <div
                      className="main absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-in-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${pub.image})` }}
                    ></div>
                    <a
                      className="tokyo_tm_full_link absolute inset-0 z-[4]"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelected(pub);
                      }}
                    ></a>
                  </div>
                  <div className="details flex w-full flex-1 flex-col bg-white px-10 pb-[25px] pt-[30px]">
                    <div className="extra relative mb-[25px] flex items-center justify-between after:absolute after:bottom-[-7px] after:h-px after:w-full after:bg-black/10 after:content-['']">
                      <div className="short">
                        <p className="date overflow-hidden whitespace-nowrap text-ellipsis font-heading text-[13px] text-[#767676]">
                          {pub.source}
                          {pub.date && (
                            <span className="relative before:relative before:mr-[5px] before:pl-[2px] before:text-[10px] before:content-['/']">
                              {" "}
                              {pub.date}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <h3 className="publication_title title mb-[10px] line-clamp-2 min-h-[2.6em] text-lg font-semibold leading-[1.4]">
                      <a
                        href="#"
                        className="inline-block text-black transition-colors duration-300 ease-in-out"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelected(pub);
                        }}
                      >
                        {pub.title}
                      </a>
                    </h3>
                    <div className="tokyo_tm_read_more mt-auto">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelected(pub);
                        }}
                      >
                        <span>Read More</span>
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Portaled into .tokyo_tm_all_wrap, not document.body — #news is a
          stacking context (partly-behind-the-sidebar bug) and .tokyo_tm_all_wrap
          keeps this a real descendant of the theme's border-box reset
          (overflowing-the-popup-boundary bug); see the longer notes in
          Portfolio.jsx, where both were first found. Shell renders
          unconditionally from first mount — see the comment on the
          equivalent modal in Service.jsx / useModalTransition. */}
      {portalTarget &&
        createPortal(
          <div className={`tokyo_tm_modalbox${open ? " opened" : ""}`} onClick={() => setSelected(null)}>
            <div className="box_inner" onClick={(e) => e.stopPropagation()}>
              <div className="close">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected(null);
                  }}
                  aria-label="Close"
                >
                  <FaTimes />
                </a>
              </div>
              {displayed && (
                <div className="description_wrap">
                  <div className="service_popup_informations w-full">
                    <div className="image relative z-[-1] float-left mb-10 w-full">
                      <img src="/img/thumbs/4-2.jpg" alt="" className="min-w-full" />
                      <div
                        className="main absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${displayed.image})` }}
                      ></div>
                    </div>
                    <div className="main_title float-left mb-[23px] w-full">
                      <h3 className="text-[23px] font-semibold">{displayed.title}</h3>
                    </div>
                    <div className="descriptions float-left w-full">
                      <p className="date mb-[15px] text-[#767676]">
                        {displayed.source}
                        {displayed.date ? ` — ${displayed.date}` : ""}
                      </p>
                      <p className="mb-[15px] last:mb-0">{displayed.summary}</p>
                      {displayed.link && (
                        <p className="mb-[15px] last:mb-0">
                          <a href={displayed.link} target="_blank" rel="noreferrer">
                            View publication →
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>,
          portalTarget
        )}
    </>
  );
}
