import { InlineCode, LetterFx } from "@/once-ui/components";

const person = {
  firstName: "Dhruv",
  lastName: "Haldar",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Aerospace Engineer",
  avatar: "/images/1700894012265.avif",
  location: "Asia/Kolkata",
  languages: ["English", "Swedish", "German", "Hindi", "Bengali"],
};

const social = [
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
    link: "mailto:bubqbgvl1@mozmail.com",
  },
  {
    name: "Youtube",
    icon: "youtube",
    link: "https://www.youtube.com/c/DhruvHaldar",
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/dhruvism",
  },
];

const home = {
  label: "Home",
  title: `${person.name} Portfolio (With Projects and Publications)`,
  description: `Explore Dhruv Haldar&apos;s portfolio, blending aerospace engineering with cutting-edge Computational Fluid Dynamics (CFD) expertise. 🚀 #Aerospace #CFD #Rocketry`,
  headline: (
    <>
      <span style={{ fontFamily: 'var(--font-family-code)' }}>
        <LetterFx
          speed="medium"
          trigger="instant"
          charset={['A', '@', '$', 'e', 'R', '?', 'o', '~', '5']}
        >
          Bridging Computational Models with Real-World Aerospace Solutions
        </LetterFx>
      </span>
    </>
  ),
  subline: (
    <>
      👋 Hi! I&apos;m Dhruv Haldar, an Aerospace/CFD engineer at{" "}
      <InlineCode>
      <a href="https://www.tridiagonal.com/" style={{ color: 'inherit', textDecoration: 'none' }}>Tridiagonal Software Inc.</a>
    </InlineCode> where I specialize in simulations and application testing. I have a proven track record of successfully tackling challenging engineering issues in the fields of aerospace 🛩️, chemical 🧪, automotive 🏎️, and propulsion 🚀 systems.
    </>
  ),
};

// About Page
const about = {
  label: "About",
  title: "About me",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: { display: true, subItems: true },
  avatar: { display: true },
  calendar: { display: true, link: "https://cal.com/dhruvhaldar" },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        👋 Hi! I&apos;m an Aerospace Engineer and CFD Specialist with a relentless drive to innovate at the intersection of fluid dynamics, computational modeling, and cutting-edge technology. Over the years, I&apos;ve honed my expertise in solving complex engineering challenges across aerospace, automotive, and propulsion systems, blending analytical rigor with creative problem-solving.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Tridiagonal Solutions",
        timeframe: "July 2025 - Present",
        role: "Senior Software Engineer (CFD)",
        achievements: [],
        images: [],
      },
      {
        company: "Sankhyasutra Labs Limited",
        timeframe: "December 2022 - June 2025",
        role: "Senior CFD Engineer (Aerospace & Automotive)",
        achievements: [
          <>
            Collaborate with a multidisciplinary team of developers to design and validate in-house CFD solver using established benchmarks, including TU Munich drivAer car model, Ahmed body, Eppler/NACA airfoils, Pipe Flows, and Cyclone separator.
          </>,
          <>
            Develop advanced post-processing modules in Python leveraging Pyvista and Visualization Toolkit (VTK) libraries for efficient data visualization and analysis.
          </>,
        ],
        images: [],
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
        company: "Technische Universität Dresden",
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
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Python",
        description: <>Pyvista, Scipy, Scikit Learn</>,
        images: [],
      },
      {
        title: "MATLAB",
        description: <></>,
        images: [],
      },
      {
        title: "ANSYS",
        description: <></>,
        images: [],
      },
      {
        title: "OpenFOAM",
        description: <></>,
        images: [],
      },
      {
        title: "Paraview",
        description: <></>,
        images: [],
      },
      {
        title: "GAMS",
        description: <></>,
        images: [],
      },
      {
        title: "Docker",
        description: <></>,
        images: [],
      },
      {
        title: "Nastran",
        description: <></>,
        images: [],
      },
      {
        title: "Siemens NX",
        description: <></>,
        images: [],
      },
      {
        title: "Solidworks",
        description: <></>,
        images: [],
      },
      {
        title: "R",
        description: <></>,
        images: [],
      },
      {
        title: "AngularJS",
        description: <></>,
        images: [],
      },
      {
        title: "React",
        description: <></>,
        images: [],
      },
    ],
  },
};

// Publications Page
const publications = {
  label: "Publications",
  title: "Publications",
  description: `Publications by ${person.name } `,
};

// Work page
const work = {
  label: "Work",
  title: "My projects",
  description: `Engineering projects by ${person.name}`,
};

// Gallery Page
const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  description: `A photo collection by ${person.name }`,
  images: [
    {src: "/images/gallery/49605806838_50152b0fa6_o.avif", alt: "image", orientation: "vertical" },
    {src: "/images/gallery/49605806978_f489af4e9a_o.avif", alt: "image", orientation: "vertical" },
    {src: "/images/gallery/49605807048_1386aaac7d_o.avif", alt: "image", orientation: "horizontal" },
    {src: "/images/gallery/49605807303_2277086af9_o.avif", alt: "image", orientation: "horizontal" },
    {src: "/images/gallery/49605815283_26d53b69ed_o.avif", alt: "image", orientation: "horizontal" },
    {src: "/images/gallery/49605815538_2f03204319_o.avif", alt: "image", orientation: "horizontal" },
    {src: "/images/gallery/49605815838_851a2d0c3b_o.avif", alt: "image", orientation: "horizontal" },
    {src: "/images/gallery/49606315876_45293a5727_o.avif", alt: "image", orientation: "vertical" },
    {src: "/images/gallery/49606315921_1023ed28b1_o.avif", alt: "image", orientation: "horizontal" },
    {src: "/images/gallery/49606323636_447ab2c88e_o.avif", alt: "image", orientation: "horizontal" },
    {src: "/images/gallery/49606324896_a4a5b18f5a_o.avif", alt: "image", orientation: "horizontal" },
    {src: "/images/gallery/49606566657_0cea39b69a_o.avif", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/49606576132_e01f5b5875_o.avif", alt: "image", orientation: "horizontal" },
    {src: "/images/gallery/49606576712_746dec0e82_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/50122281262_e7f9caaaf1_o.avif", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/50123293593_911f2bacf0_o.avif", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/50123396478_dfd7d42b1c_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/img-01.avif", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/img-02.avif", alt: "image", orientation: "horizontal" },
  ],
};

export { person, social, home, about, work, gallery, publications };
