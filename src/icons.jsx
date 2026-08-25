// Self-contained icon set. No external icon library, no network fetch —
// every icon is inline SVG so the workbench renders identically air-gapped.
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconHome(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  )
}

export function IconLayers(props) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 8 4.2-8 4.2-8-4.2z" />
      <path d="m4 12.2 8 4.2 8-4.2" />
      <path d="m4 16.4 8 4.2 8-4.2" />
    </svg>
  )
}

export function IconActivity(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 13h3.5l2-6 4 12 2-9 1.5 3H21" />
    </svg>
  )
}

export function IconBell(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function IconHelp(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.4a2.4 2.4 0 1 1 3.5 2.1c-.8.5-1.1 1-1.1 1.9" />
      <circle cx="12" cy="16.6" r=".25" fill="currentColor" />
    </svg>
  )
}

export function IconChevronDown(props) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function IconArrowRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

export function IconUpload(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 15V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  )
}

export function IconX(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function IconScan(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M20 8V6a2 2 0 0 0-2-2h-2" />
      <path d="M4 16v2a2 2 0 0 0 2 2h2" />
      <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
      <path d="M4 12h16" />
    </svg>
  )
}

export function IconTerminal(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="m7.5 9.5 3 2.7-3 2.7" />
      <path d="M12.5 15h4" />
    </svg>
  )
}

export function IconShield(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 19 6.3v5.2c0 4.7-3 7.8-7 9-4-1.2-7-4.3-7-9V6.3z" />
      <path d="m9 12 2 2 4-4.3" />
    </svg>
  )
}

export function IconFileText(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 13h6M9 16h6" />
    </svg>
  )
}

export function IconImage(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m5 17 4.5-4.8L13 15l2.5-3 3.5 5" />
    </svg>
  )
}

export function IconDot(props) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" {...props}>
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  )
}

// Signature element: a verification seal, styled after an inspection stamp.
// Appears next to every result that is real and ran locally — the visual
// promise that backs the sovereignty claim, distinct from generic checkmarks.
export function IconSeal(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        d="M12 2.2 15 4l3.5.3.7 3.4 2.3 2.6-2.3 2.6-.7 3.4L15 17l-3 1.8L9 17l-3.5-.3-.7-3.4-2.3-2.6 2.3-2.6.7-3.4L9 4Z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="m8.7 12.3 2.2 2.2 4.4-4.8" />
    </svg>
  )
}
