"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ width: "40px", height: "40px" }} />;

  return (
    <button
      onClick={toggle}
      className={`theme-toggle-btn ${theme}`}
      style={{
        padding: "8px",
        borderRadius: "12px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        color: theme === "dark" ? "#FDB813" : "#3B82F6",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: 'relative',
        overflow: 'hidden'
      }}
      title={theme === "dark" ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish"}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      }}
    >
      <div style={{ transition: "all 0.5s ease", transform: theme === "dark" ? "rotate(0)" : "rotate(360deg)" }}>
        {theme === "dark" ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
      </div>
    </button>
  );
}
