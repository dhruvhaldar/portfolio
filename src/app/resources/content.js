import { InlineCode, LetterFx } from "@/once-ui/components";

const person = {firstName: "Dhruv",lastName: "Haldar",get name() {return `${this.firstName} ${this.lastName}`;},role: "Aerospace Engineer",avatar: "/images/1700894012265.jpeg",location: "Asia/Kolkata", languages: ["English", "Swedish", "German", "Hindi", "Bengali"],};

const newsletter={display:false,title: <>Subscribge to{person.firstName}'s Newsletter</>,description:(<>I.</>),}; 

// Import new icons in /once-ui/icons.ts
const social=[{name:"GitHub",icon:"github",link:"https://github.com/dhruvhaldar"},{name:"LinkedIn",icon:"linkedin",link:"https://www.linkedin.com/in/dhruvhaldar/"},{name:"Email",icon:"email",link:"mailto:bubqbgvl1@mozmail.com"},{name:"Youtube",icon:"youtube",link:"https://www.youtube.com/c/DhruvHaldar"},{name:"Instagram",icon:"instagram",link:"https://www.instagram.com/dhruvism"}];

const home = {label: "Home",
  title: `${person.name}'s Portfolio (With Projects & Publications)`,
  description: `Explore Dhruv Haldar's portfolio, blending aerospace engineering with cutting-edge Computational Fluid Dynamics (CFD) expertise. 🚀 #Aerospace #CFD #Rocketry`,
  headline: <>
    <span style={{fontFamily: 'var(--font-family-code)'}}>
    <LetterFx speed="medium" trigger="instant" charset={['A','@','$','e','R','?','o','~','5','y','#','!','*','0','1','+','K','j','2','$','m','N','8','w','p','X','5','&','h','L','9','a','=']}>
    Bridging computational models and real-world aerospace solutions
    </LetterFx></span>
    </>,

  subline: (
    <>
      👋 Hi! I'm Dhruv Haldar, an Aerospace/CFD engineer at <InlineCode>SANKHYASUTRA LABS</InlineCode> where I specialize in simulations and application testing. I have a proven track record of successfully tackling challenging engineering issues in the fields of aerospace, chemical, automotive, and propulsion systems. 
    </>
  ),
};

// About Page
const about = {label: "About",title: "About me",description: `Meet ${person.name}, ${person.role} from ${person.location}`,
tableOfContent: {display: true,subItems: true,},
  avatar: {display: true,},calendar: {display: true,link: "https://cal.com/dhruvhaldar",},intro: {display: true,title: "Introduction",
    description: (
      <>
        👋 Hi! I’m an Aerospace Engineer and CFD Specialist with a relentless drive to innovate at the intersection of fluid dynamics, computational modeling, and cutting-edge technology. Over the years, I’ve honed my expertise in solving complex engineering challenges across aerospace, automotive, and propulsion systems, blending analytical rigor with creative problem-solving.
      </>
    ),
  },
  
  work: {
    display: true,title: "Work Experience",
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
  studies: {display: true,title: "Education",institutions: [{name: 'KTH Royal Institute of Technology',description: <>Studied Master of Science (M.Sc.) in Aerospace Engineering (Systems Track).</>,},{name: 'SRM Institute of Science and Technology',description: <>Studied Bachelor of Technology (B.Tech.) in Mechanical Engineering.</>,},],},
  technical: {display: true,title: "Technical skills",
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

// Blog Page hidden
const blog={label:"Blog",title:"Writing about design and tech...",description:`Read what ${person.name } has been up to recently`,};

// Work page
const work = {label: "Work",title: "My projects",description: `Engineering projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts. All projects will be listed on the /home and /work routes
};

// Gallery Page
const gallery={label:"Gallery",title:"My photo gallery",description:`A photo collection by ${person.name }`,images:[{src:"/images/gallery/img-01.jpg",alt:"image",orientation:"vertical"},{src:"/images/gallery/img-02.jpg",alt:"image",orientation:"horizontal"}]};

export { person, social, newsletter, home, about, blog, work, gallery };
