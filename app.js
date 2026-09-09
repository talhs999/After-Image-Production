/**
 * AFTERIMAGE POST-PRODUCTION & LINE PRODUCTION
 * Core Interactive Logic & Application Controller — Redesign
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeroVideo();
  initCinemaTimecode();
  initCountUpStats();
  initScrollReveal();
  initVfxSlider();
  initPortfolioFilter();
  initContactWizard();
  initServiceModals();
  initShowreelModal();
  initKarachiClock();
  initScrollEffects();
  initSideDrawer();
  initStackingCardsEffect();
  initCinematicParallax();
  initAboutGalleryAccordion();
});

/* ==========================================================================
   1. Dark / Light Theme Toggle with localStorage Persistence
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('afterimage_theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      localStorage.setItem('afterimage_theme', currentTheme);
    });
  }
}

/* ==========================================================================
   2. Hero Video Autoplay Enforcer
   ========================================================================== */
function initHeroVideo() {
  const video = document.getElementById('hero-bg-video');
  if (video) {
    video.muted = true;
    video.playsInline = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        window.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
    }
  }
}

/* ==========================================================================
   3. Live 24fps Cinema Timecode Counter
   ========================================================================== */
function initCinemaTimecode() {
  const timecodeEl = document.getElementById('cinema-timecode');
  if (!timecodeEl) return;

  let hours = 0;
  let minutes = 17;
  let seconds = 45;
  let frames = 21;

  setInterval(() => {
    frames++;
    if (frames >= 24) {
      frames = 0;
      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
          minutes = 0;
          hours = (hours + 1) % 24;
        }
      }
    }

    const pad = (num) => String(num).padStart(2, '0');
    timecodeEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
  }, 1000 / 24);
}

/* ==========================================================================
   4. Animated Stat Counters (Count-up on Scroll)
   ========================================================================== */
function initCountUpStats() {
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter-target'), 10);
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out expo
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeOut * target);

          el.textContent = `${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Scroll-Reveal Animations (Fade & Rise)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. Interactive VFX Before & After Comparison Slider
   ========================================================================== */
function initVfxSlider() {
  const container = document.getElementById('vfx-slider');
  const beforeLayer = document.getElementById('vfx-before-layer');
  const handle = document.getElementById('vfx-handle');

  if (!container || !beforeLayer || !handle) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;

    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    beforeLayer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  handle.addEventListener('touchstart', () => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      updateSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  container.addEventListener('click', (e) => {
    updateSliderPosition(e.clientX);
  });
}

/* ==========================================================================
   7. Portfolio Showcase Filter
   ========================================================================== */
function initPortfolioFilter() {
  const tabs = document.querySelectorAll('.tab-btn');
  const items = document.querySelectorAll('.portfolio-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. PART 4: 3-Step Guided Contact Form Wizard
   ========================================================================== */
function initContactWizard() {
  let currentStep = 1;

  const stepPanes = {
    1: document.getElementById('wizard-step-1'),
    2: document.getElementById('wizard-step-2'),
    3: document.getElementById('wizard-step-3'),
    4: document.getElementById('wizard-confirmation')
  };

  const stepIndicators = {
    1: document.getElementById('step-indicator-1'),
    2: document.getElementById('step-indicator-2'),
    3: document.getElementById('step-indicator-3')
  };

  const progressFill = document.getElementById('wizard-progress-fill');

  // Service Chips Toggle
  const serviceChips = document.querySelectorAll('.service-chip');
  serviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const checkbox = chip.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      chip.classList.toggle('selected', checkbox.checked);
    });
  });

  function getSelectedServices() {
    const selected = [];
    document.querySelectorAll('.service-chip input[type="checkbox"]:checked').forEach(cb => {
      selected.push(cb.value);
    });
    return selected;
  }

  function setStep(step) {
    currentStep = step;

    // Panes visibility
    Object.keys(stepPanes).forEach(k => {
      if (stepPanes[k]) {
        stepPanes[k].classList.toggle('active', parseInt(k, 10) === step);
      }
    });

    // Progress bar width
    if (progressFill) {
      if (step === 1) progressFill.style.width = '33.33%';
      if (step === 2) progressFill.style.width = '66.66%';
      if (step >= 3) progressFill.style.width = '100%';
    }

    // Step indicators
    Object.keys(stepIndicators).forEach(k => {
      const ind = stepIndicators[k];
      const stepNum = parseInt(k, 10);
      if (!ind) return;

      ind.classList.remove('active', 'completed');
      if (stepNum === step) {
        ind.classList.add('active');
      } else if (stepNum < step) {
        ind.classList.add('completed');
      }
    });
  }

  // Next to Step 2
  const toStep2Btn = document.getElementById('btn-to-step-2');
  if (toStep2Btn) {
    toStep2Btn.addEventListener('click', () => {
      const services = getSelectedServices();
      if (services.length === 0) {
        alert('Please select at least one service required for your project.');
        return;
      }
      setStep(2);
    });
  }

  // Back to Step 1
  const backToStep1Btn = document.getElementById('btn-back-to-1');
  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => setStep(1));
  }

  // Next to Step 3
  const toStep3Btn = document.getElementById('btn-to-step-3');
  if (toStep3Btn) {
    toStep3Btn.addEventListener('click', () => setStep(3));
  }

  // Back to Step 2
  const backToStep2Btn = document.getElementById('btn-back-to-2');
  if (backToStep2Btn) {
    backToStep2Btn.addEventListener('click', () => setStep(2));
  }

  // Gather all form data
  function compileBriefData() {
    const services = getSelectedServices().join(', ') || 'Line Production & VFX Consultation';
    const projectType = document.getElementById('wizard-project-type')?.value || 'Commercial TVC';
    const timeline = document.getElementById('wizard-timeline')?.value || 'Standard (2-4 Weeks)';
    const budget = document.getElementById('wizard-budget')?.value || 'To Be Discussed';
    const notes = document.getElementById('wizard-notes')?.value.trim() || 'No additional notes provided';

    const clientName = document.getElementById('wizard-name')?.value.trim() || '';
    const clientPhone = document.getElementById('wizard-phone')?.value.trim() || '';
    const clientEmail = document.getElementById('wizard-email')?.value.trim() || '';

    return {
      services,
      projectType,
      timeline,
      budget,
      notes,
      clientName,
      clientPhone,
      clientEmail
    };
  }

  function validateContactInputs(data) {
    if (!data.clientName) {
      alert('Please enter your name or agency name.');
      return false;
    }
    if (!data.clientPhone && !data.clientEmail) {
      alert('Please provide either your WhatsApp/Phone number or Email address.');
      return false;
    }
    return true;
  }

  // Submit via WhatsApp
  const submitWhatsAppBtn = document.getElementById('btn-wizard-whatsapp');
  if (submitWhatsAppBtn) {
    submitWhatsAppBtn.addEventListener('click', () => {
      const data = compileBriefData();
      if (!validateContactInputs(data)) return;

      const message = 
`🎬 *AFTERIMAGE — NEW PROJECT BRIEF*
----------------------------------------
👤 *Client / Agency:* ${data.clientName}
📞 *Phone / WhatsApp:* ${data.clientPhone || 'N/A'}
✉️ *Email:* ${data.clientEmail || 'N/A'}

🎯 *Required Services:* 
${data.services}

📽 *Project Type:* ${data.projectType}
⏱ *Target Timeline:* ${data.timeline}
💰 *Budget Tier:* ${data.budget}

📝 *Project Overview / Script:*
${data.notes}
----------------------------------------
Requesting proposal & budget estimation.`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/923453076189?text=${encoded}`, '_blank');
      showConfirmation(data);
    });
  }

  // Submit via Email
  const submitEmailBtn = document.getElementById('btn-wizard-email');
  if (submitEmailBtn) {
    submitEmailBtn.addEventListener('click', () => {
      const data = compileBriefData();
      if (!validateContactInputs(data)) return;

      const subject = encodeURIComponent(`Project Brief: ${data.projectType} - ${data.clientName}`);
      const body = encodeURIComponent(
`Hi AfterImage Team,

We would like to request a proposal and budget estimation.

Project Scope:
- Client / Agency: ${data.clientName}
- Phone: ${data.clientPhone}
- Email: ${data.clientEmail}
- Services Required: ${data.services}
- Project Type: ${data.projectType}
- Timeline: ${data.timeline}
- Budget Tier: ${data.budget}

Project Brief Notes:
${data.notes}

Looking forward to your prompt response.

Best regards,
${data.clientName}`
      );

      window.location.href = `mailto:nomanimator@gmail.com?subject=${subject}&body=${body}`;
      showConfirmation(data);
    });
  }

  function showConfirmation(data) {
    setStep(4);
    const summaryBox = document.getElementById('confirm-summary-content');
    if (summaryBox) {
      summaryBox.innerHTML = `
        <div><strong>Agency / Client:</strong> ${data.clientName}</div>
        <div><strong>Services:</strong> ${data.services}</div>
        <div><strong>Timeline &amp; Type:</strong> ${data.projectType} (${data.timeline})</div>
        <div><strong>Budget Tier:</strong> ${data.budget}</div>
      `;
    }
  }

  const restartBtn = document.getElementById('btn-wizard-restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => setStep(1));
  }
}

/* ==========================================================================
   9. Service Deep-Dive Modals
   ========================================================================== */
const serviceModalData = {
  'line-production': {
    title: 'Line Production Services',
    tag: 'Physical Set Execution & Logistics',
    summary: 'Complete on-ground production orchestration across Karachi and nationwide sets, delivering disciplined timelines and first-class technical talent.',
    details: [
      {
        heading: 'Pre-Production Planning & Breakdown',
        text: 'Script breakdowns, scene-by-scene logistics, budgeting, location scouting across Karachi/Sindh/Punjab, municipal permits, and full technical crew allocation.'
      },
      {
        heading: 'On-Set Coordination & Flow Control',
        text: 'Strict execution of daily call sheets, camera package coordination (ARRI ALEXA 35, Mini LF, RED V-Raptor), wireless video village monitoring, and continuous time management.'
      },
      {
        heading: 'Vendor & Crew Ecosystem',
        text: 'Decade-long relationships with top gaffers, grips, art directors, sound engineers, stunt coordinators, and studio spaces in Karachi.'
      }
    ]
  },
  'vfx': {
    title: 'VFX & Visual Effects Compositing',
    tag: 'Digital Mastery & CG Integration',
    summary: 'High-end visual effects compositing that blends seamlessly with live-action plates, adhering to international photoreal standards.',
    details: [
      {
        heading: '3D Compositing & Camera Tracking',
        text: 'Multi-pass EXR integration (beauty, diffuse, specular, normal, Z-depth), camera solve in 3D space, lens distortion matching, and dynamic lighting integration.'
      },
      {
        heading: 'Chroma Keying & Precision Rotoscoping',
        text: 'Fine edge hair extraction, green/blue spill suppression, clean alpha mattes, and articulation rotoscoping for complex character motion.'
      },
      {
        heading: 'Cleanup & Wire Rig Removal',
        text: 'Stunt harness elimination, boom mic painting, digital skin retouching, background cosmetic cleanup, and phone/screen graphic replacements.'
      }
    ]
  },
  'post-production': {
    title: 'Post-Production Management',
    tag: 'Editorial, Pipeline & Mastering',
    summary: 'From raw media camera ingest to final broadcast and OTT deliverable packages, ensuring color precision and audio sync across all platforms.',
    details: [
      {
        heading: 'Commercial Editing & Assembly',
        text: 'Offline narrative shaping, commercial pacing (15s, 30s, 60s TVC cuts), online assembly, and sound design synchronization.'
      },
      {
        heading: 'Color & Workflow Supervision',
        text: 'ACES & DaVinci YRGB color-managed pipelines, raw footage ingest with checksum verification, proxy generation, and seamless VFX round-tripping.'
      },
      {
        heading: 'Final TVC Mastering & Delivery',
        text: 'Broadcast legal standards for Pakistani TV networks, 16:9 broadcast masters, 9:16 and 1:1 social cutdowns, DCI-P3 / Rec.709 color profiles.'
      }
    ]
  }
};

function initServiceModals() {
  const modalBackdrop = document.getElementById('service-modal');
  const modalBody = document.getElementById('service-modal-body');
  const closeBtn = document.getElementById('service-modal-close');
  const triggers = document.querySelectorAll('[data-service-trigger]');

  if (!modalBackdrop || !modalBody || !closeBtn) return;

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service-trigger');
      const data = serviceModalData[serviceKey];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--amber-solid); text-transform: uppercase; letter-spacing: 0.1em;">${data.tag}</span>
          <h2 style="font-size: 1.85rem; text-transform: uppercase; margin: 0.5rem 0 1rem;">${data.title}</h2>
          <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.7;">${data.summary}</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.75rem; border-top: 1px solid var(--border-subtle); padding-top: 1.75rem;">
          ${data.details.map(item => `
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 1.25rem 1.4rem; border-radius: var(--radius-sm);">
              <h4 style="color: var(--amber-solid); font-size: 1rem; margin-bottom: 0.35rem;">${item.heading}</h4>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">${item.text}</p>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <a href="#contact" class="btn btn-primary" onclick="document.getElementById('service-modal').classList.remove('open')">Request Quote For This Service</a>
        </div>
      `;

      modalBackdrop.classList.add('open');
    });
  });

  closeBtn.addEventListener('click', () => {
    modalBackdrop.classList.remove('open');
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('open');
    }
  });
}

/* ==========================================================================
   10. Showreel Video Modal
   ========================================================================== */
function initShowreelModal() {
  const modalBackdrop = document.getElementById('reel-modal');
  const closeBtn = document.getElementById('reel-modal-close');
  const openBtns = document.querySelectorAll('[data-open-reel]');

  if (!modalBackdrop || !closeBtn) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalBackdrop.classList.add('open');
    });
  });

  closeBtn.addEventListener('click', () => {
    modalBackdrop.classList.remove('open');
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('open');
    }
  });
}

/* ==========================================================================
   11. Live Karachi Local Time Display (PKT UTC+5)
   ========================================================================== */
function initKarachiClock() {
  const clockEl = document.getElementById('karachi-time');
  const drawerClockEl = document.getElementById('drawer-karachi-time');

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    if (clockEl) clockEl.textContent = `${timeString} PKT (Karachi)`;
    if (drawerClockEl) drawerClockEl.textContent = `${timeString} PKT`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   12. Scroll Effects & Header Sticky Class
   ========================================================================== */
function initScrollEffects() {
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   13. Off-Canvas Side Drawer Menu
   ========================================================================== */
function initSideDrawer() {
  const openBtn = document.getElementById('side-menu-open-btn');
  const closeBtn = document.getElementById('side-drawer-close-btn');
  const backdrop = document.getElementById('side-drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!backdrop) return;

  function openDrawer() {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeDrawer();
    }
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   14. Sticky Stacking Cards Depth & Scale on Scroll
   ========================================================================== */
function initStackingCardsEffect() {
  const cards = document.querySelectorAll('.stack-card');
  if (!cards.length) return;

  function updateCardTransforms() {
    cards.forEach((card, i) => {
      const nextCard = cards[i + 1];
      if (!nextCard) return;

      const cardRect = card.getBoundingClientRect();
      const nextRect = nextCard.getBoundingClientRect();

      // Distance from top of next card to sticky position of current card
      const diff = nextRect.top - cardRect.top;
      const cardHeight = cardRect.height || 440;

      if (diff < cardHeight && diff > 0) {
        // As next card scrolls up and overlaps current card
        const progress = (cardHeight - diff) / cardHeight;
        const scale = 1 - (progress * 0.05); // scale down from 1 to 0.95
        const brightness = 1 - (progress * 0.22); // dim subtly from 1 to 0.78
        card.style.transform = `scale(${scale.toFixed(3)})`;
        card.style.filter = `brightness(${brightness.toFixed(3)})`;
      } else if (diff <= 0) {
        card.style.transform = 'scale(0.95)';
        card.style.filter = 'brightness(0.78)';
      } else {
        card.style.transform = 'scale(1)';
        card.style.filter = 'brightness(1)';
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateCardTransforms);
  }, { passive: true });

  updateCardTransforms();
}

/* ==========================================================================
   15. Cinematic Parallax Section ("AfterImage Statement")
   ========================================================================== */
function initCinematicParallax() {
  const section = document.getElementById('parallax-statement');
  const bgImg = document.getElementById('parallax-bg-img');
  const title = document.getElementById('parallax-massive-title');

  if (!section || !bgImg) return;

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Trigger parallax when section enters viewport
    if (rect.top < windowHeight && rect.bottom > 0) {
      const totalDistance = windowHeight + rect.height;
      const currentProgress = (windowHeight - rect.top) / totalDistance;
      
      // Normalized offset (-0.5 to +0.5)
      const centered = currentProgress - 0.5;

      // Background moves smoothly downward/upward by 120px
      const bgY = centered * 120;
      bgImg.style.transform = `translate3d(0, ${bgY.toFixed(1)}px, 0) scale(1.18)`;

      // Giant AFTERIMAGE text rises upwards at an opposing speed
      if (title) {
        const titleY = centered * -80;
        title.style.transform = `translate3d(0, ${titleY.toFixed(1)}px, 0)`;
      }
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();
}

/* ==========================================================================
   16. 5-Stage About Gallery Showcase (Accordion & Auto-Advance)
   ========================================================================== */
function initAboutGalleryAccordion() {
  const cards = document.querySelectorAll('.gallery-card');
  if (!cards.length) return;

  let activeIndex = 0;
  let isHovered = false;

  function setActiveCard(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    activeIndex = index;
  }

  cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      isHovered = true;
      setActiveCard(index);
    });

    card.addEventListener('click', () => {
      setActiveCard(index);
    });
  });

  const showcase = document.querySelector('.about-gallery-showcase');
  if (showcase) {
    showcase.addEventListener('mouseleave', () => {
      isHovered = false;
    });
  }

  // Smooth auto-rotation every 4.5 seconds if user is not hovering
  setInterval(() => {
    if (!isHovered) {
      const nextIndex = (activeIndex + 1) % cards.length;
      setActiveCard(nextIndex);
    }
  }, 4500);
}


