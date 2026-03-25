"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .offline-page * { margin: 0; padding: 0; box-sizing: border-box; }
            .offline-page {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #fafafa;
              color: #171717;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 24px;
            }
            @media (prefers-color-scheme: dark) {
              .offline-page { background: #0a0a0a; color: #ededed; }
              .offline-card { background: #171717 !important; border-color: #262626 !important; }
              .offline-btn-primary { background: #ededed !important; color: #171717 !important; }
              .offline-btn-primary:hover { background: #d4d4d4 !important; }
              .offline-btn-secondary { border-color: #404040 !important; color: #a3a3a3 !important; }
              .offline-btn-secondary:hover { background: #262626 !important; }
              .offline-muted { color: #a3a3a3 !important; }
              .offline-icon-bg { background: #262626 !important; }
              .offline-divider { border-color: #262626 !important; }
            }
            .offline-container {
              width: 100%;
              max-width: 400px;
              text-align: center;
            }
            .offline-card {
              background: #fff;
              border: 1px solid #e5e5e5;
              border-radius: 16px;
              padding: 32px 24px;
            }
            .offline-icon-wrapper {
              position: relative;
              width: 80px;
              height: 80px;
              margin: 0 auto 24px;
            }
            .offline-icon-bg {
              position: absolute;
              inset: 0;
              background: #f5f5f5;
              border-radius: 50%;
            }
            
            .offline-icon-svg {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 40px;
              height: 40px;
            }
            .offline-title {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 12px;
              letter-spacing: -0.5px;
            }
            .offline-description {
              font-size: 14px;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .offline-muted { color: #737373; }
            .offline-status {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-size: 13px;
              margin-bottom: 24px;
            }
            .offline-status-dot {
              position: relative;
              width: 8px;
              height: 8px;
            }
            .offline-status-dot::before {
              content: '';
              position: absolute;
              inset: 0;
              background: #ef4444;
              border-radius: 50%;
              animation: offline-ping 1.5s ease-out infinite;
            }
            .offline-status-dot::after {
              content: '';
              position: absolute;
              inset: 0;
              background: #ef4444;
              border-radius: 50%;
            }
            @keyframes offline-ping {
              0% { transform: scale(1); opacity: 1; }
              75%, 100% { transform: scale(2); opacity: 0; }
            }
            .offline-buttons {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .offline-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px 24px;
              font-size: 14px;
              font-weight: 500;
              border-radius: 9999px;
              cursor: pointer;
              transition: all 0.2s;
              text-decoration: none;
            }
            .offline-btn-primary {
              background: #171717;
              color: #fff;
              border: none;
            }
            .offline-btn-primary:hover { background: #404040; }
            .offline-btn-secondary {
              background: transparent;
              border: 1px solid #e5e5e5;
              color: #525252;
            }
            .offline-btn-secondary:hover { background: #f5f5f5; }
            .offline-divider {
              border: none;
              border-top: 1px dashed #e5e5e5;
              margin: 24px 0 16px;
            }
            .offline-tips-title {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 12px;
            }
            .offline-tips-list {
              list-style: none;
              font-size: 13px;
              text-align: left;
              max-width: 240px;
              margin: 0 auto;
            }
            .offline-tips-list li {
              display: flex;
              align-items: flex-start;
              gap: 8px;
              margin-bottom: 8px;
            }
          `,
        }}
      />
      <div className="offline-page">
        <div className="offline-container">
          <div className="offline-card">
            {/* WiFi off icon */}
            <div className="offline-icon-wrapper">
              <div className="offline-icon-bg" />
              <svg
                className="offline-icon-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 1l22 22" stroke="#ef4444" strokeWidth="2" />
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <circle cx="12" cy="20" r="1" fill="currentColor" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="offline-title">You&apos;re Offline</h1>

            {/* Description */}
            <p className="offline-description offline-muted">
              Looks like you&apos;ve lost your internet connection. Don&apos;t
              worry — previously visited pages may still be available.
            </p>

            {/* Status indicator */}
            <div className="offline-status offline-muted">
              <span className="offline-status-dot" />
              <span>No connection detected</span>
            </div>

            {/* Buttons */}
            <div className="offline-buttons">
              <button
                className="offline-btn offline-btn-primary"
                onClick={() => window.location.reload()}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 16h5v5" />
                </svg>
                Try Again
              </button>
              <Link href="/" className="offline-btn offline-btn-secondary">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Go Home
              </Link>
            </div>

            {/* Tips */}
            <hr className="offline-divider" />
            <p className="offline-tips-title offline-muted">Things to try</p>
            <ul className="offline-tips-list offline-muted">
              <li>
                <span style={{ color: "#a3a3a3" }}>•</span>
                Check your WiFi or mobile data
              </li>
              <li>
                <span style={{ color: "#a3a3a3" }}>•</span>
                Toggle airplane mode off
              </li>
              <li>
                <span style={{ color: "#a3a3a3" }}>•</span>
                Move closer to your router
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
