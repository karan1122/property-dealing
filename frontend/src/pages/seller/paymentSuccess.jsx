// pages/payment/PaymentSuccess.jsx
// Shown after Razorpay popup closes and /payments/verify succeeds.
// Counts down 5 seconds then auto-redirects to /seller/dashboard.
// Seller can also click "Go to Dashboard" immediately.

import { useEffect, useState } from "react";
import { useNavigate, Link }   from "react-router-dom";

const REDIRECT_AFTER = 5; // seconds

export default function PaymentSuccess() {
  const navigate  = useNavigate();
  const [count, setCount] = useState(REDIRECT_AFTER);

  // Countdown → auto-redirect
  useEffect(() => {
    if (count <= 0) {
      navigate("/seller/dashboard");
      return;
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .ps-wrap {
          min-height: 100vh;
          background: #F5F3EE;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }

        .ps-card {
          background: #fff;
          border: 1px solid #E5E1D9;
          border-radius: 20px;
          padding: 48px 44px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 4px 24px rgba(28,26,23,.07);
          animation: ps-pop .45s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes ps-pop {
          from { opacity: 0; transform: scale(.94) translateY(16px); }
          to   { opacity: 1; transform: scale(1)  translateY(0);     }
        }

        /* Animated tick circle */
        .ps-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #EFF6E8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          animation: ps-bounce .5s .2s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes ps-bounce {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
        .ps-icon svg {
          animation: ps-draw .4s .55s ease both;
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
        }
        @keyframes ps-draw {
          to { stroke-dashoffset: 0; }
        }

        .ps-title {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 700;
          color: #1C1A17;
          letter-spacing: -.4px;
          margin-bottom: 10px;
        }

        .ps-sub {
          font-size: 14px;
          color: #6B6560;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        /* Info rows */
        .ps-info {
          background: #FAFAF8;
          border: 1px solid #E5E1D9;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
          text-align: left;
        }
        .ps-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          color: #5A554E;
        }
        .ps-row-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ps-row-icon.green { background: #EFF6E8; }
        .ps-row-icon.amber { background: #FFF5E0; }
        .ps-row-icon.blue  { background: #EBF3FF; }
        .ps-row strong { color: #1C1A17; font-weight: 600; }

        /* Progress bar */
        .ps-progress-wrap {
          background: #F0EDE6;
          border-radius: 99px;
          height: 4px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .ps-progress-bar {
          height: 4px;
          background: #C8973A;
          border-radius: 99px;
          transition: width 1s linear;
        }

        .ps-redirect-note {
          font-size: 12.5px;
          color: #9A9488;
          margin-bottom: 20px;
        }
        .ps-redirect-note strong {
          color: #C8973A;
          font-variant-numeric: tabular-nums;
        }

        /* Buttons */
        .ps-btn-primary {
          display: block;
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: #1C1A17;
          color: #F5F3EE;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background .15s, transform .1s;
          text-decoration: none;
          margin-bottom: 10px;
        }
        .ps-btn-primary:hover { background: #2E2B26; }
        .ps-btn-primary:active { transform: scale(.98); }

        .ps-btn-ghost {
          display: block;
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1.5px solid #E0DCD5;
          background: none;
          color: #6B6560;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: border-color .15s, color .15s;
          text-decoration: none;
        }
        .ps-btn-ghost:hover { border-color: #1C1A17; color: #1C1A17; }

        /* Brand */
        .ps-brand {
          margin-bottom: 28px;
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-weight: 700;
          color: #1C1A17;
          letter-spacing: -.3px;
        }
        .ps-brand em { color: #C8973A; font-style: normal; }

        @media (max-width: 500px) {
          .ps-card { padding: 36px 24px; }
          .ps-title { font-size: 22px; }
        }
      `}</style>

      <div className="ps-wrap">
        <div className="ps-card">

          {/* Brand */}
          <div className="ps-brand">Nest<em>Find</em></div>

          {/* Animated tick */}
          <div className="ps-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
              stroke="#3A6B1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="7 18 14 25 29 11" />
            </svg>
          </div>

          <h1 className="ps-title">Payment successful!</h1>
          <p className="ps-sub">
            Your listing fee has been received and your property has been submitted for review.
          </p>

          {/* What happens next */}
          <div className="ps-info">
            <div className="ps-row">
              <div className="ps-row-icon green">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#3A6B1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span>Payment of <strong>₹999</strong> confirmed via Razorpay</span>
            </div>
            <div className="ps-row">
              <div className="ps-row-icon amber">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#C8973A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <span>Property is <strong>pending</strong> — agent will verify it first</span>
            </div>
            <div className="ps-row">
              <div className="ps-row-icon blue">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <span>You'll be <strong>notified by email</strong> once it goes live</span>
            </div>
          </div>

          {/* Countdown progress bar */}
          <div className="ps-progress-wrap">
            <div
              className="ps-progress-bar"
              style={{ width: `${((REDIRECT_AFTER - count) / REDIRECT_AFTER) * 100}%` }}
            />
          </div>

          <p className="ps-redirect-note">
            Redirecting to dashboard in <strong>{count}s</strong>…
          </p>

          {/* Manual CTA */}
          <button className="ps-btn-primary" onClick={() => navigate("/seller/dashboard")}>
            Go to Dashboard
          </button>

          <Link to="/seller/add-property" className="ps-btn-ghost">
            + List another property
          </Link>

        </div>
      </div>
    </>
  );
}