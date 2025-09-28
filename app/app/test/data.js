const mainContent = computed(() => {
    // Only generate for single-column layout
    if (props.templateConfig.paginatorType !== 'oneColHeader') {
      return ''
    }
    // Professional summary
    const summaryHTML = `
          <h2 class="section-title" style="color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px;">Professional Summary</h2>
          
          <div style="margin-bottom: 20px;">
            <p style="margin: 10px 0; line-height: 1.5;">
              Highly skilled and innovative Software Engineer with over 8 years of experience in developing cutting-edge applications and services. 
              Specialized in machine learning, cloud infrastructure, and distributed systems. Proven track record of leading teams to deliver 
              high-quality software solutions that drive business growth and improve user experience. Strong technical expertise in Python, Java, 
              and cloud technologies with a passion for solving complex problems and staying at the forefront of technological advancements.
            </p>
          </div>
          
    `
    // Fake education data
    const educationHTML = `
          <h2 class="section-title" style="color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px;">Education</h2>
          
          <div class="education-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Stanford University</h3>
              <span style="font-weight: 500;">Sep 2020 - Jun 2022</span>
            </div>
            <p style="margin: 5px 0; font-weight: 500;">Master of Science in Computer Science</p>
            <p style="margin: 5px 0; font-style: italic;">Specialized in Artificial Intelligence and Machine Learning. GPA: 3.92/4.0</p>
            <ul style="margin-top: 5px;">
              <li>Research Assistant at Stanford AI Lab</li>
              <li>Published 2 papers on deep learning applications</li>
              <li>Teaching Assistant for CS231n: Convolutional Neural Networks</li>
            </ul>
          </div>
          
          <div class="education-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">University of California, Berkeley</h3>
              <span style="font-weight: 500;">Sep 2016 - May 2020</span>
            </div>
            <p style="margin: 5px 0; font-weight: 500;">Bachelor of Science in Computer Engineering</p>
            <p style="margin: 5px 0; font-style: italic;">Minor in Mathematics. Graduated with Honors. GPA: 3.85/4.0</p>
            <ul style="margin-top: 5px;">
              <li>Dean's List all semesters</li>
              <li>Capstone Project: Developed an IoT system for smart energy management</li>
            </ul>
          </div>
    
          <div class="education-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">ETH Zurich</h3>
              <span style="font-weight: 500;">Jan 2019 - Jun 2019</span>
            </div>
            <p style="margin: 5px 0; font-weight: 500;">Study Abroad Program</p>
            <p style="margin: 5px 0; font-style: italic;">Focus on Advanced Algorithms and Distributed Systems</p>
            <ul style="margin-top: 5px;">
              <li>Completed research project on distributed consensus algorithms</li>
              <li>Participated in the ETH Robotics Challenge</li>
            </ul>
          </div>
          
          <div class="education-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Phillips Academy Andover</h3>
              <span style="font-weight: 500;">Sep 2012 - May 2016</span>
            </div>
            <p style="margin: 5px 0; font-weight: 500;">High School Diploma</p>
            <p style="margin: 5px 0; font-style: italic;">Advanced Placement in Mathematics, Computer Science, and Physics</p>
            <ul style="margin-top: 5px;">
              <li>Captain of the Robotics Team</li>
              <li>National Merit Scholar</li>
              <li>First place in State Mathematics Competition</li>
            </ul>
          </div>
    `
  
    // Fake experience data
    const experienceHTML = `
          <h2 class="section-title" style="color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px;">Professional Experience</h2>
          
          <div class="experience-item" style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Google</h3>
              <span style="font-weight: 500;">Jun 2022 - Present</span>
            </div>
            
          </div>
          <p style="margin: 5px 0; font-weight: bold;">Senior Software Engineer</p>
            <p style="margin: 5px 0;">Working on Google Cloud Platform's AI and machine learning services.</p>
            <ul style="margin-top: 8px;">
              <li>Led the development of a new feature for BigQuery ML that improved model training speed by 40%</li>
              <li>Collaborated with cross-functional teams to design and implement RESTful APIs for ML model deployment</li>
              <li>Mentored 5 junior engineers and conducted technical interviews</li>
              <li>Implemented CI/CD pipelines that reduced deployment time by 60%</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, TensorFlow, Kubernetes, Docker, Go</p>
          
          <div class="experience-item" style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Microsoft</h3>
              <span style="font-weight: 500;">Jul 2020 - May 2022</span>
            </div>
            
          </div>
          <p style="margin: 5px 0; font-weight: bold;">Software Engineer</p>
            <p style="margin: 5px 0;">Worked on Azure Machine Learning platform.</p>
            <ul style="margin-top: 8px;">
              <li>Developed and maintained microservices for model training and deployment</li>
              <li>Improved system reliability by implementing comprehensive error handling and monitoring</li>
              <li>Reduced infrastructure costs by 25% through optimization of resource allocation</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> C#, .NET Core, Azure, Docker, Kubernetes</p>
          
          <div class="experience-item" style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Twitter</h3>
              <span style="font-weight: 500;">Jun 2014 - Jul 2016</span>
            </div>
            
          </div>
          <p style="margin: 5px 0; font-weight: bold;">Junior Software Engineer</p>
            <p style="margin: 5px 0;">Worked on backend services for the Twitter timeline.</p>
            <ul style="margin-top: 8px;">
              <li>Developed and maintained RESTful APIs for timeline features</li>
              <li>Improved service reliability through comprehensive testing and monitoring</li>
              <li>Participated in on-call rotation for critical production systems</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Scala, Java, Finagle, Redis, Kafka</p>
    `
  
   
    const skillsHTML = `
          <h2 class="section-title" style="color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px;">Skills</h2>
          
          <div style="margin-bottom: 15px;">
            <h3 style="margin: 10px 0 5px; font-size: 14px;">Programming Languages</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Python</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Java</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">JavaScript</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">TypeScript</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Go</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">SQL</span>
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h3 style="margin: 10px 0 5px; font-size: 14px;">Frameworks & Libraries</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">TensorFlow</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">PyTorch</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">React</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Vue.js</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Django</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Flask</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Spring Boot</span>
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h3 style="margin: 10px 0 5px; font-size: 14px;">Tools & Platforms</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Docker</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Kubernetes</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">AWS</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">GCP</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Azure</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">Git</span>
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-weight: 500; font-size: 12px;">CI/CD</span>
            </div>
          </div>
    `
  
    // Fake projects data
    const projectsHTML = `
          <h2 class="section-title" style="color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px;">Projects</h2>
          
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Neural Style Transfer App</h3>
              <span style="font-weight: 500;">2023</span>
            </div>
          </div>
          <p style="margin: 5px 0;">A web application that applies artistic styles to images using deep learning.</p>
            <ul style="margin-top: 8px;">
              <li>Implemented a CNN-based style transfer algorithm using PyTorch</li>
              <li>Built a React frontend with a Flask API backend</li>
              <li>Deployed on AWS using Docker containers and ECS</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, PyTorch, React, Flask, AWS, Docker</p>
          
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Smart Home Energy Management System</h3>
              <span style="font-weight: 500;">2022</span>
            </div>
            
          </div>
          <p style="margin: 5px 0;">An IoT system that optimizes energy usage in homes using machine learning.</p>
            <ul style="margin-top: 8px;">
              <li>Designed and built IoT sensors using Arduino and Raspberry Pi</li>
              <li>Implemented a machine learning model to predict energy usage patterns</li>
              <li>Created a mobile app for real-time monitoring and control</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, TensorFlow, Arduino, Raspberry Pi, React Native</p>
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Smart Home Energy Management System</h3>
              <span style="font-weight: 500;">2022</span>
            </div>
            
          </div>
          <p style="margin: 5px 0;">An IoT system that optimizes energy usage in homes using machine learning.</p>
            <ul style="margin-top: 8px;">
              <li>Designed and built IoT sensors using Arduino and Raspberry Pi</li>
              <li>Implemented a machine learning model to predict energy usage patterns</li>
              <li>Created a mobile app for real-time monitoring and control</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, TensorFlow, Arduino, Raspberry Pi, React Native</p>
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Smart Home Energy Management System</h3>
              <span style="font-weight: 500;">2022</span>
            </div>
            
          </div>
          <p style="margin: 5px 0;">An IoT system that optimizes energy usage in homes using machine learning.</p>
            <ul style="margin-top: 8px;">
              <li>Designed and built IoT sensors using Arduino and Raspberry Pi</li>
              <li>Implemented a machine learning model to predict energy usage patterns</li>
              <li>Created a mobile app for real-time monitoring and control</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, TensorFlow, Arduino, Raspberry Pi, React Native</p>
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Smart Home Energy Management System</h3>
              <span style="font-weight: 500;">2022</span>
            </div>
           
          </div>
           <p style="margin: 5px 0;">An IoT system that optimizes energy usage in homes using machine learning.</p>
            <ul style="margin-top: 8px;">
              <li>Designed and built IoT sensors using Arduino and Raspberry Pi</li>
              <li>Implemented a machine learning model to predict energy usage patterns</li>
              <li>Created a mobile app for real-time monitoring and control</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, TensorFlow, Arduino, Raspberry Pi, React Native</p>
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Smart Home Energy Management System</h3>
              <span style="font-weight: 500;">2022</span>
            </div>
            
          </div>
          <p style="margin: 5px 0;">An IoT system that optimizes energy usage in homes using machine learning.</p>
            <ul style="margin-top: 8px;">
              <li>Designed and built IoT sensors using Arduino and Raspberry Pi</li>
              <li>Implemented a machine learning model to predict energy usage patterns</li>
              <li>Created a mobile app for real-time monitoring and control</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, TensorFlow, Arduino, Raspberry Pi, React Native</p>
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Smart Home Energy Management System</h3>
              <span style="font-weight: 500;">2022</span>
            </div>
            
          </div>
          <p style="margin: 5px 0;">An IoT system that optimizes energy usage in homes using machine learning.</p>
            <ul style="margin-top: 8px;">
              <li>Designed and built IoT sensors using Arduino and Raspberry Pi</li>
              <li>Implemented a machine learning model to predict energy usage patterns</li>
              <li>Created a mobile app for real-time monitoring and control</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, TensorFlow, Arduino, Raspberry Pi, React Native</p>
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Smart Home Energy Management System</h3>
              <span style="font-weight: 500;">2022</span>
            </div>
            
          </div>
          <p style="margin: 5px 0;">An IoT system that optimizes energy usage in homes using machine learning.</p>
            <ul style="margin-top: 8px;">
              <li>Designed and built IoT sensors using Arduino and Raspberry Pi</li>
              <li>Implemented a machine learning model to predict energy usage patterns</li>
              <li>Created a mobile app for real-time monitoring and control</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, TensorFlow, Arduino, Raspberry Pi, React Native</p>
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Smart Home Energy Management System</h3>
              <span style="font-weight: 500;">2022</span>
            </div>
            <p style="margin: 5px 0;">An IoT system that optimizes energy usage in homes using machine learning.</p>
            <ul style="margin-top: 8px;">
              <li>Designed and built IoT sensors using Arduino and Raspberry Pi</li>
              <li>Implemented a machine learning model to predict energy usage patterns</li>
              <li>Created a mobile app for real-time monitoring and control</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, TensorFlow, Arduino, Raspberry Pi, React Native</p>
          </div>
    
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Blockchain-based Supply Chain Tracker</h3>
              <span style="font-weight: 500;">2021</span>
            </div>
            
          </div>
          <p style="margin: 5px 0;">A decentralized application for tracking products through the supply chain.</p>
            <ul style="margin-top: 8px;">
              <li>Developed smart contracts using Solidity on Ethereum blockchain</li>
              <li>Created a web3 frontend with React and Metamask integration</li>
              <li>Implemented QR code scanning for real-time product verification</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Solidity, Ethereum, Web3.js, React, Node.js</p>
       
          
          <div class="project-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 18px;">Autonomous Drone Navigation System</h3>
              <span style="font-weight: 500;">2019</span>
            </div>
           
          </div>
           <p style="margin: 5px 0;">A computer vision system enabling drones to navigate indoor environments without GPS.</p>
            <ul style="margin-top: 8px;">
              <li>Implemented SLAM (Simultaneous Localization and Mapping) algorithms</li>
              <li>Developed object detection and obstacle avoidance using YOLOv4</li>
              <li>Optimized algorithms to run efficiently on edge computing devices</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Technologies:</strong> Python, OpenCV, TensorFlow Lite, ROS, C++</p>
    `
  
    // Fake certifications data
    const certificationsHTML = `
          <h2 class="section-title" style="color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px;">Certifications</h2>
        
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div style="font-weight: 500;">AWS Certified Solutions Architect - Professional</div>
              <span>2023</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div style="font-weight: 500;">Google Cloud Professional Data Engineer</div>
              <span>2022</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div style="font-weight: 500;">Microsoft Certified: Azure Solutions Architect Expert</div>
              <span>2021</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <div style="font-weight: 500;">TensorFlow Developer Certificate</div>
              <span>2020</span>
            </div>
          </div>
    `
  
    // Awards section
    const awardsHTML = `
          <h2 class="section-title" style="color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px;">Awards & Recognition</h2>
        
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div>
              <div style="font-weight: 500;">Google Peer Bonus Award</div>
              <p style="margin: 2px 0 0; font-style: italic;">For exceptional contributions to the BigQuery ML project</p>
            </div>
            <span>2023</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div>
              <div style="font-weight: 500;">ACM SIGKDD Best Paper Award</div>
              <p style="margin: 2px 0 0; font-style: italic;">For research on efficient distributed training algorithms</p>
            </div>
            <span>2022</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div>
              <div style="font-weight: 500;">Microsoft Hackathon Winner</div>
              <p style="margin: 2px 0 0; font-style: italic;">First place for developing an accessibility tool for visually impaired users</p>
            </div>
            <span>2021</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div>
              <div style="font-weight: 500;">Amazon Outstanding Technical Achievement</div>
              <p style="margin: 2px 0 0; font-style: italic;">For optimizing recommendation system performance</p>
            </div>
            <span>2019</span>
          </div>
    `
  
    // Languages section
    const languagesHTML = `
          <h2 class="section-title" style="color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px;">Languages</h2>
          
          <div class="lang-item" style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-weight: 500;">English</div>
              <div>Native</div>
            </div>
            <div class="lang-bar" style="height: 6px; background-color: #e0e0e0; border-radius: 3px; margin-top: 5px;">
              <div style="height: 100%; width: 100%; background-color: #0EA5E9; border-radius: 3px;"></div>
            </div>
          </div>
          
          <div class="lang-item" style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-weight: 500;">Spanish</div>
              <div>Fluent</div>
            </div>
            <div class="lang-bar" style="height: 6px; background-color: #e0e0e0; border-radius: 3px; margin-top: 5px;">
              <div style="height: 100%; width: 90%; background-color: #0EA5E9; border-radius: 3px;"></div>
            </div>
          </div>
          
          <div class="lang-item" style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-weight: 500;">Mandarin Chinese</div>
              <div>Intermediate</div>
            </div>
            <div class="lang-bar" style="height: 6px; background-color: #e0e0e0; border-radius: 3px; margin-top: 5px;">
              <div style="height: 100%; width: 60%; background-color: #0EA5E9; border-radius: 3px;"></div>
            </div>
          </div>
          
          <div class="lang-item" style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-weight: 500;">German</div>
              <div>Basic</div>
            </div>
            <div class="lang-bar" style="height: 6px; background-color: #e0e0e0; border-radius: 3px; margin-top: 5px;">
              <div style="height: 100%; width: 30%; background-color: #0EA5E9; border-radius: 3px;"></div>
            </div>
          </div>
             <div class="lang-item" style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-weight: 500;">German</div>
              <div>Basic</div>
            </div>
            <div class="lang-bar" style="height: 6px; background-color: #e0e0e0; border-radius: 3px; margin-top: 5px;">
              <div style="height: 100%; width: 30%; background-color: #0EA5E9; border-radius: 3px;"></div>
            </div>
          </div>
            
             
          
          <div class="lang-item" style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-weight: 500;">French</div>
              <div>Basic</div>
            </div>
            <div class="lang-bar" style="height: 6px; background-color: #e0e0e0; border-radius: 3px; margin-top: 5px;">
              <div style="height: 100%; width: 25%; background-color: #0EA5E9; border-radius: 3px;"></div>
            </div>
          </div>
    `
  
    // Publications section
    const publicationsHTML = `
          <h2 class="section-title" style="color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px;">Publications</h2>
        
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 500;">"Efficient Distributed Training Algorithms for Large-Scale Neural Networks"</div>
            <p style="margin: 2px 0 0; font-style: italic;">ACM SIGKDD Conference on Knowledge Discovery and Data Mining (2022)</p>
            <p style="margin: 5px 0 0;">Co-authors: J. Zhang, L. Chen, M. Johnson</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 500;">"Optimizing Recommendation Systems Through Reinforcement Learning"</div>
            <p style="margin: 2px 0 0; font-style: italic;">International Conference on Machine Learning (ICML) (2021)</p>
            <p style="margin: 5px 0 0;">Co-authors: R. Williams, S. Patel</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 500;">"A Novel Approach to Computer Vision for Autonomous Navigation in GPS-denied Environments"</div>
            <p style="margin: 2px 0 0; font-style: italic;">IEEE Conference on Computer Vision and Pattern Recognition (CVPR) (2020)</p>
            <p style="margin: 5px 0 0;">Co-authors: A. Rodriguez, T. Wilson</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 500;">"Scalable Cloud Infrastructure for Real-time Data Processing"</div>
            <p style="margin: 2px 0 0; font-style: italic;">IEEE International Conference on Cloud Computing (2019)</p>
            <p style="margin: 5px 0 0;">Co-authors: D. Brown, K. Smith</p>
          </div>
    `
  
    // Combine all sections
    return `
      <div style="padding: 20px;">
        ${summaryHTML}
        ${experienceHTML}
        ${educationHTML}
        ${skillsHTML}
        ${projectsHTML}
        ${publicationsHTML}
        ${awardsHTML}
        ${certificationsHTML}
        ${languagesHTML}
      </div>
    `
  })