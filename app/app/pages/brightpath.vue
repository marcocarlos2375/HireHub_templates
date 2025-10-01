<template>
  <div>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&family=Inter:wght@300;400;600&family=Poppins:wght@300;400;600&family=Roboto:wght@300;400;500&family=Wix+Madefor+Text:wght@300;400;600&family=Gabarito:wght@300;400;600&family=Raleway:wght@300;400;600&family=Manrope:wght@300;400;600&family=DM+Sans:wght@300;400;500&family=Space+Grotesk:wght@300;400;600&family=Plus+Jakarta+Sans:wght@300;400;600&family=Figtree:wght@300;400;600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
    
    <!-- Hidden source content for Paged.js -->
    <div class="resume-content" style="display: none;">
      <!-- Header - Only on first page -->
      <div class="header page-header">
        <div class="decorator"></div>
        <div class="header-info">
          <h1>Carlos Idrissi Saez</h1>
          <p class="job-title">Software Engineer</p>
        </div>
      </div>

      <div class="main two-column-layout">
        <!-- Left Part -->
        <div class="left-part">
          <section class="contact">
            <h2>Contact</h2>
            <table class="contact-table">
              <tbody>
                <tr><td>Phone:</td><td>+33 6 12 34 56 78</td></tr>
                <tr><td>Email:</td><td>carlos.idriss@example.com</td></tr>
                <tr><td>Location:</td><td>Paris, France</td></tr>
                <tr><td>Portfolio:</td><td>www.carlossaez.dev</td></tr>
                <tr><td>LinkedIn:</td><td>linkedin.com/in/carlossaez</td></tr>
              </tbody>
            </table>
          </section>

          <section class="skills">
            <h2>Technical Skills</h2>
            <table class="skills-table">
              <tbody>
                <tr><td>Python</td><td class="level">Expert</td></tr>
                <tr><td>Java</td><td class="level">Expert</td></tr>
                <tr><td>React</td><td class="level">Expert</td></tr>
                <tr><td>Node.js</td><td class="level">Expert</td></tr>
                <tr><td>Docker</td><td class="level">Expert</td></tr>
                <tr><td>JavaScript</td><td class="level">Advanced</td></tr>
                <tr><td>TypeScript</td><td class="level">Advanced</td></tr>
                <tr><td>Vue.js</td><td class="level">Advanced</td></tr>
                <tr><td>AWS</td><td class="level">Advanced</td></tr>
                <tr><td>Kubernetes</td><td class="level">Advanced</td></tr>
              </tbody>
            </table>
          </section>

          <section class="languages">
            <h2>Languages</h2>
            <table class="skills-table">
              <tbody>
                <tr><td>English</td><td class="level">Native</td></tr>
                <tr><td>Spanish</td><td class="level">Fluent</td></tr>
                <tr><td>French</td><td class="level">Intermediate</td></tr>
              </tbody>
            </table>
          </section>

          <section class="certifications">
            <h2>Certifications</h2>
            <div class="cert-list">
              <div class="cert-item">
                <span class="cert-name">AWS Certified Solutions Architect</span>
                <span class="cert-year">2023</span>
              </div>
              <div class="cert-item">
                <span class="cert-name">Google Cloud Professional Developer</span>
                <span class="cert-year">2022</span>
              </div>
              <div class="cert-item">
                <span class="cert-name">Certified Kubernetes Administrator</span>
                <span class="cert-year">2022</span>
              </div>
            </div>
          </section>

          <section class="awards">
            <h2>Awards</h2>
            <div class="award-list">
              <div class="award-item">
                <span class="award-name">Employee of the Year</span>
                <span class="award-org">Google Inc. • 2023</span>
              </div>
              <div class="award-item">
                <span class="award-name">Innovation Award</span>
                <span class="award-org">Microsoft Corporation • 2021</span>
              </div>
            </div>
          </section>

          <section class="references">
            <h2>References</h2>
            <p><strong>Michael Bauer</strong><br>
               TechVision GmbH / CTO<br>
               Phone: +49 30 987654<br>
               Email: michael.bauer@techvision.com</p>
            
            <p><strong>Sarah Chen</strong><br>
               InnovateTech Solutions / Senior Engineering Manager<br>
               Phone: +1 555 123 4567<br>
               Email: sarah.chen@innovatetech.com</p>
          </section>
        </div>

        <!-- Right Part -->
        <div class="right-part">
          <section class="about">
            <h2>Professional Summary</h2>
            <p class="summary-text">Highly skilled and innovative Software Engineer with over 8 years of experience in developing cutting-edge applications and services. Specialized in machine learning, cloud infrastructure, and distributed systems. Proven track record of leading teams to deliver high-quality solutions that drive business growth and improve user experience.</p>
          </section>

          <section class="education">
            <h2>Education</h2>
            <div class="timeline-edu">
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>Master of Science in Computer Science</h3>
                  <p><em>Stanford University</em> — Sep 2020 - Jun 2022</p>
                  <p>Specialized in Artificial Intelligence and Machine Learning. GPA: 3.92/4.0. Research Assistant at Stanford AI Lab. Published 2 papers on deep learning applications.</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>Bachelor of Science in Computer Engineering</h3>
                  <p><em>University of California, Berkeley</em> — Sep 2016 - May 2020</p>
                  <p>Minor in Mathematics. GPA: 3.85/4.0. Dean's List all semesters. Capstone Project: Developed an IoT system for smart energy management.</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>Study Abroad Program</h3>
                  <p><em>ETH Zurich</em> — Jan 2019 - Jun 2019</p>
                  <p>Focus on Advanced Algorithms and Distributed Systems. Completed research project on distributed consensus algorithms.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="experience">
            <h2>Experience</h2>
            <div class="timeline-exp">
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>Senior Software Engineer</h3>
                  <p><em>Google Inc., Mountain View, CA</em> — Jun 2022 - Present</p>
                  <ul>
                    <li>Led the development of a new feature for BigQuery ML that improved model training speed by 40%</li>
                    <li>Collaborated with cross-functional teams to design and implement RESTful APIs for ML model deployment</li>
                    <li>Mentored 5 junior engineers and conducted technical interviews</li>
                    <li>Implemented CI/CD pipelines that reduced deployment time by 60%</li>
                  </ul>
                </div>
              </div>
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>Software Engineer</h3>
                  <p><em>Microsoft Corporation, Seattle, WA</em> — Jul 2020 - May 2022</p>
                  <ul>
                    <li>Built scalable microservices handling 1M+ requests per day</li>
                    <li>Optimized database queries resulting in 50% performance improvement</li>
                    <li>Implemented automated testing frameworks reducing bugs by 30%</li>
                    <li>Collaborated with product managers to define technical requirements</li>
                  </ul>
                </div>
              </div>
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>Software Engineer</h3>
                  <p><em>XYZ Company, Deggendorf</em> — Mar 2025 - Dec 2026</p>
                  <ul>
                    <li>Designed and implemented RESTful APIs and microservices improving feature delivery time by ~30%</li>
                    <li>Developed frontend components and responsive UIs, reducing UI bugs by 25%</li>
                    <li>Built and maintained automated CI/CD pipelines and deployment scripts</li>
                    <li>Optimized database queries and introduced caching strategies, reducing response time by 40%</li>
                    <li>Designed and implemented RESTful APIs and microservices improving feature delivery time by ~30%</li>
                    <li>Developed frontend components and responsive UIs, reducing UI bugs by 25%</li>
                    <li>Built and maintained automated CI/CD pipelines and deployment scripts</li>
                    <li>Optimized database queries and introduced caching strategies, reducing response time by 40%</li>
                  
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section class="projects">
            <h2>Key Projects</h2>
            <div class="timeline-exp">
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>SmartRetail Platform</h3>
                  <p><em>RetailTech AG</em> — Mar 2022 - Present</p>
                  <p><strong>Technologies:</strong> React, Node.js, MongoDB, AWS</p>
                  <ul>
                    <li>Implemented machine learning algorithms for demand forecasting</li>
                    <li>Built real-time dashboard with React and D3.js</li>
                    <li>Achieved 25% improvement in inventory turnover rates</li>
                  </ul>
                </div>
              </div>
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>FinanceTracker Pro</h3>
                  <p><em>FinTech Solutions</em> — Jan 2023 - Dec 2023</p>
                  <p><strong>Technologies:</strong> Vue.js, Python, PostgreSQL, Docker</p>
                  <ul>
                    <li>Developed automated transaction categorization using NLP</li>
                    <li>Built investment portfolio tracking with real-time market data</li>
                    <li>Created mobile-responsive Vue.js frontend with PWA capabilities</li>
                  </ul>
                </div>
              </div>
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>E-Commerce Platform</h3>
                  <p><em>ShopTech Inc.</em> — Jun 2021 - Dec 2021</p>
                  <p><strong>Technologies:</strong> Next.js, Stripe, Redis, Kubernetes</p>
                  <ul>
                    <li>Built scalable e-commerce platform handling 10K+ daily transactions</li>
                    <li>Integrated payment processing with Stripe and PayPal</li>
                    <li>Implemented real-time inventory management system</li>
                  </ul>
                </div>
              </div>
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>AI Chatbot System</h3>
                  <p><em>ChatAI Solutions</em> — Jan 2020 - May 2020</p>
                  <p><strong>Technologies:</strong> Python, TensorFlow, FastAPI, WebSocket</p>
                  <ul>
                    <li>Developed NLP-based chatbot with 95% accuracy</li>
                    <li>Integrated with multiple messaging platforms</li>
                    <li>Reduced customer support workload by 40%</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section class="publications">
            <h2>Publications & Articles</h2>
            <div class="timeline-exp">
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>Machine Learning in Production Systems</h3>
                  <p><em>IEEE Conference on AI</em> — 2023</p>
                  <p>Co-authored paper on deploying ML models at scale with focus on performance optimization and monitoring.</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>Microservices Architecture Best Practices</h3>
                  <p><em>Tech Blog</em> — 2022</p>
                  <p>Published comprehensive guide on building resilient microservices with real-world examples.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="volunteer">
            <h2>Volunteer Experience</h2>
            <div class="timeline-exp">
              <div class="timeline-item">
                <div class="dot yellow"></div>
                <div class="content">
                  <h3>Coding Mentor</h3>
                  <p><em>Code for Good</em> — 2021 - Present</p>
                  <p>Mentoring underprivileged students in programming and software development.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Simple continuous display - browser handles pagination on print -->
    <div class="paged-container"></div>

    <!-- Control Panel -->
    <div class="control-panel">
      <h3>🎨 Customize Template</h3>
      
      <div class="control-group">
        <label for="font-selector">Font Family:</label>
        <select id="font-selector" v-model="selectedFont" @change="applyFont">
          <option value="'Josefin Sans', sans-serif">Josefin Sans (Default)</option>
          <option value="'Inter', sans-serif">Inter</option>
          <option value="'Poppins', sans-serif">Poppins</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Wix Madefor Text', sans-serif">Wix Madefor Text</option>
          <option value="'Gabarito', sans-serif">Gabarito</option>
          <option value="'Raleway', sans-serif">Raleway</option>
          <option value="'Manrope', sans-serif">Manrope</option>
          <option value="'DM Sans', sans-serif">DM Sans</option>
          <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
          <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
          <option value="'Figtree', sans-serif">Figtree</option>
          <option value="'Lato', sans-serif">Lato</option>
        </select>
      </div>

      <div class="control-group">
        <label for="color-scheme">Color Scheme:</label>
        <select id="color-scheme" v-model="selectedScheme" @change="applyColorScheme">
          <option value="yellow">Yellow (Default)</option>
          <option value="blue">Professional Blue</option>
          <option value="green">Nature Green</option>
          <option value="purple">Creative Purple</option>
          <option value="red">Dynamic Red</option>
          <option value="teal">Fresh Teal</option>
          <option value="orange">Energetic Orange</option>
        </select>
      </div>

      <div class="control-group">
        <button id="reset-btn" @click="resetToDefault">Reset to Default</button>
        <button id="print-btn" @click="printResume">Print Resume</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const selectedFont = ref("'Josefin Sans', sans-serif")
const selectedScheme = ref('yellow')

const colorSchemes = {
  yellow: {
    primary: '#e6b800',
    secondary: '#f8f4e6',
    background: '#f9f9f9',
    text: '#2c2c2c',
    lightText: '#555',
    border: '#ddd'
  },
  blue: {
    primary: '#2196f3',
    secondary: '#e3f2fd',
    background: '#f5f5f5',
    text: '#1565c0',
    lightText: '#424242',
    border: '#90caf9'
  },
  green: {
    primary: '#4caf50',
    secondary: '#e8f5e8',
    background: '#f1f8e9',
    text: '#2e7d32',
    lightText: '#424242',
    border: '#a5d6a7'
  },
  purple: {
    primary: '#9c27b0',
    secondary: '#f3e5f5',
    background: '#fce4ec',
    text: '#7b1fa2',
    lightText: '#424242',
    border: '#ce93d8'
  },
  red: {
    primary: '#f44336',
    secondary: '#ffebee',
    background: '#fafafa',
    text: '#c62828',
    lightText: '#424242',
    border: '#ef9a9a'
  },
  teal: {
    primary: '#009688',
    secondary: '#e0f2f1',
    background: '#f0fdfc',
    text: '#00695c',
    lightText: '#424242',
    border: '#80cbc4'
  },
  orange: {
    primary: '#ff9800',
    secondary: '#fff3e0',
    background: '#fff8f5',
    text: '#e65100',
    lightText: '#424242',
    border: '#ffcc02'
  }
}

const applyFont = () => {
  if (process.client) {
    document.body.style.fontFamily = selectedFont.value
    // Apply to paged content
    const pagedContent = document.querySelector('.paged-container')
    if (pagedContent) {
      pagedContent.style.fontFamily = selectedFont.value
    }
  }
}

const applyColorScheme = () => {
  if (process.client) {
    const colors = colorSchemes[selectedScheme.value]
    
    // Apply to both source and paged content
    const containers = ['.resume-content', '.paged-container']
    containers.forEach(selector => {
      const container = document.querySelector(selector)
      if (!container) return
      
      const decorator = container.querySelector('.decorator')
      if (decorator) decorator.style.backgroundColor = colors.primary
      
      container.querySelectorAll('.dot.yellow').forEach(el => {
        el.style.backgroundColor = colors.primary
      })
      
      container.querySelectorAll('.cert-year').forEach(el => {
        el.style.backgroundColor = colors.secondary
        el.style.color = colors.text
      })
      
      container.querySelectorAll('h1, h2, h3').forEach(el => {
        el.style.color = colors.text
      })
    })
    
    document.body.style.backgroundColor = colors.background
  }
}

const resetToDefault = () => {
  selectedFont.value = "'Josefin Sans', sans-serif"
  selectedScheme.value = 'yellow'
  applyFont()
  applyColorScheme()
}

const printResume = () => {
  if (process.client) {
    const controlPanel = document.querySelector('.control-panel')
    if (controlPanel) controlPanel.style.display = 'none'
    window.print()
    if (controlPanel) controlPanel.style.display = 'block'
  }
}

const initPaged = () => {
  if (!process.client) return
  
  const content = document.querySelector('.resume-content')
  const container = document.querySelector('.paged-container')
  
  if (!content || !container) return
  
  console.log('📄 Starting simple A4 pagination...')
  
  // Clear container
  container.innerHTML = ''
  
  // Create first page
  const page1 = document.createElement('div')
  page1.className = 'a4-page'
  page1.setAttribute('data-page', '1')
  page1.innerHTML = content.innerHTML
  container.appendChild(page1)
  
  // Wait for render then check overflow
  setTimeout(() => {
    checkAndCreatePages()
    applyFont()
    applyColorScheme()
  }, 100)
}

const checkAndCreatePages = () => {
  const container = document.querySelector('.paged-container')
  if (!container) return
  
  const A4_HEIGHT = 1123 // 297mm in pixels
  const SAFE_SPACE = 50 // Safety margin in pixels
  const SAFE_HEIGHT = A4_HEIGHT - SAFE_SPACE
  
  console.log(`\n🔍 Checking A4 page...`)
  console.log(`   A4 Height: ${A4_HEIGHT}px`)
  console.log(`   Safe Space: ${SAFE_SPACE}px`)
  console.log(`   Safe Height: ${SAFE_HEIGHT}px`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  
  const page = container.querySelector('.a4-page')
  if (!page) return
  
  const pageHeight = page.scrollHeight
  const isOverflowing = pageHeight > SAFE_HEIGHT
  
  console.log(`📄 Page 1:`)
  console.log(`   Content Height: ${pageHeight}px`)
  
  if (isOverflowing) {
    const overflow = pageHeight - SAFE_HEIGHT
    console.log(`   ⚠️ OVERFLOW: ${overflow}px beyond safe zone`)
    console.log(`   Content will be cut at ${SAFE_HEIGHT}px`)
    
    // Add badge
    if (!page.querySelector('.overflow-badge')) {
      const badge = document.createElement('div')
      badge.className = 'overflow-badge'
      badge.textContent = `⚠️ ${overflow}px hidden`
      page.appendChild(badge)
    }
  } else {
    const remaining = SAFE_HEIGHT - pageHeight
    console.log(`   ✅ OK - ${remaining}px remaining in safe zone`)
  }
  
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
}

onMounted(() => {
  if (process.client) {
    initPaged()
  }
})
</script>

<style>
/* Paged.js CSS Paged Media Rules */
@page {
  size: A4;
  margin: 0;
}

@page :first {
  margin: 0;
}

/* Header only on first page */
.page-header {
  width: 100%;
  clear: both;
  margin-bottom: 20px;
}

/* Two column layout using CSS Grid - stays together */
.two-column-layout {
  display: grid;
  grid-template-columns: 30% 1fr;
  gap: 20px;
  width: 100%;
  break-inside: avoid;
  page-break-inside: avoid;
}

/* Left and right parts */
.left-part {
  grid-column: 1;
  padding-right: 10px;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
}

.right-part {
  grid-column: 2;
  padding-left: 10px;
  box-sizing: border-box;
}

/* Allow sections to break if needed */
section {
  break-inside: auto;
  page-break-inside: auto;
  margin-bottom: 15px;
}

.timeline-item {
  break-inside: auto;
  page-break-inside: auto;
  margin-bottom: 15px;
}

/* Keep the grid together */
.main.two-column-layout {
  break-inside: auto;
  page-break-inside: auto;
}

/* Page break utilities */
.page-break {
  break-after: page;
  page-break-after: always;
}

/* Force grid to continue on new pages */
@media print {
  .two-column-layout {
    display: grid !important;
  }
}

body {
  font-family: 'Josefin Sans', sans-serif;
  background: #f4f4f4;
  padding: 20px;
  color: #333;
}

/* Paged container */
.paged-container {
  margin: 20px auto;
  max-width: 210mm;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 20px;
}

/* Each A4 page */
.paged-container :deep(.a4-page) {
  width: 210mm;
  height: 297mm; /* Fixed A4 height */
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 20px 25px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden; /* This cuts the content */
}

/* Debug: Show safe height limit */
.paged-container :deep(.a4-page)::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: calc(297mm - 50px); /* Safe height line */
  height: 2px;
  background: #e74c3c;
  z-index: 999;
  pointer-events: none;
}

/* Force height limit on all content inside */
.paged-container :deep(.a4-page .header),
.paged-container :deep(.a4-page .main) {
  max-height: calc(297mm - 40px - 50px); /* A4 height - padding - safe space = 1073px */
}

.paged-container :deep(.a4-page .main) {
  overflow: hidden;
}

/* Overflow badges */
.paged-container :deep(.overflow-badge) {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.paged-container :deep(.overflow-badge.hard) {
  background: #e74c3c; /* Red for hard overflow */
  animation: pulse 1.5s infinite;
}

.paged-container :deep(.overflow-badge.soft) {
  background: #f39c12; /* Orange for soft overflow */
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Print styles */
@media print {
  body {
    background: white;
  }
  
  .paged-container {
    margin: 0;
    gap: 0;
  }
  
  .paged-container :deep(.a4-page) {
    box-shadow: none;
    margin: 0;
    page-break-after: always;
  }
  
  @page {
    size: A4;
    margin: 0;
  }
}

/* Resume content container - hidden source */
.resume-content {
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  border: 1px solid #ddd;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
  clear: both;
}

.decorator {
  background: #e6b800;
  padding: 20px;
  border-radius: 10px;
}

.header-info h1 {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
}

.job-title {
  font-size: 14px;
  text-transform: uppercase;
  color: #666;
  margin-top: 4px;
}

/* Additional spacing */
section {
  margin-bottom: 20px;
}

h2 {
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  padding-bottom: 4px;
  text-transform: uppercase;
}

/* CONTACT TABLE SPECIFIC */
.contact-table td:last-child {
  word-break: break-all;
}

/* REFERENCES SECTION */
.references p {
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 12px;
  color: #555;
}

.references p strong {
  color: #333;
  font-weight: 600;
  font-size: 13px;
}

/* PROFESSIONAL SUMMARY */
.summary-text {
  font-size: 13px;
  line-height: 1.5;
  color: #555;
  margin: 0;
}

/* Timeline common */
.timeline-edu, .timeline-exp {
  border-left: 2px solid #ccc;
  padding-left: 20px;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-item .dot {
  width: 12px;
  height: 12px;
  background: #333;
  border-radius: 50%;
  position: absolute;
  left: -27px;
  top: 0px;
}

.timeline-item .dot.yellow {
  background: #e6b800;
}

.timeline-item .content h3 {
  margin: 0;
  font-size: 15px;
  font-weight: bold;
}

.timeline-item .content p {
  margin: 3px 0;
  font-size: 13px;
  color: #555;
}

.timeline-item .content ul {
  margin: 8px 0;
  padding-left: 20px;
}

.timeline-item .content ul li {
  font-size: 13px;
  margin-bottom: 4px;
  color: #555;
}

/* UNIFORM TABLE STYLES */
.skills-table, .contact-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.skills-table td, .contact-table td {
  padding: 3px 0;
  font-size: 12px;
  border: none;
  vertical-align: top;
}

.skills-table td:first-child, .contact-table td:first-child {
  color: #333;
  font-weight: 500;
  width: 35%;
}

.skills-table td:last-child, .contact-table td:last-child {
  color: #555;
}

.skills-table td.level {
  text-align: right;
}

/* CERTIFICATIONS */
.cert-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.cert-name {
  color: #333;
}

.cert-year {
  color: #333;
  font-size: 12px;
  background: #f8f4e6;
  padding: 2px 6px;
  border-radius: 3px;
}

/* AWARDS */
.award-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.award-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.award-name {
  font-size: 13px;
  font-weight: bold;
  color: #333;
}

.award-org {
  font-size: 12px;
  color: #666;
}

/* CONTROL PANEL */
.control-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  min-width: 250px;
  font-family: 'Inter', sans-serif;
}

.control-panel h3 {
  margin: 0 0 15px;
  font-size: 16px;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 500;
  color: #555;
}

.control-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 13px;
  background: white;
  color: #333;
}

.control-group select:focus {
  outline: none;
  border-color: #e6b800;
  box-shadow: 0 0 0 2px rgba(230, 184, 0, 0.2);
}

.control-group button {
  width: 48%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

#reset-btn {
  background: #f8f9fa;
  color: #666;
  margin-right: 4%;
}

#reset-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

#print-btn {
  background: #e6b800;
  color: white;
  border-color: #e6b800;
}

#print-btn:hover {
  background: #cc9900;
  border-color: #cc9900;
}

/* Hide control panel when printing */
@media print {
  .control-panel {
    display: none !important;
  }
}

/* Mobile responsiveness for control panel */
@media (max-width: 768px) {
  .control-panel {
    position: relative;
    top: auto;
    right: auto;
    margin: 20px auto;
    width: 90%;
    max-width: 300px;
  }
}
</style>
