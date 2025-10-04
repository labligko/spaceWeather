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


// ===================
// SECTION SCROLL
// ===================
const sections = document.querySelectorAll(".section");
let currentSection = 0;
let isScrolling = false;
const header = document.querySelector("header");

function showSection(index) {
  sections.forEach((sec, i) => {
    sec.classList.toggle("active", i === index);
  });

  sections[index].scrollIntoView({ behavior: "smooth" });

  // Header fade
  header.style.opacity = index > 0 ? 0 : 1;
}

window.addEventListener("wheel", (e) => {
  if (isScrolling) return;
  if (Math.abs(e.deltaY) < 30) return;

  isScrolling = true;

  if (e.deltaY > 0) {
    currentSection = Math.min(currentSection + 1, sections.length - 1);
  } else {
    currentSection = Math.max(currentSection - 1, 0);
  }

  showSection(currentSection);

  setTimeout(() => {
    isScrolling = false;
  }, 800);
});

// tampilkan pertama kali
showSection(currentSection);


// ===================
// PAGE CONTENT FIX
// ===================
const slideContents = document.querySelectorAll(".slide-content");

slideContents.forEach(slide => {
  const pages = slide.querySelectorAll(".text-page");
  const prevBtn = slide.querySelector(".prev-text");
  const nextBtn = slide.querySelector(".next-text");

  let currentPage = 0;

  function showPage(index) {
    pages.forEach((p, i) => {
      p.classList.toggle("active", i === index);
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      currentPage = (currentPage - 1 + pages.length) % pages.length;
      showPage(currentPage);
    });

    nextBtn.addEventListener("click", () => {
      currentPage = (currentPage + 1) % pages.length;
      showPage(currentPage);
    });
  }

  showPage(currentPage); // tampilkan page pertama
});

// ===================
// 3D ASSET
// ===================
function createThreeJSViewer(containerId, modelPath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 3);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  const loader = new THREE.GLTFLoader();
let model = null;

loader.load(
  modelPath,
  (gltf) => {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    scene.add(model);
    animate();
  },
  undefined,
  (error) => console.error('Error loading model:', error)
);

  function animate() {
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.005;
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}

// Panggil fungsi ini untuk tiap container dan file model GLB-mu
// createThreeJSViewer('glb-container', 'model1.glb');
createThreeJSViewer('glb-container2', 'assets/asteroid3.gltf');
createThreeJSViewer('glb-container3', 'assets/asteroid4/result.gltf');