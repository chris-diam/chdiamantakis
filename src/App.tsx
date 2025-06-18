import React, { useState, useEffect, useRef, useCallback } from 'react';

// Import all the technology icons
import reactIcon from './assets/portfolio images/react.png';
import typescriptIcon from './assets/portfolio images/ts.png';
import nodejsIcon from './assets/portfolio images/nodejs.png';
import graphqlIcon from './assets/portfolio images/graphql-icon.png';
import dockerIcon from './assets/portfolio images/docker.png';
import mongoIcon from './assets/portfolio images/mongo.png';
import postgresIcon from './assets/portfolio images/postgress.png';
import tailwindIcon from './assets/portfolio images/tailwind.png';
import minioIcon from './assets/portfolio images/minio.png';
import nginxIcon from './assets/portfolio images/nginx.png';
import edcIcon from './assets/portfolio images/edc.png';
import keycloakIcon from './assets/portfolio images/keycloak.png';
import d3Icon from './assets/portfolio images/D3.js.png';
import blockchainIcon from './assets/portfolio images/blockchain.png';

interface MousePosition {
  x: number;
  y: number;
}

interface Technology {
  name: string;
  color: string;
  icon: string;
  iconImage?: string;
  position: { top: string; left: string };
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  color: string;
}

interface ContentData {
  title: string;
  content: string;
  projects: string[];
}

type Section = 'about' | 'technologies' | 'projects';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 50, y: 50 });
  const [currentSection, setCurrentSection] = useState<Section>('about');
  const lastUpdateRef = useRef<number>(0);

  // Add CSS animations as a string constant
  const animationStyles = `
    @keyframes complexFloat {
      0%, 100% { 
        transform: translateX(0px) translateY(0px) rotate(0deg) scale(1); 
        opacity: 0.3;
      }
      25% { 
        transform: translateX(10px) translateY(-15px) rotate(90deg) scale(1.2); 
        opacity: 0.7;
      }
      50% { 
        transform: translateX(-5px) translateY(-25px) rotate(180deg) scale(0.9); 
        opacity: 0.5;
      }
      75% { 
        transform: translateX(-15px) translateY(-10px) rotate(270deg) scale(1.1); 
        opacity: 0.8;
      }
    }
    
    @keyframes spaceFloat {
      0%, 100% { 
        transform: translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1); 
        opacity: 0.4;
      }
      33% { 
        transform: translateX(20px) translateY(-30px) translateZ(10px) rotateX(120deg) rotateY(180deg) scale(1.3); 
        opacity: 0.8;
      }
      66% { 
        transform: translateX(-15px) translateY(-20px) translateZ(-5px) rotateX(240deg) rotateY(300deg) scale(0.7); 
        opacity: 0.6;
      }
    }
    
    @keyframes bubbleFloat {
      0%, 100% { 
        transform: translate(-50%, -50%) translateY(0px) scale(1); 
      }
      43% { 
        transform: translate(-50%, -50%) translateY(-15px) translateX(5px) scale(1.02); 
      }
      86% { 
        transform: translate(-50%, -50%) translateY(-8px) translateX(-3px) scale(0.98); 
      }
    }
    
    @keyframes orbitalFloat {
      0%, 100% { 
        transform: translate(-50%, -50%) translateX(0px) translateY(0px) scale(1); 
      }
      75% { 
        transform: translate(-50%, -50%) translateX(8px) translateY(-12px) scale(1.03); 
      }
      50% { 
        transform: translate(-50%, -50%) translateX(-5px) translateY(-18px) scale(0.97); 
      }
      75% { 
        transform: translate(-50%, -50%) translateX(-10px) translateY(-8px) scale(1.01); 
      }
    }
    
    @keyframes slideInUp {
      to {
        opacity: 1;
        transform: translateY(0px);
      }
    }
    
    .bg-gradient-radial {
      background: radial-gradient(circle, var(--tw-gradient-stops));
    }
    
    .select-none {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    .smooth-transform {
      will-change: transform;
      backface-visibility: hidden;
      transform-style: preserve-3d;
    }
  `;

  // Inject styles into document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const technologies: Technology[] = [
    { name: 'React', color: '#61dafb', icon: '⚛️', iconImage: reactIcon, position: { top: '55%', left: '35%' } },
    { name: 'TypeScript', color: '#3178c6', icon: '🔷', iconImage: typescriptIcon, position: { top: '25%', left: '70%' } },
    { name: 'Node.js', color: '#339933', icon: '🟢', iconImage: nodejsIcon, position: { top: '35%', left: '80%' } },
    { name: 'GraphQL', color: '#e10098', icon: '💎', iconImage: graphqlIcon, position: { top: '65%', left: '45%' } },
    { name: 'Docker', color: '#2496ed', icon: '🐳', iconImage: dockerIcon, position: { top: '70%', left: '25%' } },
    { name: 'MongoDB', color: '#47a248', icon: '🍃', iconImage: mongoIcon, position: { top: '55%', left: '75%' } },
    { name: 'PostgreSQL', color: '#336791', icon: '🐘', iconImage: postgresIcon, position: { top: '45%', left: '15%' } },
    { name: 'Tailwind', color: '#06b6d4', icon: '💨', iconImage: tailwindIcon, position: { top: '80%', left: '60%' } },
    { name: 'MinIO', color: '#C72E29', icon: '📦', iconImage: minioIcon, position: { top: '30%', left: '45%' } },
    { name: 'Nginx', color: '#009639', icon: '🌐', iconImage: nginxIcon, position: { top: '85%', left: '35%' } },
    { name: 'EDC', color: '#FF6B35', icon: '🔌', iconImage: edcIcon, position: { top: '50%', left: '85%' } },
    { name: 'Keycloak', color: '#4D4D4D', icon: '🔐', iconImage: keycloakIcon, position: { top: '20%', left: '50%' } },
    { name: 'Angular', color: '#DD0031', icon: '🅰️', position: { top: '60%', left: '20%' } },
    { name: 'D3.js', color: '#F68E3F', icon: '📊', iconImage: d3Icon, position: { top: '40%', left: '65%' } },
    { name: 'Blockchain', color: '#F7931A', icon: '⛓️', iconImage: blockchainIcon, position: { top: '75%', left: '80%' } },
  ];

  const projects: Project[] = [
    {
      name: 'IDEA4RC',
      description: 'Built a React TypeScript application with Keycloak authentication for rare cancer patients to complete questionnaires and consent to donate medical data. Data is stored in MongoDB, hashed and stored in Hyperledger Fabric blockchain for security and immutability.',
      technologies: ['React', 'TypeScript', 'Keycloak', 'MongoDB', 'Blockchain'],
      link: 'https://www.idea4rc.eu/',
      color: '#FF6B6B'
    },
    {
      name: 'FEVER',
      description: 'Developed GraphQL APIs and React.js/React Native UIs with Keycloak authentication for member registration and transaction management in a distributed ledger ecosystem.',
      technologies: ['React', 'GraphQL', 'Keycloak', 'TypeScript'],
      link: 'https://fever-h2020.eu/',
      color: '#ffce00'
    },
    {
      name: 'POP-MACHINA',
      description: 'Enhanced and debugged Angular.js trading platform, improving user experience and platform stability for the circular economy ecosystem.',
      technologies: ['Angular', 'TypeScript', 'Trading APIs'],
      link: 'https://pop-machina.eu/',
      color: '#9ebf46'
    },
    {
      name: 'ODIN',
      description: 'Built hospital administration platform with IoT resource monitoring and D3.js patient data visualizations for smart hospital management.',
      technologies: ['React', 'D3.js', 'IoT', 'MongoDB', 'Node.js'],
      link: 'https://odin-smarthospitals.eu/',
      color: '#508784'
    },
    {
      name: 'ENACT',
      description: 'Implementing a Node.js API with Keycloak authentication to enable users to perform EDC connector data transfers via secure API endpoints. Building the bridge between data providers and consumers in federated data ecosystems.',
      technologies: ['Node.js', 'Keycloak', 'EDC', 'TypeScript', 'PostgreSQL'],
      link: 'https://enact-horizon.eu/',
      color: '#FF6B35'
    }
  ];

  // Optimized mouse tracking with throttling
  const updateMousePosition = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastUpdateRef.current > 32) {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
      lastUpdateRef.current = now;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [updateMousePosition]);

  // Optimized snap-to-section scrolling with smoother animation
  useEffect(() => {
    let isScrolling = false;
    let scrollTimeout: number | undefined;
    let animationFrame: number;

    const smoothScrollTo = (targetY: number, duration: number = 800) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, startY + distance * easedProgress);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animateScroll);
        } else {
          isScrolling = false;
        }
      };

      animationFrame = requestAnimationFrame(animateScroll);
    };

    const handleWheel = (e: WheelEvent): void => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }
      
      const delta = e.deltaY;
      const windowHeight = window.innerHeight;
      let targetScrollY: number;
      let targetSection: Section;
      
      if (delta > 0) {
        // Scrolling down
        if (currentSection === 'about') {
          targetSection = 'technologies';
          targetScrollY = windowHeight;
        } else if (currentSection === 'technologies') {
          targetSection = 'projects';
          targetScrollY = windowHeight * 2;
        } else {
          return; // Already at bottom
        }
      } else {
        // Scrolling up
        if (currentSection === 'projects') {
          targetSection = 'technologies';
          targetScrollY = windowHeight;
        } else if (currentSection === 'technologies') {
          targetSection = 'about';
          targetScrollY = 0;
        } else {
          return; // Already at top
        }
      }
      
      e.preventDefault();
      
      if (!isScrolling) {
        isScrolling = true;
        
        // Update section immediately for faster UI response
        setCurrentSection(targetSection);
        
        // Smooth scroll to target
        smoothScrollTo(targetScrollY, 600);
      }
    };

    const handleKeydown = (e: KeyboardEvent): void => {
      if (isScrolling) return;
      
      const windowHeight = window.innerHeight;
      let targetScrollY: number;
      let targetSection: Section;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (currentSection === 'about') {
          targetSection = 'technologies';
          targetScrollY = windowHeight;
        } else if (currentSection === 'technologies') {
          targetSection = 'projects';
          targetScrollY = windowHeight * 2;
        } else {
          return;
        }
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (currentSection === 'projects') {
          targetSection = 'technologies';
          targetScrollY = windowHeight;
        } else if (currentSection === 'technologies') {
          targetSection = 'about';
          targetScrollY = 0;
        } else {
          return;
        }
        e.preventDefault();
      } else {
        return;
      }
      
      isScrolling = true;
      setCurrentSection(targetSection);
      smoothScrollTo(targetScrollY, 600);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeydown);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      clearTimeout(scrollTimeout);
    };
  }, [currentSection]);

  const getContent = (): ContentData => {
    switch (activeSection) {
      case 'React':
        return {
          title: 'React Expertise',
          content: 'Specialized in building robust, responsive web applications with React.js and React Native. Experience with modern hooks, state management, and component architecture.',
          projects: ['IDEA4RC Patient Platform', 'FEVER Platform UI', 'Hospital Administration Dashboard']
        };
      case 'TypeScript':
        return {
          title: 'TypeScript Development',
          content: 'Strong proficiency in TypeScript for type-safe development, improving code quality and developer experience across large-scale applications.',
          projects: ['IDEA4RC Application', 'Type-safe API integrations', 'Component library development']
        };
      case 'Node.js':
        return {
          title: 'Backend Development',
          content: 'Full-stack development capabilities with Node.js, building scalable server-side applications and APIs.',
          projects: ['ENACT API development', 'RESTful API development', 'Microservices architecture']
        };
      case 'GraphQL':
        return {
          title: 'Modern API Development',
          content: 'Implementing efficient data fetching with GraphQL, reducing over-fetching and improving application performance.',
          projects: ['FEVER GraphQL APIs', 'Apollo Client integration', 'Real-time subscriptions']
        };
      case 'Docker':
        return {
          title: 'Containerization',
          content: 'Containerizing applications for consistent deployment across different environments using Docker.',
          projects: ['Multi-stage Docker builds', 'Development environment setup', 'Production deployment pipelines']
        };
      case 'MongoDB':
        return {
          title: 'NoSQL Database Management',
          content: 'Experience with MongoDB for flexible, scalable data storage solutions and document-based architectures.',
          projects: ['IDEA4RC data storage', 'ODIN patient data', 'Query optimization']
        };
      case 'PostgreSQL':
        return {
          title: 'SQL Database Management',
          content: 'Expertise in PostgreSQL for relational data management, complex queries, and data integrity.',
          projects: ['ENACT data management', 'Performance optimization', 'Data warehousing']
        };
      case 'Tailwind':
        return {
          title: 'Modern CSS Framework',
          content: 'Creating beautiful, responsive designs with Tailwind CSS, focusing on utility-first approach and design systems.',
          projects: ['Component library creation', 'Responsive design systems', 'Custom theme development']
        };
      case 'MinIO':
        return {
          title: 'Object Storage Solutions',
          content: 'Implementing scalable object storage with MinIO for handling large files and data assets in cloud-native applications.',
          projects: ['File upload systems', 'Data lake architecture', 'Backup and recovery solutions']
        };
      case 'Nginx':
        return {
          title: 'Web Server & Reverse Proxy',
          content: 'Configuring Nginx for high-performance web serving, load balancing, and reverse proxy setups.',
          projects: ['Load balancer configuration', 'SSL/TLS termination', 'Static asset optimization']
        };
      case 'EDC':
        return {
          title: 'Eclipse Data Connector',
          content: 'Implementing Sovity\'s EDC connectors for secure data exchange and interoperability in federated data ecosystems.',
          projects: ['ENACT API development', 'Data connector setup', 'Policy configuration']
        };
      case 'Keycloak':
        return {
          title: 'Identity & Access Management',
          content: 'Implementing secure authentication and authorization with Keycloak for enterprise applications and microservices.',
          projects: ['IDEA4RC Authentication', 'ENACT API Security', 'FEVER SSO implementation']
        };
      case 'Angular':
        return {
          title: 'Angular Framework',
          content: 'Experience with Angular for building large-scale enterprise applications with TypeScript and modern web standards.',
          projects: ['POP-MACHINA trading platform', 'Enterprise web applications', 'Component architecture']
        };
      case 'D3.js':
        return {
          title: 'Data Visualization',
          content: 'Creating interactive data visualizations and charts using D3.js for better data understanding and user engagement.',
          projects: ['ODIN hospital dashboards', 'Patient data visualization', 'Real-time monitoring charts']
        };
      case 'Blockchain':
        return {
          title: 'Blockchain Technology',
          content: 'Implementing blockchain solutions for data integrity, security, and immutability using Hyperledger Fabric and other technologies.',
          projects: ['IDEA4RC data hashing', 'Medical data security', 'Distributed ledger integration']
        };
      default:
        return {
          title: 'Tech Stack Overview',
          content: 'Explore my comprehensive technology stack by clicking on any technology icon. Each represents a key skill in my development arsenal, from frontend frameworks to backend services and emerging technologies.',
          projects: []
        };
    }
  };

  const content: ContentData = getContent();

  // Generate floating particles with 3D movement
  const generateParticles = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: Math.random() * 3 + 1,
      direction: Math.random() * 360,
    }));
  };

  const particles = generateParticles(20);

  return (
    <div className="relative overflow-hidden select-none">
      {/* Fixed Height Container for Snap Scrolling */}
      <div className="h-screen overflow-hidden">

        {/* About Me Section */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ease-out transform smooth-transform ${
            currentSection === 'about' 
              ? 'translate-y-0 opacity-100 scale-100' 
              : currentSection === 'technologies' 
                ? '-translate-y-full opacity-0 scale-98' 
                : '-translate-y-full opacity-0 scale-95'
          } ${
            currentSection === 'about' ? 'bg-gradient-to-br from-green-900 via-teal-800 to-slate-900' : 'bg-gradient-to-br from-gray-900 via-slate-800 to-black'
          }`}
        >
        {/* Background particles */}
        <div className="absolute inset-0 opacity-30">
          {particles.slice(0, 15).map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full transition-colors duration-1000 ${
                currentSection === 'about' ? 'bg-green-400' : 'bg-gray-400'
              }`}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `complexFloat ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
                transform: `rotate(${particle.direction}deg)`,
              }}
            />
          ))}
          
          {/* Mouse follower */}
          <div
            className={`absolute w-80 h-80 rounded-full pointer-events-none opacity-20 transition-all duration-500 ease-out ${
              currentSection === 'about' ? 'bg-gradient-radial from-green-400/40 to-transparent' : 'bg-gradient-radial from-gray-400/40 to-transparent'
            }`}
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Header */}
        <div className="relative z-10 text-center pt-16 mb-12">
          <h1 className={`text-6xl font-bold mb-4 transition-colors duration-1000 ${
            currentSection === 'about' ? 'text-green-400' : 'text-gray-400'
          }`}>
            Christos Diamantakis
          </h1>
          <p className="text-xl text-gray-300">Frontend Developer & Research Associate</p>
        </div>

        {/* Main Content Grid - Only visible in about section */}
        {currentSection === 'about' && (
          <div className="relative z-10 max-w-7xl mx-auto px-8 opacity-100 transition-opacity duration-1000">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Who Am I */}
              <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-500 transform hover:scale-105">
                <h3 className="text-2xl font-bold text-green-400 mb-4">Who Am I?</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Frontend Developer with a strong focus on the React library. Passionate about implementing robust and responsive designs, I specialize in creating clean, secure, and privacy-conscious code.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Currently working as a Software Engineer and R&D Associate at CERTH/ITI, where I contribute to cutting-edge European research projects, developing innovative web applications and introducing new technologies to advance the field.
                </p>
                
                {/* Contact Links */}
                <div className="mt-6 space-y-3">
                  <a href="mailto:ch.diamantakis@gmail.com" className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors duration-300 group">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold">@</span>
                    </div>
                    <span>ch.diamantakis@gmail.com</span>
                  </a>
                  
                  <a href="https://github.com/chris-diam" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors duration-300 group">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold">G</span>
                    </div>
                    <span>chris-diam</span>
                  </a>
                  
                  <a href="https://www.linkedin.com/in/christos-diamantakis/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors duration-300 group">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold">in</span>
                    </div>
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              </div>

              {/* Current Role */}
              <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Current Role</h3>
                <h4 className="text-xl font-semibold text-green-400 mb-2">Software Engineer - R&D Associate</h4>
                <p className="text-gray-400 italic mb-1">Centre for Research and Technology Hellas (CERTH/ITI)</p>
                <p className="text-gray-500 text-sm mb-4">April 2022 - Present</p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1">•</span>
                    <span>Research, design and development of robust and responsive Web applications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1">•</span>
                    <span>Participation in drafting technical documentation and project deliverables</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1">•</span>
                    <span>Introduction of new technologies, tools and technical workflows</span>
                  </li>
                </ul>
              </div>

              {/* Education */}
              <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">Education</h3>
                <h4 className="text-xl font-semibold text-white mb-2">Bachelor's in Applied Informatics</h4>
                <p className="text-yellow-400 italic mb-2">University of Macedonia</p>
                <p className="text-gray-400">December 2021</p>
              </div>

              {/* Languages */}
              <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-500 transform hover:scale-105">
                <h3 className="text-2xl font-bold text-orange-400 mb-4">Languages</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Greek</span>
                    <span className="text-green-400 text-sm font-semibold">Native</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">English</span>
                    <span className="text-blue-400 text-sm font-semibold">Professional</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">French</span>
                    <span className="text-yellow-400 text-sm font-semibold">Certified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools & Environment - Full Width */}
            <div className="mt-8 bg-gray-800/80 backdrop-blur-md rounded-xl p-8 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500 transform hover:scale-105">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Tools & Environment</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center space-y-2 hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl">📝</div>
                  <p className="text-white font-medium">LaTeX</p>
                </div>
                <div className="flex flex-col items-center space-y-2 hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl">🔧</div>
                  <p className="text-white font-medium">Postman</p>
                </div>
                <div className="flex flex-col items-center space-y-2 hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl">🎨</div>
                  <p className="text-white font-medium">Figma</p>
                </div>
                <div className="flex flex-col items-center space-y-2 hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl">💻</div>
                  <p className="text-white font-medium">VSCode</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation hint */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center z-10">
          <p className="text-lg font-medium mb-3 opacity-90">
            {currentSection === 'about' ? 'Explore My Technologies' : 
             currentSection === 'technologies' ? 'View My Projects' : 'Back to Top'}
          </p>
          <div className="animate-bounce">
            <span className={`text-3xl transition-colors duration-1000 ${
              currentSection === 'about' ? 'text-green-400' : 'text-gray-400'
            }`}>
              {currentSection === 'projects' ? '↑' : '↓'}
            </span>
          </div>
        </div>
      </div>

        {/* Technologies Section */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ease-out transform smooth-transform ${
            currentSection === 'technologies' 
              ? 'translate-y-0 opacity-100 scale-100' 
              : currentSection === 'about' 
                ? 'translate-y-full opacity-0 scale-98' 
                : '-translate-y-full opacity-0 scale-98'
          } ${
            currentSection === 'technologies' ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' : 'bg-gradient-to-br from-gray-800 via-slate-900 to-black'
          }`}
        >
        
        {/* Enhanced Background */}
        <div className="absolute inset-0 opacity-40">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full transition-colors duration-1000 ${
                currentSection === 'technologies' ? 'bg-blue-400' : 'bg-gray-600'
              }`}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `spaceFloat ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
                transform: `rotate(${particle.direction}deg)`,
              }}
            />
          ))}
          
          <div
            className={`absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-500 ease-out ${
              currentSection === 'technologies' ? 'bg-gradient-radial from-blue-500/25 to-transparent' : 'bg-gradient-radial from-gray-500/25 to-transparent'
            }`}
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Technology Bubbles with Enhanced 3D Floating */}
        {currentSection === 'technologies' && (
          <div className="absolute inset-0">
            {technologies.map((tech, index) => (
              <div
                key={tech.name}
                className={`absolute group cursor-pointer transition-all duration-700 ease-out hover:scale-125 ${
                  activeSection === tech.name ? 'scale-125 z-30' : 'hover:z-20'
                }`}
                style={{
                  ...tech.position,
                  transform: 'translate(-50%, -50%)',
                  animation: `bubbleFloat ${4 + index * 0.4}s ease-in-out infinite`,
                  animationDelay: `${index * 0.3}s`,
                }}
                onClick={() => setActiveSection(activeSection === tech.name ? null : tech.name)}
              >
                <div
                  className={`w-28 h-28 rounded-full flex items-center justify-center text-3xl shadow-2xl border-2 border-white/30 backdrop-blur-sm transition-all duration-500 ${
                    activeSection === tech.name
                      ? 'bg-white/30 border-white/70 shadow-lg shadow-white/40'
                      : 'bg-white/15 hover:bg-white/25 hover:border-white/50'
                  }`}
                  style={{
                    backgroundColor: activeSection === tech.name ? `${tech.color}60` : undefined,
                    boxShadow: activeSection === tech.name ? `0 0 50px ${tech.color}90` : undefined,
                  }}
                >
                  {tech.iconImage ? (
                    <img 
                      src={tech.iconImage} 
                      alt={tech.name}
                      className="w-12 h-12 object-contain filter drop-shadow-lg"
                    />
                  ) : (
                    <span className="filter drop-shadow-lg text-3xl">
                      {tech.icon}
                    </span>
                  )}
                </div>
                
                <div className="absolute top-32 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="bg-black/90 text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-lg">
                    {tech.name}
                  </span>
                </div>
                
                {activeSection === tech.name && (
                  <div className="absolute inset-0">
                    <div className="w-28 h-28 rounded-full border-2 border-white/70 animate-ping"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content Panel */}
        {currentSection === 'technologies' && (
          <div className="absolute top-6 left-6 max-w-lg bg-black/85 backdrop-blur-md rounded-xl p-8 text-white border border-white/20 z-40 transition-all duration-700 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {content.title}
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              {content.content}
            </p>
            {content.projects.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-300">Related Projects:</h3>
                <ul className="space-y-2">
                  {content.projects.map((project, index) => (
                    <li key={index} className="text-sm text-gray-400 flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-4 flex-shrink-0"></span>
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Section Navigation */}
        <div className="absolute bottom-6 right-6 text-white text-center z-40">
          <div className="flex flex-col items-center space-y-3">
            <div className={`w-4 h-4 rounded-full transition-all duration-500 cursor-pointer ${currentSection === 'about' ? 'bg-green-400 scale-125' : 'bg-gray-500 hover:bg-gray-400'}`}></div>
            <div className={`w-4 h-4 rounded-full transition-all duration-500 cursor-pointer ${currentSection === 'technologies' ? 'bg-blue-400 scale-125' : 'bg-gray-500 hover:bg-gray-400'}`}></div>
            <div className={`w-4 h-4 rounded-full transition-all duration-500 cursor-pointer ${currentSection === 'projects' ? 'bg-orange-400 scale-125' : 'bg-gray-500 hover:bg-gray-400'}`}></div>
          </div>
          <p className="text-sm opacity-75 mt-3 font-medium">
            {currentSection === 'about' ? 'About Me' : 
             currentSection === 'technologies' ? 'Tech Stack' : 'Projects'}
          </p>
          {currentSection !== 'projects' && (
            <div className="animate-bounce mt-3">
              <span className="text-3xl text-blue-400">↓</span>
            </div>
          )}
        </div>
      </div>

        {/* Projects Section */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ease-out transform smooth-transform ${
            currentSection === 'projects' 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-full opacity-0 scale-98'
          } ${
            currentSection === 'projects' ? 'bg-gradient-to-br from-gray-800 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
          } py-20 px-4 overflow-y-auto`}
        >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${
            currentSection === 'projects' ? 'opacity-100 transform translate-y-0' : 'opacity-50 transform translate-y-10'
          }`}>
            <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-6">
              Research Projects
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Contributions to European research initiatives at CERTH/ITI, focusing on innovative web technologies, medical applications, and secure data management solutions.
            </p>
          </div>

          {currentSection === 'projects' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.name}
                  className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-700 hover:scale-105 hover:shadow-2xl transform"
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    animation: `slideInUp 0.8s ease-out forwards ${index * 0.2}s`,
                    opacity: 0,
                    transform: 'translateY(30px)'
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 
                      className="text-2xl font-bold group-hover:scale-105 transition-transform duration-300"
                      style={{ color: project.color }}
                    >
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {project.name}
                        </a>
                      ) : (
                        project.name
                      )}
                    </h3>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                        <span className="text-2xl">🔗</span>
                      </a>
                    )}
                  </div>
                  
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech) => {
                      const techData = technologies.find(t => t.name === tech);
                      return (
                        <span
                          key={tech}
                          className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-110 hover:shadow-lg"
                          style={{
                            backgroundColor: techData ? `${techData.color}25` : '#374151',
                            borderColor: techData ? `${techData.color}70` : '#6B7280',
                            color: techData ? techData.color : '#D1D5DB',
                          }}
                        >
                          {techData?.icon} {tech}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
              </div>
      </div>

      <style >{`
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        
        @keyframes complexFloat {
          0%, 100% { 
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1); 
            opacity: 0.3;
          }
          25% { 
            transform: translateX(10px) translateY(-15px) rotate(90deg) scale(1.2); 
            opacity: 0.7;
          }
          50% { 
            transform: translateX(-5px) translateY(-25px) rotate(180deg) scale(0.9); 
            opacity: 0.5;
          }
          75% { 
            transform: translateX(-15px) translateY(-10px) rotate(270deg) scale(1.1); 
            opacity: 0.8;
          }
        }
        
        @keyframes spaceFloat {
          0%, 100% { 
            transform: translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1); 
            opacity: 0.4;
          }
          33% { 
            transform: translateX(20px) translateY(-30px) translateZ(10px) rotateX(120deg) rotateY(180deg) scale(1.3); 
            opacity: 0.8;
          }
          66% { 
            transform: translateX(-15px) translateY(-20px) translateZ(-5px) rotateX(240deg) rotateY(300deg) scale(0.7); 
            opacity: 0.6;
          }
        }
        
        @keyframes bubbleFloat {
          0%, 100% { 
            transform: translate(-50%, -50%) translateY(0px) scale(1); 
          }
          33% { 
            transform: translate(-50%, -50%) translateY(-15px) translateX(5px) scale(1.02); 
          }
          66% { 
            transform: translate(-50%, -50%) translateY(-8px) translateX(-3px) scale(0.98); 
          }
        }
        
        @keyframes orbitalFloat {
          0%, 100% { 
            transform: translate(-50%, -50%) translateX(0px) translateY(0px) scale(1); 
          }
          25% { 
            transform: translate(-50%, -50%) translateX(8px) translateY(-12px) scale(1.03); 
          }
          50% { 
            transform: translate(-50%, -50%) translateX(-5px) translateY(-18px) scale(0.97); 
          }
          75% { 
            transform: translate(-50%, -50%) translateX(-10px) translateY(-8px) scale(1.01); 
          }
        }
        
        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default App;