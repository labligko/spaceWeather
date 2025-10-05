// ===================
// SLIDER SESSION 2
// ===================
const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentSlide = 0;
let viewers = {};

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
  if (index === 0 && !viewers.glb1) {
    viewers.glb1 = createThreeJSViewer('glb-container', 'assets/Earth2/Earghtt.glb', 'bright-earth');
  }

  if (index === 1 && !viewers.glb2) {
    viewers.glb2 = createThreeJSViewer('glb-container2', 'assets/asteroipack/asteroid3.1.glb', 'dark-asteroid');
  }

  if (index === 2 && !viewers.glb3) {
    viewers.glb3 = createThreeJSViewer('glb-container3', 'assets/sun/matahari.glb', 'sun-bright');
  }
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
function createThreeJSViewer(containerId, modelPath, lightingType = 'default') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // === Scene, Camera, Renderer ===
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
    0.01,
    1000
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(Math.max(container.clientWidth, 1), Math.max(container.clientHeight, 1));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // === Customizable Lights ===
switch (lightingType) {
  case 'bright-earth':
    scene.add(new THREE.HemisphereLight(0xffffff, 0x0000ff, 0.6));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.8));
    scene.add(new THREE.AmbientLight(0x99ccff, 0.5));
    renderer.setClearColor(0x0a0a0a, 0.6);
    renderer.toneMappingExposure = 0.8;
    break;

  case 'dark-asteroid':
    // Lighting
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(3, 2, 1);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    const ambientDark = new THREE.AmbientLight(0x111111, 0.3);
    scene.add(ambientDark);

    const hemiDark = new THREE.HemisphereLight(0x222222, 0x000000, 0.1);
    scene.add(hemiDark);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Background & tone mapping
    renderer.setClearColor(0x0a0a0a, 0.6);
    renderer.toneMappingExposure = 0.8; 
    break;

  case 'sun-bright':
    const sunLight = new THREE.PointLight(0xffcc00, 2, 50);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0xffcc66, 0.5));
    renderer.setClearColor(0x0a0a0a, 0.6);
    renderer.toneMappingExposure = 0.8;
    break;

  default:
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.4));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.4));
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    break;
}

// Tetap tambahkan point light ke kamera (opsional)
const point = new THREE.PointLight(0xffffff, 0.3);
camera.add(point);
scene.add(camera);


  // === Controls ===
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;

  let model = null;

  // === Load GLTF ===
  const loader = new THREE.GLTFLoader();
  console.log('Loading model from:', modelPath);

  loader.load(
    modelPath,
    (gltf) => {
      model = gltf.scene;
      
    //   // === Tambahan khusus untuk bumi ===
    // if (modelPath.includes("gabung3.glb")) {
    //   const textureLoader = new THREE.TextureLoader();
    //   const diffuse = textureLoader.load("assets/earth/Earth_Diffuse_6K.jpg");
    //   const normal = textureLoader.load("assets/earth/Earth_NormalNRM_6K.jpg");
    //   const gloss = textureLoader.load("assets/earth/Earth_Glossiness_6K.jpg");
    //   const clouds = textureLoader.load("assets/earth/Earth_Clouds_6K.jpg");
    //   const illumination = textureLoader.load("assets/earth/Earth_Illumination_6K.jpg");

    //   // Buat material baru untuk bola bumi
    //   const earthMat = new THREE.MeshStandardMaterial({
    //     map: diffuse,
    //     normalMap: normal,
    //     roughnessMap: gloss,
    //     emissiveMap: illumination,
    //     emissiveIntensity: 1.5,
    //     metalness: 0.0,
    //     roughness: 0.8,
    //   });

    //   model.traverse((c) => {
    //     if (c.isMesh) {
    //       c.material = earthMat;
    //       c.castShadow = true;
    //       c.receiveShadow = true;
    //     }
    //   });
    // }
    // // === End tambahan ===

      model.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;

          // === Warna & pencahayaan fix ===
          const mat = c.material;
          if (mat) {
            // Pastikan warna tetap sRGB
            if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;

            // Map lain tetap linear
            if (mat.roughnessMap) mat.roughnessMap.colorSpace = THREE.NoColorSpace;
            if (mat.metalnessMap) mat.metalnessMap.colorSpace = THREE.NoColorSpace;
            if (mat.normalMap) mat.normalMap.colorSpace = THREE.NoColorSpace;

            // Tambahan opsional buat lighting lebih hidup
            mat.envMapIntensity = 1.2;
          }
        }
      });

      // === Cek ukuran model asli ===
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      console.log(`📦 ${modelPath} size:`, size, 'center:', center);

      // === Auto-scale & center ===
      const maxDim = Math.max(size.x, size.y, size.z);
      const scaleFactor = 10 / maxDim;
      model.scale.setScalar(scaleFactor);
      model.position.sub(center.multiplyScalar(scaleFactor));
      scene.add(model);

      // === Fit camera ===
      const fov = camera.fov * (Math.PI / 180);
      const distance = (maxDim * scaleFactor) / (2 * Math.tan(fov / 2));
      camera.position.set(0, 0, distance * 2.5);
      controls.target.set(0, 0, 0);
      controls.update();

      console.log(`✅ ${modelPath} loaded. Scale: ${scaleFactor.toFixed(3)}, CameraZ: ${distance * 2.5}`);
      animate();
    },
    (xhr) => {
      if (xhr.total) console.log(((xhr.loaded / xhr.total) * 100).toFixed(0) + '% loaded');
      else console.log(xhr.loaded + ' bytes loaded');
    },
    (error) => console.error('❌ Error loading model:', error)
  );

  // === Animate ===
  function animate() {
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.0025;
    controls.update();
    renderer.render(scene, camera);
  }

  // === Responsive Resize ===
  function updateSize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const tryEnsureVisible = () => {
    updateSize();
    if (container.clientWidth <= 1 || container.clientHeight <= 1) setTimeout(tryEnsureVisible, 200);
  };
  tryEnsureVisible();

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
  } else {
    window.addEventListener('resize', updateSize);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') updateSize();
  });

  return { scene, camera, renderer };
}

// ===================
// SLIDER LOGIC
// ===================
function goToSlide(index) {
  document.querySelectorAll('.slide').forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  if (index === 1 && !viewers.glb2) {
    viewers.glb2 = createThreeJSViewer('glb-container2', 'assets/asteroipack2/asteroid3.1.glb');
  }

  if (index === 2 && !viewers.glb3) {
    viewers.glb3 = createThreeJSViewer('glb-container3', 'assets/sun/matahari.glb');
  }
}
