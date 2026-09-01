import { useEffect, useState } from "react";
import { fetchProfile, fetchPosts, fetchGallery } from "./api/client.js";
import Sidebar from "./components/Sidebar.jsx";
import Preloader from "./components/Preloader.jsx";
import Cursor from "./components/Cursor.jsx";
import Home from "./components/sections/Home.jsx";
import About from "./components/sections/About.jsx";
import Service from "./components/sections/Service.jsx";
import Portfolio from "./components/sections/Portfolio.jsx";
import Publications from "./components/sections/Publications.jsx";
import Contact from "./components/sections/Contact.jsx";
import AdminPanel from "./components/admin/AdminPanel.jsx";

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "service", label: "Service" },
  { id: "portfolio", label: "Portfolio" },
  { id: "news", label: "News" },
  { id: "contact", label: "Contact" },
];

const isAdminRoute = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("admin");

export default function App() {
  return isAdminRoute ? <AdminPanel /> : <PortfolioApp />;
}

function PortfolioApp() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState(null);
  const [active, setActiveRaw] = useState("home");
  // The original theme only plays the section-enter animation on a
  // user-triggered nav click, not on the very first paint (the static
  // "home" section starts pre-animated in the source HTML). This flag
  // reproduces that: false until the first navigation happens.
  const [hasNavigated, setHasNavigated] = useState(false);

  // Tracks which section is mid-entrance-animation. The animation's last
  // keyframe (translateX(0)) is a no-op visually but is still a non-"none"
  // transform, which creates a new containing block for any `position:
  // fixed` descendant (e.g. the Portfolio hover tooltip) for as long as the
  // "fadeInLeft" class stays on the section — breaking that descendant's
  // fixed-to-viewport positioning. The original theme avoids this by
  // stripping the animation class once it finishes; we mirror that here by
  // clearing it after the animation's 1s duration (see .animated in
  // plugins.css).
  const [enteringId, setEnteringId] = useState(null);

  const setActive = (id) => {
    setHasNavigated(true);
    setActiveRaw(id);
  };

  useEffect(() => {
    if (!hasNavigated) return;
    setEnteringId(active);
    const timer = setTimeout(() => setEnteringId(null), 1000);
    return () => clearTimeout(timer);
  }, [active, hasNavigated]);

  useEffect(() => {
    Promise.all([fetchProfile(), fetchPosts(), fetchGallery()])
      .then(([profileData, postsData, galleryData]) => {
        setProfile(profileData);
        setPosts(postsData);
        setGallery(galleryData);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <>
        <Preloader />
        <div className="min-h-screen bg-[#141414] p-10 text-white">
          Could not reach the API. Please start the backend (see README).
          <br />
          <small>{error}</small>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Preloader />
        <div className="min-h-screen bg-[#141414] p-10 text-white">Loading…</div>
      </>
    );
  }

  // Mirrors the original theme's three-state section system
  // (.hidden / .animated / .active — see tokyo_tm_page_transition() in
  // the source init.js): the active section gets .active.animated, plus
  // a one-time .fadeInLeft entrance on every navigation after the first;
  // every other section is just .hidden.
  const sectionClass = (id) => {
    if (id !== active) return "tokyo_tm_section hidden";
    const entering = hasNavigated && enteringId === id;
    return `tokyo_tm_section active animated${entering ? " fadeInLeft" : ""}`;
  };

  return (
    <div
      className="tokyo_tm_all_wrap relative float-left h-auto w-full clear-both"
      data-magic-cursor="show"
      data-enter="fadeInLeft"
      data-exit=""
    >
      <Preloader />
      <Sidebar profile={profile} active={active} onNavigate={setActive} />

      <div className="rightpart relative float-left min-h-screen w-full bg-[#f8f8f8] pl-[450px] max-xl:pl-[350px] max-lg:pl-0">
        <div className="rightpart_in relative float-left min-h-screen w-full clear-both border-l border-[#ebebeb] max-lg:border-l-0">
          <div id="home" className={sectionClass("home")}>
            <Home profile={profile} />
          </div>
          <div id="about" className={sectionClass("about")}>
            <About profile={profile} />
          </div>
          <div id="service" className={sectionClass("service")}>
            <Service profile={profile} />
          </div>
          <div id="portfolio" className={sectionClass("portfolio")}>
            <Portfolio profile={profile} gallery={gallery} />
          </div>
          <div id="news" className={sectionClass("news")}>
            <Publications posts={posts} />
          </div>
          <div id="contact" className={sectionClass("contact")}>
            <Contact profile={profile} />
          </div>
        </div>
      </div>

      <Cursor />
    </div>
  );
}
