import { InlineCode, RevealFx, Row, Line } from "@/once-ui/components";
import { Text } from "@/once-ui/components/Text";

const person = {
  firstName: "Dhruv",
  lastName: "Haldar",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "CFD Specialist",
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
  label: "",
  title: `${person.name} Portfolio (With Projects and Publications)`,
  description: `Explore Dhruv Haldar&apos;s portfolio, blending aerospace engineering with cutting-edge Computational Fluid Dynamics (CFD) expertise. 🚀 #Aerospace #CFD #Rocketry`,
  headline: (
    <RevealFx translateY="4" fillWidth horizontal="start">
      <span style={{ fontFamily: 'var(--font-family-code)' }}>
        Designing smarter systems through simulation and control
      </span>
    </RevealFx>
  ),
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">More Electric Aircraft : IPS</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/publications/implementation-of-wing-ice-protection-in-mea",
  },
  subline: (
    <>
      👋 Hi! I&apos;m Dhruv Haldar, a CFD specialist at{" "}
      <InlineCode>
      <a href="https://www.tridiagonal.com/" style={{ color: 'inherit', textDecoration: 'none' }}>Tridiagonal Inc.</a>
    </InlineCode> where I specialize in simulations and application testing. I have a proven track record of successfully tackling challenging engineering issues in the fields of aerospace 🛩️, chemical 🧪, automotive 🏎️, and propulsion 🚀 systems. After hours, I build and publish my own projects on <a href="https://github.com/dhruvhaldar" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>GitHub</a>.
    </>
  ),
};

// About Page
const about = {
  label: "About",
  title: "About me",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  path: "/about",
  tableOfContent: { display: true, subItems: true },
  avatar: { display: true },
  calendar: { display: true, link: "https://cal.com/dhruvhaldar" },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        As an Aerospace Engineer and CFD Specialist, I’m driven to innovate where physics meets computation. My expertise spans fluid dynamics, modeling, and simulation, enabling me to design and optimize systems across aerospace, automotive, and propulsion domains through analytical insight and inventive problem-solving.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Tridiagonal Inc.",
        timeframe: "Jul 2025 - Present",
        role: "Senior Software Engineer (CFD)",
        achievements: [
          <>
            Developing a new post-processing product for OpenFOAM and MixIT to enhance data analysis and visualization capabilities such as Surface/Volume Transform, Surface/Volume Clipper, Surface/Volume Threshold, Iso-contour and Streamlines.
          </>
        ],
        images: [],
      },
      {
        company: "Sankhyasutra Labs Ltd.",
        timeframe: "Dec 2022 - Jun 2025",
        role: "Software Development Engineer - II (Aerospace & Automotive CFD)",
        achievements: [
          <> Development & Release testing of post processing tools for in-house CFD Solver (SankhyaSutra Taral).
          </>,
          <> Worked with test cases (Drivaer model, Eppler airfoil, Ahmed Body) using High Performance Computing (HPC).
          </>,
          <> Parallel programming using Message Passing Interface (MPI).  
          </>,
          <> Preparing User Documentation using Sphinx.
          </>,
          <> Developing Python libraries for post processing using VTK.
          </>,
          <> Writing business proposals.
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
        timeframe: "Oct 2019 - Apr 2020",
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
        timeframe: "Jun 2019 - Aug 2019",
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
        description: <>Pyvista, Scipy, Scikit Learn, NumPy, Matplotlib, VTK, MPI4Py</>,
        images: [],
      },
      {
        title: "MATLAB",
        description: <>fmincon, fminunc, linprog, quadprog, ode45</>,
        images: [],
      },
      {
        title: "ANSYS",
        description: <>CFX, Fensap-ICE, Fluent, Mechanical</>,
        images: [],
      },
      {
        title: "OpenFOAM",
        description: <>pisoFoam, simpleFoam, snappyHexMesh</>,
        images: [],
      },
      {
        title: "Paraview",
        description: <>Clipper, Contour, Streamlines, Threshold, Transform</>,
        images: [],
      },
      {
        title: "GAMS",
        description: <>Cplex(LP, MIP), Gurobi(LP, MIP, MIQCP)</>,
        images: [],
      },
      {
        title: "Docker",
        description: <>Portainer, Docker Compose</>,
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
        description: <>ggplot2, dplyr, tidyr, tibble, </>,
        images: [],
      },
      {
        title: "AngularJS",
        description: <></>,
        images: [],
      },
      {
        title: "React",
        description: <>Next.js, Vite, Tailwind CSS, Once UI</>,
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
  path: "/publications",
};

// Work page
const work = {
  label: "Work",
  title: "Projects",
  description: `Engineering projects by ${person.name}`,
  path: "/work",
};

// Gallery Page
const gallery = {
  label: "Gallery",
  title: "Gallery",
  description: `A photo collection by ${person.name }`,
  path: "/gallery",
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

// Blog Page
const blog = {
  label: "Blog",
  title: "Blog",
  description: `Read technical blog posts by ${person.name}`,
  path: "/blog",
};

export { person, social, home, about, work, gallery, publications, blog };
