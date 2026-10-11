import { InlineCode, Flex, Row, Line } from "@/once-ui/components";
import { Text } from "@/once-ui/components/Text";

const person = {
  firstName: "Dhruv",
  lastName: "Haldar",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Senior CFD Engineer",
  avatar: "/images/my_profile.png",
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
    <Flex fillWidth horizontal="start">
      <span style={{ fontFamily: 'var(--font-family-code)' }}>
        Architecting robust fluids, thermal, and simulation systems
      </span>
    </Flex>
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
      👋 Hi! I&apos;m Dhruv Haldar, a Senior CFD Engineer at{" "}
      <InlineCode>
        <a href="https://www.tridiagonal.com/" style={{ color: 'inherit', textDecoration: 'none' }}>Tridiagonal Inc.</a>
      </InlineCode> where I specialize in end-to-end industrial fluid dynamics, simulation delivery, and advanced simulation workflow software. With 5+ years of combined industrial CFD and engineering experience across aerospace 🛩️, chemical/process 🧪, automotive 🏎️, and propulsion 🚀 applications, I own complete simulation lifecycles—from physical model selection and mesh sensitivity verification to engineering recommendation delivery. After hours, I build and publish open-source numerical tools on <a href="https://github.com/dhruvhaldar" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>GitHub</a>.
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
        As an Aerospace Engineer and Senior CFD Specialist with over 5 years of professional and research experience, I combine deep fluid mechanics fundamentals with computational rigor. My expertise spans independent ownership of industrial CFD analyses—defining engineering questions and quantities of interest, selecting defensible turbulence and multiphase physics, assessing numerical sensitivity, validating predictions against experimental benchmarks, and delivering actionable engineering recommendations—alongside designing high-performance numerical and workflow software.
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
            Leading technical architecture and development of next-generation post-processing and visualization capabilities for OpenFOAM and MixIT (Surface/Volume Transform, Clipper, Threshold, Iso-contour, and Streamlines) to accelerate industrial simulation analysis workflows.
          </>,
          <>
            Owning CFD simulation quality assurance, establishing standard verification and validation (V&V) procedures for industrial mixing and multiphase flow applications.
          </>,
          <>
            Directing simulation analysis reviews, defining mesh sensitivity standards, and mentoring junior engineers in physical model selection and numerical convergence analysis.
          </>,
          <>
            Collaborating with industrial engineering stakeholders to translate complex simulation results into validated design improvements and defensible engineering deliverables.
          </>,
        ],
        images: [],
      },
      {
        company: "Sankhyasutra Labs Ltd.",
        timeframe: "Dec 2022 - Jun 2025",
        role: "Software Development Engineer - II / Senior CFD Engineer",
        achievements: [
          <>
            Executed end-to-end industrial aerodynamic simulations and rigorous verification & validation (V&V) benchmarks on High Performance Computing (HPC) clusters across PBS and SLURM workload managers using MPI parallelization.
          </>,
          <>
            Led external aerodynamic simulations for the Mercedes DrivAer model (130 km/h, Re = 4.87 × 10⁶) in a virtual wind tunnel with moving ground plane boundaries and rotating wheels using SankhyaSutra's Entropic Lattice Boltzmann Method (LBM) solver (Taral), cross-validating results against ANSYS Discovery / Fluent and OpenFOAM.
          </>,
          <>
            Developed an advanced volume downsampling algorithm that compressed massive transient 3D CFD datasets from 101 GB down to 0.6 GB (a 99.4% file size reduction) while preserving critical boundary-layer and wake vortex features for real-time visualization.
          </>,
          <>
            Collaborated with Intelimek Systems to develop the Taral GUI diagnostics suite, implementing 3D Plot-Over-Line spatial extraction, velocity streamlines, Q-criterion isosurface generation (Q = 100 on Eppler airfoils at Re = 2 × 10⁶), and custom material databases.
          </>,
          <>
            Led release testing, quality assurance, and verification benchmarks for the solver platform, authoring Sphinx technical documentation, client-facing simulation delivery reports, and technical proposals.
          </>,
          <>
            Provided CFD technical leadership and peer-review sign-off on simulation benchmark suites, establishing best practices and mentoring incoming engineers.
          </>,
        ],
        images: [],
      },
      {
        company: "SAAB AB",
        timeframe: "May 2020 - Dec 2021",
        role: "Graduate CFD Research Engineer (Joint Master Thesis)",
        achievements: [
          <>
            Conducted the SAAB AB and KTH Royal Institute of Technology joint industrial research project titled "Implementation of wing ice protection system in more electric aircraft technologies".
          </>,
          <>
            Owned complete 3D in-flight icing simulation workflows for an Airbus A320 wing section in ANSYS FENSAP-ICE (FENSAP airflow, DROP3D droplet impingement, ICE3D thermodynamic accretion, and Fluent conjugate heat transfer).
          </>,
          <>
            Validated numerical predictions against NASA Lewis Icing Research Tunnel (IRT) experimental reference data for NACA 0012 airfoils, demonstrating close agreement in ice horn profiles and accreted ice mass.
          </>,
          <>
            Demonstrated a 13% to 50% power and fuel reduction by transitioning from conventional bleed-air pneumatic systems to electrothermal architectures, publishing findings at the ICAS 2022 international congress.
          </>,
          <>
            Automated geometry generation and meshing workflows using IronPython scripting in ANSYS SpaceClaim to streamline multi-domain simulation turnarounds.
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
        icon: "python",
      },
      {
        title: "MATLAB",
        description: <>fmincon, fminunc, linprog, quadprog, ode45</>,
        images: [],
        icon: "matlab",
      },
      {
        title: "ANSYS",
        description: <>CFX, Fensap-ICE, Fluent, Mechanical</>,
        images: [],
        icon: "ansys",
      },
      {
        title: "OpenFOAM",
        description: <>pisoFoam, simpleFoam, snappyHexMesh</>,
        images: [],
        icon: "openfoam",
      },
      {
        title: "Paraview",
        description: <>Clipper, Contour, Streamlines, Threshold, Transform</>,
        images: [],
        icon: "paraview",
      },
      {
        title: "GAMS",
        description: <>Cplex(LP, MIP), Gurobi(LP, MIP, MIQCP)</>,
        images: [],
        icon: "gams",
      },
      {
        title: "Docker",
        description: <>Portainer, Docker Compose</>,
        images: [],
        icon: "docker",
      },
      {
        title: "Nastran",
        description: <></>,
        images: [],
        icon: "nastran",
      },
      {
        title: "Siemens NX",
        description: <></>,
        images: [],
        icon: "siemens",
      },
      {
        title: "Solidworks",
        description: <></>,
        images: [],
        icon: "solidworks",
      },
      {
        title: "R",
        description: <>ggplot2, dplyr, tidyr, tibble, </>,
        images: [],
        icon: "r",
      },
      {
        title: "AngularJS",
        description: <></>,
        images: [],
        icon: "angular",
      },
      {
        title: "React",
        description: <>Next.js, Vite, Tailwind CSS, Once UI</>,
        images: [],
        icon: "react",
      },
    ],
  },
};

// Publications Page
const publications = {
  label: "Publications",
  title: "Publications",
  description: `Publications by ${person.name} `,
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
  description: `A photo collection by ${person.name}`,
  path: "/gallery",
  images: [
    { src: "/images/gallery/49605806838_50152b0fa6_o.avif", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/49605806978_f489af4e9a_o.avif", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/49605807048_1386aaac7d_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/49605807303_2277086af9_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/49605815283_26d53b69ed_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/49605815538_2f03204319_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/49605815838_851a2d0c3b_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/49606315876_45293a5727_o.avif", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/49606315921_1023ed28b1_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/49606323636_447ab2c88e_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/49606324896_a4a5b18f5a_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/49606566657_0cea39b69a_o.avif", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/49606576132_e01f5b5875_o.avif", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/49606576712_746dec0e82_o.avif", alt: "image", orientation: "horizontal" },
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

// Newsletter
const newsletter = {
  display: true,
  title: "Subscribe to Dhruv's Newsletter",
  description: "I write about programming and engineering",
  // Replace with your ConvertKit Form Action URL (e.g., https://app.convertkit.com/forms/12345/subscriptions)
  action: "https://app.kit.com/forms/8910146/subscriptions",
};

export { person, social, home, about, work, gallery, publications, blog, newsletter };
