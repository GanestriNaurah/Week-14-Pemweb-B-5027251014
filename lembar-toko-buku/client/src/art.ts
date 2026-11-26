// Ilustrasi SVG per genre (konstanta di kode, bukan input pengguna)
const S = 'stroke="#1D1B4C" stroke-width="2.5" stroke-linejoin="round"';

const face = (x: number, y: number, s = 1) => `
  <circle cx="${x - 8 * s}" cy="${y}" r="${2.4 * s}" fill="#1D1B4C"/>
  <circle cx="${x + 8 * s}" cy="${y}" r="${2.4 * s}" fill="#1D1B4C"/>
  <path d="M${x - 4 * s} ${y + 6 * s}q${4 * s} ${4 * s} ${8 * s} 0" stroke="#1D1B4C" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="${x - 14 * s}" cy="${y + 5 * s}" r="${3 * s}" fill="#FF8FB5" opacity=".75"/>
  <circle cx="${x + 14 * s}" cy="${y + 5 * s}" r="${3 * s}" fill="#FF8FB5" opacity=".75"/>`;

export const ART: Record<string, string> = {
  Fiksi: `<path d="M24 40L30 14L47 30ZM76 40L70 14L53 30Z" fill="#fff" ${S}/><ellipse cx="50" cy="55" rx="28" ry="24" fill="#fff" ${S}/>${face(50, 54)}`,
  Sains: `<path d="M50 8C66 22 68 50 64 72H36C32 50 34 22 50 8Z" fill="#fff" ${S}/><path d="M36 58L22 76L38 72ZM64 58L78 76L62 72Z" fill="#FF8A4C" ${S}/><path d="M42 72L50 92L58 72Z" fill="#FFD95A" ${S}/>${face(50, 44, 0.75)}`,
  Anak: `<circle cx="27" cy="32" r="11" fill="#fff" ${S}/><circle cx="73" cy="32" r="11" fill="#fff" ${S}/><circle cx="50" cy="55" r="27" fill="#fff" ${S}/>${face(50, 52)}`,
  Motivasi: `<g ${S} stroke-linecap="round"><path d="M50 8v10M50 82v10M8 50h10M82 50h10M20 20l7 7M73 73l7 7M80 20l-7 7M27 73l-7 7"/></g><circle cx="50" cy="50" r="24" fill="#FFD95A" ${S}/>${face(50, 50)}`,
  Sejarah: `<path d="M50 12L90 84H10Z" fill="#fff" ${S}/>${face(50, 64, 0.9)}`,
  Teknologi: `<path d="M50 14V28" ${S} stroke-linecap="round"/><circle cx="50" cy="12" r="5" fill="#FF8A4C" ${S}/><rect x="22" y="28" width="56" height="48" rx="14" fill="#fff" ${S}/>${face(50, 52)}`,
  Romantis: `<path d="M50 84C8 56 16 20 38 26C45 28 50 35 50 35C50 35 55 28 62 26C84 20 92 56 50 84Z" fill="#FFB6D5" ${S}/>${face(50, 50)}`,
  Fantasi: `<circle cx="50" cy="54" r="30" fill="#FFD95A" ${S}/>${face(50, 54)}<path d="M82 12l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#fff" ${S}/>`,
};
