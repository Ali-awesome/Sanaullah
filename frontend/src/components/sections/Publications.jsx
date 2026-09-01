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
      <div className="tokyo_tm_news">
        <div className="tokyo_tm_title">
          <div className="title_flex">
            <div className="left">
              <span>News</span>
              <h2>Publications &amp; Learning</h2>
            </div>
          </div>
        </div>

        {!posts.length && <p style={{ color: "#767676" }}>No posts yet.</p>}

        <ul>
          {posts.map((pub) => (
            <li key={pub.id || pub.title}>
              <div className="list_inner">
                <div className="image">
                  <img src="/img/thumbs/40-25.jpg" alt="" />
                  <div className="main" style={{ backgroundImage: `url(${pub.image})` }}></div>
                  <a
                    className="tokyo_tm_full_link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelected(pub);
                    }}
                  ></a>
                </div>
                <div className="details">
                  <div className="extra">
                    <div className="short">
                      <p className="date">
                        {pub.source} <span>{pub.date}</span>
                      </p>
                    </div>
                  </div>
                  <h3 className="title publication_title">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelected(pub);
                      }}
                    >
                      {pub.title}
                    </a>
                  </h3>
                  <div className="tokyo_tm_read_more">
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
    {portalTarget && createPortal(
      <div className={`tokyo_tm_modalbox${open ? " opened" : ""}`} onClick={() => setSelected(null)}>
        <div className="box_inner" onClick={(e) => e.stopPropagation()}>
          <div className="close">
            <a href="#" onClick={(e) => { e.preventDefault(); setSelected(null); }} aria-label="Close">
              <FaTimes />
            </a>
          </div>
          {displayed && (
            <div className="description_wrap">
              <div className="service_popup_informations">
                <div className="image">
                  <img src="/img/thumbs/4-2.jpg" alt="" />
                  <div className="main" style={{ backgroundImage: `url(${displayed.image})` }}></div>
                </div>
                <div className="main_title">
                  <h3>{displayed.title}</h3>
                </div>
                <div className="descriptions">
                  <p className="date" style={{ marginBottom: 15, color: "#767676" }}>
                    {displayed.source} — {displayed.date}
                  </p>
                  <p>{displayed.summary}</p>
                  {displayed.link && (
                    <p>
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
