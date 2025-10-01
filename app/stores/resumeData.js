import { defineStore } from 'pinia'

export const useResumeDataStore = defineStore('resumeData', {
  state: () => ({
    personalInfo: {
      name: 'Carlos Idrissi Saez',
      title: 'Software Engineer',
      email: 'carlos.idriss@example.com',
      phone: '+33 6 12 34 56 78',
      location: 'Paris, France',
      linkedin: 'linkedin.com/in/carlossaez',
      portfolio: 'www.carlossaez.dev',
      summary: 'Highly skilled and innovative Software Engineer with over 8 years of experience in developing cutting-edge applications and services. Specialized in machine learning, cloud infrastructure, and distributed systems.'
    },
  
    summary: {
      text: 'Highly skilled and innovative Software Engineer with over 8 years of experience in developing cutting-edge applications and services. Specialized in machine learning, cloud infrastructure, and distributed systems. Proven track record of leading teams to deliver high-quality solutions that drive business growth and improve user experience.'
    },
  
    experience: [
      {
        id: 1,
        job_title: 'Software Engineer',
        company: 'XYZ Company',
        location: 'Deggendorf',
        start_date: 'Mar 2025',
        end_date: 'Dec 2026',
        description: '<p>Responsible for designing and delivering scalable web applications and internal tools. Implemented backend services and automated <strong>CI/CD pipelines</strong> to enhance deployment <u>speed and system reliability</u>.</p><ul><li>Designed and implemented RESTful APIs and microservices using modern web frameworks, accelerating feature delivery by ~30%.</li><li>Developed responsive, component-driven UIs and collaborated with designers to reduce UI defects by 25%.</li><li>Built and maintained automated CI/CD pipelines, test suites, and deployment scripts ensuring zero-downtime releases.</li><li>Optimized database queries and introduced caching strategies, lowering response times for critical endpoints by 40%.</li><li>Implemented monitoring and alerting dashboards that cut incident detection time by 50% and improved recovery metrics.</li><li>Mentored junior developers, conducted code reviews, and established coding standards to boost quality and consistency.</li><li>Enhanced system observability with structured logging and proactive performance metrics collection.</li><li>Collaborated with cross-functional stakeholders to align technical delivery with business goals and improve outcomes.</li><li>Integrated security best practices into development workflows, strengthening application resilience against threats.</li><li>Introduced automated documentation tools, improving onboarding speed and knowledge sharing across the team.</li></ul>'
      },
      {
        id: 2,
        job_title: 'Senior Software Engineer',
        company: 'Google Inc.',
        location: 'Mountain View, CA',
        start_date: 'Jun 2022',
        end_date: 'Present',
        description: '<p><strong>Senior Software Engineer</strong> working on Google Cloud Platform’s AI and machine learning services.</p><ul><li>Led the development of a new BigQuery ML feature that accelerated training speed by 40%.</li><li>Partnered with cross-functional teams to design and deliver RESTful APIs for deploying ML models.</li><li>Engineered scalable backend systems ensuring high availability and performance.</li><li>Improved reliability through automation, monitoring, and self-healing infrastructure.</li><li>Mentored 5 junior engineers, provided guidance, and ran technical interviews.</li><li>Implemented CI/CD pipelines that reduced deployment time by 60% and increased release frequency.</li></ul>'
      },
      {
        id: 3,
        job_title: 'Software Engineer',
        company: 'Microsoft Corporation',
        location: 'Seattle, WA',
        start_date: 'Jul 2020',
        end_date: 'May 2022',
        description: '<p>Developed cloud-native applications and services for the Azure platform with a focus on scalability, performance optimization, and testing automation.</p><ul><li>Built microservices handling over 1M requests per day.</li><li>Optimized queries and caching, improving performance by 50%.</li><li>Introduced automated testing frameworks, reducing defects by 30%.</li><li>Worked with product managers to define technical requirements and align with business goals.</li></ul>'
      }
    ],
  
    education: [
      {
        id: 1,
        institution: 'Stanford University',
        location: 'Stanford, CA',
        start_date: 'Sep 2020',
        end_date: 'Jun 2022',
        degree: 'Master of Science in Computer Science',
        description: '<p>Specialized in Artificial Intelligence and Machine Learning. <strong>GPA: 3.92/4.0</strong></p><ul><li>Research Assistant at Stanford AI Lab.</li><li>Published 2 papers on deep learning applications.</li><li>Teaching Assistant for CS231n: Convolutional Neural Networks.</li></ul>'
      },
      {
        id: 2,
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        start_date: 'Sep 2016',
        end_date: 'May 2020',
        degree: 'Bachelor of Science in Computer Engineering',
        description: '<p>Bachelor of Science in Computer Engineering - Minor in Mathematics. Graduated with Honors. GPA: 3.85/4.0</p><ul><li>Dean\'s List every semester.</li><li>Capstone Project: Developed an IoT system for smart energy management.</li></ul>'
      },
      {
        id: 3,
        institution: 'ETH Zurich',
        location: 'Zurich, Switzerland',
        start_date: 'Jan 2019',
        end_date: 'Jun 2019',
        degree: 'Study Abroad Program',
        description: '<p>Focus on Advanced Algorithms and Distributed Systems.</p><ul><li>Completed a research project on distributed consensus algorithms.</li><li>Participated in the ETH Robotics Challenge.</li></ul>'
      }
    ],
  
    skills: {
      'Programming Languages': [
        { name: 'Python', level: 5 },
        { name: 'Java', level: 5 },
        { name: 'JavaScript', level: 4 },
        { name: 'TypeScript', level: 4 },
        { name: 'Go', level: 3 },
        { name: 'C++', level: 3 }
      ],
      'Frameworks & Libraries': [
        { name: 'React', level: 5 },
        { name: 'Vue.js', level: 4 },
        { name: 'Node.js', level: 5 },
        { name: 'Express', level: 4 },
        { name: 'Django', level: 3 },
        { name: 'Spring Boot', level: 3 }
      ],
      'Cloud & DevOps': [
        { name: 'AWS', level: 4 },
        { name: 'Azure', level: 3 },
        { name: 'Docker', level: 5 },
        { name: 'Kubernetes', level: 4 },
        { name: 'Jenkins', level: 3 },
        { name: 'Terraform', level: 3 }
      ],
      'Databases': [
        { name: 'PostgreSQL', level: 4 },
        { name: 'MongoDB', level: 4 },
        { name: 'Redis', level: 3 },
        { name: 'Elasticsearch', level: 3 }
      ]
    },
  
    projects: [
      {
        id: 1,
        title: 'SmartRetail Platform',
        role: 'Lead Developer',
        organization: 'RetailTech AG',
        url: 'https://smartretail.com',
        start_date: 'Mar 2022',
        end_date: 'Present',
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
        description: '<p>AI-powered retail analytics platform for sales and inventory optimization.</p><ul><li>Implemented machine learning algorithms for demand forecasting.</li><li>Built real-time dashboards with React and D3.js.</li><li>Integrated with POS systems and inventory databases.</li><li>Achieved 25% improvement in inventory turnover rates.</li></ul>'
      },
      {
        id: 2,
        title: 'FinanceTracker Pro',
        role: 'Full Stack Developer',
        organization: 'FinTech Solutions',
        url: 'https://financetracker.io',
        start_date: 'Jan 2023',
        end_date: 'Dec 2023',
        technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Docker'],
        description: '<p><strong>Personal finance management application</strong> with automated categorization and investment tracking.</p><ul><li>Developed automated transaction categorization using NLP.</li><li>Built portfolio tracking with live market data.</li><li>Implemented secure bank integrations via Plaid API.</li><li>Created mobile-responsive Vue.js frontend with PWA capabilities.</li></ul>'
      },
      {
        id: 3,
        title: 'Healthcare Analytics Dashboard',
        role: 'Senior Developer',
        organization: 'MedTech Innovations',
        url: 'https://healthanalytics.com',
        start_date: 'Jun 2021',
        end_date: 'Feb 2022',
        technologies: ['Angular', 'Java', 'Spring Boot', 'MySQL'],
        description: '<p>Real-time healthcare data visualization platform for hospital management and patient care optimization.</p><ul><li>Built dashboards for monitoring patient flows.</li><li>Implemented real-time alerts for critical patient metrics.</li><li>Developed integration layers for multiple hospital systems.</li><li>Reduced patient wait times by 30% via scheduling optimization.</li></ul>'
      }
    ],
  
    publications: [
      {
        id: 1,
        title: 'Scaling Microservices with Kubernetes',
        publisher: 'Tech Journal',
        publication_date: 'August 2022',
        url: 'https://techjournal.com/microservices-k8s',
        description: 'Best practices for deploying and scaling microservices with Kubernetes.'
      },
      {
        id: 2,
        title: 'Modern Frontend Architecture Patterns',
        publisher: 'Web Development Quarterly',
        publication_date: 'March 2023',
        url: 'https://webdevquarterly.com/frontend-patterns',
        description: 'Comprehensive guide to modern frontend architecture patterns including micro-frontends and component-driven development.'
      },
      {
        id: 3,
        title: 'Machine Learning in Production Systems',
        publisher: 'AI Research Today',
        publication_date: 'November 2023',
        url: 'https://airesearchtoday.com/ml-production',
        description: 'Practical approaches to deploying and maintaining machine learning models in production environments.'
      }
    ],
  
    certifications: [
      { name: 'AWS Certified Solutions Architect', year: '2023' },
      { name: 'Google Cloud Professional Developer', year: '2022' },
      { name: 'Certified Kubernetes Administrator', year: '2022' }
    ],
  
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Spanish', level: 'Fluent' },
      { name: 'French', level: 'Intermediate' }
    ],
  
    awards: [
      { name: 'Employee of the Year', organization: 'Google Inc.', year: '2023' },
      { name: 'Innovation Award', organization: 'Microsoft Corporation', year: '2021' }
    ],
  
    references: [
      {
        id: 1,
        full_name: 'Michael Bauer',
        company: 'TechVision GmbH',
        position: 'CTO',
        email: 'michael.bauer@techvision.com',
        phone: '+49 30 987654',
        permission: true,
        relationship: 'Direct Manager'
      },
      {
        id: 2,
        full_name: 'Sarah Chen',
        company: 'InnovateTech Solutions',
        position: 'Senior Engineering Manager',
        email: 'sarah.chen@innovatetech.com',
        phone: '+1 555 123 4567',
        permission: true,
        relationship: 'Team Lead'
      },
      {
        id: 3,
        full_name: 'Dr. Andreas Mueller',
        company: 'University of Munich',
        position: 'Professor of Computer Science',
        email: 'a.mueller@tum.de',
        phone: '+49 89 289 17234',
        permission: true,
        relationship: 'Academic Supervisor'
      }
    ],
  
    customSections: [
      {
        id: 1,
        section_name: 'Volunteer Experience',
        entries: [
          {
            id: 1,
            title: 'Web Development Mentor',
            city: 'Berlin',
            start_date: 'Jan 2023',
            end_date: 'Present',
            description: '<p>Mentoring aspiring web developers through coding bootcamp program.</p><ul><li>Provided one-on-one guidance to 15+ students.</li><li>Conducted weekly code review sessions.</li><li>Helped students build portfolio projects.</li><li>Achieved 90% job placement rate for mentees.</li></ul>'
          },
          {
            id: 2,
            title: 'Tech Workshop Organizer',
            city: 'Munich',
            start_date: 'Mar 2022',
            end_date: 'Dec 2022',
            description: '<p>Organized monthly technology workshops for local community.</p><ul><li>Planned and executed 10 workshops with 200+ attendees.</li><li>Topics covered: React, Node.js, Python, and DevOps.</li><li>Collaborated with local tech companies for sponsorship.</li></ul>'
          }
        ]
      },
      {
        id: 2,
        section_name: 'Professional Memberships',
        entries: [
          {
            id: 1,
            title: 'IEEE Computer Society',
            city: 'International',
            start_date: 'Jan 2020',
            end_date: 'Present',
            description: '<p>Active member of the IEEE Computer Society with focus on software engineering standards.</p><ul><li>Participated in annual conferences and workshops.</li><li>Contributed to open-source engineering guidelines.</li><li>Networking with industry professionals worldwide.</li></ul>'
          },
          {
            id: 2,
            title: 'German Software Engineering Association',
            city: 'Germany',
            start_date: 'Jun 2021',
            end_date: 'Present',
            description: '<p>Member of national software engineering professional organization.</p><ul><li>Regular attendee of quarterly meetups.</li><li>Participated in industry best practices discussions.</li></ul>'
          }
        ]
      }
    ]
  })
,  
  
  getters: {
    getPersonalInfo: (state) => state.personalInfo,
    getExperience: (state) => state.experience,
    getEducation: (state) => state.education,
    getSkills: (state) => state.skills,
    getProjects: (state) => state.projects
  },
  
  actions: {
    updatePersonalInfo(info) {
      this.personalInfo = { ...this.personalInfo, ...info }
    },
    
    addExperience(experience) {
      this.experience.push({
        ...experience,
        id: Math.max(...this.experience.map(e => e.id)) + 1
      })
    },
    
    updateExperience(id, updates) {
      const index = this.experience.findIndex(e => e.id === id)
      if (index !== -1) {
        this.experience[index] = { ...this.experience[index], ...updates }
      }
    }
  }
})
