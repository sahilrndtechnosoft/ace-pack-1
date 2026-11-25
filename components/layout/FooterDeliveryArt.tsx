import './footer-art.css';

/**
 * Decorative line-art band for the top of the footer: the plant, a delivery scooter riding
 * across, a plane overhead and parcels at the store. SVG user units are px, so the CSS
 * keyframes in footer-art.css move things in viewBox coordinates (0–1200 wide, ground at y=150).
 */
export function FooterDeliveryArt() {
  return (
    <div className="fda" aria-hidden="true">
      <svg viewBox="0 0 1200 170" preserveAspectRatio="xMidYMax slice" className="fda-svg">
        <g className="fda-stroke">
          {/* Ground and road markings run past the drawing to the screen edges (footer clips them). */}
          <path d="M-1200 150 H2400" />
          <path className="fda-road" d="M-1200 161 H2400" />

          {/* Plant with saw-tooth roof and chimney */}
          <g className="fda-muted">
            <path d="M60 150 V96 L100 116 V96 L140 116 V96 L180 116 V150" />
            <path d="M186 150 V62 H200 V150" />
            <path d="M74 150 V132 H92 V150 M108 128 H126 V140 H108 Z M146 128 H164 V140 H146 Z" />
          </g>
          <circle className="fda-smoke fda-smoke-1" cx="193" cy="52" r="5" />
          <circle className="fda-smoke fda-smoke-2" cx="200" cy="40" r="7" />
          <circle className="fda-smoke fda-smoke-3" cx="210" cy="26" r="9" />

          {/* Store and parcels waiting for pickup */}
          <g className="fda-muted">
            <path d="M1010 150 V102 L1075 72 L1140 102 V150" />
            <path d="M1058 150 V118 H1092 V150 M1022 110 H1128" />
          </g>
          <g className="fda-parcels">
            <path d="M930 150 V122 H960 V150 M930 136 H960 M945 122 V130" />
            <path d="M962 150 V128 H988 V150 M975 128 V135" />
            <path d="M940 122 V100 H964 V122 M952 100 V107" />
          </g>

          {/* Plane crossing with a dashed trail */}
          <g className="fda-plane">
            <path className="fda-trail" d="M-90 10 H-6" />
            <path d="M0 10 C0 4 6 1 14 1 H58 C66 1 74 6 74 10 C74 14 66 17 58 17 H14 C6 17 0 15 0 10 Z" />
            <path d="M30 8 L42 -12 H51 L46 8 M30 12 L42 32 H51 L46 12 M4 6 L0 -8 H8 L17 3" />
            <path d="M54 7 H66" />
          </g>

          {/* Delivery rider; wheels sit on the ground line */}
          <g className="fda-scooter">
            <g className="fda-bounce">
              <path className="fda-speed" d="M-22 -30 H-8 M-30 -20 H-10 M-18 -40 H-6" />
              <path d="M4 -18 C4 -34 20 -38 34 -34 L40 -26 H52 L60 -58 M54 -60 H67 M60 -58 L70 -12 M14 -38 H36" />
              <path d="M4 -64 H26 V-40 H4 Z M4 -52 H26" />
              <circle cx="44" cy="-82" r="8" />
              <path d="M40 -73 L32 -42 L46 -38 L50 -27 M39 -68 L57 -60" />
            </g>
            <g className="fda-wheel">
              <circle cx="15" cy="-12" r="12" />
              <path d="M15 -22 V-2 M5 -12 H25" />
            </g>
            <g className="fda-wheel">
              <circle cx="70" cy="-12" r="12" />
              <path d="M70 -22 V-2 M60 -12 H80" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
