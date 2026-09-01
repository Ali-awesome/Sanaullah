import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaFacebookSquare, FaTwitterSquare, FaLinkedin } from "react-icons/fa";
import { useModalTransition } from "../../hooks/useModalTransition.js";
import { usePortalTarget } from "../../hooks/usePortalTarget.js";

// Real share-intent links for the "Share" row in the Detail popup (the
// original theme's own icons are inert placeholders — href="#" — since a
// static demo has no real page to share; ours actually work). There's no
// per-project route in this single-page app, so every project shares the
// same page URL with its own title as the share text.
function shareLinks(title) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = encodeURIComponent(title);
  const u = encodeURIComponent(url);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    twitter: `https://twitter.com/intent/tweet?url=${u}&text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  };
}

export default function Portfolio({ profile, gallery = [] }) {
  const categories = useMemo(
    () => ["All", ...new Set(profile.portfolio.map((p) => p.category))],
    [profile.portfolio]
  );
  const [filter, setFilter] = useState("All");
  // The original theme filters the grid via Isotope (tokyo_tm_portfolio() in
  // init.js), which runs a 750ms animated transition on every filter click —
  // not an instant swap. We don't pull in Isotope (a masonry layout engine)
  // for what's a plain CSS grid here, but reproduce the same *timing*: the
  // active tab highlight (`filter`) updates immediately on click, same as
  // the original's separate "current"-class handler, while the actual
  // rendered items (`displayFilter`) cross-fade to the new set over the same
  // 750ms (375ms out, swap, 375ms back in) instead of snapping instantly.
  const [displayFilter, setDisplayFilter] = useState("All");
  const fading = filter !== displayFilter;

  useEffect(() => {
    if (filter === displayFilter) return;
    const timer = setTimeout(() => setDisplayFilter(filter), 375);
    return () => clearTimeout(timer);
  }, [filter, displayFilter]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [hovered, setHovered] = useState(null);
  const tooltipRef = useRef(null);

  const [displayedProject, projectOpen] = useModalTransition(selectedProject);
  const [displayedPhoto, photoOpen] = useModalTransition(selectedPhoto);
  const portalTarget = usePortalTarget();

  // "All" is the photo gallery (admin-managed, via /api/gallery), not an
  // aggregate of every category — each category tab still shows only its
  // own portfolio projects.
  const isGallery = displayFilter === "All";
  const items = isGallery ? gallery : profile.portfolio.filter((p) => p.category === displayFilter);

  // Recreates tokyo_tm_projects() from the source init.js: a small label
  // that follows the cursor, showing the hovered item's name (plus category,
  // for portfolio items). Position is written straight to the DOM (not
  // React state) so it can track every mousemove without re-rendering the
  // list.
  const handleMove = (e) => {
    if (!tooltipRef.current) return;
    tooltipRef.current.style.left = `${e.clientX - 10}px`;
    tooltipRef.current.style.top = `${e.clientY + 25}px`;
  };

  // The tooltip and both modals are portaled into .tokyo_tm_all_wrap (see
  // usePortalTarget): they're position:fixed, but this section (#portfolio)
  // is `position: absolute` with its own z-index (see .tokyo_tm_section in
  // style.css), which makes it a stacking context — so z-index on anything
  // nested inside it only ever ranks *within* that context, not against the
  // sidebar (.leftpart, z-index 12) globally. Since #portfolio's own
  // z-index (8–10) loses to the sidebar's, everything nested inside it was
  // rendering partly behind the sidebar, invisible on the mostly-white
  // Service/Publications popups but obvious here against a full-bleed photo.
  // The original theme avoids this entirely by prepending its modal markup
  // straight onto .tokyo_tm_all_wrap (a sibling of the sidebar, outside any
  // section) — this portal reproduces that exactly, rather than portaling to
  // document.body, which would dodge the stacking bug but escape the
  // theme's `.tokyo_tm_all_wrap *{ box-sizing: border-box }` reset too
  // (a real regression an earlier version of this fix had — every
  // padding/width calculation in the modal markup assumes border-box).
  return (
    <>
    <div className="container">
      <div className="tokyo_tm_portfolio">
        <div className="tokyo_tm_title">
          <div className="title_flex">
            <div className="left">
              <span>Portfolio</span>
              <h2>Featured Work</h2>
            </div>
            <div className="portfolio_filter">
              <ul>
                {categories.map((c) => (
                  <li key={c}>
                    <a
                      href="#"
                      className={filter === c ? "current" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        setFilter(c);
                      }}
                    >
                      {c}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="list_wrapper">
          <ul className={`portfolio_list gallery_zoom${fading ? " fading" : ""}`}>
            {isGallery
              ? items.map((photo) => (
                  <li key={photo.id}>
                    <div className="inner">
                      <div
                        className="entry tokyo_tm_portfolio_animation_wrap"
                        data-title={photo.name}
                        onMouseEnter={() => setHovered({ title: photo.name })}
                        onMouseMove={handleMove}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedPhoto(photo);
                          }}
                        >
                          <img src="/img/thumbs/1-1.jpg" alt="" />
                          <div className="abs_image" style={{ backgroundImage: `url(${photo.image})` }}></div>
                        </a>
                      </div>
                    </div>
                  </li>
                ))
              : items.map((item) => (
                  <li key={item.slug}>
                    <div className="inner">
                      <div
                        className="entry tokyo_tm_portfolio_animation_wrap"
                        data-title={item.title}
                        data-category={item.category}
                        onMouseEnter={() => setHovered({ title: item.title, category: item.category })}
                        onMouseMove={handleMove}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedProject(item);
                          }}
                        >
                          <img src="/img/thumbs/1-1.jpg" alt="" />
                          <div className="abs_image" style={{ backgroundImage: `url(${item.image})` }}></div>
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>

    {portalTarget && createPortal(
      <div className={`tokyo_tm_portfolio_titles${hovered ? " visible" : ""}`} ref={tooltipRef}>
        {hovered?.title}
        {hovered?.category && <span className="work__cat">{hovered.category}</span>}
      </div>,
      portalTarget
    )}

    {/* Matches the original theme's "Detail" popup style exactly (verified
          against the live template): a full-width hero image, title +
          category, a two-column text/detail-list body (Client, Category,
          Date, Share), and an optional additional-images strip. The strip
          only renders when a project actually supplies extra images — none
          of ours do, so it's structurally present but stays invisible
          rather than filling the space with unrelated stock photos. */}
    {/* This shell renders unconditionally from first mount (matching the
        original theme's own markup, which always has the popup div in the
        DOM, hidden by .tokyo_tm_modalbox's own CSS) so the "opened" class
        always has a previously-painted closed state to transition from —
        see useModalTransition for why that matters. Only the inner
        content is conditional, gated on displayedProject. */}
    {portalTarget && createPortal(
      <div
        className={`tokyo_tm_modalbox${projectOpen ? " opened" : ""}`}
        onClick={() => setSelectedProject(null)}
      >
        <div className="box_inner" onClick={(e) => e.stopPropagation()}>
          <div className="close">
            <a href="#" onClick={(e) => { e.preventDefault(); setSelectedProject(null); }} aria-label="Close">
              <FaTimes />
            </a>
          </div>
          {displayedProject && (
            <div className="description_wrap">
              <div className="popup_details">
                <div className="top_image">
                  <img src="/img/thumbs/4-2.jpg" alt="" />
                  <div className="main" style={{ backgroundImage: `url(${displayedProject.image})` }}></div>
                </div>
                <div className="portfolio_main_title">
                  <h3>{displayedProject.title}</h3>
                  <span>{displayedProject.category}</span>
                </div>
                <div className="main_details">
                  <div className="textbox">
                    <p>{displayedProject.summary}</p>
                    {displayedProject.link && (
                      <p>
                        <a href={displayedProject.link} target="_blank" rel="noreferrer">
                          View publication →
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="detailbox">
                    <ul>
                      <li>
                        <span className="first">Client</span>
                        <span>{displayedProject.client}</span>
                      </li>
                      <li>
                        <span className="first">Category</span>
                        <span>{displayedProject.category}</span>
                      </li>
                      <li>
                        <span className="first">Date</span>
                        <span>{displayedProject.date}</span>
                      </li>
                      <li>
                        <span className="first">Share</span>
                        <ul className="share">
                          {(() => {
                            const s = shareLinks(displayedProject.title);
                            return (
                              <>
                                <li>
                                  <a href={s.facebook} target="_blank" rel="noreferrer" aria-label="Share on Facebook">
                                    <FaFacebookSquare />
                                  </a>
                                </li>
                                <li>
                                  <a href={s.twitter} target="_blank" rel="noreferrer" aria-label="Share on X">
                                    <FaTwitterSquare />
                                  </a>
                                </li>
                                <li>
                                  <a href={s.linkedin} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn">
                                    <FaLinkedin />
                                  </a>
                                </li>
                              </>
                            );
                          })()}
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                {displayedProject.images?.length > 0 && (
                  <div className="additional_images">
                    <ul>
                      {displayedProject.images.map((img, i) => (
                        <li key={i}>
                          <div className="list_inner">
                            <div className="my_image">
                              <img src="/img/thumbs/4-2.jpg" alt="" />
                              <div className="main" style={{ backgroundImage: `url(${img})` }}></div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>,
      portalTarget
    )}

    {/* Gallery photos are simple admin-uploaded images (name + picture),
        not portfolio projects — so this reuses the same Detail chrome
        (hero image, description_wrap scroll/fade) without the Client/
        Category/Date/Share list that only makes sense for real projects.
        Shell renders unconditionally from first mount, same as above. */}
    {portalTarget && createPortal(
      <div className={`tokyo_tm_modalbox${photoOpen ? " opened" : ""}`} onClick={() => setSelectedPhoto(null)}>
        <div className="box_inner" onClick={(e) => e.stopPropagation()}>
          <div className="close">
            <a href="#" onClick={(e) => { e.preventDefault(); setSelectedPhoto(null); }} aria-label="Close">
              <FaTimes />
            </a>
          </div>
          {displayedPhoto && (
            <div className="description_wrap">
              <div className="popup_details">
                <div className="top_image">
                  <img src="/img/thumbs/4-2.jpg" alt="" />
                  <div className="main" style={{ backgroundImage: `url(${displayedPhoto.image})` }}></div>
                </div>
                <div className="portfolio_main_title">
                  <h3>{displayedPhoto.name}</h3>
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
