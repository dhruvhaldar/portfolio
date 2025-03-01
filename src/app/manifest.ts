import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dhruv Haldar's Portfolio (With Projects & Publications)",
    short_name: "Dhruv's Portfolio",
    description: "Explore Dhruv Haldar's portfolio, blending aerospace engineering with cutting-edge Computational Fluid Dynamics (CFD) expertise. 🚀 #Aerospace #CFD #Rocketry",
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#60e4fc',
    icons: [
        {
            "src": "/android-chrome-192x192.jpg",
            "sizes": "192x192",
            "type": "image/jpeg"
          },
          {
            "src": "/android-chrome-512x512.jpg",
            "sizes": "512x512",
            "type": "image/jpeg"
          },
          {
            "src": "/favicon.ico",
            "sizes": "any",
            "type": "image/x-icon"
          },
          {
            "src": "/favicon-32x32.png",
            "sizes": "32x32",
            "type": "image/png"
          },

    ],
  }
}