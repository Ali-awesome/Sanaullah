import { useEffect, useState, lazy, Suspense } from "react";
import { fetchProfile, postsClient, galleryClient, portfolioProjectsClient } from "./api/client.js";
import Sidebar from "./components/Sidebar.jsx";
import Preloader from "./components/Preloader.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import Cursor from "./components/Cursor.jsx";
import Home from "./components/sections/Home.jsx";
import About from "./components/sections/About.jsx";
import Service from "./components/sections/Service.jsx";
import Portfolio from "./components/sections/Portfolio.jsx";
import Publications from "./components/sections/Publications.jsx";
import Contact from "./components/sections/Contact.jsx";

// Loaded on demand, not bundled with the public site: the admin panel pulls
// in a rich text editor (Tiptap) that only the admin ever needs, and every
// visitor to the actual portfolio would otherwise pay for downloading it.
const AdminPanel = lazy(() => import("./components/admin/AdminPanel.jsx"));

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
  if (!isAdminRoute) return <PortfolioApp />;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminPanel />
    </Suspense>
  );
}

function PortfolioApp() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
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
    Promise.all([fetchProfile(), postsClient.fetchAll(), galleryClient.fetchAll(), portfolioProjectsClient.fetchAll()])
      .then(([profileData, postsData, galleryData, portfolioProjectsData]) => {
        setProfile(profileData);
        setPosts(postsData);
        setGallery(galleryData);
        setPortfolioProjects(portfolioProjectsData);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#141414] p-10 text-white">
        Could not reach the API. Please start the backend (see README).
        <br />
        <small>{error}</small>
      </div>
    );
  }

  // Checks whether the data actually exists first (a centered spinner, not
  // the intro curtain — there's nothing yet for the curtain to reveal).
  // Only once the profile has actually loaded does the real curtain
  // (Preloader) play, immediately followed by the real site — mounted
  // exactly once, in the return below, so it never gets remounted/replayed
  // by a later re-render the way it would if it were duplicated across
  // multiple early-return branches like this one.
  if (!profile) {
    return <LoadingSpinner />;
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

      <div className="rightpart relative float-left min-h-screen w-full bg-[var(--bg-alt)] pl-[450px] max-xl:pl-[350px] max-lg:pl-0">
        <div className="rightpart_in relative float-left min-h-screen w-full clear-both border-l border-[var(--border)] max-lg:border-l-0">
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
            <Portfolio projects={portfolioProjects} gallery={gallery} />
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
