// Base URL for the application
const baseURL = "dhruvhaldar.vercel.app";

// Route configuration
const routes = {
  "/": true,
  "/about": true,
  "/work": true,
  "/publications": true,
  "/gallery": false,
  "/blog": true
};

// Protected routes configuration
const protectedRoutes = {
  "/work/mars-mission": false
};

// Theme and style configuration
const style = {
  theme: "light", // dark | light
  neutral: "slate", // sand | gray | slate
  brand: "emerald", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: "violet", // Not used
  solid: "color", // color | contrast
  solidStyle: "plastic", // flat | plastic
  border: "rounded", // rounded | playful | conservative
  surface: "translucent", // filled | translucent
  transition: "all" // all | micro | macro
};

// Visual effects configuration
const effects = {
  mask: {
    cursor: true,
    x: 0,
    y: 0,
    radius: 75
  },
  gradient: {
    display: true,
    x: 50,
    y: 0,
    width: 150,
    height: 200,
    tilt: 0,
    colorStart: "brand-background-strong",
    colorEnd: "static-transparent",
    opacity: 70
  },
  dots: {
    display: false,
    size: 64,
    color: "neutral-on-background-weak",
    opacity: 60
  },
  lines: {
    display: false,
    color: "neutral-alpha-weak",
    opacity: 60
  },
  grid: {
    display: false,
    color: "neutral-alpha-medium",
    opacity: 50
  }
};

// Display Time configuration
const display = {
  location: false,
  time: false
};

export {
  routes,
  protectedRoutes,
  effects,
  style,
  display,
  baseURL
};
