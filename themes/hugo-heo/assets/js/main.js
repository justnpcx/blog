document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Theme Toggle (Dark/Light Mode)
     ========================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const iconSun = themeToggle?.querySelector('.icon-sun');
  const iconMoon = themeToggle?.querySelector('.icon-moon');
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('heo-theme', theme);
    
    if (iconSun && iconMoon) {
      if (theme === 'dark') {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
      } else {
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
      }
    }
  }

  // Init toggle icons based on current theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(currentTheme);

  themeToggle?.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  /* ==========================================================================
     2. Navbar Scroll Effect, Page Title Toggle & Back to Top Percentage
     ========================================================================== */
  const nav = document.getElementById('heoNav');
  const backToTop = document.getElementById('backToTop');
  const percentEl = document.getElementById('percent');
  const totopBtn = document.getElementById('nav-totop');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateScrollState() {
    const currentScrollY = window.scrollY;
    
    // Navbar shadow and background scrolled state
    if (currentScrollY > 10) {
      nav?.classList.add('nav-scrolled');
    } else {
      nav?.classList.remove('nav-scrolled');
    }

    // nav-fixed toggling for menus and page title exchange
    if (currentScrollY > 60) {
      nav?.classList.add('nav-fixed');
    } else {
      nav?.classList.remove('nav-fixed');
    }

    // Hide navbar on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 150) {
      nav?.classList.add('nav-hidden');
    } else {
      nav?.classList.remove('nav-hidden');
    }

    // Back to top visibility (traditional sidebar button)
    if (currentScrollY > 300) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }

    // Calculate scroll percentage
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    let scrollPercent = 0;
    if (docHeight > 0) {
      scrollPercent = Math.round((currentScrollY / docHeight) * 100);
    }
    if (scrollPercent > 100) scrollPercent = 100;
    if (scrollPercent < 0) scrollPercent = 0;

    if (percentEl) {
      percentEl.textContent = scrollPercent;
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  const pageNameText = document.getElementById('page-name-text');

  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  backToTop?.addEventListener('click', smoothScrollToTop);
  totopBtn?.addEventListener('click', smoothScrollToTop);
  pageNameText?.addEventListener('click', smoothScrollToTop);

  /* ==========================================================================
     3. Mobile Menu Toggle
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
  });

  /* ==========================================================================
     4. Code Block Copy Button
     ========================================================================== */
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(block => {
    const button = document.createElement('button');
    button.className = 'heo-code-copy-btn';
    button.textContent = 'Copy';
    
    button.addEventListener('click', () => {
      const code = block.querySelector('code');
      if (code) {
        navigator.clipboard.writeText(code.innerText).then(() => {
          button.textContent = 'Copied!';
          button.classList.add('copied');
          setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
          }, 2000);
        });
      }
    });
    
    block.appendChild(button);
  });

  /* ==========================================================================
     5. Table of Contents (Active State)
     ========================================================================== */
  const tocLinks = document.querySelectorAll('.heo-toc nav a');
  const headers = Array.from(document.querySelectorAll('.heo-content h1, .heo-content h2, .heo-content h3, .heo-content h4'))
    .filter(h => h.id); // Only headers with IDs

  if (tocLinks.length > 0 && headers.length > 0) {
    const observerCallback = (entries) => {
      let activeId = null;
      // Find the first visible header
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
        }
      });

      if (activeId) {
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    });

    headers.forEach(h => observer.observe(h));
  }

  /* ==========================================================================
     6. Search Overlay (Basic functionality)
     ========================================================================== */
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');

  searchToggle?.addEventListener('click', () => {
    searchOverlay?.classList.add('active');
    setTimeout(() => searchInput?.focus(), 100);
  });

  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
      searchOverlay.classList.remove('active');
    }
  });

  /* ==========================================================================
     7. Hero Section Slider Hover Sync & Autoplay
     ========================================================================== */
  const heroListItems = document.querySelectorAll('.heo-hero-list-item');
  const heroSlides = document.querySelectorAll('.heo-hero-slide');
  
  if (heroListItems.length > 0 && heroSlides.length > 0) {
    let activeIndex = 0;
    let autoplayInterval = null;
    
    function switchHeroSlide(index) {
      if (index === activeIndex) return;
      
      activeIndex = index;
      
      heroSlides.forEach((slide, idx) => {
        if (idx === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      
      heroListItems.forEach((item, idx) => {
        if (idx === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
    
    function startAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => {
        let nextIndex = (activeIndex + 1) % heroSlides.length;
        switchHeroSlide(nextIndex);
      }, 5000);
    }
    
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }
    
    heroListItems.forEach((item, idx) => {
      item.addEventListener('mouseenter', () => {
        stopAutoplay();
        switchHeroSlide(idx);
      });
      
      item.addEventListener('mouseleave', () => {
        startAutoplay();
      });
    });
    
    startAutoplay();
  }
});
