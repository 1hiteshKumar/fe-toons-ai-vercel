// Icon components for each tab
const ScenesIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

const CharactersIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ShotImagesIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const ShotVideosIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const PublishIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const UploadStoryIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

const Pencil = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.2168 3.82331L20.1762 7.78279C20.6644 8.27096 20.6644 9.06244 20.1763 9.55061L10.2378 19.4895C10.0794 19.6478 9.88147 19.7607 9.66457 19.8164L4.33852 21.1831C3.41788 21.4194 2.58086 20.5823 2.81709 19.6616L4.18368 14.3354C4.23934 14.1185 4.35223 13.9206 4.51057 13.7622L14.4491 3.82333C14.9372 3.33517 15.7286 3.33516 16.2168 3.82331ZM15.3329 5.06079L5.61958 14.7745L4.37502 19.6251L9.2255 18.3804L18.9388 8.66671L15.3329 5.06079Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.6878 8.313C15.883 8.50826 15.8831 8.82485 15.6878 9.02011L9.68803 15.0201C9.49277 15.2154 9.17619 15.2154 8.98093 15.0201C8.78566 14.8249 8.78565 14.5083 8.98091 14.313L14.9807 8.31302C15.1759 8.11775 15.4925 8.11775 15.6878 8.313Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.98044 16.3136C7.1757 16.1184 7.49229 16.1184 7.68754 16.3136L9.68747 18.3136C9.88272 18.5089 9.88272 18.8255 9.68745 19.0207C9.49219 19.216 9.1756 19.216 8.98035 19.0207L6.98042 17.0207C6.78517 16.8255 6.78517 16.5089 6.98044 16.3136Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.4707 1.46966C17.7636 1.17677 18.2384 1.17678 18.5313 1.46968L22.5312 5.46968C22.824 5.76258 22.824 6.23745 22.5311 6.53034C22.2382 6.82323 21.7634 6.82322 21.4705 6.53032L17.4706 2.53032C17.1777 2.23742 17.1778 1.76255 17.4707 1.46966Z"
      fill="white"
    />
  </svg>
);

const Trash = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.25 5.57147C1.25 5.15726 1.58579 4.82147 2 4.82147H21.9998C22.414 4.82147 22.7498 5.15726 22.7498 5.57147C22.7498 5.98569 22.414 6.32147 21.9998 6.32147H2C1.58579 6.32147 1.25 5.98569 1.25 5.57147Z"
      fill="#FF7373"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.60693 6.32147V16.8998C5.60693 19.3023 7.5545 21.2498 9.95693 21.2498H14.0425C16.4449 21.2498 18.3925 19.3023 18.3925 16.8998V6.32147H5.60693ZM4.10693 5.67147C4.10693 5.20203 4.48749 4.82147 4.95693 4.82147H19.0425C19.5119 4.82147 19.8925 5.20204 19.8925 5.67147V16.8998C19.8925 20.1307 17.2733 22.7498 14.0425 22.7498H9.95693C6.72607 22.7498 4.10693 20.1307 4.10693 16.8998V5.67147Z"
      fill="#FF7373"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.14258 9.82141C9.55679 9.82141 9.89258 10.1572 9.89258 10.5714V16.2856C9.89258 16.6998 9.55679 17.0356 9.14258 17.0356C8.72836 17.0356 8.39258 16.6998 8.39258 16.2856V10.5714C8.39258 10.1572 8.72836 9.82141 9.14258 9.82141Z"
      fill="#FF7373"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.8569 9.82141C15.2711 9.82141 15.6069 10.1572 15.6069 10.5714V16.2856C15.6069 16.6998 15.2711 17.0356 14.8569 17.0356C14.4427 17.0356 14.1069 16.6998 14.1069 16.2856V10.5714C14.1069 10.1572 14.4427 9.82141 14.8569 9.82141Z"
      fill="#FF7373"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.71436 2.75009C9.024 2.75009 8.46436 3.30973 8.46436 4.00009V5.57148C8.46436 5.98569 8.12857 6.32148 7.71436 6.32148C7.30014 6.32148 6.96436 5.98569 6.96436 5.57148V4.00009C6.96436 2.48131 8.19557 1.25009 9.71436 1.25009H14.2857C15.8045 1.25009 17.0357 2.48131 17.0357 4.00009V5.57148C17.0357 5.98569 16.6999 6.32148 16.2857 6.32148C15.8715 6.32148 15.5357 5.98569 15.5357 5.57148V4.00009C15.5357 3.30974 14.976 2.75009 14.2857 2.75009H9.71436Z"
      fill="#FF7373"
    />
  </svg>
);

export {
  ShotImagesIcon,
  ShotVideosIcon,
  CharactersIcon,
  ScenesIcon,
  PublishIcon,
  UploadStoryIcon,
  Pencil,
  Trash,
};
