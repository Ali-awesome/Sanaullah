import { useState } from "react";
import { NAV_ITEMS } from "../App.jsx";

export default function Sidebar({ profile, active, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  const renderLinks = () =>
    NAV_ITEMS.map((item) => (
      <li key={item.id} className={active === item.id ? "active" : ""}>
        <a
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            go(item.id);
          }}
        >
          {item.label}
        </a>
      </li>
    ));

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="tokyo_tm_topbar">
        <div className="topbar_inner">
          <div className="logo" data-type="text">
            <a href="#home" onClick={(e) => { e.preventDefault(); go("home"); }}>
              <h3>{profile.name.split(" ")[0]}</h3>
            </a>
          </div>
          <div className="trigger" onClick={() => setMenuOpen((v) => !v)}>
            <div className={`hamburger hamburger--slider${menuOpen ? " is-active" : ""}`}>
              <div className="hamburger-box">
                <div className="hamburger-inner"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`tokyo_tm_mobile_menu${menuOpen ? " opened" : ""}`}>
        <div className="menu_list">
          <ul className="transition_link">{renderLinks()}</ul>
        </div>
      </div>

      {/* DESKTOP LEFT NAV */}
      <div className="leftpart">
        <div className="leftpart_inner">
          <div className="logo" data-type="text">
            <a href="#home" onClick={(e) => { e.preventDefault(); go("home"); }}>
              <h3>{profile.name.split(" ")[0]}</h3>
            </a>
          </div>
          <div className="menu">
            <ul className="transition_link">{renderLinks()}</ul>
          </div>
          <div className="copyright">
            <p>
              &copy; {new Date().getFullYear()} {profile.name}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
