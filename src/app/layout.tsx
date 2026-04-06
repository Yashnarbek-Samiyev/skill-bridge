import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

import ThemeToggle from "./ThemeToggle";
import LangToggle from "./LangToggle";
import NotificationPanel from "./NotificationPanel";
import { getDictionary } from "@/lib/i18n";
import { getSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getNotifications } from "@/lib/actions";
import prisma from "@/lib/prisma";
import SupportChat from "./SupportChat";
import { Dictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Skill-Bridge Platform",
  description:
    "Texnikum talabalarini real mijozlar bilan bog'laydigan zamonaviy ta'lim va mehnat platformasi"
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary();
  const session = await getSession();
  let notifs: any[] = [];
  let currentUser = null;
  if (session?.userId) {
    notifs = await getNotifications(session.userId as string);
    currentUser = await prisma.user.findUnique({
      where: { id: session.userId as string },
      select: { name: true, username: true }
    });
  }

  async function handleLogout() {
    "use server";
    await deleteSession();
    redirect("/");
  }

  return (
    <html lang="uz" data-theme="light" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <nav className="navbar">
          <Link
            href="/"
            className="logo"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="14" fill="#3B82F6" />
              {/* Vertical line for 'B' */}
              <path d="M16 12V36" stroke="white" strokeWidth="4" strokeLinecap="round" />
              {/* S-curve that also forms the loops of 'B' */}
              <path
                d="M16 12C16 12 34 12 34 18C34 24 16 24 16 24C16 24 34 24 34 30C34 36 16 36 16 36"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', lineHeight: 1, color: 'var(--invert-heading)', letterSpacing: '-0.3px' }}>
                Skill<span style={{ color: 'var(--accent)' }}>Bridge</span>
              </div>
              <div className="logo-tagline" style={{ fontSize: '10px', fontWeight: 500, color: 'var(--t3)', letterSpacing: '0.3px', lineHeight: 1 }}>
                Talabalar · Mijozlar · Texnikum
              </div>
            </div>
          </Link>
          <div className="nav-links" style={{ alignItems: "center" }}>
            <Link href="/" className="nav-link">
              {dict.nav.home}
            </Link>

            {/* Ommaviy havolalar - mobil qurilmalarda yashiriladi */}
            <Link href="/#about" className="nav-link nav-link-secondary">
              {dict.nav.about}
            </Link>
            <Link href="/#faq" className="nav-link nav-link-secondary">
              {dict.nav.faq}
            </Link>
            <Link href="/#help" className="nav-link nav-link-secondary">
              {dict.nav.help}
            </Link>

            {!session && (
              <>
                <Link
                  href="/register"
                  className="btn btn-secondary nav-link-login nav-link-secondary"
                  style={{ padding: "8px 16px", fontSize: "12px", border: '1px solid var(--border)' }}
                >
                  {dict.nav.register}
                </Link>
                <Link
                  href="/login"
                  className="btn btn-primary nav-link-login"
                  style={{ padding: "8px 16px", fontSize: "12px" }}
                >
                  {dict.nav.login}
                </Link>
              </>
            )}

            {session?.role === "CLIENT" && (
              <Link href="/client" className="nav-link nav-link-role">
                {dict.nav.client}
              </Link>
            )}
            {session?.role === "STUDENT" && (
              <Link href="/student" className="nav-link nav-link-role">
                {dict.nav.student}
              </Link>
            )}
            {session?.role === "LEADER" && (
              <Link href="/leader" className="nav-link nav-link-role">
                {dict.nav.leader}
              </Link>
            )}
            {session?.role === "ADMIN" && (
              <Link href="/admin" className="nav-link">
                {dict.nav.admin}
              </Link>
            )}

            {session && currentUser && (
              <div className="nav-user-info" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
                <div className="nav-user-details" style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', lineHeight: '1.2' }}>{currentUser.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--t3)', lineHeight: '1' }}>@{currentUser.username}</span>
                </div>
                <form action={handleLogout} style={{ display: "inline" }}>
                  <button
                    type="submit"
                    className="nav-link nav-link-login"
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--err)",
                      fontWeight: "bold",
                      display: "inline-flex"
                    }}
                  >
                    {dict.nav.logout}
                  </button>
                </form>
              </div>
            )}

            <div
              className="nav-icon-group"
              style={{
                display: "flex",
                gap: "8px",
                marginLeft: "12px",
                borderLeft: "1px solid var(--border)",
                paddingLeft: "16px",
                alignItems: "center"
              }}
            >
              {session && (
                <NotificationPanel
                  notifications={notifs}
                  userId={session.userId as string}
                  dict={dict}
                />
              )}
              <LangToggle />
              <ThemeToggle />
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <SupportChat dict={dict} />
        
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              
              {/* Column 1: About */}
              <div className="footer-col">
                <div className="logo" style={{ marginBottom: '16px' }}>
                  Skill<span style={{ color: 'var(--accent)' }}>Bridge</span>
                </div>
                <p className="footer-text" style={{ marginBottom: '20px' }}>
                  {dict.footerCol1Desc}
                </p>
                <div className="footer-socials">
                  <Link href="#" className="social-icon" title="Telegram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  </Link>
                  <Link href="#" className="social-icon" title="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </Link>
                  <Link href="#" className="social-icon" title="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </Link>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="footer-col">
                <h4 className="footer-col-title">{dict.footerCol2Title}</h4>
                <div className="footer-links">
                  <Link href="/" className="footer-link">{dict.nav.home}</Link>
                  <Link href="/#about" className="footer-link">{dict.nav.about}</Link>
                  <Link href="/#faq" className="footer-link">{dict.nav.faq}</Link>
                  <Link href="/#help" className="footer-link">{dict.nav.help}</Link>
                  <Link href="/register" className="footer-link">{dict.nav.register}</Link>
                </div>
              </div>

              {/* Column 3: Services */}
              <div className="footer-col">
                <h4 className="footer-col-title">{dict.footerCol3Title}</h4>
                <div className="footer-links">
                  <Link href="/#directions" className="footer-link">IT va Dasturlash</Link>
                  <Link href="/#directions" className="footer-link">Grafik Dizayn</Link>
                  <Link href="/#directions" className="footer-link">Maishiy Texnika Ta'miri</Link>
                  <Link href="/#directions" className="footer-link">Oshpazlik va Konditer</Link>
                  <Link href="/#directions" className="footer-link">Tikuvchilik</Link>
                </div>
              </div>

              {/* Column 4: Newsletter / Contact */}
              <div className="footer-col">
                <h4 className="footer-col-title">{dict.newsletterTitle}</h4>
                <p className="footer-text">{dict.newsletterSub}</p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Email..." 
                    className="form-input" 
                    style={{ borderRadius: '8px 0 0 8px', borderRight: 'none' }}
                  />
                  <button 
                    className="btn btn-primary" 
                    style={{ borderRadius: '0 8px 8px 0', padding: '0 16px' }}
                  >
                    {dict.newsletterBtn}
                  </button>
                </form>
                <div style={{ marginTop: '24px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '4px' }}>+998 71 200-00-00</div>
                  <div style={{ fontSize: '13px', color: 'var(--t3)' }}>info@skill-bridge.uz</div>
                </div>
              </div>

            </div>

            <div className="footer-bottom">
              <span>{dict.footerCopy1}</span>
              <span>{dict.footerCopy2}</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
