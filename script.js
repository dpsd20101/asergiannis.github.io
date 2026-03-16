const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.toolbar-menu');

hamburger.addEventListener('click', function () {
  this.classList.toggle('active');
  menu.classList.toggle('show');
});

document.addEventListener('DOMContentLoaded', function () {
  const languageIcons = document.querySelectorAll('.lang-icon');
  const englishFlag = document.querySelector('.lang-icon[alt="English"]');
  const aboutSection = document.getElementById('about-me');

  function rebuildHeroName(lang) {
    const heroNameElement = document.querySelector('.hero-name');
    if (!heroNameElement) return;

    const source = heroNameElement.getAttribute(lang === 'el' ? 'data-greek' : 'data-english');
    if (!source) return;

    const withLetters = source
      .split('')
      .map(char => {
        if (char === ' ' || char === '\n') return '<span class="hero-letter">&nbsp;</span>';
        if (char === '<' || char === '>') return char;
        return `<span class="hero-letter">${char}</span>`;
      })
      .join('')
      .replace(/<span class="hero-letter">&lt;<\/span>br<span class="hero-letter">&gt;<\/span>/g, '<br>');

    heroNameElement.innerHTML = withLetters;
  }

  function applyLanguageState(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-greek][data-english]').forEach(element => {
      if (element.classList.contains('hero-name')) {
        return;
      }

      const translated = element.getAttribute(lang === 'el' ? 'data-greek' : 'data-english');
      if (!translated) return;

      if (translated.includes('<br>')) {
        element.innerHTML = translated;
      } else {
        element.textContent = translated;
      }
    });

    rebuildHeroName(lang);
  }

  function updateInactiveFlags() {
    const useBlack = aboutSection && window.scrollY > (aboutSection.offsetTop + aboutSection.offsetHeight);

    languageIcons.forEach(icon => {
      if (icon.classList.contains('active')) {
        icon.style.filter = 'none';
        return;
      }

      icon.classList.toggle('black', !!useBlack);
      icon.style.filter = useBlack
        ? 'brightness(0) contrast(3)'
        : 'brightness(0) invert(1) contrast(3)';
    });
  }

  function activateLanguage(icon) {
    languageIcons.forEach(otherIcon => {
      const isActive = otherIcon === icon;
      otherIcon.classList.toggle('active', isActive);
      otherIcon.src = otherIcon.getAttribute(isActive ? 'data-active' : 'data-default');
    });

    updateInactiveFlags();
    applyLanguageState(icon.getAttribute('alt') === 'Greek' ? 'el' : 'en');
  }

  languageIcons.forEach(icon => {
    icon.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      activateLanguage(this);
    });
  });

  window.addEventListener('scroll', updateInactiveFlags);

  if (englishFlag) {
    activateLanguage(englishFlag);
  } else {
    applyLanguageState('en');
  }
});

// Close menu when clicking outside
document.addEventListener('click', function (e) {
  const isClickInsideMenu = menu.contains(e.target);
  const isClickOnHamburger = hamburger.contains(e.target);
  const isMenuOpen = menu.classList.contains('show');
  
  if (isMenuOpen && !isClickInsideMenu && !isClickOnHamburger) {
    hamburger.classList.remove('active');
    menu.classList.remove('show');
  }
});

const heroName = document.querySelector('.hero-name');
const text = heroName.innerText;
heroName.innerHTML = text.split('').map(char => {
  if (char === ' ' || char === '\n') return `<span class="hero-letter">&nbsp;</span>`;
  return `<span class="hero-letter">${char}</span>`;
}).join('');

function getCurrentLanguage() {
  return document.documentElement.lang === 'el' ? 'el' : 'en';
}

const mainContent = document.getElementById('main-content');
const aboutMe = document.getElementById('about-me');
// Title element for the About description block
const aboutDescriptionTitle = document.querySelector('.description-title');

let ignoreScroll = false;

// Ensure both have the fade class
mainContent.classList.add('fade');
aboutMe.classList.add('fade');

// Show About section, hide main content with fade
function showAbout() {
  const aboutMeSection = document.getElementById('about-me');
  if (aboutMeSection) {
    ignoreScroll = true; // Prevent scroll listener interference
    smoothScrollTo(aboutMeSection, 900);
    // Let the scroll listener handle the fade naturally during scroll
    // Ensure final state after scroll completes
    setTimeout(() => {
      aboutMeSection.style.opacity = '1';
      aboutMeSection.style.pointerEvents = 'auto';
      aboutMeSection.style.zIndex = '2';
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.pointerEvents = 'none';
        mainContent.style.zIndex = '1';
      }
      ignoreScroll = false;
    }, 950); // Slightly longer than scroll duration
  }
}

// Show main content, hide About section with fade
function showMain() {
  const mainContentSection = document.getElementById('main-content');
  if (mainContentSection) {
    ignoreScroll = true; // Prevent scroll listener interference
    smoothScrollTo(mainContentSection, 900);
    // Let the scroll listener handle the fade naturally during scroll
    // Ensure final state after scroll completes
    setTimeout(() => {
      mainContentSection.style.opacity = '1';
      mainContentSection.style.pointerEvents = 'auto';
      mainContentSection.style.zIndex = '2';
      const aboutMe = document.getElementById('about-me');
      if (aboutMe) {
        aboutMe.style.opacity = '0';
        aboutMe.style.pointerEvents = 'none';
        aboutMe.style.zIndex = '1';
      }
      ignoreScroll = false;
    }, 950); // Slightly longer than scroll duration
  }
}

// Attach to nav and button
document.querySelectorAll('a[href="#about"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Add a slight delay specifically so button click visual effects (like our splash) can render
    setTimeout(() => {
      showAbout();
      // Wait for the fade-in to start, then scroll to about section
      setTimeout(() => {
        smoothScrollTo(document.getElementById('about-me'), 900); // 900ms for a nice effect
      }, 510);
    }, 300);
  });
});

// Optionally, add a "Back" button in the about section:
/*
const backBtn = document.createElement('button');
backBtn.textContent = "Back";
backBtn.style = "margin-top: 32px; font-size: 1.2rem; padding: 10px 24px; border-radius: 12px; border: none; background: #e06d6d; color: #fff; cursor: pointer;";

let ignoreScroll = false;
let aboutShownByScroll = false;
let lastScrollY = window.scrollY;

backBtn.onclick = function() {
  ignoreScroll = true;
  showMain();
  setTimeout(() => {
    smoothScrollTo(document.getElementById('main-content'), 900);
    setTimeout(() => { ignoreScroll = false; }, 950);
  }, 500);
};

document.querySelector('#about-me .about-me-content').appendChild(backBtn);
*/

// Attach to the HOME nav item
document.querySelectorAll('a[href="#hero"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    ignoreScroll = true;
    showMain();
    setTimeout(() => {
      smoothScrollTo(document.getElementById('main-content'), 900);
      setTimeout(() => { ignoreScroll = false; }, 950);
    }, 500);
  });
});

function smoothScrollTo(target, duration = 800) {
  const start = window.scrollY;
  const end = typeof target === 'number'
    ? target
    : target.getBoundingClientRect().top + window.scrollY;
  const change = end - start;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeOutCubic(progress);
    window.scrollTo(0, start + change * ease);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

// Initialize sections
document.addEventListener('DOMContentLoaded', function () {
  const mainContent = document.getElementById('main-content');
  const aboutMe = document.getElementById('about-me');
  if (mainContent) mainContent.style.opacity = '1';
  if (aboutMe) aboutMe.style.opacity = '0'; // Ensure about starts faded out
  if (aboutMe) aboutMe.style.pointerEvents = 'none';
  if (mainContent) mainContent.style.zIndex = '2';
  if (aboutMe) aboutMe.style.zIndex = '1';

  // Evaluate toolbar coloring on scroll
  const toolbar = document.querySelector('.toolbar');
  const portfolioSection = document.getElementById('portfolio');

  window.addEventListener('scroll', () => {
    if (!toolbar || !portfolioSection) return;
    // Get the top position of the portfolio section relative to the viewport
    const portfolioTop = portfolioSection.getBoundingClientRect().top;

    // If the top of the portfolio section hits the toolbar (which is e.g. 100px tall), switch to dark mode
    if (portfolioTop <= 80) {
      toolbar.classList.add('dark-mode');
    } else {
      toolbar.classList.remove('dark-mode');
    }
  });

  // Trigger a scroll event on load to fix the blank screen bug on refresh
  // This evaluates the current scroll position and makes the correct sections visible
  setTimeout(() => window.dispatchEvent(new Event('scroll')), 50);
});


// === ABOUT ME VERTICAL CAROUSEL ===
// 1. grab elements and set up state
const aboutMeCarousel = document.querySelector('.about-me .carousel');
const aboutMeCarouselRegion = document.querySelector('.about-me-carousel-region');
const aboutDescriptionP = document.querySelector('.about-description p'); // Get the description paragraph

if (aboutMeCarousel && aboutMeCarouselRegion && aboutDescriptionP) {
  let offset = 0;
  let animationFrame;
  let isMobile = window.innerWidth <= 600; // Check if mobile view
  let logoSwapTimeout = null; // controls staggered fade-out → fade-in for tool logos

  // 2. the core rendering function
  function updateCards() {
    const cards = Array.from(aboutMeCarousel.children);
    let centerCardIdentified = false; // Flag to ensure we only update once per state change

    cards.forEach((card, i) => {
      const pos = i - 2 + offset;
      const scale = Math.max(0.7, 1 - Math.abs(pos) * 0.2);
      const finalOpacity = Math.abs(pos) < 0.5 ? 1 : 0;

      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease';

      // Horizontal layout universally
      card.style.transform = `translate(-50%, -50%) translateX(${pos * 140}px) scale(${scale})`;

      card.style.opacity = finalOpacity;
      card.style.zIndex = finalOpacity ? (10 - Math.abs(pos)) : 0;

      // Check if this is the settled, central card and update description, title, and tool logos
      if (finalOpacity === 1 && !centerCardIdentified) {
        // Trust the card's own data-title for the logical label so
        // icon, title, and description can never drift out of sync.
        const logicalKey = card.dataset.title || 'Web Design';

        // Keep the about copy in sync with the selected language.
        const englishDescriptions = {
          'Web Design': 'Focusing on responsive web design and development.',
          'Creative Ideas': 'Idea generation, brainstorming, and creative solutions.',
          'UI/UX Focus': 'UI/UX design, wireframing, and prototyping.',
          'Visual Arts': 'Visual design, branding, and illustration skills.',
          'Tech & Tools': 'Technical skills, problem-solving, and development tools.'
        };

        const greekDescriptions = {
          'Web Design': 'Εστιάζω στον responsive σχεδιασμό και την ανάπτυξη ιστοσελίδων.',
          'Creative Ideas': 'Παραγωγή ιδεών, brainstorming και δημιουργικές λύσεις.',
          'UI/UX Focus': 'Σχεδιασμός UI/UX, wireframing και prototyping.',
          'Visual Arts': 'Οπτικός σχεδιασμός, branding και δεξιότητες εικονογράφησης.',
          'Tech & Tools': 'Τεχνικές δεξιότητες, επίλυση προβλημάτων και εργαλεία ανάπτυξης.'
        };

        const isGreek = getCurrentLanguage() === 'el';
        const localizedTitle = isGreek ? (card.dataset.titleEl || logicalKey) : logicalKey;

        if (aboutDescriptionTitle) {
          aboutDescriptionTitle.innerText = localizedTitle;
        }

        const targetText = isGreek
          ? (greekDescriptions[logicalKey] || 'Σχεδιαστικές δεξιότητες και εμπειρία.')
          : (englishDescriptions[logicalKey] || 'Design-focused skills and experience.');
        if (aboutDescriptionP.innerText !== targetText) {
          aboutDescriptionP.style.opacity = 0;
          setTimeout(() => {
            aboutDescriptionP.innerText = targetText;
            aboutDescriptionP.style.opacity = 1;
          }, 150);
        } else {
          aboutDescriptionP.style.opacity = 1;
        }

        // Toggle tool logos based on the central card
        const toolsLogos = document.querySelector('.about-tools-logos');
        if (toolsLogos) {
          const logo1 = toolsLogos.querySelector('.tool-logo-1');
          const logo2 = toolsLogos.querySelector('.tool-logo-2');
          const logo3 = toolsLogos.querySelector('.tool-logo-3');
          const allLogos = toolsLogos.querySelectorAll('.tool-logo');

          // Clear any in-flight swap so we can start a fresh fade sequence
          if (logoSwapTimeout) {
            clearTimeout(logoSwapTimeout);
            logoSwapTimeout = null;
          }

          // Always remove active first so current icons fade OUT
          allLogos.forEach(logo => logo.classList.remove('active'));

          // Decide which pair should be shown based on the active card
          const pairByKey = {
            'UI/UX Focus': {
              src1: 'assets/Figma-logo.svg.png',
              alt1: 'Figma',
              src2: 'assets/android_logo_PNG32.png',
              alt2: 'Android / Android Studio'
            },
            'Visual Arts': {
              src1: 'assets/photoshop-logo-png.png',
              alt1: 'Adobe Photoshop',
              src2: 'assets/png-transparent-adobe-illustrator-macos-bigsur-icon-thumbnail.png',
              alt2: 'Adobe Illustrator'
            },
            'Tech & Tools': {
              src1: 'assets/Sql_data_base_with_logo.png',
              alt1: 'SQL Database',
              src2: 'assets/Firebase-Logo.png',
              alt2: 'Firebase'
            },
            'Creative Ideas': {
              src1: 'assets/blender-logo.png',
              alt1: 'Blender',
              src2: 'assets/ptc-creo-elements-software.png',
              alt2: 'Creo'
            },
            'Web Design': {
              src1: 'assets/js-logo.png',
              alt1: 'JavaScript',
              src2: 'assets/HTML5_logo_and_wordmark.svg.png',
              alt2: 'HTML5',
              src3: 'assets/css-logo.png',
              alt3: 'CSS'
            }
          };

          const pair = pairByKey[logicalKey];

          if (pair && logo1 && logo2) {
            // Keep container visible while we fade out old icons
            toolsLogos.classList.add('visible');
            toolsLogos.setAttribute('aria-hidden', 'false');

            // After fade-out finishes (including the stagger on the right logo),
            // swap sources and fade the new pair IN
            logoSwapTimeout = setTimeout(() => {
              logo1.src = pair.src1;
              logo1.alt = pair.alt1;
              logo2.src = pair.src2;
              logo2.alt = pair.alt2;
              
              // Handle third logo if it exists
              if (logo3 && pair.src3 && pair.alt3) {
                logo3.style.display = 'block';
                logo3.src = pair.src3;
                logo3.alt = pair.alt3;
                logo3.classList.add('active');
              } else if (logo3) {
                logo3.style.display = 'none';
                logo3.classList.remove('active');
              }

              // Trigger staggered fade-in via .active
              logo1.classList.add('active');
              logo2.classList.add('active');
            }, 650); // 0.4s transition + 0.25s delay on right logo (with a small buffer)
          } else {
            toolsLogos.classList.remove('visible');
            toolsLogos.setAttribute('aria-hidden', 'true');
          }
        }

        centerCardIdentified = true; // Mark that we've updated for this cycle
      }
    });

    // Add transition to the description paragraph for the fade effect
    aboutDescriptionP.style.transition = 'opacity 0.15s ease-in-out';
  }

  // 3. wrap logic: when offset drifts past ±0.5, move cards in DOM
  function wrapCards() {
    while (offset > 0.5) {
      aboutMeCarousel.insertBefore(aboutMeCarousel.lastElementChild, aboutMeCarousel.firstElementChild);
      offset -= 1;
    }
    while (offset < -0.5) {
      aboutMeCarousel.appendChild(aboutMeCarousel.firstElementChild);
      offset += 1;
    }
  }

  // 4. snap to nearest card
  function snapToNearest() {
    if (animationFrame) cancelAnimationFrame(animationFrame);

    const target = Math.round(offset);
    if (Math.abs(offset - target) > 0.01) {
      offset += (target - offset) * 0.2; // Snapping ease
      wrapCards();
      updateCards();
      animationFrame = requestAnimationFrame(snapToNearest);
    }
  }

  // 5. arrow click handlers
  const leftArrow = aboutMeCarouselRegion.querySelector('.left');
  const rightArrow = aboutMeCarouselRegion.querySelector('.right');

  if (leftArrow) {
    leftArrow.addEventListener('click', () => {
      offset -= 1;
      wrapCards();
      updateCards();
      snapToNearest();
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener('click', () => {
      offset += 1;
      wrapCards();
      updateCards();
      snapToNearest();
    });
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 600;

    // Only update if the layout type changed
    if (wasMobile !== isMobile) {
      updateCards();
    }
  });

  // Initial render
  updateCards();
} else {
  console.warn("About Me carousel elements not found. Vertical carousel inactive.");
}

// === END OF ABOUT ME VERTICAL CAROUSEL ===

// === Portfolio Carousel Logic ===
document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.querySelector('.portfolio-carousel-container'); // Use container for events if needed
  const carousel = document.querySelector('.portfolio-carousel');
  const slides = document.querySelectorAll('.portfolio-slide');
  const prevBtn = document.querySelector('.portfolio-arrow.prev');
  const nextBtn = document.querySelector('.portfolio-arrow.next');
  const dotsContainer = document.querySelector('.portfolio-dots-container');

  if (!carousel || slides.length === 0 || !prevBtn || !nextBtn || !dotsContainer || !carouselContainer) {
    console.warn('Portfolio carousel elements not found. Carousel inactive.');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (dotsContainer) dotsContainer.style.display = 'none';
    return;
  }

  let currentSlideIndex = 0;
  const totalSlides = slides.length;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0; // For requestAnimationFrame

  // On mobile, carousel should be vertical (swipe up/down). Desktop remains horizontal.
  let isVertical = window.innerWidth <= 768;

  // --- Create Dots --- 
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.classList.add('portfolio-dot');
    dot.setAttribute('aria-label', `Go to project ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll('.portfolio-dot');

  // --- Go To Slide Function --- 
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides || isDragging || slides.length === 0) return;
    cancelAnimationFrame(animationID);

    const firstSlide = slides[0];
    const slideStyle = getComputedStyle(firstSlide);

    // Calculate the total size of one slide including its margins (width for desktop, height for mobile)
    const slideOuterSize = isVertical
      ? firstSlide.offsetHeight + parseFloat(slideStyle.marginTop) + parseFloat(slideStyle.marginBottom)
      : firstSlide.offsetWidth + parseFloat(slideStyle.marginLeft) + parseFloat(slideStyle.marginRight);

    currentSlideIndex = index;

    // Translate the track to make the active slide centered in the container
    currentTranslate = -index * slideOuterSize;

    const containerSize = isVertical ? carouselContainer.offsetHeight : carouselContainer.offsetWidth;
    const initialOffset = (containerSize - slideOuterSize) / 2;
    currentTranslate += initialOffset;

    prevTranslate = currentTranslate;

    setSliderPosition();
    updateUI();
  }

  // --- Update UI (Dots/Arrows) --- 
  function updateUI() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlideIndex);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlideIndex);
    });

    // Update mobile details panel (shown on narrow viewports)
    const mobileTitle = document.querySelector('.portfolio-mobile-title');
    const mobileDesc = document.querySelector('.portfolio-mobile-description');
    if (mobileTitle && mobileDesc) {
      const activeSlide = slides[currentSlideIndex];
      const titleEl = activeSlide.querySelector('.portfolio-item-title');
      const descEl = activeSlide.querySelector('.portfolio-item-description');
      mobileTitle.innerText = titleEl ? titleEl.innerText : '';
      mobileDesc.innerText = descEl ? descEl.innerText : '';
    }

    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === totalSlides - 1;
  }

  // --- Set Slider Position --- 
  function setSliderPosition() {
    carousel.style.transform = isVertical
      ? `translateY(${currentTranslate}px)`
      : `translateX(${currentTranslate}px)`;
  }

  // --- Animation Loop (for smooth drag) --- 
  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  // --- Event Listeners --- 
  prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

  // --- Drag/Swipe Event Listeners --- 
  carousel.addEventListener('mousedown', dragStart);
  carousel.addEventListener('touchstart', dragStart, { passive: true }); // Use passive for performance

  carousel.addEventListener('mouseup', dragEnd);
  carousel.addEventListener('mouseleave', dragEnd); // End drag if mouse leaves carousel
  carousel.addEventListener('touchend', dragEnd);

  carousel.addEventListener('mousemove', dragAction);
  carousel.addEventListener('touchmove', dragAction, { passive: true });

  // Prevent default image drag behavior
  carousel.ondragstart = () => false;

  function dragStart(event) {
    isDragging = true;
    startPos = getPointerPosition(event);
    prevTranslate = currentTranslate; // Store position before drag starts
    carousel.style.transition = 'none'; // Disable transition during drag
    carousel.style.cursor = 'grabbing';
    animationID = requestAnimationFrame(animation); // Start animation loop
  }

  function dragAction(event) {
    if (!isDragging) return;
    const currentPosition = getPointerPosition(event);
    const move = currentPosition - startPos;
    currentTranslate = prevTranslate + move; // Calculate new position based on drag start
    // No need to call setSliderPosition here, animation loop handles it
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    const slideSize = isVertical
      ? slides[0].offsetHeight + (parseFloat(getComputedStyle(slides[0]).marginTop) + parseFloat(getComputedStyle(slides[0]).marginBottom))
      : slides[0].offsetWidth + (parseFloat(getComputedStyle(slides[0]).marginLeft) + parseFloat(getComputedStyle(slides[0]).marginRight));

    const threshold = slideSize * 0.2;

    carousel.style.transition = 'transform 0.5s ease-in-out'; // Re-enable transition
    carousel.style.cursor = 'grab';

    // Determine slide change based on drag distance and direction
    if (movedBy < -threshold && currentSlideIndex < totalSlides - 1) {
      goToSlide(currentSlideIndex + 1);
    } else if (movedBy > threshold && currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    } else {
      // Snap back to the current slide if threshold not met
      goToSlide(currentSlideIndex);
    }
  }

  // Helper to get position for both mouse and touch events
  function getPointerPosition(event) {
    const isMouse = event.type.includes('mouse');
    if (isVertical) {
      return isMouse ? event.pageY : (event.touches ? event.touches[0].clientY : event.changedTouches[0].clientY);
    }
    return isMouse ? event.pageX : (event.touches ? event.touches[0].clientX : event.changedTouches[0].clientX);
  }

  // --- Window Resize Handler --- 
  window.addEventListener('resize', () => {
    const wasVertical = isVertical;
    isVertical = window.innerWidth <= 768;

    if (slides.length > 0) { // Add this check before accessing slides[0]
      // Only re-layout if orientation mode changes
      if (wasVertical !== isVertical) {
        goToSlide(currentSlideIndex);
      }
    }
  });

  // --- Initialize --- 
  updateUI(); // Initial UI state

  // Set initial position without transition
  const firstSlide = slides[0];
  const slideStyle = getComputedStyle(firstSlide);
  const slideOuterSize = isVertical
    ? firstSlide.offsetHeight + parseFloat(slideStyle.marginTop) + parseFloat(slideStyle.marginBottom)
    : firstSlide.offsetWidth + parseFloat(slideStyle.marginLeft) + parseFloat(slideStyle.marginRight);

  const containerSize = isVertical ? carouselContainer.offsetHeight : carouselContainer.offsetWidth;
  const initialOffset = (containerSize - slideOuterSize) / 2;

  currentTranslate = -currentSlideIndex * slideOuterSize + initialOffset;

  carousel.style.transition = 'none';
  setSliderPosition();
  // Re-enable transition shortly after for future actions
  setTimeout(() => {
    carousel.style.transition = 'transform 0.5s ease-in-out';
  }, 50);

  // Portfolio Image Hover Effect
  const portfolioImageContainers = document.querySelectorAll('.portfolio-image-container');
  portfolioImageContainers.forEach(container => {
    container.addEventListener('mouseenter', () => {
      container.classList.add('hover-active');
    });
    container.addEventListener('mouseleave', () => {
      container.classList.remove('hover-active');
    });
  });

  // Project Detail Modal Logic
  const projectDetailModal = document.getElementById('project-detail-modal');
  const closeModalBtn = projectDetailModal ? projectDetailModal.querySelector('.modal-close-btn') : null;
  const modalProjectTitle = projectDetailModal ? projectDetailModal.querySelector('#modal-project-title') : null;
  const modalProjectImage = projectDetailModal ? projectDetailModal.querySelector('#modal-project-image') : null;
  const seeMorePrompts = document.querySelectorAll('.see-more-prompt .see-more-text');

  // Make each slide tappable/clickable to open the modal
  if (projectDetailModal) {
    slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
        openProjectModal(index);
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeProjectModal);
    }

    // Close modal when clicking outside content wrapper
    projectDetailModal.addEventListener('click', (event) => {
      if (event.target === projectDetailModal) {
        closeProjectModal();
      }
    });
  }

  // --- Elements for Project Detail Modal Text Carousel ---
  const modalMainImage = projectDetailModal ? projectDetailModal.querySelector('#modal-project-image') : null;
  const modalImageSliderContainer = projectDetailModal ? projectDetailModal.querySelector('.modal-image-slider-container') : null;
  const textCarouselPageDisplay = projectDetailModal ? projectDetailModal.querySelector('.text-carousel-page-display') : null;
  const textCarouselTrack = projectDetailModal ? projectDetailModal.querySelector('.text-carousel-track') : null;
  const textCarouselPrevBtn = projectDetailModal ? projectDetailModal.querySelector('.text-carousel-arrow.prev') : null;
  const textCarouselNextBtn = projectDetailModal ? projectDetailModal.querySelector('.text-carousel-arrow.next') : null;
  const textCarouselDotsContainer = projectDetailModal ? projectDetailModal.querySelector('.text-carousel-dots-container') : null;

  let currentProjectData = null;
  let currentTextPageIndex = 0;

  // Variables for modal image slider
  let modalImageSliderInterval = null;
  let currentModalImageIndex = 0;

  // --- Variables for Text Carousel Dragging ---
  let isTextDragging = false;
  let textDragStartPosX = 0;
  let textDragStartPosY = 0;
  let isTextDragAllowed = null; // null = undecided, true = horizontal swipe, false = vertical scroll
  let textDragCurrentTranslateX = 0;
  let textDragAnimationID = 0;

  // --- Placeholder Project Data (ensure this matches your intended structure) ---
  const portfolioProjectsData = [
    {
      title: "Project Alpha", shortDescription: "Brief for card Alpha.", mainImage: "assets/img/Web_Design_1.png",
      modalHeader: "Web Design",
      modalHeaderEl: "Σχεδιασμός Ιστοσελίδων",
      imageContainerClass: "web-screenshot-frame",
      modalSliderImages: [
        "assets/img/Web_Design_1.png",
        "assets/img/Web_Design_2.png",
        "assets/img/Web_Design_3.png",
        "assets/img/Web_Design_4.png"
      ],
      detailedContentPages: [
        "<h3>I developed a university assignment website focused on clear structure, usability, and functional design.</h3>",
        "<h3>My core skill set includes HTML, CSS, and JavaScript for building responsive and engaging web interfaces.</h3>",
        "<h3>I also use SQL and database systems to manage data efficiently and support more dynamic web solutions.</h3>"
      ],
      detailedContentPagesEl: [
        "<h3>Ανέπτυξα μια ιστοσελίδα πανεπιστημιακής εργασίας με έμφαση στην καθαρή δομή, τη χρηστικότητα και τον λειτουργικό σχεδιασμό.</h3>",
        "<h3>Το βασικό μου σύνολο δεξιοτήτων περιλαμβάνει HTML, CSS και JavaScript για responsive και ελκυστικά web interfaces.</h3>",
        "<h3>Χρησιμοποιώ επίσης SQL και συστήματα βάσεων δεδομένων για αποδοτική διαχείριση δεδομένων και πιο δυναμικές web λύσεις.</h3>"
      ]
    },
    {
      title: "Project Beta", shortDescription: "Brief for card Beta.", mainImage: "assets/img/App_Design_2.png",
      modalHeader: "App Design",
      modalHeaderEl: "Σχεδιασμός Εφαρμογών",
      imageClass: "app-screenshot",
      modalSliderImages: [
        "assets/img/CarInCommon-2.png",
        "assets/img/CarInCommon-1 .png",
        "assets/img/App-Design_1.png",
        "assets/img/App_Design_2.png"
      ],
      detailedContentPages: [
        "<h3>I have designed and developed university app projects, including a parking app, a friend finder app, and a shared car platform that helps groups manage vehicle usage, maintenance needs, and related services.</h3>",
        "<h3>I specialize in Android Studio, using Java and XML to create functional, well-structured, and user-friendly mobile applications.</h3>",
        "<h3>I also work with Firebase database and storage solutions to support real-time data handling, user information, and app content management.</h3>"
      ],
      detailedContentPagesEl: [
        "<h3>Έχω σχεδιάσει και αναπτύξει πανεπιστημιακά app projects, όπως εφαρμογή στάθμευσης, εφαρμογή εύρεσης φίλων και κοινόχρηστη πλατφόρμα αυτοκινήτου που βοηθά ομάδες να διαχειρίζονται χρήση οχήματος, ανάγκες συντήρησης και σχετικές υπηρεσίες.</h3>",
        "<h3>Εξειδικεύομαι στο Android Studio, χρησιμοποιώντας Java και XML για λειτουργικές, σωστά δομημένες και φιλικές προς τον χρήστη mobile εφαρμογές.</h3>",
        "<h3>Εργάζομαι επίσης με Firebase database και storage λύσεις για real-time διαχείριση δεδομένων, πληροφοριών χρηστών και περιεχομένου εφαρμογών.</h3>"
      ]
    },
    {
      title: "Project Gamma", shortDescription: "Brief for card Gamma.", mainImage: "assets/img/MOCKUP1.jpg",
      modalHeader: "Graphic Design",
      modalHeaderEl: "Γραφιστικός Σχεδιασμός",
      modalSliderImages: [
        "assets/img/MOCKUP1.jpg",
        "assets/img/MOCKUP2-b.jpg",
        "assets/img/products.png"
      ],
      detailedContentPages: [
        "<h3>I create visual work that transforms ideas into branding and design solutions that support both identity and business presence.</h3>",
        "<h3>My experience includes university assignments in poster design, product design concepts, and sketch development, which reflects my ability to draw, explore, and communicate ideas effectively.</h3>",
        "<h3>I work with Photoshop and Illustrator to produce visually strong, concept-based designs across digital and print-oriented projects.</h3>",
      ],
      detailedContentPagesEl: [
        "<h3>Δημιουργώ οπτική δουλειά που μετατρέπει ιδέες σε branding και σχεδιαστικές λύσεις που ενισχύουν τόσο την ταυτότητα όσο και την επιχειρηματική παρουσία.</h3>",
        "<h3>Η εμπειρία μου περιλαμβάνει πανεπιστημιακές εργασίες σε poster design, product design concepts και ανάπτυξη σκίτσων, κάτι που αντικατοπτρίζει την ικανότητά μου να σχεδιάζω, να εξερευνώ και να επικοινωνώ ιδέες αποτελεσματικά.</h3>",
        "<h3>Χρησιμοποιώ Photoshop και Illustrator για να παράγω οπτικά δυναμικά, concept-based σχέδια για digital και print-oriented projects.</h3>",
      ]
    },
    {
      title: "Project Delta", shortDescription: "Brief for card Delta.", mainImage: "assets/img/Emorph (1).jpg",
      modalHeader: "Product Design",
      modalHeaderEl: "Σχεδιασμός Προϊόντων",
      imageContainerClass: "web-screenshot-frame",
      modalSliderImages: [
        "assets/img/Emorph (1).jpg",
        "assets/img/Emorph (2).jpg",
        "assets/img/Emorph (3).jpg",
        "assets/img/emorph.png"
      ],
      detailedContentPages: [
        "<h3>I have worked on a range of projects that combined mechanical thinking with the design thinking process to bring products from early ideas to developed concepts.</h3>",
        "<h3>I have also taken part in design competitions, including a shoe design challenge where my team placed third in Greece.</h3>",
        "<h3>I use CAD and 3D design tools such as Blender and Creo Parametric to support product development, digital modeling, and visual exploration.</h3>"
      ],
      detailedContentPagesEl: [
        "<h3>Έχω εργαστεί σε μια σειρά από projects που συνδύαζαν μηχανική σκέψη με τη διαδικασία design thinking για να μετατρέψουν προϊόντα από αρχικές ιδέες σε αναπτυγμένες προτάσεις.</h3>",
        "<h3>Έχω επίσης λάβει μέρος σε διαγωνισμούς design, συμπεριλαμβανομένου ενός shoe design challenge όπου η ομάδα μου κατέκτησε την τρίτη θέση στην Ελλάδα.</h3>",
        "<h3>Χρησιμοποιώ CAD και 3D design εργαλεία όπως Blender και Creo Parametric για product development, digital modeling και οπτική διερεύνηση.</h3>"
      ]
    }
  ];

  function goToTextPage(pageIndex, animate = true) {
    if (!currentProjectData || !textCarouselTrack || !textCarouselPageDisplay) return;
    const pageContent = getCurrentLanguage() === 'el' && currentProjectData.detailedContentPagesEl
      ? currentProjectData.detailedContentPagesEl
      : currentProjectData.detailedContentPages;
    const pageCount = pageContent.length;
    if (pageIndex < 0) pageIndex = 0;
    if (pageIndex >= pageCount) pageIndex = pageCount - 1;

    const viewportWidth = Math.max(textCarouselPageDisplay.offsetWidth, textCarouselPageDisplay.getBoundingClientRect().width, 1);
    currentTextPageIndex = pageIndex;
    textDragCurrentTranslateX = -currentTextPageIndex * viewportWidth;

    if (animate) {
      textCarouselTrack.style.transition = 'transform 0.4s ease-in-out';
    } else {
      textCarouselTrack.style.transition = 'none';
    }
    textCarouselTrack.style.transform = `translateX(${textDragCurrentTranslateX}px)`;

    const dots = textCarouselDotsContainer.querySelectorAll('.text-carousel-dot');
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentTextPageIndex));

    if (textCarouselPrevBtn) textCarouselPrevBtn.disabled = currentTextPageIndex === 0;
    if (textCarouselNextBtn) textCarouselNextBtn.disabled = currentTextPageIndex >= pageCount - 1;
  }

  function generateTextCarouselPagesAndDots() {
    if (!currentProjectData || !textCarouselTrack || !textCarouselDotsContainer) return;
    const pageContent = getCurrentLanguage() === 'el' && currentProjectData.detailedContentPagesEl
      ? currentProjectData.detailedContentPagesEl
      : currentProjectData.detailedContentPages;

    // Reset the track position so old translates don't push new pages offscreen
    textDragCurrentTranslateX = 0;
    currentTextPageIndex = 0;
    textCarouselTrack.style.transition = 'none';
    textCarouselTrack.style.transform = 'translateX(0)';

    textCarouselTrack.innerHTML = '';
    textCarouselDotsContainer.innerHTML = '';
    pageContent.forEach((pageHTML, index) => {
      const pageElement = document.createElement('div');
      pageElement.classList.add('text-carousel-page');
      pageElement.innerHTML = pageHTML;
      textCarouselTrack.appendChild(pageElement);
      const dot = document.createElement('button');
      dot.classList.add('text-carousel-dot');
      dot.setAttribute('aria-label', `Go to page ${index + 1}`);
      dot.addEventListener('click', () => goToTextPage(index));
      textCarouselDotsContainer.appendChild(dot);
    });
  }

  function changeModalImage() {
    if (!currentProjectData || !modalMainImage || !currentProjectData.modalSliderImages || currentProjectData.modalSliderImages.length < 2) {
      return; // No slider if not enough images
    }

    modalMainImage.style.opacity = '0'; // Start fade out

    setTimeout(() => {
      currentModalImageIndex = (currentModalImageIndex + 1) % currentProjectData.modalSliderImages.length;
      modalMainImage.src = currentProjectData.modalSliderImages[currentModalImageIndex];
      modalMainImage.alt = `${currentProjectData.title} image ${currentModalImageIndex + 1}`;
      modalMainImage.style.opacity = '1'; // Start fade in
    }, 750); // Wait for fade out (matches half of 1.5s total, or full 0.7s opacity transition)
  }

  function startModalImageSlider() {
    if (!currentProjectData || !currentProjectData.modalSliderImages || currentProjectData.modalSliderImages.length < 2) {
      // If only one image or no images, just ensure the first one is displayed if available
      if (modalMainImage && currentProjectData && currentProjectData.modalSliderImages && currentProjectData.modalSliderImages.length === 1) {
        modalMainImage.src = currentProjectData.modalSliderImages[0];
        modalMainImage.alt = currentProjectData.title + " image 1";
        modalMainImage.style.opacity = '1';
      } else if (modalMainImage && currentProjectData && currentProjectData.mainImage) {
        modalMainImage.src = currentProjectData.mainImage;
        modalMainImage.alt = currentProjectData.title + " image";
        modalMainImage.style.opacity = '1';
      }
      return; // Don't start interval if not enough images for a slideshow
    }

    // Set initial image immediately
    currentModalImageIndex = 0;
    modalMainImage.src = currentProjectData.modalSliderImages[currentModalImageIndex];
    modalMainImage.alt = `${currentProjectData.title} image ${currentModalImageIndex + 1}`;
    modalMainImage.style.opacity = '1';

    if (modalImageSliderInterval) clearInterval(modalImageSliderInterval); // Clear existing interval
    modalImageSliderInterval = setInterval(changeModalImage, 5000); // 5 seconds
  }

  function openProjectModal(projectIndex) {
    if (!projectDetailModal || !portfolioProjectsData[projectIndex]) return;
    currentProjectData = portfolioProjectsData[projectIndex];
    currentTextPageIndex = 0;
    if (modalProjectTitle) {
      modalProjectTitle.textContent = getCurrentLanguage() === 'el'
        ? (currentProjectData.modalHeaderEl || currentProjectData.modalHeader || 'Project Details')
        : (currentProjectData.modalHeader || 'Project Details');
    }

    if (modalMainImage) {
      if (currentProjectData.imageClass) {
        modalMainImage.className = 'modal-project-image ' + currentProjectData.imageClass;
      } else {
        modalMainImage.className = 'modal-project-image';
      }
    }

    if (modalImageSliderContainer) {
      modalImageSliderContainer.className = 'modal-image-slider-container';
      if (currentProjectData.imageContainerClass) {
        modalImageSliderContainer.classList.add(currentProjectData.imageContainerClass);
      }
    }

    // Show modal first so layout measurements (offsetWidth) are correct
    projectDetailModal.style.display = 'flex';
    document.body.classList.add('modal-open');

    // Generate pages + position carousel after browser has laid out modal
    requestAnimationFrame(() => {
      generateTextCarouselPagesAndDots();
      // Delay positioning until after the DOM update (widths can be 0 on first pass)
      requestAnimationFrame(() => {
        goToTextPage(currentTextPageIndex, false); // Set initial page without animation
      });
      startModalImageSlider();
    });

    setTimeout(() => projectDetailModal.classList.add('show'), 10);
  }

  function closeProjectModal() {
    if (!projectDetailModal) return;
    projectDetailModal.classList.remove('show');
    document.body.classList.remove('modal-open');
    currentProjectData = null;
    if (modalImageSliderInterval) clearInterval(modalImageSliderInterval);
    modalImageSliderInterval = null;
    currentModalImageIndex = 0;
    if (isTextDragging) { // Reset drag state if modal is closed mid-drag
      isTextDragging = false;
      document.body.style.cursor = '';
      textCarouselTrack.style.transition = 'transform 0.4s ease-in-out';
    }
  }

  // Text Carousel Arrow Listeners
  if (textCarouselPrevBtn) {
    textCarouselPrevBtn.addEventListener('click', () => goToTextPage(currentTextPageIndex - 1));
  }
  if (textCarouselNextBtn) {
    textCarouselNextBtn.addEventListener('click', () => goToTextPage(currentTextPageIndex + 1));
  }

  // --- Text Carousel Drag Logic ---
  function getTextPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function getTextPositionY(event) {
    return event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
  }

  function textDragStart(event) {
    if (!currentProjectData) return;

    textDragStartPosX = getTextPositionX(event);
    textDragStartPosY = getTextPositionY(event);
    isTextDragAllowed = null;
    isTextDragging = true;
    textDragAnimationID = requestAnimationFrame(textDragAnimationLoop);
    textCarouselTrack.style.transition = 'none';
    document.body.style.cursor = 'grabbing';
  }

  function textDragAnimationLoop() {
    if (isTextDragging) {
      textCarouselTrack.style.transform = `translateX(${textDragCurrentTranslateX}px)`;
      requestAnimationFrame(textDragAnimationLoop);
    }
  }

  function textDragMove(event) {
    if (!isTextDragging || !currentProjectData) return;

    const currentX = getTextPositionX(event);
    const currentY = getTextPositionY(event);
    const diffX = currentX - textDragStartPosX;
    const diffY = currentY - textDragStartPosY;

    // On touch devices, determine whether the user intends a vertical scroll (within the page)
    // or a horizontal swipe (between carousel pages).
    if (isTextDragAllowed === null) {
      if (Math.abs(diffY) > Math.abs(diffX) + 6) {
        // Vertical movement wins: stop drag handling and allow native scroll
        isTextDragging = false;
        document.body.style.cursor = '';
        cancelAnimationFrame(textDragAnimationID);
        return;
      }

      if (Math.abs(diffX) > Math.abs(diffY) + 6) {
        isTextDragAllowed = true;
      } else {
        // Not enough movement to decide; keep waiting for more movement
        return;
      }
    }

    if (!isTextDragAllowed) return;

    const baseTranslateX = -currentTextPageIndex * textCarouselPageDisplay.offsetWidth;
    textDragCurrentTranslateX = baseTranslateX + diffX;
  }

  function textDragAnimationLoop() {
    if (isTextDragging) {
      textCarouselTrack.style.transform = `translateX(${textDragCurrentTranslateX}px)`;
      requestAnimationFrame(textDragAnimationLoop);
    }
  }

  function textDragMove(event) {
    if (!isTextDragging || !currentProjectData) return;
    const currentX = getTextPositionX(event);
    const diffX = currentX - textDragStartPosX;
    const baseTranslateX = -currentTextPageIndex * textCarouselPageDisplay.offsetWidth;
    textDragCurrentTranslateX = baseTranslateX + diffX;
    // No need to set transform here directly if using rAF loop, but for immediate feedback outside loop:
    // textCarouselTrack.style.transform = `translateX(${textDragCurrentTranslateX}px)`; 
  }

  function textDragEnd() {
    if (!isTextDragging || !currentProjectData) return;
    isTextDragging = false;
    isTextDragAllowed = null;
    cancelAnimationFrame(textDragAnimationID);
    document.body.style.cursor = '';
    textCarouselTrack.style.transition = 'transform 0.4s ease-in-out';

    const viewportWidth = textCarouselPageDisplay.offsetWidth;
    const draggedDistance = textDragCurrentTranslateX - (-currentTextPageIndex * viewportWidth);
    const threshold = viewportWidth / 4; // Must drag at least 1/4 of the page width

    let newPageIndex = currentTextPageIndex;
    if (draggedDistance < -threshold && currentTextPageIndex < currentProjectData.detailedContentPages.length - 1) {
      newPageIndex++;
    } else if (draggedDistance > threshold && currentTextPageIndex > 0) {
      newPageIndex--;
    }
    goToTextPage(newPageIndex);
  }

  if (textCarouselPageDisplay) { // Viewport for drag
    textCarouselPageDisplay.addEventListener('mousedown', textDragStart);
    textCarouselPageDisplay.addEventListener('touchstart', textDragStart, { passive: true });
  }
  document.addEventListener('mousemove', textDragMove);
  document.addEventListener('touchmove', textDragMove, { passive: true });
  document.addEventListener('mouseup', textDragEnd);
  document.addEventListener('touchend', textDragEnd);

  // Prevent image dragging interference (if any images are inside text pages)
  if (textCarouselTrack) {
    textCarouselTrack.ondragstart = () => false;
  }

  // --- Existing Modal Trigger and Close Logic ---
  seeMorePrompts.forEach(prompt => {
    prompt.addEventListener('click', (event) => {
      const slide = event.target.closest('.portfolio-slide');
      if (slide) {
        const projectIndex = slide.dataset.projectIndex;
        if (projectIndex !== undefined) {
          openProjectModal(parseInt(projectIndex, 10));
        }
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeProjectModal);
  }

  if (projectDetailModal) {
    projectDetailModal.addEventListener('click', (event) => {
      if (event.target === projectDetailModal) {
        closeProjectModal();
      }
    });
  }

  // Adjust resize listener for text carousel
  window.addEventListener('resize', () => {
    if (projectDetailModal && projectDetailModal.classList.contains('show')) {
      // For image slider (already present)
      // For text carousel, readjust position without animation if viewport width changed
      if (textCarouselTrack && currentProjectData) {
        goToTextPage(currentTextPageIndex, false);
      }
    }
  });

});

// === Tool Logo Tooltip Functionality ===
document.addEventListener('DOMContentLoaded', function() {
  const tooltip = document.getElementById('carousel-tooltip');
  const toolsLogosContainer = document.querySelector('.about-tools-logos');
  
  if (!tooltip || !toolsLogosContainer) return;
  
  let tooltipTimeout = null;
  
  // Use event delegation to handle dynamically loaded logos
  toolsLogosContainer.addEventListener('mouseenter', function(e) {
    const logo = e.target.closest('.tool-logo');
    if (logo) {
      const altText = logo.getAttribute('alt');
      if (altText) {
        // Clear any existing timeout
        if (tooltipTimeout) {
          clearTimeout(tooltipTimeout);
        }
        
        // Set tooltip content using the alt attribute
        tooltip.textContent = altText;
        
        // Show tooltip with slight delay for better UX
        tooltipTimeout = setTimeout(() => {
          tooltip.classList.add('show');
          updateTooltipPosition(e);
        }, 200);
      }
    }
  }, true); // Use capture to ensure we catch the event
  
  toolsLogosContainer.addEventListener('mouseleave', function(e) {
    const logo = e.target.closest('.tool-logo');
    if (logo) {
      // Clear timeout and hide tooltip
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
      }
      tooltip.classList.remove('show');
    }
  }, true);
  
  toolsLogosContainer.addEventListener('mousemove', function(e) {
    const logo = e.target.closest('.tool-logo');
    if (logo && tooltip.classList.contains('show')) {
      updateTooltipPosition(e);
    }
  }, true);
  
  // Hide tooltip when mouse leaves the entire tools logos area
  toolsLogosContainer.addEventListener('mouseleave', function(e) {
    // Only hide if not leaving to another logo within the container
    if (!e.relatedTarget || !e.relatedTarget.closest('.tool-logo')) {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
      }
      tooltip.classList.remove('show');
    }
  });
  
  function updateTooltipPosition(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Position tooltip above the cursor
    tooltip.style.left = mouseX + 'px';
    tooltip.style.top = mouseY + 'px';
  }
  
  // Also try to attach to any existing logos immediately
  function attachToExistingLogos() {
    const existingLogos = document.querySelectorAll('.tool-logo');
    existingLogos.forEach(logo => {
      // Remove any existing listeners to avoid duplicates
      logo.replaceWith(logo.cloneNode(true));
    });
    
    // Re-attach to fresh logos
    const freshLogos = document.querySelectorAll('.tool-logo');
    freshLogos.forEach(logo => {
      logo.addEventListener('mouseenter', function(e) {
        const altText = this.getAttribute('alt');
        if (altText) {
          if (tooltipTimeout) clearTimeout(tooltipTimeout);
          tooltip.textContent = altText;
          tooltipTimeout = setTimeout(() => {
            tooltip.classList.add('show');
            updateTooltipPosition(e);
          }, 200);
        }
      });
      
      logo.addEventListener('mouseleave', function() {
        if (tooltipTimeout) {
          clearTimeout(tooltipTimeout);
          tooltipTimeout = null;
        }
        tooltip.classList.remove('show');
      });
      
      logo.addEventListener('mousemove', function(e) {
        if (tooltip.classList.contains('show')) {
          updateTooltipPosition(e);
        }
      });
    });
  }
  
  // Initial attachment
  attachToExistingLogos();
  
  // Re-attach whenever logos might change (after carousel animations)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.target.classList.contains('about-tools-logos')) {
        attachToExistingLogos();
      }
    });
  });
  
  if (toolsLogosContainer) {
    observer.observe(toolsLogosContainer, {
      childList: true,
      subtree: true
    });
  }
});

// Simple Tool Logo Tooltips
setTimeout(function() {
  const tooltip = document.createElement('div');
  tooltip.style.cssText = 'position:fixed;background:#000;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999;opacity:0;transition:opacity 0.2s;font-family:"Berlinerins Trial", Arial, sans-serif;font-size:20px;';
  document.body.appendChild(tooltip);
  
  const logos = document.querySelectorAll('.tool-logo');
  console.log('Found logos:', logos.length);
  
  logos.forEach((logo, index) => {
    console.log(`Logo ${index}:`, logo.alt);
    
    // Enable pointer events on the logos
    logo.style.pointerEvents = 'auto';
    
    logo.onmouseover = function() {
      console.log('Mouse over:', this.alt);
      tooltip.textContent = this.alt;
      tooltip.style.opacity = '1';
    };
    
    logo.onmouseout = function() {
      console.log('Mouse out');
      tooltip.style.opacity = '0';
    };
    
    logo.onmousemove = function(e) {
      tooltip.style.left = e.clientX + 10 + 'px';
      tooltip.style.top = e.clientY - 30 + 'px';
    };
  });
}, 500);

// Scroll-based fade between Sections
window.addEventListener('scroll', function () {
  if (ignoreScroll) return;

  const mainContent = document.getElementById('main-content');
  const aboutMe = document.getElementById('about-me');
  const portfolioSection = document.getElementById('portfolio');
  const contactSection = document.getElementById('contact'); // Get contact section

  if (!mainContent || !aboutMe || !portfolioSection || !contactSection) return; // Check contact section

  const mainRect = mainContent.getBoundingClientRect();
  const aboutRect = aboutMe.getBoundingClientRect();
  const portfolioRect = portfolioSection.getBoundingClientRect(); // Get portfolio rect
  const windowHeight = window.innerHeight;

  // --- Transition 1: Main Content -> About Me --- 
  const fade1Start = windowHeight * 0.8;
  const fade1End = windowHeight * 0.2;
  let progress1 = 0;
  if (mainRect.bottom < fade1Start) {
    progress1 = Math.min(1, (fade1Start - mainRect.bottom) / (fade1Start - fade1End));
  }
  progress1 = Math.max(0, progress1);

  // --- Transition 2: About Me -> Portfolio --- 
  const fade2Start = windowHeight * 0.8;
  const fade2End = windowHeight * 0.2;
  let progress2 = 0;
  if (aboutRect.bottom < fade2Start) {
    progress2 = Math.min(1, (fade2Start - aboutRect.bottom) / (fade2Start - fade2End));
  }
  progress2 = Math.max(0, progress2);

  // --- Transition 3: Portfolio -> Contact --- 
  const fade3Start = windowHeight * 0.8;
  const fade3End = windowHeight * 0.2;
  let progress3 = 0;
  if (portfolioRect.bottom < fade3Start) {
    progress3 = Math.min(1, (fade3Start - portfolioRect.bottom) / (fade3Start - fade3End));
  }
  progress3 = Math.max(0, progress3);

  // Apply Opacity based on transitions
  mainContent.style.opacity = 1 - progress1;
  aboutMe.style.opacity = progress1 * (1 - progress2); // Fade in then out
  portfolioSection.style.opacity = progress2 * (1 - progress3); // Fade in then out
  contactSection.style.opacity = progress3; // Fade in

  // Update Pointer Events & Z-Index
  if (progress3 > 0.5) { // Contact is dominant
    mainContent.style.pointerEvents = 'none';
    aboutMe.style.pointerEvents = 'none';
    portfolioSection.style.pointerEvents = 'none';
    contactSection.style.pointerEvents = 'auto';
    mainContent.style.zIndex = '1';
    aboutMe.style.zIndex = '2';
    portfolioSection.style.zIndex = '3';
    contactSection.style.zIndex = '4';
  } else if (progress2 > 0.5) { // Portfolio is dominant
    mainContent.style.pointerEvents = 'none';
    aboutMe.style.pointerEvents = 'none';
    portfolioSection.style.pointerEvents = 'auto';
    contactSection.style.pointerEvents = 'none';
    mainContent.style.zIndex = '1';
    aboutMe.style.zIndex = '2';
    portfolioSection.style.zIndex = '4'; // Highest when active
    contactSection.style.zIndex = '3';
  } else if (progress1 > 0.5) { // About Me is dominant
    mainContent.style.pointerEvents = 'none';
    aboutMe.style.pointerEvents = 'auto';
    portfolioSection.style.pointerEvents = 'none';
    contactSection.style.pointerEvents = 'none';
    mainContent.style.zIndex = '1';
    aboutMe.style.zIndex = '4'; // Highest when active
    portfolioSection.style.zIndex = '3';
    contactSection.style.zIndex = '2';
  } else { // Main Content is dominant
    mainContent.style.pointerEvents = 'auto';
    aboutMe.style.pointerEvents = 'none';
    portfolioSection.style.pointerEvents = 'none';
    contactSection.style.pointerEvents = 'none';
    mainContent.style.zIndex = '4'; // Highest when active
    aboutMe.style.zIndex = '3';
    portfolioSection.style.zIndex = '2';
    contactSection.style.zIndex = '1';
  }
});

// Adjust showAbout, showMain, and MyWorkBtn click to primarily handle scrolling

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    ignoreScroll = true; // Prevent scroll listener interference during animation
    smoothScrollTo(section, 900);
    // The scroll listener will handle the fade
    // We set the final state after the scroll animation
    setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      const aboutMe = document.getElementById('about-me');
      const portfolioSection = document.getElementById('portfolio');
      const contactSection = document.getElementById('contact'); // Get contact section

      if (mainContent && aboutMe && portfolioSection && contactSection) {
        mainContent.style.opacity = sectionId === 'main-content' ? '1' : '0';
        aboutMe.style.opacity = sectionId === 'about-me' ? '1' : '0';
        portfolioSection.style.opacity = sectionId === 'portfolio' ? '1' : '0';
        contactSection.style.opacity = sectionId === 'contact' ? '1' : '0'; // Set contact opacity

        mainContent.style.pointerEvents = sectionId === 'main-content' ? 'auto' : 'none';
        aboutMe.style.pointerEvents = sectionId === 'about-me' ? 'auto' : 'none';
        portfolioSection.style.pointerEvents = sectionId === 'portfolio' ? 'auto' : 'none';
        contactSection.style.pointerEvents = sectionId === 'contact' ? 'auto' : 'none'; // Set contact pointer-events

        // Simplified Z-Index logic: Target section highest, others lower
        mainContent.style.zIndex = sectionId === 'main-content' ? '4' : '1';
        aboutMe.style.zIndex = sectionId === 'about-me' ? '4' : '1';
        portfolioSection.style.zIndex = sectionId === 'portfolio' ? '4' : '1';
        contactSection.style.zIndex = sectionId === 'contact' ? '4' : '1';
      }
      ignoreScroll = false;
    }, 950); // Match scroll duration + buffer
  }
}

function showAbout() {
  scrollToSection('about-me');
}

function showMain() {
  scrollToSection('main-content');
}

// Update MY WORK button listener to use scrollToSection
document.addEventListener('DOMContentLoaded', function () {
  const myWorkBtn = document.querySelector('.my-work-btn');
  if (myWorkBtn) {
    myWorkBtn.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToSection('portfolio');
    });
  }

  // Toolbar link for MY WORK
  const workNavLink = document.querySelector('.toolbar-menu a[href="#work"]');
  if (workNavLink) {
    workNavLink.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToSection('portfolio');
    });
  }

  // Toolbar link for ABOUT
  const aboutNavLink = document.querySelector('.toolbar-menu a[href="#about"]');
  if (aboutNavLink) {
    aboutNavLink.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToSection('about-me');
    });
  }

  // Toolbar link for HOME
  const homeNavLink = document.querySelector('.toolbar-menu a[href="#hero"]');
  if (homeNavLink) {
    homeNavLink.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToSection('main-content');
    });
  }

  // CONTACT ME button in Portfolio section
  const portfolioContactBtn = document.querySelector('.portfolio-content .contact-btn');
  if (portfolioContactBtn) {
    portfolioContactBtn.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToSection('contact'); // Target the contact section ID
    });
  }

  // Toolbar link for CONTACT
  const contactNavLink = document.querySelector('.toolbar-menu a[href="#contact"]');
  if (contactNavLink) {
    contactNavLink.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToSection('contact');
    });
  }
});

// Initial setup on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  const mainContent = document.getElementById('main-content');
  const aboutMe = document.getElementById('about-me');
  const portfolioSection = document.getElementById('portfolio');
  const contactSection = document.getElementById('contact'); // Get contact section

  if (mainContent) mainContent.style.opacity = '1';
  if (aboutMe) aboutMe.style.opacity = '0';
  if (portfolioSection) portfolioSection.style.opacity = '0';
  if (contactSection) contactSection.style.opacity = '0'; // Initialize contact section opacity

  if (mainContent) mainContent.style.pointerEvents = 'auto';
  if (aboutMe) aboutMe.style.pointerEvents = 'none';
  if (portfolioSection) portfolioSection.style.pointerEvents = 'none';
  if (contactSection) contactSection.style.pointerEvents = 'none'; // Initialize contact pointer-events

  if (mainContent) mainContent.style.zIndex = '4'; // Highest z-index
  if (aboutMe) aboutMe.style.zIndex = '3';
  if (portfolioSection) portfolioSection.style.zIndex = '2';
  if (contactSection) contactSection.style.zIndex = '1'; // Lowest z-index
});

// Add event listener for the back-to-top button
const backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// // --- Generate Slides and Dots from Data ---
// function generatePortfolioItems() {
//   carousel.innerHTML = ''; // Clear existing slides
//   dotsContainer.innerHTML = ''; // Clear existing dots

//   portfolioProjects.forEach((project, index) => {
//     // Create Slide
//     const slide = document.createElement('div');
//     slide.classList.add('portfolio-slide');

//     // Create Image Container & Image
//     const imageContainer = document.createElement('div');
//     imageContainer.classList.add('portfolio-image-container');
//     const img = document.createElement('img');
//     img.src = project.image;
//     img.alt = project.title + " Image";
//     img.classList.add('portfolio-image-item');
//     imageContainer.appendChild(img);
//     // Append Image Container to Slide FIRST
//     slide.appendChild(imageContainer);

//     // Create Text Content Container (now separate)
//     const textContent = document.createElement('div');
//     textContent.classList.add('portfolio-text-content'); // Removed 'overlay' class here
//     const title = document.createElement('h3');
//     title.classList.add('portfolio-item-title');
//     title.textContent = project.title; // Use project title
//     const description = document.createElement('p');
//     description.classList.add('portfolio-item-description');
//     description.textContent = project.description; // Use project description
//     textContent.appendChild(title);
//     textContent.appendChild(description);
//     // Append Text Content to Slide SECOND
//     slide.appendChild(textContent);

//     carousel.appendChild(slide);

//     // Create Dot
//     const dot = document.createElement('button');
//     dot.classList.add('portfolio-dot');
//     dot.setAttribute('aria-label', `Go to project ${index + 1}`);
//     dot.addEventListener('click', () => goToSlide(index));
//     dotsContainer.appendChild(dot);
//   });

//   // Re-initialize slides array and UI after generation
//   slides = document.querySelectorAll('.portfolio-slide');
//   totalSlides = slides.length;
//   dots = dotsContainer.querySelectorAll('.portfolio-dot');
//   if (totalSlides > 0) {
//     currentSlideIndex = 0; // Reset index
//     goToSlide(currentSlideIndex);
//   } else {
//     updateUI(); // Update arrows if no slides
//   }
// }
// generatePortfolioItems(); // Call the function to build slides initially

// --- Button Splash Ripple Effect ---
document.querySelectorAll('.about-btn').forEach(button => {
  button.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // The #about button has its own delayed scroll logic above. 
    // For other buttons (like "MY WORK" going to #work), we prevent default and handle it here.
    if (href && href !== '#about' && href !== '#hero') {
      e.preventDefault();
    }

    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.classList.add('splash-ripple');

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    this.appendChild(ripple);

    // Remove the ripple element after the CSS animation finishes (0.6s)
    setTimeout(() => {
      ripple.remove();
    }, 600);

    // Delay scroll to allow splash to visibly expand before viewport moves
    if (href && href !== '#about' && href !== '#hero') {
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          smoothScrollTo(target, 900);
        }
      }, 350);
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const langIcons = document.querySelectorAll('.lang-icon');
  const aboutSection = document.getElementById('about-me');
  const englishIcon = document.querySelector('.lang-icon[alt="English"]');

  function renderLocalizedHeroName(lang) {
    const heroNameElement = document.querySelector('.hero-name');
    if (!heroNameElement) return;

    const textMarkup = heroNameElement.getAttribute(lang === 'el' ? 'data-greek' : 'data-english');
    if (!textMarkup) return;

    const rendered = textMarkup
      .split('')
      .map(char => {
        if (char === ' ' || char === '\n') return '<span class="hero-letter">&nbsp;</span>';
        if (char === '<' || char === '>') return char;
        return `<span class="hero-letter">${char}</span>`;
      })
      .join('')
      .replace(/<span class="hero-letter">&lt;<\/span>br<span class="hero-letter">&gt;<\/span>/g, '<br>');

    heroNameElement.innerHTML = rendered;
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-greek][data-english]').forEach(element => {
      if (element.classList.contains('hero-name')) {
        return;
      }

      const nextText = element.getAttribute(lang === 'el' ? 'data-greek' : 'data-english');
      if (!nextText) return;

      if (nextText.includes('<br>')) {
        element.innerHTML = nextText;
      } else {
        element.textContent = nextText;
      }
    });

    renderLocalizedHeroName(lang);

    if (typeof updateCards === 'function') {
      updateCards();
    }

    const activeSlide = document.querySelector('.portfolio-slide.active');
    const mobileTitle = document.querySelector('.portfolio-mobile-title');
    const mobileDesc = document.querySelector('.portfolio-mobile-description');
    if (activeSlide && mobileTitle && mobileDesc) {
      const titleEl = activeSlide.querySelector('.portfolio-item-title');
      const descEl = activeSlide.querySelector('.portfolio-item-description');
      mobileTitle.innerText = titleEl ? titleEl.innerText : '';
      mobileDesc.innerText = descEl ? descEl.innerText : '';
    }

    if (typeof currentProjectData !== 'undefined' && currentProjectData && typeof generateTextCarouselPagesAndDots === 'function' && typeof goToTextPage === 'function') {
      if (typeof modalProjectTitle !== 'undefined' && modalProjectTitle) {
        modalProjectTitle.textContent = lang === 'el'
          ? (currentProjectData.modalHeaderEl || currentProjectData.modalHeader || 'Project Details')
          : (currentProjectData.modalHeader || 'Project Details');
      }
      const pageIndex = typeof currentTextPageIndex !== 'undefined' ? currentTextPageIndex : 0;
      generateTextCarouselPagesAndDots();
      goToTextPage(pageIndex, false);
    }
  }

  function updateInactiveIconFilters() {
    const isPastAbout = aboutSection && window.scrollY > (aboutSection.offsetTop + aboutSection.offsetHeight);

    langIcons.forEach(icon => {
      if (icon.classList.contains('active')) {
        icon.style.filter = 'none';
        return;
      }

      icon.classList.toggle('black', !!isPastAbout);
      icon.style.filter = isPastAbout
        ? 'brightness(0) contrast(3)'
        : 'brightness(0) invert(1) contrast(3)';
    });
  }

  function activateLanguage(icon) {
    langIcons.forEach(otherIcon => {
      const isActive = otherIcon === icon;
      otherIcon.classList.toggle('active', isActive);
      otherIcon.src = otherIcon.getAttribute(isActive ? 'data-active' : 'data-default');
    });

    updateInactiveIconFilters();
    applyLanguage(icon.getAttribute('alt') === 'Greek' ? 'el' : 'en');
  }

  langIcons.forEach(icon => {
    icon.addEventListener('click', function (event) {
      event.preventDefault();
      activateLanguage(this);
    });
  });

  window.addEventListener('scroll', updateInactiveIconFilters);

  if (englishIcon) {
    activateLanguage(englishIcon);
  } else {
    applyLanguage('en');
  }
});

// === Language Icon Switcher ===
document.addEventListener('DOMContentLoaded', function() {
  const langIcons = document.querySelectorAll('.lang-icon');
  const aboutSection = document.getElementById('about-me');
  let currentLang = 'en'; // Default language is English

  function renderHeroNameWithLetters(markup) {
    return markup
      .split('')
      .map(char => {
        if (char === ' ' || char === '\n') return '<span class="hero-letter">&nbsp;</span>';
        if (char === '<' || char === '>') return char;
        return `<span class="hero-letter">${char}</span>`;
      })
      .join('')
      .replace(/<span class="hero-letter">&lt;<\/span>br<span class="hero-letter">&gt;<\/span>/g, '<br>');
  }
  
  // Set English flag as active by default
  const englishIcon = document.querySelector('[alt="English"]');
  if (englishIcon) {
    englishIcon.classList.add('active');
    englishIcon.src = englishIcon.getAttribute('data-active');
    englishIcon.style.filter = 'none';
  }
  
  // Language switching function
  function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    updateAllTexts(lang);
    updateDynamicContentLanguage(lang);
  }
  
  // Function to update all texts based on current language
  function updateAllTexts(lang) {
    const translatableElements = document.querySelectorAll('[data-greek]');
    
    translatableElements.forEach(element => {
      
      // Skip about description elements as they're handled by updateAboutDescription
      if (element.parentElement.classList.contains('about-description')) {
        console.log('Skipping about description element');
        return;
      }
      
      if (lang === 'el') {
        // Switch to Greek
        const greekText = element.getAttribute('data-greek');
        if (element.classList.contains('hero-name')) {
          element.innerHTML = renderHeroNameWithLetters(greekText);
        } else if (element.tagName === 'SPAN' && greekText.includes('<br>')) {
          // Handle multi-line text like hero name
          element.innerHTML = greekText;
        } else {
          element.textContent = greekText;
        }
      } else {
        // Switch to English (restore original)
        if (element.tagName === 'SPAN' && element.classList.contains('hero-name')) {
          const englishMarkup = element.getAttribute('data-english') || 'ARGYRIS<br>SERGIANNIS';
          element.innerHTML = renderHeroNameWithLetters(englishMarkup);
        } else if (element.classList.contains('about-btn')) {
          // Restore original English for about buttons
          if (element.classList.contains('my-work-btn')) {
            element.textContent = 'MY WORK';
          } else {
            element.textContent = 'ABOUT ME';
          }
        } else if (element.tagName === 'A') {
          // Restore original English for navigation links
          const navTranslations = {
            'ΑΡΧΙΚΗ': 'HOME',
            'ΣΧΕΤΙΚΑ': 'ABOUT',
            'ΔΟΥΛΕΙΑ': 'MY WORK',
            'ΕΠΙΚΟΙΝΩΝΙΑ': 'CONTACT'
          };
          const currentText = element.textContent;
          element.textContent = navTranslations[currentText] || currentText;
        } else if (element.tagName === 'H2' || element.tagName === 'H3') {
          // Restore original English for headings
          const headingTranslations = {
            'ΣΧΕΔΙΑΣΤΙΚΗ ΕΠΙΚΕΝΤΡΩΣΗ': 'DESIGN FOCUS',
            'ΣΧΕΔΙΑΣΤΙΚΗ ΕΠΙΚΕΝΤΡΩΣΗ UI/UX': 'UI/UX DESIGN FOCUS',
            'Η ΔΟΥΛΕΙΑ ΜΟΥ': 'MY WORK'
          };
          const currentText = element.textContent;
          element.textContent = headingTranslations[currentText] || currentText;
        } else if (element.tagName === 'P') {
          // Skip about description paragraphs as they're handled by carousel
          if (!element.parentElement.classList.contains('about-description')) {
            element.textContent = 'SPECIALIZING IN USER-CENTRIC PRODUCT DESIGN, I CRAFT INTUITIVE, ENGAGING EXPERIENCES THAT BLEND CREATIVITY WITH FUNCTIONAL EXCELLENCE, TRANSFORMING COMPLEX IDEAS INTO ELEGANT, USER-FRIENDLY SOLUTIONS THAT RESONATE WITH PEOPLE.';
          }
        }
      }
    });
  }
  
  // Legacy helper (now disabled) – titles/descriptions are driven directly
  // by the main carousel logic to avoid mismatches with icons.
  function updateAboutDescription() {
    return;
  }

  function updateAllTexts(lang) {
    const translatableElements = document.querySelectorAll('[data-greek][data-english]');

    translatableElements.forEach(element => {
      const nextText = element.getAttribute(lang === 'el' ? 'data-greek' : 'data-english');
      if (!nextText) return;

      if (nextText.includes('<br>')) {
        element.innerHTML = nextText;
      } else {
        element.textContent = nextText;
      }
    });
  }

  function updateDynamicContentLanguage(lang) {
    if (typeof updateCards === 'function') {
      updateCards();
    }

    const mobileTitle = document.querySelector('.portfolio-mobile-title');
    const mobileDesc = document.querySelector('.portfolio-mobile-description');
    const activeSlide = document.querySelector('.portfolio-slide.active');
    if (activeSlide && mobileTitle && mobileDesc) {
      const titleEl = activeSlide.querySelector('.portfolio-item-title');
      const descEl = activeSlide.querySelector('.portfolio-item-description');
      mobileTitle.innerText = titleEl ? titleEl.innerText : '';
      mobileDesc.innerText = descEl ? descEl.innerText : '';
    }

    if (currentProjectData && typeof generateTextCarouselPagesAndDots === 'function' && typeof goToTextPage === 'function') {
      const currentIndex = currentTextPageIndex;
      if (modalProjectTitle) {
        modalProjectTitle.textContent = lang === 'el'
          ? (currentProjectData.modalHeaderEl || currentProjectData.modalHeader || 'Project Details')
          : (currentProjectData.modalHeader || 'Project Details');
      }
      generateTextCarouselPagesAndDots();
      goToTextPage(currentIndex, false);
    }
  }
  
  // Monitor carousel changes to maintain language
  function setupCarouselLanguageMonitor() {
    const carousel = document.querySelector('.about-me .carousel');
    if (carousel) {
      // Create a MutationObserver to watch for changes in the carousel
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            // Re-apply language settings after carousel change
            setTimeout(() => {
              updateAboutDescription();
              updateAllTexts(currentLang);
              updateDynamicContentLanguage(currentLang);
            }, 50);
          }
        });
      });
      
      // Start observing the carousel for changes
      observer.observe(carousel, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }
  
  // Initialize carousel monitor
  setupCarouselLanguageMonitor();

  document.documentElement.lang = currentLang;
  
  // Initial update of about description
  updateAboutDescription();
  updateAllTexts(currentLang);
  updateDynamicContentLanguage(currentLang);
  
  langIcons.forEach(icon => {
    // Mouse enter - show active state with actual colors
    icon.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
        this.src = this.getAttribute('data-active');
        this.style.filter = 'none';
      }
    });
    
    // Mouse leave - return to default state with appropriate filter
    icon.addEventListener('mouseleave', function() {
      if (!this.classList.contains('active')) {
        this.src = this.getAttribute('data-default');
        // Restore appropriate filter based on scroll position
        if (this.classList.contains('black')) {
          this.style.filter = 'brightness(0) contrast(3)';
        } else {
          this.style.filter = 'brightness(0) invert(1) contrast(3)';
        }
      }
    });
    
    // Click - set permanent active state and switch language
    icon.addEventListener('click', function() {
      // Remove active class from all icons and reset to default images
      langIcons.forEach(otherIcon => {
        otherIcon.classList.remove('active');
        otherIcon.src = otherIcon.getAttribute('data-default');
        // Restore appropriate filter for each icon
        if (otherIcon.classList.contains('black')) {
          otherIcon.style.filter = 'brightness(0) contrast(3)';
        } else {
          otherIcon.style.filter = 'brightness(0) invert(1) contrast(3)';
        }
      });
      
      // Add active class and set active image with no filter
      this.classList.add('active');
      this.src = this.getAttribute('data-active');
      this.style.filter = 'none';
      
      // Switch language based on clicked icon
      const lang = this.getAttribute('alt') === 'English' ? 'en' : 'el';
      switchLanguage(lang);
    });
  });
  
  // Change icons to black after about section
  window.addEventListener('scroll', function() {
    if (aboutSection) {
      const aboutBottom = aboutSection.offsetTop + aboutSection.offsetHeight;
      
      if (window.scrollY > aboutBottom) {
        langIcons.forEach(icon => {
          if (!icon.classList.contains('active')) {
            icon.classList.add('black');
            icon.style.filter = 'brightness(0) contrast(3)';
          }
        });
      } else {
        langIcons.forEach(icon => {
          icon.classList.remove('black');
          if (!icon.classList.contains('active')) {
            icon.style.filter = 'brightness(0) invert(1) contrast(3)';
          }
        });
      }
    }
  });
});
