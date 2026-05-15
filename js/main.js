// ===== ArdurAI Landing Page JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
  // Header scroll effect
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);

  // Counter animation
  const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      updateCounter();
    });
  };

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate counters when stats section is visible
        if (entry.target.classList.contains('stat-card') ||
            entry.target.classList.contains('stats-grid')) {
          animateCounters();
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  document.querySelectorAll('.stat-card').forEach(el => observer.observe(el));

  // Tilt effect for product cards
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // Terminal demo
  const terminalContent = document.getElementById('terminal-content');
  const demoActions = {
    allow: async () => {
      const lines = [
        { text: 'Tool call: file_write("config.yaml")', type: 'output' },
        { text: 'Checking policy...', type: 'output' },
        { text: '✓ ALLOWED - within mission scope', type: 'success' },
        { text: 'Receipt signed: 0x' + generateHash(), type: 'success' }
      ];
      await typeLines(lines);
    },
    deny: async () => {
      const lines = [
        { text: 'Tool call: shell_exec("rm -rf /")', type: 'output' },
        { text: 'Checking policy...', type: 'output' },
        { text: '✗ DENIED - violates safety policy', type: 'error' },
        { text: 'Audit logged: 0x' + generateHash(), type: 'error' }
      ];
      await typeLines(lines);
    },
    verify: async () => {
      const lines = [
        { text: 'Verifying receipt chain...', type: 'output' },
        { text: 'Receipt #1: ✓ valid', type: 'success' },
        { text: 'Receipt #2: ✓ valid', type: 'success' },
        { text: 'Receipt #3: ✓ valid', type: 'success' },
        { text: 'Chain integrity: VERIFIED', type: 'success' }
      ];
      await typeLines(lines);
    }
  };

  async function typeLines(lines) {
    for (const line of lines) {
      const span = document.createElement('div');
      span.className = line.type || 'output';
      span.textContent = '> ' + line.text;
      terminalContent.appendChild(span);
      terminalContent.scrollTop = terminalContent.scrollHeight;
      await sleep(300);
    }
  }

  function generateHash() {
    return Math.random().toString(16).slice(2, 10) +
           Math.random().toString(16).slice(2, 10);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Demo button handlers
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (demoActions[action]) {
        demoActions[action]();
      }
    });
  });

  // Confetti on first visit
  const hasVisited = sessionStorage.getItem('ardur-visited');
  if (!hasVisited) {
    triggerConfetti();
    sessionStorage.setItem('ardur-visited', 'true');
  }

  function triggerConfetti() {
    const colors = ['#6366f1', '#22d3ee', '#f472b6'];

    // Main burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true
    });

    // Side bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
    }, 300);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Add visible class to stats when in view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statCards = entry.target.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, index * 100);
        });
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Parallax effect for orbs
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
      const speed = 0.1 + (index * 0.05);
      orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Typing effect for hero subtitle (optional enhancement)
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    heroSubtitle.style.opacity = '0';
    setTimeout(() => {
      heroSubtitle.style.transition = 'opacity 0.8s ease-out';
      heroSubtitle.style.opacity = '1';
    }, 400);
  }

  console.log('%c🚀 ArdurAI — Open Source AI Governance', 'color: #6366f1; font-size: 20px; font-weight: bold;');
  console.log('%cProve what your agents do, not just what they say.', 'color: #888899; font-size: 14px;');
});
