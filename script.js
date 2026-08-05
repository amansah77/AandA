// Popup Modal Handlers
function showPopup() {
  document.getElementById("imagePopup").style.display = "flex";
}

function closePopup() {
  document.getElementById("imagePopup").style.display = "none";
}

function closeOnBackgroundClick(event) {
  if (event.target.id === "imagePopup") {
    closePopup();
  }
}

// Automatically trigger popup after 500ms delay on page load
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(showPopup, 500);

  // Popup Click Listeners
  const imagePopup = document.getElementById("imagePopup");
  const closePopupBtn = document.getElementById("closePopupBtn");
  
  if (imagePopup) imagePopup.addEventListener("click", closeOnBackgroundClick);
  if (closePopupBtn) closePopupBtn.addEventListener("click", closePopup);
});

// Header scroll state
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, {passive: true});

// Mobile drawer
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
const scrim = document.getElementById('scrim');
const drawerClose = document.getElementById('drawerClose');

function openDrawer() { drawer.classList.add('open'); scrim.classList.add('show'); }
function closeDrawer() { drawer.classList.remove('open'); scrim.classList.remove('show'); }

hamburger.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
scrim.addEventListener('click', closeDrawer);
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal, .service-card');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, {threshold: 0.15, rootMargin: '0px 0px -40px 0px'});

revealEls.forEach(el => io.observe(el));

// Stagger service cards
document.querySelectorAll('.service-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 70) + 'ms';
});

// Form and Alert Logic
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

function showCustomAlert(message) {
  document.getElementById('customAlertMessage').innerText = message;
  document.getElementById('customAlertModal').style.display = 'flex';
}

function closeCustomAlert() {
  document.getElementById('customAlertModal').style.display = 'none';
}

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // 1. Rate Limit Check (30 seconds)
  const COOLDOWN_TIME = 30 * 1000; 
  const lastSubmit = localStorage.getItem('lastFormSubmit');
  const now = Date.now();

  if (lastSubmit && (now - lastSubmit) < COOLDOWN_TIME) {
    const remainingSeconds = Math.ceil((COOLDOWN_TIME - (now - lastSubmit)) / 1000);
    showCustomAlert(`Please wait ${remainingSeconds} second(s) before submitting again.`);
    return;
  }

  // 2. Gather field values
  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const service = document.getElementById('fservice').value;
  const msg = document.getElementById('fmsg').value.trim();

  // 3. 10-Digit Mobile Validation (Starts with 97 or 98)
  const phoneRegex = /^(97|98)\d{8}$/;

  if (!phoneRegex.test(phone)) {
    showCustomAlert("Please enter a valid 10-digit mobile number starting with 97 or 98.");
    document.getElementById('fphone').focus();
    return;
  }

  // 4. Send to Web3Forms
  const formData = new FormData(form);

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData
  })
  .then(async (response) => {
    let json = await response.json();

    if (response.status === 200) {
      localStorage.setItem('lastFormSubmit', Date.now());

      const waText = encodeURIComponent(`Hi A&A Tax & Accounting, my name is ${name}. I'm interested in: ${service}. My message is "${msg}"`);
      
      success.innerHTML = `✓ Thanks ${name || ''}! We've noted your message. <a href="https://wa.me/9779811317673?text=${waText}" target="_blank" rel="noopener" style="text-decoration:underline;color:#1B9E5A;font-weight:700;margin-left:4px;">Send it on WhatsApp too →</a>`;
      success.classList.add('show');
      
      form.reset();
    } else {
      showCustomAlert(json.message || "Form submission failed. Please try again.");
    }
  })
  .catch(error => {
    showCustomAlert("Unable to send message right now. Please try again.");
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Free Consultation modal
const consultScrim = document.getElementById('consultScrim');
const consultClose = document.getElementById('consultClose');

function openConsult() { consultScrim.classList.add('show'); }
function closeConsult() { consultScrim.classList.remove('show'); }

document.getElementById('heroConsultBtn').addEventListener('click', openConsult);
document.getElementById('drawerConsultBtn').addEventListener('click', () => { closeDrawer(); openConsult(); });
consultClose.addEventListener('click', closeConsult);
consultScrim.addEventListener('click', (e) => { if(e.target === consultScrim) closeConsult(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeConsult(); });