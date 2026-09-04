import { useState } from "react";
import { NAV_ITEMS } from "../App.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Sidebar({ profile, active, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen((v) => !v);
  const onTriggerKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  };

  const renderLinks = (liClassName, linkClassName) =>
    NAV_ITEMS.map((item) => {
      const isActive = active === item.id;
      return (
        <li key={item.id} className={`${liClassName} ${isActive ? "active" : ""}`}>
          <a
            href={`#${item.id}`}
            className={`${linkClassName} ${
              isActive ? "text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
            onClick={(e) => {
              e.preventDefault();
              go(item.id);
            }}
          >
            {item.label}
          </a>
        </li>
      );
    });

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="tokyo_tm_topbar fixed inset-x-0 top-0 z-[14] hidden h-[50px] bg-[var(--bg)] max-lg:block">
        <div className="topbar_inner flex h-full w-full items-center justify-between px-5">
          <div className="logo">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                go("home");
              }}
            >
              <h3 className="font-poppins text-[25px] font-black tracking-[4px] text-[var(--fg)]">
                {profile.name.split(" ")[0]}
              </h3>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div
              className="trigger relative top-[5px] cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={toggleMenu}
              onKeyDown={onTriggerKeyDown}
            >
              <div className={`hamburger hamburger--slider${menuOpen ? " is-active" : ""}`}>
                <div className="hamburger-box">
                  <div className="hamburger-inner"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`tokyo_tm_mobile_menu${menuOpen ? " opened" : ""}`}>
        <div className="menu_list w-full px-5 pt-[100px] text-right">
          <ul className="transition_link m-0 list-none">
            {renderLinks("mb-[7px]", "font-heading text-[var(--fg)]")}
          </ul>
        </div>
      </div>

      {/* DESKTOP LEFT NAV */}
      <div className="leftpart fixed z-[12] flex h-screen w-[450px] items-center bg-[var(--bg)] px-[100px] max-xl:w-[350px] max-xl:px-[70px] max-lg:hidden">
        <div className="leftpart_inner h-auto w-full">
          <div className="logo">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                go("home");
              }}
            >
              <h3 className="font-poppins text-[31px] font-black tracking-[5px] text-[var(--fg)]">
                {profile.name.split(" ")[1]}
              </h3>
            </a>
          </div>
          <div className="menu w-full py-[50px]">
            <ul className="transition_link m-0 list-none">
              {renderLinks("float-left w-full", "inline-block font-medium font-heading transition-colors duration-300 ease-in-out")}
            </ul>
          </div>
          <div className="mb-5 flex w-full">
            <ThemeToggle />
          </div>
          <div className="copyright w-full">
            <p className="font-heading text-[12px] leading-[25px] text-[var(--fg-faint)]">
              &copy; {new Date().getFullYear()} {profile.name}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
