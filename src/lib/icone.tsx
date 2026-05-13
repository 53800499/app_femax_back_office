export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Image du logo (le F est déjà dans l'image) */}
      <img
        src="/images/logo/logo.png"
        alt="Femax Logo"
        className="h-12 w-12 rounded-xl object-cover"
      />

      {/* Texte EMAX */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="160"
        height="40"
        viewBox="0 0 160 40"
        fill="none">
        <g fill="#D01F1F">
          {/* E */}
          <path d="M0 8H22V13H6V18H20V23H6V29H22V34H0V8Z" />

          {/* M */}
          <path d="M30 34V8H36L45 21L54 8H60V34H54V18L45 30L36 18V34H30Z" />

          {/* A */}
          <path d="M66 34L76 8H82L92 34H86L84 28H74L72 34H66ZM75 23H83L79 15L75 23Z" />

          {/* X */}
          <path d="M98 8H105L111 17L117 8H124L115 21L124 34H117L111 25L105 34H98L107 21L98 8Z" />
        </g>
      </svg>
    </div>
  );
};

export const LogoWhite = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Image du logo (le F est déjà dans l'image) */}
      <img
        src="/images/logo/logo.png"
        alt="Femax Logo"
        className="h-12 w-12 rounded-xl object-cover"
      />

      {/* Texte EMAX */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="160"
        height="40"
        viewBox="0 0 160 40"
        fill="none">
        <g fill="#FFFFFF">
          {/* E */}
          <path d="M0 8H22V13H6V18H20V23H6V29H22V34H0V8Z" />

          {/* M */}
          <path d="M30 34V8H36L45 21L54 8H60V34H54V18L45 30L36 18V34H30Z" />

          {/* A */}
          <path d="M66 34L76 8H82L92 34H86L84 28H74L72 34H66ZM75 23H83L79 15L75 23Z" />

          {/* X */}
          <path d="M98 8H105L111 17L117 8H124L115 21L124 34H117L111 25L105 34H98L107 21L98 8Z" />
        </g>
      </svg>
    </div>
  );
};