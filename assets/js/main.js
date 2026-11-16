/* ═══════════════════════════════════════
   EDGEMARK — JavaScript
   Navigation · Animations · Counters
   Project Filter · Form Handler
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL EFFECT ─────────────── */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // Navbar background
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Back to top button
    if (y > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
    // Active nav link on scroll
    updateActiveNavLink();
  });

  /* ── BACK TO TOP ───────────────────────── */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── MOBILE NAV HAMBURGER ──────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    });
  });

  /* ── ACTIVE NAV LINK ON SCROLL ─────────── */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  /* ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        window.scrollTo({
          top: target.offsetTop - navH,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── HERO SLIDER (LIFE ON-SITE CONSTRUCTION) ────────────────── */
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 5500);
  }

  /* ── SCROLL-TRIGGERED ANIMATIONS (AOS-like) */
  const animatedEls = document.querySelectorAll('[data-aos]');
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-aos-delay') || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  animatedEls.forEach(el => aosObserver.observe(el));

  // Trigger immediately for any elements already in viewport on load
  setTimeout(() => {
    animatedEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
        setTimeout(() => el.classList.add('aos-animate'), delay);
      }
    });
  }, 100);

  /* ── ANIMATED STAT COUNTERS ─────────────── */
  const counters = document.querySelectorAll(".stat-number[data-target]");
  let countersStarted = false;

  function runCounters() {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"));
      animateCounter(counter, 0, target, 1800);
    });
  }

  setTimeout(runCounters, 250);

  const heroSection = document.getElementById("home");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) runCounters();
    });
  }, { threshold: 0.15 });

  if (heroSection) counterObserver.observe(heroSection);

  function animateCounter(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + range * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── PROJECT FILTER ─────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── CONTACT FORM ───────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      // Simulate sending (replace with real backend/EmailJS when ready)
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Message Sent!';
        btn.style.background = '#28a745';
        contactForm.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 4000);
      }, 1800);
    });
  }

  /* ── MARQUEE PAUSE ON HOVER ─────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ── NAVBAR ALWAYS SCROLLED ON LOAD ─────── */
  if (window.scrollY > 60) navbar.classList.add('scrolled');

  /* ── FADE-IN KEYFRAME ───────────────────── */
  const style = document.createElement('style');
  style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }`;
  document.head.appendChild(style);

  /* -- CYBER MATRIX / BINARY / CODE GRAPHICS -- */
  function startAllMatrixCanvases() {
    initMatrixAnimation('service-matrix-canvas', { speed: 2.2, density: 13, cyanAccent: true });
    initMatrixAnimation('spec-matrix-canvas', { speed: 2.4, density: 12, cyanAccent: true });
    initMatrixAnimation('proj-matrix-canvas-3', { speed: 2.2, density: 12, cyanAccent: true });
  }

  startAllMatrixCanvases();
  window.addEventListener('load', startAllMatrixCanvases);

  function initMatrixAnimation(canvasId, options) {
    options = options || {};
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var width = 0, height = 0, columns = 0, drops = [], speeds = [];
    var chars = '011001010111001010101011010010101XYZkN/m�ETABS.SapModel.SetFrameLoad()def_calc_rebar()=>0x4F8A;101010'.split('');
    var fontSize = options.density || 12;

    function resize() {
      var parent = canvas.parentElement;
      width = canvas.width = parent ? (parent.offsetWidth || 340) : 340;
      height = canvas.height = parent ? (parent.offsetHeight || 380) : 380;
      columns = Math.max(1, Math.floor(width / fontSize));
      drops = [];
      speeds = [];
      for (var i = 0; i < columns; i++) {
        drops[i] = Math.random() * -35;
        speeds[i] = (options.speed || 2.0) * (0.8 + Math.random() * 0.8);
      }
    }

    resize();
    setTimeout(resize, 250);
    setTimeout(resize, 1000);
    window.addEventListener('resize', debounce(resize, 150));

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) resize();
        });
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    var lastTime = 0;
    var targetFps = 50;
    var interval = 1000 / targetFps;

    function draw(currentTime) {
      requestAnimationFrame(draw);
      if (currentTime - lastTime < interval) return;
      lastTime = currentTime;

      if (width === 0 || height === 0) {
        resize();
        return;
      }

      ctx.fillStyle = 'rgba(7, 14, 25, 0.16)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = fontSize + 'px "Fira Code", "Consolas", monospace';

      for (var i = 0; i < drops.length; i++) {
        var text = chars[Math.floor(Math.random() * chars.length)];
        var x = i * fontSize;
        var y = drops[i] * fontSize;

        if (Math.random() > 0.8) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#00f7ff';
        } else {
          ctx.fillStyle = options.cyanAccent ? '#00e5ff' : '#ff7a29';
          ctx.shadowBlur = 6;
          ctx.shadowColor = options.cyanAccent ? '#0099cc' : '#ff4400';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.94) {
          drops[i] = 0;
        }
        drops[i] += speeds[i];
      }
    }

    requestAnimationFrame(draw);
  }

  function debounce(fn, ms) {
    var timer;
    return function() {
      var args = arguments;
      var context = this;
      clearTimeout(timer);
      timer = setTimeout(function() { fn.apply(context, args); }, ms);
    };
  }


  /* ── PROJECT CASE STUDY MODAL REPOSITORY ────── */
  const projectDatabase = {
    'tower-49': {
      title: '49-Storey (200m) Residential High-Rise Skyscraper',
      location: 'Eko Atlantic City, Lagos, Nigeria',
      tag: 'Landmark Supertall',
      image: 'assets/images/projects/tower-49-render.png',
      specs: [
        { label: 'Height / Floors', val: '200m / 49 Storeys' },
        { label: 'Primary Lateral System', val: 'Core-Wall + Frame' },
        { label: 'Floor System', val: 'Post-Tensioned (PT)' }
      ],
      desc: 'Projected to stand as the tallest residential tower in Africa. The structural design demanded extensive core-wall shear modeling in CSI ETABS, validated against specialized boundary-layer wind tunnel aerodynamic testing data to calibrate lateral force coefficients and mitigate wind-induced dynamic accelerations.',
      highlights: [
        'Integrated experimental wind tunnel data with numerical ETABS models to verify base overturning shear.',
        'Engineered suspended luxury swimming pool with dynamic water sloshing checks and hydrostatic pressure.',
        'Implemented thin Post-Tensioned flat slabs allowing expansive column-free living layouts, optimized self-weight, and minimal deflection.',
        'Conducted second-order P-Delta, modal mass participation (>90%), and deep pile-raft settlement checks.'
      ],
      tech: ['CSI ETABS', 'Boundary Wind Tunnel', 'PT Flat Slabs', 'Pile-Raft', 'Eurocode 2', 'BS 6399']
    },
    'bourdillon': {
      title: '16-Storey Residential Tower with PT Floors',
      location: 'Bourdillon Road, Ikoyi, Lagos',
      tag: 'Luxury Highrise & Deep Piles',
      image: 'assets/images/projects/bourdillon-etabs-1.png',
      extraImages: ['assets/images/projects/bourdillon-render.png', 'assets/images/projects/bourdillon-etabs-2.png'],
      specs: [
        { label: 'Height / Floors', val: '16 Storeys' },
        { label: 'Floor Type', val: 'Post-Tensioned (PT)' },
        { label: 'Foundation', val: 'Deep Bored Piles' }
      ],
      desc: 'High-end multi-storey residential development in prestigious Ikoyi. Engineered using CSI ETABS for full 3D superstructure frame and deep pile foundation analysis, coupled with CSI SAFE for long-span post-tensioned tendon profiling, deflection control, and punching shear resistance.',
      highlights: [
        'Integrated 3D structural model showing full superstructure connected with bored pile foundations and pile caps.',
        'Custom tendon layout profiles optimizing tendon drape and pre-compression across critical column strips.',
        'Stringent inter-storey drift limits verified to international serviceability criteria.',
        'Column load reaction consolidation feeding directly into foundation pile-cap layouts.'
      ],
      tech: ['CSI ETABS 3D Model', 'Deep Piled Foundation', 'Post-Tensioned Concrete', 'CSI SAFE', 'Ikoyi Luxury']
    },
    'midrise-vi': {
      title: 'Mid-Rise Mixed-Use Commercial Complex',
      location: 'Victoria Island, Lagos',
      tag: 'Commercial & Mixed-Use',
      image: 'assets/images/projects/midrise-vi-render.png',
      specs: [
        { label: 'Structure Type', val: 'Dual Core RC Frame' },
        { label: 'Use Category', val: 'Retail & Corporate Office' },
        { label: 'Foundation', val: 'Cast-in-Situ Piles' }
      ],
      desc: 'Robust commercial facility in urban Victoria Island featuring generous open floorplates and high vertical clearance. Structural grid coordinated closely with architectural and mechanical disciplines to optimize structural depths.',
      highlights: [
        'Dual shear wall cores strategically positioned to balance building center of mass and center of rigidity.',
        'High-strength concrete grade specification for vertical elements to minimize column cross-sections.',
        'Automated rebar quantity schedules and constructability reviews conducted prior to site mobilization.'
      ],
      tech: ['ETABS', 'AutoCAD', 'RC Frame', 'Dual Core', 'Victoria Island']
    },
    'luxury-villa': {
      title: 'Multi-Level Luxury Villa with Spiral Core & Pool',
      location: 'Lekki Peninsula, Lagos, Nigeria',
      tag: 'Bespoke Luxury',
      image: 'assets/images/projects/villa-render.png',
      specs: [
        { label: 'Special Features', val: 'Cantilever Spiral Stairs' },
        { label: 'Water Assets', val: 'Cast-in-Place Pool' },
        { label: 'Parking', val: 'Basement Sloped Ramp' }
      ],
      desc: 'Architecturally sophisticated multi-level private estate featuring challenging geometric irregularities: a spiral staircase core with torsional moments, a sloped vehicular ramp thrust transfer into basement retaining walls, and an elevated swimming pool.',
      highlights: [
        'Detailed CSI SAFE punching shear reinforcement design for slab-column interfaces without drop panels.',
        'Spiral stair detailing ensuring fixed torsional restraint at upper and lower landing diaphragms.',
        'Sloped ramp modeled to ensure seamless lateral shear transfer into main basement frame.'
      ],
      tech: ['CSI ETABS', 'CSI SAFE', 'Spiral Core Detailing', 'Hydrostatic Retaining', 'Lekki']
    },
    'olympic-pool': {
      title: '6m Deep Olympic-Size Swimming Pool & Hydraulic Retaining',
      location: 'National Sports Complex Parcel, Nigeria',
      tag: 'Hydraulic & Water-Retaining RC',
      image: 'assets/images/projects/olympic-pool-fea.png',
      extraImages: ['assets/images/projects/olympic-pool-section.png', 'assets/images/projects/olympic-pool-loads.png'],
      specs: [
        { label: 'Pool Depth', val: '6.0 Metres' },
        { label: 'Load Cases Analyzed', val: '16 Combinations' },
        { label: 'Engineering Standard', val: 'BS 8007 Liquid Retaining' }
      ],
      desc: 'Specialized deep hydraulic engineering. Designed to resist extreme differential lateral pressures including full hydrostatic water head with dry external backfill, empty pool with saturated high water-table soil pressure, and temporary construction stages.',
      highlights: [
        'Rigorous 3D Finite Element Analysis (FEA) shell modeling capturing base slab moments, wall shear, and corner stress concentrations.',
        'Architectural and structural cross-section coordination detailing deep cantilever retaining walls with stepped wall thickness.',
        '16 independent loading combinations evaluated for ultimate limit state (ULS) and serviceability limit state (SLS).',
        'Strict crack width limitation (<0.2mm) verified under flexural and direct thermal tension forces per BS 8007.',
        'Heavy cantilever base-slab moment connections detailed to withstand hydrostatic uplift floatation.'
      ],
      tech: ['FEA Shell Modeling', 'BS 8007', '16 Load Cases', 'Hydrostatic Head', 'Crack Width Limit']
    },
    'hotel-x': {
      title: 'Hotel X Mixed-Use Complex & Ballroom',
      location: 'Uyo, Akwa Ibom State, Nigeria',
      tag: 'Hospitality & Deep Piles',
      image: 'assets/images/projects/hotel-x-render.png',
      specs: [
        { label: 'Occupancy', val: 'Hotel & Conference Center' },
        { label: 'Foundation', val: 'Bored Piles & Caps' },
        { label: 'Spans', val: 'Heavy Transfer Beams' }
      ],
      desc: 'Prominent hospitality facility in Uyo accommodating expansive column-free banquet halls beneath multi-floor guest suites. High-capacity transfer girders were designed to support discontinuous columns above.',
      highlights: [
        'Geotechnical pile capacity calculations verifying skin friction and end-bearing in coastal sandy clays.',
        'Deep pile caps designed using strut-and-tie models for non-flexural shear regions.',
        'Staged transfer girder deflection analysis avoiding serviceability distress in upper hotel rooms.'
      ],
      tech: ['Bored Piles', 'Strut-and-Tie', 'Transfer Girders', 'ETABS', 'Akwa Ibom']
    },
    'link-bridge': {
      title: '18m Span Heavy Vehicular Link Bridge',
      location: 'Coastal Infrastructure Route, Nigeria',
      tag: 'Bridges & Infrastructure',
      image: 'assets/images/projects/link-bridge-model.png',
      specs: [
        { label: 'Clear Span', val: '18.0 Metres' },
        { label: 'Deck Type', val: 'Composite RC Deck' },
        { label: 'Substructure', val: 'Abutment Pile Groups' }
      ],
      desc: 'Complete engineering design and fabrication detailing for an 18m span bridge facilitating critical access across a waterways corridor. Engineered in Tekla Structures and CSI ETABS under heavy vehicular traffic loading.',
      highlights: [
        'Designed composite steel/RC deck system resisting heavy axle point loads and braking thrusts.',
        'Detailed reinforced concrete pile caps and bridge abutments with expansion joint seats.',
        'Delivered complete bar bending schedules and 3D Tekla structural shop drawings for steel fabrication.'
      ],
      tech: ['Tekla Structures', 'ETABS', 'Bridge Abutments', 'Deep Piles', 'Vehicular Loading']
    },
    'steel-canopies': {
      title: 'Heavy Commercial Steel Canopies (Lekki & Kano)',
      location: 'Lekki, Lagos & Kano State',
      tag: 'Commercial Steel Framing',
      image: 'assets/images/projects/canopy-lekki.png',
      specs: [
        { label: 'Structure', val: 'Cantilever Steel Frames' },
        { label: 'Wind Standard', val: 'BS 6399 Part 2' },
        { label: 'Connections', val: 'Moment Baseplates' }
      ],
      desc: 'High-wind resistant commercial canopies constructed in contrasting climatic zones: severe Atlantic squall winds in Lekki and open gust conditions in Kano. Focused on uplift stability and base moment connections.',
      highlights: [
        'Wind suction reversal calculations preventing uplift and local web buckling in cantilever rafters.',
        'High-capacity holding-down bolt anchorages embedded in reinforced concrete pad footings.',
        'Standardized modular connection details expediting fabrication and site bolt assembly.'
      ],
      tech: ['Structural Steel', 'Wind Uplift', 'Moment Baseplates', 'Tekla', 'Lekki & Kano']
    },
    'portal-warehouses': {
      title: 'Structural Integrity Appraisal & Non-Destructive Testing (NDT)',
      location: 'Ilupeju Industrial Area, Lagos & Kano State',
      tag: 'Forensic Audit & NDT Testing',
      image: 'assets/images/ndt-hammer-test-1.png',
      extraImages: ['assets/images/ndt-crack-inspection.png', 'assets/images/projects/steel-portal-frame.png', 'assets/images/projects/warehouse-inspection.png'],
      specs: [
        { label: 'NDT Methods', val: 'Rebound Hammer & Crack Survey' },
        { label: 'Defect Scope', val: 'Structural Cracks & Deflection' },
        { label: 'Facility Type', val: 'Operational Industrial Logistics' }
      ],
      desc: 'Comprehensive forensic structural integrity appraisal of distressed operational warehouse facilities. Includes on-site Non-Destructive Testing (NDT) with Schmidt hammer hardness rebound, photographic crack pattern mapping, long-span floor vibration evaluations, and remedial strengthening recommendations.',
      highlights: [
        'On-site Non-Destructive Testing (NDT) quantifying compressive strength of existing structural concrete members.',
        'Crack classification and mapping identifying active shear and flexural stress patterns across beams and columns.',
        'Vibration and resonance evaluation of long-span floor slabs under dynamic moving loads.',
        'Engineered remedial retrofitting and carbon-fiber/steel jacket strengthening schemes extending operational service life.'
      ],
      tech: ['NDT Rebound Hammer', 'Crack Diagnostics', 'Vibration Analysis', 'Forensic Audit', 'Structural Retrofit']
    },
    'autostruct-suite': {
      title: 'AutoStruct — Computational ETABS Automation Suite',
      location: 'EDGEMARK AutoStruct Solutions',
      tag: 'AEC Software & COM API',
      image: 'assets/images/app-wind-dynamics-gui.png',
      extraImages: ['assets/images/projects/midrise-vi-model.png'],
      specs: [
        { label: 'Language', val: 'Python / Tkinter GUI' },
        { label: 'API Target', val: 'CSI ETABS OAPI' },
        { label: 'Specialization', val: 'Wind Dynamics (BS 6399 & NBC)' }
      ],
      desc: 'EDGEMARK AutoStruct Solutions signature desktop software. An automated engineering suite communicating directly with ETABS via COM API, generating building geometry, grouping shear wall piers, extracting modal frequencies, and calculating wind pressure gradients with full graphical interface.',
      highlights: [
        'Universal COM API return parser solving version-specific return bugs in ETABS.',
        'Automated generation of code-compliant wind pressure profiles per BS 6399 and NBC 2005.',
        'Instant multi-run extraction saving up to 80% of engineer modeling time.'
      ],
      tech: ['Python Desktop App', 'ETABS OAPI', 'Tkinter UI', 'Wind Dynamics Engine', 'AEC Software']
    },
    'rebar-detailing': {
      title: 'Automated Reinforcement Detailing & Revit Extension',
      location: 'EDGEMARK AutoStruct Solutions',
      tag: 'Revit Automation & RC Scheduling',
      image: 'assets/images/app-rebar-revit-gui.png',
      extraImages: ['assets/images/pt-tendon-stressing-1.jpg', 'assets/images/pt-site-rebar.jpg'],
      specs: [
        { label: 'Platform', val: 'Autodesk Revit & Python' },
        { label: 'RC Standard', val: 'BS 8110 & Eurocode 2' },
        { label: 'Output', val: 'Parametric 3D Rebar & BBS' }
      ],
      desc: 'Proprietary Revit automation extension and Python detailing engine. Converts finite-element design moments and shear demands into code-compliant rebar placement, lap curtailments, 3D parametric rebar models in Revit, and bar bending schedules.',
      highlights: [
        'Automates 2D/3D reinforcement layout, section annotations, and bar tags directly inside Autodesk Revit.',
        'Optimizes bar curtailment lengths to minimize scrap waste from commercial 12m stock.',
        'Seamless integration with Rebar Visualization Tool and automated calculation sheets.'
      ],
      tech: ['Autodesk Revit API', 'Python Engine', 'Rebar Visualization Tool', 'BBS Generation']
    },
      tag: 'Rebar Pro Algorithms',
      image: 'assets/images/projects/4storey-rc-model.png',
      specs: [
        { label: 'Core Function', val: 'Rebar Bar Bending Schedules' },
        { label: 'Input Source', val: 'FEA Moment/Shear Envelopes' },
        { label: 'Output', val: 'AutoCAD DXF & Excel Schedules' }
      ],
      desc: 'Algorithmic reinforcement detailing engine that bridges finite element analysis output and production fabrication drawings. Converts raw moment envelopes directly into code-compliant bar arrangements, curtailment cut-offs, and BBS sheets.',
      highlights: [
        'Automated lap length and anchorage curtailment calculation per BS 8110 and Eurocode 2.',
        'Minimizes steel wastage by optimizing bar cutting lengths from standard 12m commercial rebar stock.',
        'Significantly reduces detailing drafting hours while preventing fabrication transcription errors.'
      ],
      tech: ['Python', 'RC Design Algorithms', 'Excel Rebar Pro', 'AutoCAD DXF', 'BBS Automation']
    },
    'safe-automation': {
      title: 'CSI SAFE Foundation Load Bridge Importer',
      location: 'EDGEMARK Internal & AEC Industry',
      tag: 'Foundation Data Bridge',
      image: 'assets/images/projects/hotel-x-model.png',
      specs: [
        { label: 'Automation Bridge', val: 'ETABS Reactions -> SAFE' },
        { label: 'Load Cases Handled', val: 'All Gravity, Lateral & Combos' },
        { label: 'Error Rate', val: 'Zero Transcription Faults' }
      ],
      desc: 'Seamless computational pipeline that automatically harvests reaction vectors (Fz, Fx, Fy, Mx, My, Mz) across all load combinations from ETABS support nodes and programmatically generates support points and loads inside CSI SAFE.',
      highlights: [
        'Eliminates manual entry of hundreds of column base loads for multi-storey foundation designs.',
        'Auto-verifies equilibrium between ETABS base shears and SAFE foundation applied loads.',
        'Accelerates pile-cap and raft footing design turnaround from days to minutes.'
      ],
      tech: ['Python', 'CSI SAFE API', 'ETABS OAPI', 'Foundation Engineering', 'Workflow Automation']
    }
  };

  // Global functions for modal access
  window.openProjectModal = function(projectId) {
    const data = projectDatabase[projectId];
    if (!data) return;

    const modal = document.getElementById('project-modal');
    const heroImg = document.getElementById('modal-hero-image');
    const tag = document.getElementById('modal-tag');
    const title = document.getElementById('modal-title');
    const loc = document.getElementById('modal-loc').querySelector('span');
    const specsContainer = document.getElementById('modal-specs');
    const desc = document.getElementById('modal-desc');
    const highlightsList = document.getElementById('modal-highlights-list');
    const techContainer = document.getElementById('modal-tech');

    heroImg.src = data.image;
    heroImg.alt = data.title;
    tag.textContent = data.tag;
    title.textContent = data.title;
    loc.textContent = data.location;
    desc.textContent = data.desc;

    // Handle multi-image gallery thumbnails if available
    const galleryStrip = document.getElementById('modal-gallery-strip');
    if (galleryStrip) {
      if (data.extraImages && data.extraImages.length > 0) {
        const allImgs = [data.image, ...data.extraImages];
        galleryStrip.innerHTML = allImgs.map((imgUrl, idx) => `
          <button type="button" class="modal-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="document.getElementById('modal-hero-image').src='${imgUrl}'; document.querySelectorAll('.modal-thumb-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');">
            <img src="${imgUrl}" alt="Thumbnail ${idx + 1}" />
          </button>
        `).join('');
        galleryStrip.style.display = 'flex';
      } else {
        galleryStrip.style.display = 'none';
        galleryStrip.innerHTML = '';
      }
    }

    // Populate specs
    specsContainer.innerHTML = data.specs.map(s => `
      <div class="modal-spec-card">
        <span>${s.label}</span>
        <strong>${s.val}</strong>
      </div>
    `).join('');

    // Populate highlights
    highlightsList.innerHTML = data.highlights.map(h => `
      <li><i class="fa-solid fa-check-circle"></i> <span>${h}</span></li>
    `).join('');

    // Populate tech
    techContainer.innerHTML = data.tech.map(t => `<span>${t}</span>`).join('');

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Close handlers
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', window.closeProjectModal);

  const modalBackdrop = document.getElementById('project-modal');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) window.closeProjectModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeProjectModal();
  });

  console.log('%c EDGEMARK Engineering Consulting Ltd. ', 
    'background:#1A2D4F; color:#E84B0D; font-size:14px; font-weight:bold; padding:8px 16px; border-radius:4px;');
  console.log('%c Providing Cutting-Edge Solutions and Defining Strength with Precision. ', 
    'color:#1A2D4F; font-size:11px;');
});

