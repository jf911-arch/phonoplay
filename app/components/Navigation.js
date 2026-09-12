"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const mainLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Words",
    href: "/words",
  },
  {
    name: "Wordle",
    href: "/wordle",
  },
  {
    name: "Word Search",
    href: "/word-search",
  },
];

const menuLinks = [
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Settings",
    href: "/settings",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  function isActive(href) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="site-header">

      <nav
        className="navbar"
        aria-label="Main navigation"
      >

        {/* LOGO */}

        <Link
          href="/"
          className="navbar-logo"
          aria-label="PhonoPlay home"
        >
          <span className="logo-mark">
            P
          </span>

          <span className="logo-text">
            PhonoPlay
          </span>
              
        </Link>
    <p> Assessment 2 - Backend implementation and database integration </p>

        {/* DESKTOP NAVIGATION */}

        <div className="desktop-nav">

          {mainLinks.map((link) => (

            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${
                isActive(link.href)
                  ? "active"
                  : ""
              }`}
            >
              {link.name}
            </Link>


          ))}

        </div>

        {/* DESKTOP MENU */}

        <div className="desktop-menu">

          <button
            className={`menu-button ${
              menuOpen
                ? "menu-button-active"
                : ""
            }`}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-label={
              menuOpen
                ? "Close menu"
                : "Open menu"
            }
          >
            <span />
            <span />
            <span />
          </button>

          {menuOpen && (

            <div
              className="dropdown-menu"
              role="menu"
            >

              {menuLinks.map((link) => (

                <Link
                  key={link.href}
                  href={link.href}
                  className={`dropdown-link ${
                    isActive(link.href)
                      ? "active"
                      : ""
                  }`}
                  role="menuitem"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >

                  <span>
                    {link.name ===
                    "About"
                      ? "ⓘ "
                      : "⚙ "}
                  </span>

                  {link.name}

                </Link>

              ))}

            </div>

          )}

        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          className={`mobile-menu-button ${
            menuOpen
              ? "open"
              : ""
          }`}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
        >

          <span />
          <span />
          <span />

        </button>

      </nav>

      {/* MOBILE NAVIGATION */}

      <div
        id="mobile-navigation"
        className={`mobile-navigation ${
          menuOpen
            ? "mobile-navigation-open"
            : ""
        }`}
      >

        <div className="mobile-navigation-inner">

          {[
            ...mainLinks,
            ...menuLinks,
          ].map((link) => (

            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav-link ${
                isActive(link.href)
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setMenuOpen(false)
              }
            >

              {link.name}

            </Link>

          ))}

        </div>

      </div>

    </header>
  );
}