import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dhruv Haldar's Portfolio (With Projects & Publications)",
    short_name: "Dhruv's Portfolio",
    description: "Explore Dhruv Haldar's portfolio, blending aerospace engineering with cutting-edge Computational Fluid Dynamics (CFD) expertise. 🚀 #Aerospace #CFD #Rocketry",
    start_url: '/',
    "dir": "rtl",
    "id": '/',
    display: 'standalone',
    "display_override": ["fullscreen", "minimal-ui"],
    background_color: '#fff',
    theme_color: '#60e4fc',
    "icons": [
          {
            "src": "/favicon.ico",
            "sizes": "any",
            "type": "image/x-icon"
          },
    ],
    "screenshots": [
        {
            "src": "images/screenshots/home.webp",
            "sizes": "2835x1377",
            "type": "image/webp",
            "form_factor": "wide",
            "label": "Home screen showing main navigation and featured content"
        },
    ],
  }
}