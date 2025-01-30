import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Dhruv",
  lastName: "Haldar",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Aerospace Engineer",
  avatar: "/images/1700894012265.jpeg",
  location: "Asia/Kolkata", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Swedish", "German", "Hindi", "Bengali"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about design, technology, and share thoughts on the intersection of
      creativity and engineering.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/dhruvhaldar",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/dhruvhaldar/",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:haldardhruv@gmail.com",
  },
];

const home = {
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Bridging computational models and real-world aerospace solutions</>,
  subline: (
    <>
      👋 Hi! I'm Dhruv, an Aerospace/CFD engineer at <InlineCode>SANKHYASUTRA LABS</InlineCode> where I specialize in simulations and application testing. When I'm not busy, I mess around with creative projects.
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: true,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/dhruvhaldar",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        👋 Hi! I’m a passionate Aerospace Engineer and CFD Specialist with a relentless drive to innovate at the intersection of fluid dynamics, computational modeling, and cutting-edge technology. Over the years, I’ve honed my expertise in solving complex engineering challenges across aerospace, automotive, and propulsion systems, blending analytical rigor with creative problem-solving.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Sankhyasutra Labs Limited",
        timeframe: "December 2022 - Present",
        role: "Senior CFD Engineer (Aerospace & Automotive)",
        achievements: [
          <>
            Collaborate with a multidisciplinary team of developers to design and validate in-house CFD solver using established benchmarks, including TU Munich drivAer car model, Ahmed body, Eppler/NACA airfoils, Pipe Flows, and Cyclone separator.
          </>,
          <>
            Develop advanced post-processing modules in Python leveraging Pyvista and Visualization Toolkit (VTK) libraries for efficient data visualization and analysis.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Once UI Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "SAAB AB",
        timeframe: "May 2020 - Dec 2021",
        role: "Examensarbete (Master Thesis)",
        achievements: [
          <>
            Conducted the SAAB-KTH University Joint Master Thesis project titled Implementation of wing ice protection system in more electric aircraft technologies.
          </>,
          <>
            Investigated innovative concepts for the More Electric Aircraft (MEA) to enhance performance and minimize weight by replacing traditional hydraulic, pneumatic, and mechanical systems with electrical systems.
          </>,
          <>
            Implemented the Ice Protection System (IPS) of an Airbus A320 aircraft using CFD simulations (ANSYS FENSAP-ICE) and automated workflow processes with IronPython.
          </>,
        ],
        images: [],
      },
      {
        company: "Flemingsberg Science",
        timeframe: "October 2019 - April 2020",
        role: "Technical Consultant",
        achievements: [
          <>
             Led a team of 5 in developing the award-winning start-up idea, "Cyclodash: A Social Game for Bike Commuting".
          </>,
          <>
            Leveraged Augmented Reality (AR) to improve public perception of biking, achieving a 10% increase in positive sentiment.
          </>,
          <>
            Resolved technical, financial, and operational challenges through close collaboration with stakeholders, utilizing an Agile Kanban approach.
          </>,
        ],
        images: [],
      },
      {
        company: "Institut für Luft- und Raumfahrttechnik der Technische Universität Dresden",
        timeframe: "June 2019 - August 2019",
        role: "Summer Intern in Rocket Propulsion",
        achievements: [
          <>
            Worked with German Aerospace Center (DLR) to execute 9 static fire tests for the Liquid-Propellant Rocket Engine (LPRE)-based SMART Rocket.
          </>,
          <>
            Conducted ground testing to optimize engine thermal performance and calibrated test stand and scaffolding systems.
          </>,
          <>
           Mentored bachelors students in preparing and performing rocket engine tests, fostering their technical expertise and practical skills.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: 'KTH Royal Institute of Technology',
        description: <>Studied Master of Science (M.Sc.) in Aerospace Engineering (Systems Track).</>,
      },
      {
        name: 'SRM Institute of Science and Technology',
        description: <>Studied Bachelor of Technology (B.Tech.) in Mechanical Engineering.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Python",
        description: <>Able to prototype in Figma with Once UI with unnatural speed.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "MATLAB",
        description: <>Building next gen apps with Next.js + Once UI + Supabase.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog = {
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Work",
  title: "My projects",
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  description: `A photo collection by ${person.name}`,
  // Images from https://pexels.com
  images: [
    {
      src: "/images/gallery/img-01.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-03.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-04.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-05.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-06.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-07.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-08.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-09.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-10.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-11.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-12.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-13.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-14.jpg",
      alt: "image",
      orientation: "horizontal",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
