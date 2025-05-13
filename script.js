const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.toolbar-menu');

hamburger.addEventListener('click', function() {
  this.classList.toggle('active');
  menu.classList.toggle('show');
});

const heroName = document.querySelector('.hero-name');
const text = heroName.innerText;
heroName.innerHTML = text.split('').map(char => {
  if (char === ' ' || char === '\n') return `<span class="hero-letter">&nbsp;</span>`;
  return `<span class="hero-letter">${char}</span>`;
}).join('');

const mainContent = document.getElementById('main-content');
const aboutMe = document.getElementById('about-me');

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
  link.addEventListener('click', function(e) {
    e.preventDefault();
    showAbout();
    // Wait for the fade-in to start, then scroll to about section
    setTimeout(() => {
      smoothScrollTo(document.getElementById('about-me'), 900); // 900ms for a nice effect
    }, 510); // Slightly more than your fade duration (500ms)
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

// The following variables were part of the back button logic, ensure they are defined if used elsewhere
// or remove if only for the back button.
let ignoreScroll = false;
let aboutShownByScroll = false;
let lastScrollY = window.scrollY;

// Attach to the HOME nav item
document.querySelectorAll('a[href="#hero"]').forEach(link => {
  link.addEventListener('click', function(e) {
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
document.addEventListener('DOMContentLoaded', function() {
  const mainContent = document.getElementById('main-content');
  const aboutMe = document.getElementById('about-me');
  if (mainContent) mainContent.style.opacity = '1';
  if (aboutMe) aboutMe.style.opacity = '0'; // Ensure about starts faded out
  if (aboutMe) aboutMe.style.pointerEvents = 'none';
  if (mainContent) mainContent.style.zIndex = '2';
  if (aboutMe) aboutMe.style.zIndex = '1';
});

// === ABOUT ME VERTICAL CAROUSEL ===
// 1. grab elements and set up state
const aboutMeCarousel = document.querySelector('.about-me .carousel'); 
const aboutMeCarouselRegion = document.querySelector('.about-me-carousel-region');
const aboutDescriptionP = document.querySelector('.about-description p'); // Get the description paragraph
const aboutDescriptionTitle = document.querySelector('.description-title'); // Get the title H3

if (aboutMeCarousel && aboutMeCarouselRegion && aboutDescriptionP && aboutDescriptionTitle) { // Check for title too
  let offset = 0;      
  let velocity = 0;      // drag speed
  let dragging = false;
  let isCoasting = false;
  let lastY = 0;
  let animationFrame;

  // 2. the core rendering function
  function updateCards() {
    const cards = Array.from(aboutMeCarousel.children);
    let centerCardIdentified = false; // Flag to ensure we only update once per state change

    cards.forEach((card, i) => {
      const pos = i - 2 + offset;
      const scale = Math.max(0.7, 1 - Math.abs(pos) * 0.2);

      let finalOpacity = 0;
      if (dragging || isCoasting) {
        let vis = 1 - Math.abs(pos) * 0.6;
        finalOpacity = vis >= 0.39 ? 1 : 0;
      } else {
        finalOpacity = Math.abs(pos) < 0.5 ? 1 : 0;
      }

      card.style.transition = dragging
        ? 'none'
        : 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease';
      card.style.transform = `translate(-50%, -50%) translateY(${pos * 110}px) scale(${scale})`;
      card.style.opacity = finalOpacity;
      card.style.zIndex = finalOpacity ? (10 - Math.abs(pos)) : 0;

      // Check if this is the settled, central card and update description AND title
      if (finalOpacity === 1 && !dragging && !isCoasting && !centerCardIdentified) {
        const newTitle = card.dataset.title;
        const newDescription = card.dataset.description;

        // Update Title (Directly)
        if (newTitle && aboutDescriptionTitle.innerText !== newTitle) {
            aboutDescriptionTitle.innerText = newTitle;
        }

        // Update Description (With Fade)
        if (newDescription && aboutDescriptionP.innerText !== newDescription) {
            aboutDescriptionP.style.opacity = 0;
            setTimeout(() => {
                aboutDescriptionP.innerText = newDescription;
                aboutDescriptionP.style.opacity = 1;
            }, 150); // Small delay for fade effect (adjust timing as needed)
        } else if (newDescription) { 
            // If description is the same, ensure opacity is 1 (in case fade was interrupted)
            aboutDescriptionP.innerText = newDescription; // Ensure text is correct even if not changed
            aboutDescriptionP.style.opacity = 1;
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

  // 4. momentum + snap
  function animateMomentum() {
    if (animationFrame) cancelAnimationFrame(animationFrame); // Clear existing frame

    if (Math.abs(velocity) < 0.01 && !dragging) { // Ensure not dragging for snap
      const target = Math.round(offset);
      if (Math.abs(offset - target) > 0.01) {
        offset += (target - offset) * 0.2; // Snapping ease
        wrapCards(); updateCards();
        animationFrame = requestAnimationFrame(animateMomentum);
        return;
      }
        offset = target;
        velocity = 0;
      isCoasting = false;
        updateCards();
      return;
    }

    if (!dragging) { // Only apply friction and coasting if not actively dragging
        isCoasting = true;
    offset += velocity;
        velocity *= 0.97;   // friction
    }
    
    wrapCards(); updateCards();
    animationFrame = requestAnimationFrame(animateMomentum);
  }

  // --- Event Handlers --- 

  function handleDragStart(yPosition) {
    dragging = true;
    lastY = yPosition;
    velocity = 0;
    aboutMeCarousel.style.cursor = 'grabbing';
    if (animationFrame) cancelAnimationFrame(animationFrame);
    isCoasting = false; // Stop coasting if a new drag starts
  }

  function handleDragMove(yPosition) {
    if (!dragging) return;
    const dy = yPosition - lastY;
    const delta = dy / 110; // Convert pixels to "card units"
    offset += delta;
    velocity = delta;
    lastY = yPosition;

    wrapCards();
    updateCards();
  }

  function handleDragEnd() {
    if (!dragging) return;
    dragging = false;
    aboutMeCarousel.style.cursor = 'grab';
    if (Math.abs(velocity) > 0.01) { // Only start momentum if there was some flick
        isCoasting = true;
        animateMomentum();
    } else { // If no real flick, just snap to current position
        isCoasting = false;
        animateMomentum(); // Will snap because velocity is low
    }
  }

  // MOUSE HANDLERS
  aboutMeCarousel.addEventListener('mousedown', e => {
    handleDragStart(e.clientY);
  });

  document.addEventListener('mousemove', e => {
    // Only process if dragging started on the aboutMeCarousel
    if (dragging && e.target && aboutMeCarousel.contains(e.target.ownerDocument.elementFromPoint(e.clientX, e.clientY))) {
        handleDragMove(e.clientY);
    } else if (dragging) { // If mouse moved outside but still dragging, treat as drag end
        // handleDragEnd(); // Optional: end drag if mouse leaves carousel bounds too far
    }
  });
  document.addEventListener('mouseup', () => {
    if (dragging) { // Only end drag if it was initiated on this carousel
        handleDragEnd();
    }
  });

  // TOUCH HANDLERS
  aboutMeCarousel.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientY);
    }
  }, { passive: true });

  aboutMeCarousel.addEventListener('touchmove', e => {
    if (dragging && e.touches.length === 1) {
      handleDragMove(e.touches[0].clientY);
    }
  }, { passive: true });

  aboutMeCarousel.addEventListener('touchend', e => {
    if (dragging) {
      handleDragEnd();
    }
  });
  aboutMeCarousel.addEventListener('touchcancel', e => {
    if (dragging) {
      handleDragEnd(); // Treat cancel like end
    }
  });

  // ARROW BUTTONS
  const upArrow = aboutMeCarouselRegion.querySelector('.carousel-arrow.up');
  const downArrow = aboutMeCarouselRegion.querySelector('.carousel-arrow.down');

  function handleArrowClick(direction) {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    dragging = false;
    isCoasting = false;
    velocity = 0; // Ensure velocity is zeroed for immediate snap

    if (direction === 'up') {
      offset -= 1;
    } else if (direction === 'down') {
      offset += 1;
    }
    
    wrapCards(); // Call wrapCards HERE, before animateMomentum
    
    // Let animateMomentum handle wrapping and snapping to the new integer offset
    animateMomentum(); 
  }

  if (upArrow) {
    upArrow.addEventListener('click', () => handleArrowClick('up'));
  }
  if (downArrow) {
    downArrow.addEventListener('click', () => handleArrowClick('down'));
  }

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
  let startPosX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0; // For requestAnimationFrame

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

    const slideWidthWithMargins = slides[0].offsetWidth + (parseFloat(getComputedStyle(slides[0]).marginLeft) * 2);
    
    currentSlideIndex = index;
    // To center the active slide (80% width), we need to translate by its width 
    // and then adjust for the fact that the container should show 10% of the prev/next slide.
    // Or, more simply, translate by full slide width (including its own margins)
    // and then shift back by a certain amount if the container is not wide enough to show peeking slides by default.
    // Let's use a simpler direct translation calculation first, assuming the container is wide enough
    // or that the overflow:hidden on container + centered track will achieve the look.

    // Calculate the total width of one slide including its horizontal margins
    const firstSlide = slides[0];
    const slideStyle = getComputedStyle(firstSlide);
    const slideOuterWidth = firstSlide.offsetWidth + parseFloat(slideStyle.marginLeft) + parseFloat(slideStyle.marginRight);

    currentTranslate = -index * slideOuterWidth;
    // To perfectly center the 80% slide, we need to add an offset that accounts for the 10% on one side
    // This offset is (containerWidth - (slideWidth + margins)) / 2
    // Or, if we want to ensure the active slide *starts* at the edge of the container before centering:
    // For centering an 80% slide, we want 10% of container on left and right of the slide track itself.
    // The track will translate by `index * (slideOuterWidth)`.
    // To center slide `index`, we need to shift the entire track. 
    // Let the container be W. Slide is 0.8W + 2*margin.
    // The first slide (index 0) should be positioned such that its left edge is at 0.1W (approx for peeking).
    // So, its center is at 0.1W + (0.8W / 2) = 0.5W (if margin is 0)
    // If margin = 10px, slide is 0.8W. Its content box starts at 10px. Left edge is 0. Translate for index 0 should mean its left margin is at container edge.
    // Simpler: translate by `-index * slideOuterWidth` and add an initial offset to center the first slide.
    // This initial offset makes sure the first slide (index 0) is centered when translateX is 0.
    // This should be `(carouselContainer.offsetWidth - slideOuterWidth) / 2`.
    const initialOffset = (carouselContainer.offsetWidth - slideOuterWidth) / 2;
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
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === totalSlides - 1;
  }
  
  // --- Set Slider Position --- 
  function setSliderPosition() {
      carousel.style.transform = `translateX(${currentTranslate}px)`;
  }

  // --- Animation Loop (for smooth drag) --- 
  function animation() {
    setSliderPosition();
    if(isDragging) requestAnimationFrame(animation);
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
    startPosX = getPositionX(event);
    prevTranslate = currentTranslate; // Store position before drag starts
    carousel.style.transition = 'none'; // Disable transition during drag
    carousel.style.cursor = 'grabbing';
    animationID = requestAnimationFrame(animation); // Start animation loop
  }

  function dragAction(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    const move = currentPosition - startPosX;
    currentTranslate = prevTranslate + move; // Calculate new position based on drag start
    // No need to call setSliderPosition here, animation loop handles it
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;
    const threshold = (slides[0].offsetWidth + (parseFloat(getComputedStyle(slides[0]).marginLeft) * 2)) * 0.2;

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
  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
  
  // --- Window Resize Handler --- 
  window.addEventListener('resize', () => {
      if (slides.length > 0) { // Add this check before accessing slides[0]
        goToSlide(currentSlideIndex);
      }
  });

  // --- Initialize --- 
  updateUI(); // Initial UI state
  // Set initial position without transition
  currentTranslate = -currentSlideIndex * carousel.offsetWidth;
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
  const seeMorePrompts = document.querySelectorAll('.see-more-prompt .see-more-text');

  // --- Elements for Project Detail Modal Text Carousel ---
  const modalProjectTitle = projectDetailModal ? projectDetailModal.querySelector('#modal-project-title') : null;
  const modalMainImage = projectDetailModal ? projectDetailModal.querySelector('#modal-project-image') : null;
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
  let textDragCurrentTranslateX = 0;
  let textDragAnimationID = 0;

  // --- Placeholder Project Data (ensure this matches your intended structure) ---
  const portfolioProjectsData = [
    {
      title: "Project Alpha", shortDescription: "Brief for card Alpha.", mainImage: "assets/img/Web_Design_1.png",
      modalHeader: "Project Alpha - Details",
      modalSliderImages: ["assets/img/Web_Design_1.png", "assets/img/MOCKUP1.jpg", "assets/img/App_Design_2.png"],
      detailedContentPages: [
        "<h3>Page 1: Alpha Concept</h3><p>Lorem ipsum dolor sit amet... Alpha concept details.</p>",
        "<h3>Page 2: Alpha Development</h3><p>Cras euismod iaculis mauris... Alpha development process.</p>",
        "<h3>Page 3: Alpha Outcome</h3><p>Aenean dolor nisi, elementum ac dolor... Alpha results.</p>"
      ]
    },
    {
      title: "Project Beta", shortDescription: "Brief for card Beta.", mainImage: "assets/img/App_Design_2.png",
      modalHeader: "Project Beta - Insights",
      modalSliderImages: ["assets/img/App_Design_2.png", "assets/img/Web_Design_1.png"],
      detailedContentPages: [
        "<h3>Page 1: Beta UX Research</h3><p>Beta project focused heavily on user experience...</p>",
        "<h3>Page 2: Beta Prototyping</h3><p>Iterative prototyping allowed us to test and refine...</p>"
      ]
    },
    {
      title: "Project Gamma", shortDescription: "Brief for card Gamma.", mainImage: "assets/img/MOCKUP1.jpg",
      modalHeader: "Project Gamma - Technical Deep Dive",
      modalSliderImages: ["assets/img/MOCKUP1.jpg", "assets/img/Web_Design_1.png", "assets/img/App_Design_2.png", "assets/img/Web_Design_3.jpg"],
      detailedContentPages: [
        "<h3>Page 1: Gamma Architecture</h3><p>The architecture for Project Gamma was complex...</p>",
        "<h3>Page 2: Gamma Challenges</h3><p>Key challenges included scaling the database...</p>",
        "<h3>Page 3: Gamma Performance</h3><p>Performance tuning was critical...</p>",
        "<h3>Page 4: Gamma Future</h3><p>Future plans for Gamma include expanding...</p>"
      ]
    }
  ];

  function goToTextPage(pageIndex, animate = true) {
    if (!currentProjectData || !textCarouselTrack || !textCarouselPageDisplay) return;
    const pageCount = currentProjectData.detailedContentPages.length;
    if (pageIndex < 0) pageIndex = 0;
    if (pageIndex >= pageCount) pageIndex = pageCount - 1;

    const viewportWidth = textCarouselPageDisplay.offsetWidth;
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
    textCarouselTrack.innerHTML = '';
    textCarouselDotsContainer.innerHTML = '';
    currentProjectData.detailedContentPages.forEach((pageHTML, index) => {
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
    modalImageSliderInterval = setInterval(changeModalImage, 15000); // 15 seconds
  }

  function openProjectModal(projectIndex) {
    if (!projectDetailModal || !portfolioProjectsData[projectIndex]) return;
    currentProjectData = portfolioProjectsData[projectIndex];
    currentTextPageIndex = 0;
    if (modalProjectTitle) modalProjectTitle.textContent = currentProjectData.modalHeader || 'Project Details';
    generateTextCarouselPagesAndDots();
    goToTextPage(currentTextPageIndex, false); // Set initial page without animation
    startModalImageSlider();
    projectDetailModal.style.display = 'flex';
    document.body.classList.add('modal-open');
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

  function textDragStart(event) {
    if (!currentProjectData) return;
    // Allow scrolling within individual .text-carousel-page if target is inside it and content overflows
    const targetPage = event.target.closest('.text-carousel-page');
    if (targetPage && targetPage.scrollHeight > targetPage.clientHeight && event.type.includes('mouse')) {
        // If a mouse event, and the page itself is scrollable, don't initiate horizontal drag
        // This allows vertical scroll on desktop. For touch, it might still drag horizontally.
        // More complex logic needed for perfect nested scroll/drag priority.
        if (event.offsetX < targetPage.clientWidth - 20) { // Heuristic: Don't start drag if near potential scrollbar
             // return; // Decided to allow drag always, user can scroll a page then swipe.
        }
    }

    isTextDragging = true;
    textDragStartPosX = getTextPositionX(event);
    textDragAnimationID = requestAnimationFrame(textDragAnimationLoop);
    textCarouselTrack.style.transition = 'none'; // wichtig for direct drag feel
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
    const diffX = currentX - textDragStartPosX;
    const baseTranslateX = -currentTextPageIndex * textCarouselPageDisplay.offsetWidth;
    textDragCurrentTranslateX = baseTranslateX + diffX;
    // No need to set transform here directly if using rAF loop, but for immediate feedback outside loop:
    // textCarouselTrack.style.transform = `translateX(${textDragCurrentTranslateX}px)`; 
  }

  function textDragEnd() {
    if (!isTextDragging || !currentProjectData) return;
    isTextDragging = false;
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

// Scroll-based fade between Sections
window.addEventListener('scroll', function() {
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
document.addEventListener('DOMContentLoaded', function() {
  const myWorkBtn = document.querySelector('.my-work-btn');
  if (myWorkBtn) {
    myWorkBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToSection('portfolio');
    });
  }
  
  // Toolbar link for MY WORK
  const workNavLink = document.querySelector('.toolbar-menu a[href="#work"]');
  if (workNavLink) {
      workNavLink.addEventListener('click', function(e) {
          e.preventDefault();
          scrollToSection('portfolio');
      });
  }
  
  // Toolbar link for ABOUT
  const aboutNavLink = document.querySelector('.toolbar-menu a[href="#about"]');
  if (aboutNavLink) {
      aboutNavLink.addEventListener('click', function(e) {
          e.preventDefault();
          scrollToSection('about-me');
      });
  }
  
  // Toolbar link for HOME
  const homeNavLink = document.querySelector('.toolbar-menu a[href="#hero"]');
  if (homeNavLink) {
      homeNavLink.addEventListener('click', function(e) {
          e.preventDefault();
          scrollToSection('main-content');
      });
  }

  // CONTACT ME button in Portfolio section
  const portfolioContactBtn = document.querySelector('.portfolio-content .contact-btn');
  if (portfolioContactBtn) {
    portfolioContactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToSection('contact'); // Target the contact section ID
    });
  }

  // Toolbar link for CONTACT
  const contactNavLink = document.querySelector('.toolbar-menu a[href="#contact"]');
  if (contactNavLink) {
      contactNavLink.addEventListener('click', function(e) {
          e.preventDefault();
          scrollToSection('contact');
      });
  }
});

// Initial setup on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
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

// --- Generate Slides and Dots from Data ---
function generatePortfolioItems() {
  carousel.innerHTML = ''; // Clear existing slides
  dotsContainer.innerHTML = ''; // Clear existing dots

  portfolioProjects.forEach((project, index) => {
    // Create Slide
    const slide = document.createElement('div');
    slide.classList.add('portfolio-slide');

    // Create Image Container & Image
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('portfolio-image-container');
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title + " Image";
    img.classList.add('portfolio-image-item');
    imageContainer.appendChild(img);
    // Append Image Container to Slide FIRST
    slide.appendChild(imageContainer);

    // Create Text Content Container (now separate)
    const textContent = document.createElement('div');
    textContent.classList.add('portfolio-text-content'); // Removed 'overlay' class here
    const title = document.createElement('h3');
    title.classList.add('portfolio-item-title');
    title.textContent = project.title; // Use project title
    const description = document.createElement('p');
    description.classList.add('portfolio-item-description');
    description.textContent = project.description; // Use project description
    textContent.appendChild(title);
    textContent.appendChild(description);
    // Append Text Content to Slide SECOND
    slide.appendChild(textContent); 

    carousel.appendChild(slide);

    // Create Dot
    const dot = document.createElement('button');
    dot.classList.add('portfolio-dot');
    dot.setAttribute('aria-label', `Go to project ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  // Re-initialize slides array and UI after generation
  slides = document.querySelectorAll('.portfolio-slide');
  totalSlides = slides.length;
  dots = dotsContainer.querySelectorAll('.portfolio-dot');
  if (totalSlides > 0) {
      currentSlideIndex = 0; // Reset index
      goToSlide(currentSlideIndex);
  } else {
      updateUI(); // Update arrows if no slides
  }
}
generatePortfolioItems(); // Call the function to build slides initially