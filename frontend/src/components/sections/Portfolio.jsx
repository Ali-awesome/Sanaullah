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

// The "All" tab is really the admin-managed photo gallery, not an
// aggregate of every project category — named "Gallery" so it reads as
// what it actually is instead of implying "every project everywhere".
const GALLERY_TAB = "Gallery";
// Shows this many gallery photos up front, with a "Load More" button
// revealing the rest — up to this hard cap regardless of how many photos
// actually exist, so a heavily-populated gallery can't make the tab itself
// unreasonably heavy to load/scroll.
const GALLERY_PAGE_SIZE = 6;
const GALLERY_MAX = 30;

export default function Portfolio({ projects = [], gallery = [] }) {
  const categories = useMemo(() => [GALLERY_TAB, ...new Set(projects.map((p) => p.category))], [projects]);
  const [filter, setFilter] = useState(GALLERY_TAB);
  // The original theme filters the grid via Isotope (tokyo_tm_portfolio() in
  // init.js), which runs a 750ms animated transition on every filter click —
  // not an instant swap. We don't pull in Isotope (a masonry layout engine)
  // for what's a plain CSS grid here, but reproduce the same *timing*: the
  // active tab highlight (`filter`) updates immediately on click, same as
  // the original's separate "current"-class handler, while the actual
  // rendered items (`displayFilter`) cross-fade to the new set over the same
  // 750ms (375ms out, swap, 375ms back in) instead of snapping instantly.
  const [displayFilter, setDisplayFilter] = useState(GALLERY_TAB);
  const fading = filter !== displayFilter;

  useEffect(() => {
    if (filter === displayFilter) return;
    const timer = setTimeout(() => setDisplayFilter(filter), 375);
    return () => clearTimeout(timer);
  }, [filter, displayFilter]);

  const [visibleGalleryCount, setVisibleGalleryCount] = useState(GALLERY_PAGE_SIZE);
  // Switching tabs and back to Gallery starts the pagination over, rather
  // than remembering how far a previous visit had scrolled/expanded.
  useEffect(() => {
    setVisibleGalleryCount(GALLERY_PAGE_SIZE);
  }, [displayFilter]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [hovered, setHovered] = useState(null);
  const tooltipRef = useRef(null);

  const [displayedProject, projectOpen] = useModalTransition(selectedProject);
  const [displayedPhoto, photoOpen] = useModalTransition(selectedPhoto);
  const portalTarget = usePortalTarget();

  const isGallery = displayFilter === GALLERY_TAB;
  const cappedGallery = useMemo(() => gallery.slice(0, GALLERY_MAX), [gallery]);
  const items = isGallery ? cappedGallery.slice(0, visibleGalleryCount) : projects.filter((p) => p.category === displayFilter);
  const hasMoreGalleryItems = isGallery && visibleGalleryCount < cappedGallery.length;

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
        <div className="tokyo_tm_portfolio float-left w-full pb-10 pt-[100px] max-lg:pt-[130px] max-sm:pt-20">
          <div className="tokyo_tm_title">
            <div className="title_flex">
              <div className="left">
                <span>Portfolio</span>
                <h1>Featured Work</h1>
              </div>
              <div className="portfolio_filter max-md:pt-12">
                <ul className="m-0 list-none">
                  {categories.map((c) => (
                    <li key={c} className="mr-[25px] inline-block last:mr-0">
                      <a
                        href="#"
                        className={`inline-block font-heading font-medium transition-colors duration-300 ease-in-out ${
                          filter === c ? "text-black" : "text-[#767676] hover:text-black"
                        }`}
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

          <div className="list_wrapper float-left clear-both w-full">
            <ul
              className={`portfolio_list w-[calc(100%+2.5rem)] -ml-10 flex list-none flex-wrap max-sm:ml-0 max-sm:w-full transition-opacity duration-[375ms] ${
                fading ? "opacity-0" : "opacity-100"
              }`}
            >
              {isGallery
                ? items.map((photo) => (
                    <li key={photo.id} className="mb-10 w-1/3 pl-10 max-sm:w-full max-sm:pl-0">
                      <div className="inner group relative float-left clear-both w-full overflow-hidden">
                        <div
                          className="relative"
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
                            <img src="/img/thumbs/1-1.jpg" alt="" className="min-w-full opacity-0" />
                            <div
                              className="abs_image absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-in-out group-hover:scale-110"
                              style={{ backgroundImage: `url(${photo.image})` }}
                            ></div>
                          </a>
                        </div>
                      </div>
                    </li>
                  ))
                : items.map((item) => (
                    <li key={item.id} className="mb-10 w-1/3 pl-10 max-sm:w-full max-sm:pl-0">
                      <div className="inner group relative float-left clear-both w-full overflow-hidden">
                        <div
                          className="relative"
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
                            <img src="/img/thumbs/1-1.jpg" alt="" className="min-w-full opacity-0" />
                            <div
                              className="abs_image absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-in-out group-hover:scale-110"
                              style={{ backgroundImage: `url(${item.image})` }}
                            ></div>
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
            </ul>
            {hasMoreGalleryItems && (
              <div className="float-left w-full pt-5 text-center">
                <button
                  type="button"
                  className="inline-block bg-black px-10 py-[9px] pb-[14px] text-white transition-colors duration-300 ease-in-out hover:bg-black/80"
                  onClick={() => setVisibleGalleryCount(cappedGallery.length)}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {portalTarget &&
        createPortal(
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
      {portalTarget &&
        createPortal(
          <div className={`tokyo_tm_modalbox${projectOpen ? " opened" : ""}`} onClick={() => setSelectedProject(null)}>
            <div className="box_inner" onClick={(e) => e.stopPropagation()}>
              <div className="close">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedProject(null);
                  }}
                  aria-label="Close"
                >
                  <FaTimes />
                </a>
              </div>
              {displayedProject && (
                <div className="description_wrap">
                  <div className="popup_details float-left clear-both w-full">
                    <div className="top_image relative mb-[37px] h-[340px] overflow-hidden max-lg:h-[260px] max-sm:h-[180px]">
                      <img src="/img/thumbs/4-2.jpg" alt="" className="relative min-w-full opacity-0" />
                      <div
                        className="main absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${displayedProject.image})` }}
                      ></div>
                    </div>
                    <div className="portfolio_main_title float-left mb-7 w-full">
                      <h3 className="text-[23px] font-bold max-sm:text-xl">{displayedProject.title}</h3>
                      <span>{displayedProject.category}</span>
                    </div>
                    <div className="main_details mb-[90px] flex w-full clear-both max-lg:mb-10 max-lg:flex-col">
                      <div className="textbox w-[70%] pr-10 max-lg:mb-5 max-lg:w-full max-lg:pr-0">
                        <p className="mb-[18px] last:mb-0">{displayedProject.summary}</p>
                        {displayedProject.link && (
                          <p className="mb-[18px] last:mb-0">
                            <a href={displayedProject.link} target="_blank" rel="noreferrer">
                              View publication →
                            </a>
                          </p>
                        )}
                      </div>
                      <div className="detailbox w-[30%] pl-10 max-lg:w-full max-lg:pl-0">
                        <ul className="m-0 list-none max-lg:flex max-lg:flex-wrap max-lg:gap-x-6">
                          <li className="float-left mb-2 w-full last:mb-0 max-lg:w-auto">
                            <span className="first mb-[3px] block font-bold text-black max-lg:mb-0 max-lg:mr-1 max-lg:inline">Client:</span>
                            <span className="text-[#767676]">{displayedProject.client}</span>
                          </li>
                          <li className="float-left mb-2 w-full last:mb-0 max-lg:w-auto">
                            <span className="first mb-[3px] block font-bold text-black max-lg:mb-0 max-lg:mr-1 max-lg:inline">Category:</span>
                            <span className="text-[#767676]">{displayedProject.category}</span>
                          </li>
                          <li className="float-left mb-2 w-full last:mb-0 max-lg:w-auto">
                            <span className="first mb-[3px] block font-bold text-black max-lg:mb-0 max-lg:mr-1 max-lg:inline">Date:</span>
                            <span className="text-[#767676]">{displayedProject.date}</span>
                          </li>
                          <li className="float-left mb-2 w-full last:mb-0 max-lg:w-auto">
                            <span className="first mb-[3px] block font-bold text-black max-lg:mb-0 max-lg:mr-1 max-lg:inline">Share:</span>
                            <ul className="share relative top-[7px] m-0 list-none">
                              {(() => {
                                const s = shareLinks(displayedProject.title);
                                return (
                                  <>
                                    <li className="mr-[5px] inline-block last:mr-0">
                                      <a href={s.facebook} target="_blank" rel="noreferrer" aria-label="Share on Facebook" className="text-lg text-black">
                                        <FaFacebookSquare />
                                      </a>
                                    </li>
                                    <li className="mr-[5px] inline-block last:mr-0">
                                      <a href={s.twitter} target="_blank" rel="noreferrer" aria-label="Share on X" className="text-lg text-black">
                                        <FaTwitterSquare />
                                      </a>
                                    </li>
                                    <li className="mr-[5px] inline-block last:mr-0">
                                      <a href={s.linkedin} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" className="text-lg text-black">
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
                      <div className="additional_images float-left clear-both w-full">
                        <ul className="-ml-[30px] list-none max-lg:ml-0">
                          {displayedProject.images.map((img, i) => (
                            <li
                              key={i}
                              className="float-left mb-[30px] w-1/2 pl-[30px] [&:nth-child(3n+1)]:w-full max-lg:w-full max-lg:pl-0"
                            >
                              <div className="list_inner float-left clear-both w-full">
                                <div className="my_image relative">
                                  <img src="/img/thumbs/4-2.jpg" alt="" className="min-w-full opacity-0" />
                                  <div
                                    className="main absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url(${img})` }}
                                  ></div>
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
      {portalTarget &&
        createPortal(
          <div className={`tokyo_tm_modalbox${photoOpen ? " opened" : ""}`} onClick={() => setSelectedPhoto(null)}>
            <div className="box_inner" onClick={(e) => e.stopPropagation()}>
              <div className="close">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPhoto(null);
                  }}
                  aria-label="Close"
                >
                  <FaTimes />
                </a>
              </div>
              {displayedPhoto && (
                <div className="description_wrap">
                  <div className="popup_details float-left clear-both w-full">
                    <div className="top_image relative mb-[37px] h-[340px] overflow-hidden max-lg:h-[260px] max-sm:h-[180px]">
                      <img src="/img/thumbs/4-2.jpg" alt="" className="relative min-w-full opacity-0" />
                      <div
                        className="main absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${displayedPhoto.image})` }}
                      ></div>
                    </div>
                    <div className="portfolio_main_title float-left w-full">
                      <h3 className="text-[23px] font-bold max-sm:text-xl">{displayedPhoto.name}</h3>
                    </div>
                    {displayedPhoto.description && (
                      <div className="descriptions float-left w-full">
                        <p>{displayedPhoto.description}</p>
                      </div>
                    )}
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
