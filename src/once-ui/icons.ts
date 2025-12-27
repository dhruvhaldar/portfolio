import { IconType } from "react-icons";
import {
  HiChevronUp,
  HiChevronDown,
  HiChevronRight,
  HiChevronLeft,
  HiArrowUpRight,
  HiOutlineArrowPath,
  HiCheck,
  HiMiniQuestionMarkCircle,
  HiMiniXMark,
  HiOutlineLink,
  HiExclamationTriangle,
  HiInformationCircle,
  HiExclamationCircle,
  HiCheckCircle,
  HiMiniGlobeAsiaAustralia,
  HiArrowTopRightOnSquare,
  HiEnvelope,
  HiCalendarDays,
  HiClipboard,
  HiArrowRight,
  HiOutlineShare,
} from "react-icons/hi2";
import {
  PiHouseDuotone,
  PiUserCircleDuotone,
  PiGridFourDuotone,
  PiBookBookmarkDuotone,
  PiImageDuotone,
} from "react-icons/pi";
import { MdOutlineArticle } from "react-icons/md";
import {
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaXTwitter,
  FaQuoteRight,
  FaPython,
  FaDocker,
  FaReact,
  FaAngular,
  FaRProject,
} from "react-icons/fa6";

import {
  SiAnsys,
  SiSiemens,
} from "react-icons/si";

import {
  FaChartPie,
  FaCalculator,
  FaWind,
  FaRocket,
  FaCube,
  FaCode
} from "react-icons/fa6";

export const iconLibrary: Record<string, IconType> = {
  // Navigation icons
  chevronUp: HiChevronUp,
  chevronDown: HiChevronDown,
  chevronRight: HiChevronRight,
  chevronLeft: HiChevronLeft,
  arrowRight: HiArrowRight,
  arrowUpRight: HiArrowUpRight,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,

  // Action icons
  refresh: HiOutlineArrowPath,
  check: HiCheck,
  close: HiMiniXMark,
  openLink: HiOutlineLink,
  clipboard: HiClipboard,
  share: HiOutlineShare,

  // Status icons
  helpCircle: HiMiniQuestionMarkCircle,
  infoCircle: HiInformationCircle,
  warningTriangle: HiExclamationTriangle,
  errorCircle: HiExclamationCircle,
  checkCircle: HiCheckCircle,

  // Feature icons
  article: MdOutlineArticle,
  email: HiEnvelope,
  globe: HiMiniGlobeAsiaAustralia,
  calendar: HiCalendarDays,

  // Navigation icons
  home: PiHouseDuotone,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  book: PiBookBookmarkDuotone,
  gallery: PiImageDuotone,

  // Social media icons
  youtube: FaYoutube,
  instagram: FaInstagram,
  discord: FaDiscord,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  quote: FaQuoteRight,

  // Tech Stack & Skills
  python: FaPython,
  docker: FaDocker,
  react: FaReact,
  angular: FaAngular,
  r: FaRProject,
  matlab: FaCode,
  ansys: SiAnsys,
  openfoam: FaWind,
  paraview: FaChartPie,
  gams: FaCalculator,
  nastran: FaRocket,
  siemens: SiSiemens,
  solidworks: FaCube,
};