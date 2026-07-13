/**
 * AYUZAA - Premium Single Product E-commerce Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE SYSTEM ---
  const state = {
    cart: [],
    selectedBundle: 'single', // default selected bundle
    bundles: {
      single: {
        id: 'ayuzaa-single',
        name: 'Ayuzaa Liver Syrup - Single Bottle',
        subtitle: '1 Month Detox Plan',
        price: 499,
        originalPrice: 699,
        quantity: 1,
        badge: ''
      },
      double: {
        id: 'ayuzaa-double',
        name: 'Ayuzaa Liver Syrup - 2-Pack Value',
        subtitle: '2 Month Restoration Plan',
        price: 899,
        originalPrice: 1398,
        quantity: 2,
        badge: 'Best Value'
      },
      triple: {
        id: 'ayuzaa-triple',
        name: 'Ayuzaa Liver Syrup - 3-Pack Ultimate',
        subtitle: '3 Month Ultimate Revitalize Plan',
        price: 1199,
        originalPrice: 2097,
        quantity: 3,
        badge: 'Recommended'
      }
    }
  };

  // --- SELECTORS ---
  const navbar = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const faqItems = document.querySelectorAll('.faq-item');
  const bundleCards = document.querySelectorAll('.bundle-card');
  const purchaseImgContainer = document.querySelector('.purchase-image-container');
  const mainBuyBtn = document.getElementById('main-buy-btn');
  const mainCartBtn = document.getElementById('main-cart-btn');
  const qtyInput = document.getElementById('qty-input');
  const qtyMinusBtn = document.getElementById('qty-minus');
  const qtyPlusBtn = document.getElementById('qty-plus');
  const cartIconBtn = document.getElementById('cart-icon-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.querySelector('.cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.querySelector('.cart-count');
  const newsletterForm = document.getElementById('newsletter-form');
  const mobileStickyCta = document.getElementById('mobile-sticky-cta');
  const stickyPriceDisplay = document.getElementById('sticky-price-display');

  // --- NAVIGATION SCROLL EFFECT + MOBILE STICKY CTA ---
  const heroSection = document.querySelector('.hero');
  
  window.addEventListener('scroll', () => {
    // Navbar scroll effect
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Mobile sticky CTA — show after scrolling past hero
    if (mobileStickyCta && heroSection) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (window.scrollY > heroBottom - 100) {
        mobileStickyCta.classList.add('visible');
      } else {
        mobileStickyCta.classList.remove('visible');
      }
    }
  });

  // --- MOBILE MENU ---
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
      if (isActive) {
        document.body.classList.add('scroll-locked');
      } else {
        document.body.classList.remove('scroll-locked');
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('scroll-locked');
      });
    });
  }

  // --- SCROLL ANIMATIONS (INTERSECTION OBSERVER) ---
  const scrollElements = document.querySelectorAll('.fade-up, .stagger-container');
  
  const elementObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  scrollElements.forEach(el => elementObserver.observe(el));

  // --- FAQ ACCORDION ---
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all open items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-content').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // --- HOTSPOT POPUPS FOR MOBILE (TAP SUPPORT) ---
  const hotspots = document.querySelectorAll('.hotspot');
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      // Toggle custom active class (so popover shows on tap)
      const popover = hotspot.querySelector('.hotspot-popover');
      const isVisible = popover.style.opacity === '1';
      
      // Close other popovers first
      document.querySelectorAll('.hotspot-popover').forEach(p => {
        p.style.opacity = '0';
        p.style.visibility = 'hidden';
      });

      if (!isVisible) {
        popover.style.opacity = '1';
        popover.style.visibility = 'visible';
        e.stopPropagation();
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.hotspot-popover').forEach(p => {
      p.style.opacity = null;
      p.style.visibility = null;
    });
  });

  // --- BUNDLE CHOOSER & DYNAMIC PRICING ---
  bundleCards.forEach(card => {
    card.addEventListener('click', () => {
      bundleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const bundleKey = card.dataset.bundle;
      state.selectedBundle = bundleKey;
      
      // Update displayed price in main product info
      const bundle = state.bundles[bundleKey];
      const mainPriceEl = document.querySelector('.product-meta .current-price');
      const originalPriceEl = document.querySelector('.product-meta .original-price');
      const discountEl = document.querySelector('.product-meta .discount-badge');
      
      if (mainPriceEl && originalPriceEl && discountEl) {
        mainPriceEl.textContent = `₹${bundle.price}`;
        originalPriceEl.textContent = `₹${bundle.originalPrice}`;
        
        // Calculate percentage discount
        const savings = Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100);
        discountEl.textContent = `${savings}% OFF`;
      }

      // Sync mobile sticky CTA price
      if (stickyPriceDisplay) {
        stickyPriceDisplay.textContent = `₹${bundle.price}`;
      }

      // Quick visual swap on purchase image (simulate bottle stack)
      if (purchaseImgContainer) {
        if (bundleKey === 'single') {
          purchaseImgContainer.style.padding = '3rem';
        } else if (bundleKey === 'double') {
          purchaseImgContainer.style.padding = '2.5rem 1.5rem';
        } else {
          purchaseImgContainer.style.padding = '2rem 1rem';
        }
      }
    });
  });

  // --- PRODUCT THUMBNAILS GALLERY ---
  const initProductThumbnails = () => {
    const thumbs = document.querySelectorAll('.thumb-item');
    const mainImg = document.getElementById('main-product-img');
    if (!thumbs.length || !mainImg) return;
    
    thumbs.forEach(thumb => {
      const handleSwap = () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.src = thumb.getAttribute('data-src');
      };
      thumb.addEventListener('mouseenter', handleSwap);
      thumb.addEventListener('click', handleSwap);
    });
  };
  initProductThumbnails();

  // --- QUANTITY SELECTOR ---
  if (qtyMinusBtn && qtyPlusBtn && qtyInput) {
    qtyMinusBtn.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) {
        qtyInput.value = val - 1;
      }
    });

    qtyPlusBtn.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val < 10) {
        qtyInput.value = val + 1;
      }
    });

    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value);
      if (isNaN(val) || val < 1) qtyInput.value = 1;
      if (val > 10) qtyInput.value = 10;
    });
  }

  // --- CART PANEL DRAWERS ---
  const openCart = () => {
    if (cartOverlay) {
      cartOverlay.classList.add('active');
      document.body.classList.add('scroll-locked');
    }
  };
  const closeCart = () => {
    if (cartOverlay) {
      cartOverlay.classList.remove('active');
      document.body.classList.remove('scroll-locked');
    }
  };

  if (cartIconBtn) cartIconBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  
  // Close drawer if clicking backdrop overlay
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });
  }

  // --- ADD TO CART ACTIONS ---
  if (mainCartBtn) {
    mainCartBtn.addEventListener('click', () => {
      const qty = parseInt(qtyInput.value) || 1;
      addToCart(state.selectedBundle, qty);
      openCart();
    });
  }

  if (mainBuyBtn) {
    mainBuyBtn.addEventListener('click', () => {
      const qty = parseInt(qtyInput.value) || 1;
      addToCart(state.selectedBundle, qty);
      openCart();
      // In a real e-commerce platform, this would direct directly to /checkout
    });
  }

  // --- TOAST NOTIFICATIONS ---
  const showToast = (title, message) => {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">✓</div>
      <div class="toast-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
    `;

    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 50);

    // Remove toast after 3.5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  };

  // --- CART LOGIC ---
  const addToCart = (bundleKey, quantity) => {
    const bundleInfo = state.bundles[bundleKey];
    
    // Check if item already exists in cart
    const existingItem = state.cart.find(item => item.id === bundleInfo.id);
    
    if (existingItem) {
      existingItem.qty += quantity;
    } else {
      state.cart.push({
        id: bundleInfo.id,
        name: bundleInfo.name,
        subtitle: bundleInfo.subtitle,
        price: bundleInfo.price,
        qty: quantity,
        bundleKey: bundleKey
      });
    }
    
    updateCartUI();
    showToast('Added to Cart', `${bundleInfo.name} has been added successfully.`);
  };

  const removeFromCart = (itemId) => {
    state.cart = state.cart.filter(item => item.id !== itemId);
    updateCartUI();
  };

  const updateCartQty = (itemId, newQty) => {
    const item = state.cart.find(item => item.id === itemId);
    if (item) {
      item.qty = newQty;
      if (item.qty <= 0) {
        removeFromCart(itemId);
      } else {
        updateCartUI();
      }
    }
  };

  const updateCartUI = () => {
    // 1. Calculate count & subtotal
    let totalItems = 0;
    let subtotal = 0;

    state.cart.forEach(item => {
      totalItems += item.qty;
      subtotal += item.price * item.qty;
    });

    // Update floating cart counts
    if (cartCountEl) {
      cartCountEl.textContent = totalItems;
      cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // 2. Render items in container
    if (cartItemsContainer) {
      if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="cart-empty-message">
            <span class="cart-empty-icon">🛒</span>
            <h4>Your cart is empty</h4>
            <p>Add some Ayuzaa wellness to start your journey.</p>
          </div>
        `;
        if (cartSubtotalEl) cartSubtotalEl.textContent = '₹0';
        if (cartTotalEl) cartTotalEl.textContent = '₹0';
        return;
      }

      cartItemsContainer.innerHTML = '';
      state.cart.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'cart-item';
        
        // Dynamic product render icon based on packaging type
        let iconSvg = '';
        if (item.bundleKey === 'single') {
          iconSvg = `
            <svg viewBox="0 0 100 100" style="height: 100%; fill: var(--color-green);">
              <rect x="38" y="10" width="24" height="15" rx="3" fill="#C89B3C"/>
              <path d="M30,30 C30,27 70,27 70,30 L65,90 C65,93 35,93 35,90 Z" fill="#603813"/>
              <rect x="35" y="42" width="30" height="28" fill="#FFFDF8" rx="2"/>
              <text x="50" y="58" font-size="8" font-weight="bold" fill="#4F7D4B" text-anchor="middle" font-family="sans-serif">AYUZAA</text>
            </svg>
          `;
        } else if (item.bundleKey === 'double') {
          iconSvg = `
            <svg viewBox="0 0 100 100" style="height: 100%; fill: var(--color-green);">
              <!-- Second bottle -->
              <g transform="translate(15, 5) scale(0.95)">
                <rect x="38" y="10" width="24" height="15" rx="3" fill="#A87F32"/>
                <path d="M30,30 L70,30 L65,90 L35,90 Z" fill="#4A2708"/>
                <rect x="35" y="42" width="30" height="28" fill="#FFFDF8" rx="2"/>
              </g>
              <!-- First bottle -->
              <g transform="translate(-10, 0)">
                <rect x="38" y="10" width="24" height="15" rx="3" fill="#C89B3C"/>
                <path d="M30,30 C30,27 70,27 70,30 L65,90 C65,93 35,93 35,90 Z" fill="#603813"/>
                <rect x="35" y="42" width="30" height="28" fill="#FFFDF8" rx="2"/>
              </g>
            </svg>
          `;
        } else {
          iconSvg = `
            <svg viewBox="0 0 100 100" style="height: 100%; fill: var(--color-green);">
              <!-- Third bottle back -->
              <g transform="translate(25, 8) scale(0.85)">
                <path d="M30,30 L70,30 L65,90 L35,90 Z" fill="#3D1F05"/>
              </g>
              <!-- Second bottle back -->
              <g transform="translate(10, 4) scale(0.92)">
                <path d="M30,30 L70,30 L65,90 L35,90 Z" fill="#4D2A09"/>
              </g>
              <!-- First bottle front -->
              <g transform="translate(-15, 0)">
                <rect x="38" y="10" width="24" height="15" rx="3" fill="#C89B3C"/>
                <path d="M30,30 C30,27 70,27 70,30 L65,90 C65,93 35,93 35,90 Z" fill="#603813"/>
                <rect x="35" y="42" width="30" height="28" fill="#FFFDF8" rx="2"/>
              </g>
            </svg>
          `;
        }

        itemCard.innerHTML = `
          <div class="cart-item-img">
            ${iconSvg}
          </div>
          <div class="cart-item-details">
            <div class="cart-item-title-row">
              <div>
                <h4>${item.name}</h4>
                <p class="cart-item-pack">${item.subtitle}</p>
              </div>
              <button class="cart-item-remove-btn" data-id="${item.id}">✕</button>
            </div>
            <div class="cart-item-bottom-row">
              <div class="quantity-selector">
                <button class="quantity-btn qty-cart-minus" data-id="${item.id}">-</button>
                <input type="text" class="quantity-input" value="${item.qty}" readonly>
                <button class="quantity-btn qty-cart-plus" data-id="${item.id}">+</button>
              </div>
              <span class="cart-item-price">₹${item.price * item.qty}</span>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(itemCard);
      });

      // Bind buttons in cart list
      document.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          removeFromCart(btn.dataset.id);
        });
      });

      document.querySelectorAll('.qty-cart-minus').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = state.cart.find(i => i.id === btn.dataset.id);
          if (item) {
            updateCartQty(btn.dataset.id, item.qty - 1);
          }
        });
      });

      document.querySelectorAll('.qty-cart-plus').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = state.cart.find(i => i.id === btn.dataset.id);
          if (item) {
            updateCartQty(btn.dataset.id, item.qty + 1);
          }
        });
      });
    }

    // 3. Update footer prices
    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
    if (cartTotalEl) cartTotalEl.textContent = `₹${subtotal}`;
  };

  // --- FORM SUBMISSIONS ---
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('.newsletter-input');
      if (emailInput && emailInput.value.trim()) {
        showToast('Subscribed!', 'Thank you for joining our Ayurvedic newsletter.');
        emailInput.value = '';
      }
    });
  }

  // Smooth scroll offsets for menu links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- HERO SEQUENTIAL VIDEO PLAYBACK LOOP ---
  const heroVideo = document.getElementById('hero-video');
  const heroVideoCard = document.getElementById('hero-video-card');
  let currentVideoNum = 1;

  if (heroVideo && heroVideoCard) {
    // Check for prefers-reduced-motion query
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Show static fallback for accessibility
      heroVideo.style.display = 'none';
      heroVideoCard.style.backgroundImage = "url('lifestyle_wellness.png')";
      heroVideoCard.style.backgroundSize = "cover";
      heroVideoCard.style.backgroundPosition = "center";
    } else {
      // In-memory preloader to cache hero2.mp4 early
      const videoPreloader = document.createElement('video');
      videoPreloader.preload = 'auto';
      videoPreloader.src = 'hero2.mp4';

      // Start playing first video
      heroVideo.play().catch(error => {
        // Autoplay blocked by browser policy — gracefully fall back to poster image
        console.log("Autoplay blocked. Displaying static poster.");
        heroVideo.style.opacity = '0';
        heroVideoCard.style.backgroundImage = "url('lifestyle_wellness.png')";
        heroVideoCard.style.backgroundSize = "cover";
        heroVideoCard.style.backgroundPosition = "center";
      });

      // Ended event triggers transition and src swap
      heroVideo.addEventListener('ended', () => {
        // Smooth fade-out before the cut
        heroVideo.style.opacity = '0';

        setTimeout(() => {
          // Switch video source
          currentVideoNum = currentVideoNum === 1 ? 2 : 1;
          heroVideo.src = `hero${currentVideoNum}.mp4`;
          heroVideo.load();
          
          heroVideo.play().then(() => {
            // Smooth fade-in once video is active
            heroVideo.style.opacity = '1';
            
            // Queue next video in background cache
            const nextVideoNum = currentVideoNum === 1 ? 2 : 1;
            videoPreloader.src = `hero${nextVideoNum}.mp4`;
          }).catch(err => {
            console.log("Error transition loop autoplay:", err);
            heroVideoCard.style.backgroundImage = "url('lifestyle_wellness.png')";
          });
        }, 400); // Transitions matched to CSS ease duration (400ms)
      });
    }
  }

  // Benefits Showcase Synced Slideshow & Parallax Tilt
  const initBenefitsShowcase = () => {
    const benefitItems = document.querySelectorAll('.benefit-item');
    const showcaseImgs = document.querySelectorAll('.benefit-showcase-img');
    const innerContainer = document.querySelector('.benefits-images-inner');
    const outerContainer = document.querySelector('.benefits-layout');

    if (!benefitItems.length || !showcaseImgs.length) return;

    let activeIdx = 0;
    let autoPlayTimer = null;
    const intervalTime = 4000;

    const setActiveSlide = (idx) => {
      activeIdx = idx;
      benefitItems.forEach((item, i) => {
        if (i === idx) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      showcaseImgs.forEach((img, i) => {
        if (i === idx) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    };

    const startTimer = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => {
        let nextIdx = (activeIdx + 1) % benefitItems.length;
        setActiveSlide(nextIdx);
      }, intervalTime);
    };

    const stopTimer = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    setActiveSlide(0);
    startTimer();

    benefitItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        setActiveSlide(idx);
        startTimer();
      });
      item.addEventListener('mouseenter', () => {
        setActiveSlide(idx);
        stopTimer();
      });
      item.addEventListener('mouseleave', () => {
        startTimer();
      });
    });

    if (outerContainer) {
      outerContainer.addEventListener('mouseenter', stopTimer);
      outerContainer.addEventListener('mouseleave', startTimer);
    }

    if (innerContainer) {
      const handleMouseMove = (e) => {
        if (window.innerWidth <= 1024) return;
        const rect = innerContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / rect.height) * 8;
        const rotateY = (x / rect.width) * 8;
        innerContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        innerContainer.style.transition = 'transform 0.08s ease-out';
      };
      const handleMouseLeave = () => {
        innerContainer.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        innerContainer.style.transition = 'transform 0.4s ease';
      };
      innerContainer.addEventListener('mousemove', handleMouseMove);
      innerContainer.addEventListener('mouseleave', handleMouseLeave);
    }
  };
  initBenefitsShowcase();

  // Initialize Shape Grid Background in Hero Section
  const initShapeGrid = () => {
    const heroSection = document.getElementById('home');
    const canvas = document.getElementById('hero-shape-grid');
    if (!heroSection || !canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Config Options matching react-bits ShapeGrid
    const config = {
      direction: 'diagonal',
      speed: 0.4,
      borderColor: 'rgba(166, 124, 61, 0.08)', // subtle gold grid lines
      hoverFillColor: 'rgba(44, 74, 50, 0.08)', // soft green hover glow
      squareSize: 44,
      shape: 'square',
      hoverTrailAmount: 2
    };

    let numSquaresX = 0;
    let numSquaresY = 0;
    const gridOffset = { x: 0, y: 0 };
    let hoveredSquare = null;
    let trailCells = [];
    const cellOpacities = new Map();
    let animationFrameId = null;

    const resizeCanvas = () => {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
      numSquaresX = Math.ceil(canvas.width / config.squareSize) + 1;
      numSquaresY = Math.ceil(canvas.height / config.squareSize) + 1;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const offsetX = ((gridOffset.x % config.squareSize) + config.squareSize) % config.squareSize;
      const offsetY = ((gridOffset.y % config.squareSize) + config.squareSize) % config.squareSize;

      const cols = Math.ceil(canvas.width / config.squareSize) + 3;
      const rows = Math.ceil(canvas.height / config.squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const sx = col * config.squareSize + offsetX;
          const sy = row * config.squareSize + offsetY;

          const cellKey = `${col},${row}`;
          const alpha = cellOpacities.get(cellKey);
          
          if (alpha) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = config.hoverFillColor;
            ctx.fillRect(sx, sy, config.squareSize, config.squareSize);
            ctx.globalAlpha = 1;
          }

          ctx.strokeStyle = config.borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(sx, sy, config.squareSize, config.squareSize);
        }
      }

      // Smooth Radial Fade out overlay to blend grid edges into warm cream background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, 'rgba(245, 239, 225, 0)');
      gradient.addColorStop(0.85, 'rgba(245, 239, 225, 0.7)');
      gradient.addColorStop(1, 'rgba(245, 239, 225, 1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateCellOpacities = () => {
      const targets = new Map();

      if (hoveredSquare) {
        targets.set(`${hoveredSquare.x},${hoveredSquare.y}`, 1);
      }

      if (config.hoverTrailAmount > 0) {
        for (let i = 0; i < trailCells.length; i++) {
          const t = trailCells[i];
          const key = `${t.x},${t.y}`;
          if (!targets.has(key)) {
            targets.set(key, (trailCells.length - i) / (trailCells.length + 1));
          }
        }
      }

      for (const [key] of targets) {
        if (!cellOpacities.has(key)) {
          cellOpacities.set(key, 0);
        }
      }

      for (const [key, opacity] of cellOpacities) {
        const target = targets.get(key) || 0;
        const next = opacity + (target - opacity) * 0.15;
        if (next < 0.005) {
          cellOpacities.delete(key);
        } else {
          cellOpacities.set(key, next);
        }
      }
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(config.speed, 0.1);
      const wrapX = config.squareSize;
      const wrapY = config.squareSize;

      switch (config.direction) {
        case 'right':
          gridOffset.x = (gridOffset.x - effectiveSpeed + wrapX) % wrapX;
          break;
        case 'left':
          gridOffset.x = (gridOffset.x + effectiveSpeed + wrapX) % wrapX;
          break;
        case 'up':
          gridOffset.y = (gridOffset.y + effectiveSpeed + wrapY) % wrapY;
          break;
        case 'down':
          gridOffset.y = (gridOffset.y - effectiveSpeed + wrapY) % wrapY;
          break;
        case 'diagonal':
          gridOffset.x = (gridOffset.x - effectiveSpeed + wrapX) % wrapX;
          gridOffset.y = (gridOffset.y - effectiveSpeed + wrapY) % wrapY;
          break;
      }

      updateCellOpacities();
      drawGrid();
      animationFrameId = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = event => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const offsetX = ((gridOffset.x % config.squareSize) + config.squareSize) % config.squareSize;
      const offsetY = ((gridOffset.y % config.squareSize) + config.squareSize) % config.squareSize;

      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;

      const col = Math.floor(adjustedX / config.squareSize);
      const row = Math.floor(adjustedY / config.squareSize);

      if (!hoveredSquare || hoveredSquare.x !== col || hoveredSquare.y !== row) {
        if (hoveredSquare && config.hoverTrailAmount > 0) {
          trailCells.unshift({ ...hoveredSquare });
          if (trailCells.length > config.hoverTrailAmount) {
            trailCells.length = config.hoverTrailAmount;
          }
        }
        hoveredSquare = { x: col, y: row };
      }
    };

    const handleMouseLeave = () => {
      if (hoveredSquare && config.hoverTrailAmount > 0) {
        trailCells.unshift({ ...hoveredSquare });
        if (trailCells.length > config.hoverTrailAmount) {
          trailCells.length = config.hoverTrailAmount;
        }
      }
      hoveredSquare = null;
    };

    heroSection.addEventListener('mousemove', handleMouseMove);
    heroSection.addEventListener('mouseleave', handleMouseLeave);

    animationFrameId = requestAnimationFrame(updateAnimation);
  };
  initShapeGrid();

  // Dynamic Image Fallback Checker (handles cached items)
  const checkLoadedImages = () => {
    document.querySelectorAll('.loaded-image').forEach(img => {
      if (img.complete && img.naturalHeight > 0) {
        img.classList.add('visible');
      }
    });
  };
  checkLoadedImages();
  window.addEventListener('load', checkLoadedImages);
});
