"use client";

import { useEffect, useState } from "react";

function setCookie(name, value, days = 365) {
  const expires = new Date();

  expires.setTime(
    expires.getTime() +
      days * 24 * 60 * 60 * 1000
  );

  document.cookie =
    `${name}=${encodeURIComponent(value)}; ` +
    `expires=${expires.toUTCString()}; ` +
    `path=/; SameSite=Lax`;
}

function getCookie(name) {
  const cookies =
    document.cookie.split("; ");

  const cookie = cookies.find(
    (item) =>
      item.startsWith(`${name}=`)
  );

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(
    cookie.split("=")[1]
  );
}

export default function SettingsPage() {
  const [theme, setTheme] =
    useState("light");

  const [compactLayout, setCompactLayout] =
    useState(false);

  const [loaded, setLoaded] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      getCookie("phonoplay-theme");

    const savedLayout =
      getCookie("phonoplay-layout");

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      setTheme(savedTheme);
    }

    if (savedLayout === "compact") {
      setCompactLayout(true);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    setCookie(
      "phonoplay-theme",
      theme
    );

    setCookie(
      "phonoplay-layout",
      compactLayout
        ? "compact"
        : "comfortable"
    );

    applyTheme(theme);

    if (compactLayout) {
      document.body.classList.add(
        "compact-layout"
      );
    } else {
      document.body.classList.remove(
        "compact-layout"
      );
    }
  }, [
    theme,
    compactLayout,
    loaded,
  ]);

  function applyTheme(selectedTheme) {
    const root =
      document.documentElement;

    if (selectedTheme === "dark") {
      root.setAttribute(
        "data-theme",
        "dark"
      );

      return;
    }

    if (selectedTheme === "light") {
      root.setAttribute(
        "data-theme",
        "light"
      );

      return;
    }

    root.setAttribute(
      "data-theme",
      "system"
    );
  }

  function resetSettings() {
    setTheme("light");
    setCompactLayout(false);

    setCookie(
      "phonoplay-theme",
      "light"
    );

    setCookie(
      "phonoplay-layout",
      "comfortable"
    );

    applyTheme("light");

    document.body.classList.remove(
      "compact-layout"
    );
  }

  return (
    <div className="page-container">

      <section className="settings-page-header">

        <span className="section-label-heading">
          PREFERENCES
        </span>

        <h1>
          Settings
        </h1>

        <p>
          Personalise the PhonoPlay
          builder to suit your workflow.
        </p>

      </section>

      <div className="settings-container">

        {/* APPEARANCE */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              ◐
            </div>

            <div>

              <h2>
                Appearance
              </h2>

              <p>
                Choose how the application
                should look.
              </p>

            </div>

          </div>

          <div className="settings-options">

            <button
              className={`theme-option ${
                theme === "light"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setTheme("light")
              }
              aria-pressed={
                theme === "light"
              }
            >

              <span className="theme-symbol">
                ☀
              </span>

              <span className="theme-text">

                <strong>
                  Light
                </strong>

                <small>
                  Bright interface
                  for daytime use
                </small>

              </span>

              <span className="theme-check">
                {theme === "light"
                  ? "✓"
                  : ""}
              </span>

            </button>

            <button
              className={`theme-option ${
                theme === "dark"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setTheme("dark")
              }
              aria-pressed={
                theme === "dark"
              }
            >

              <span className="theme-symbol">
                ☾
              </span>

              <span className="theme-text">

                <strong>
                  Dark
                </strong>

                <small>
                  Reduced brightness
                  for darker environments
                </small>

              </span>

              <span className="theme-check">
                {theme === "dark"
                  ? "✓"
                  : ""}
              </span>

            </button>

            <button
              className={`theme-option ${
                theme === "system"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setTheme("system")
              }
              aria-pressed={
                theme === "system"
              }
            >

              <span className="theme-symbol">
                💻
              </span>

              <span className="theme-text">

                <strong>
                  System
                </strong>

                <small>
                  Follow your device
                  preference
                </small>

              </span>

              <span className="theme-check">
                {theme === "system"
                  ? "✓"
                  : ""}
              </span>

            </button>

          </div>

        </section>

        {/* LAYOUT */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              ⛶
            </div>

            <div>

              <h2>
                Layout
              </h2>

              <p>
                Adjust the amount of
                spacing in the interface.
              </p>

            </div>

          </div>

          <label className="setting-toggle">

            <span className="setting-toggle-text">

              <strong>
                Compact layout
              </strong>

              <small>
                Reduce spacing to fit
                more information on screen.
              </small>

            </span>

            <input
              type="checkbox"
              checked={
                compactLayout
              }
              onChange={(event) =>
                setCompactLayout(
                  event.target.checked
                )
              }
            />

            <span className="toggle-slider" />

          </label>

        </section>

        {/* INFORMATION */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              ℹ
            </div>

            <div>

              <h2>
                Preferences
              </h2>

              <p>
                Your settings are saved
                locally in your browser.
              </p>

            </div>

          </div>

          <div className="settings-info">

            <div>

              <span>
                Theme
              </span>

              <strong>
                {theme === "system"
                  ? "System"
                  : theme === "light"
                  ? "Light"
                  : "Dark"}
              </strong>

            </div>

            <div>

              <span>
                Layout
              </span>

              <strong>
                {compactLayout
                  ? "Compact"
                  : "Comfortable"}
              </strong>

            </div>

            <div>

              <span>
                Storage
              </span>

              <strong>
                Browser cookie
              </strong>

            </div>

          </div>

        </section>

        {/* RESET */}

        <section className="settings-reset">

          <div>

            <strong>
              Reset preferences
            </strong>

            <p>
              Restore the default appearance
              and layout settings.
            </p>

          </div>

          <button
            className="reset-settings-button"
            onClick={
              resetSettings
            }
          >
            Reset Settings
          </button>

        </section>

      </div>

    </div>
  );
}