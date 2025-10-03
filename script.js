let currentSection = 0;
const sections = document.querySelectorAll(".section");
const header = document.querySelector("header");

let isScrolling = false;

window.addEventListener("wheel", (e) => {
  if (isScrolling) return;

  // Biar gak tangkep scroll kecil
  if (Math.abs(e.deltaY) < 30) return; 

  isScrolling = true;

  if (e.deltaY > 0) {
    currentSection = Math.min(currentSection + 1, sections.length - 1);
  } else {
    currentSection = Math.max(currentSection - 1, 0);
  }

  sections[currentSection].scrollIntoView({ behavior: "smooth" });

  // Header fade
  header.style.opacity = currentSection > 0 ? 0 : 1;

  setTimeout(() => {
    isScrolling = false;
  }, 1000); // kasih jeda lebih panjang biar aman
});

// ===================
// SLIDER SESSION 2
// ===================
const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

prevBtn.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

nextBtn.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

// tampilkan slide pertama
showSlide(currentSlide);

