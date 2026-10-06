import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

(function initScene() {
  const stage = document.querySelector('.hero-stage');
  const canvas = document.getElementById('morph-canvas');

  if (!stage || !canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
  } catch (e) {
    document.querySelectorAll('.morph-ctl,.stage-hint').forEach((el) => (el.style.display = 'none'));
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.z = 27;

  const tiltGroup = new THREE.Group();
  const spinGroup = new THREE.Group();
  tiltGroup.add(spinGroup);
  scene.add(tiltGroup);
  spinGroup.rotation.x = 0.18;

  const N = 2400;
  const shapes = {};
  {
    const sphere = new Float32Array(N * 3),
      torus = new Float32Array(N * 3),
      knot = new Float32Array(N * 3),
      helix = new Float32Array(N * 3);

    const GA = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      let y = 1 - (i / (N - 1)) * 2,
        rad = Math.sqrt(Math.max(0, 1 - y * y)),
        th = GA * i;
      const R = 8.6 + (Math.random() - 0.5) * 0.6;
      sphere[i * 3] = Math.cos(th) * rad * R;
      sphere[i * 3 + 1] = y * R;
      sphere[i * 3 + 2] = Math.sin(th) * rad * R;

      const u = Math.random() * Math.PI * 2,
        v = Math.random() * Math.PI * 2,
        TR = 6.3,
        Tr = 2.35;
      torus[i * 3] = (TR + Tr * Math.cos(v)) * Math.cos(u);
      torus[i * 3 + 1] = Tr * Math.sin(v);
      torus[i * 3 + 2] = (TR + Tr * Math.cos(v)) * Math.sin(u);

      const t = (i / N) * Math.PI * 2 + Math.random() * 0.02,
        S = 2.5;
      const kx = (Math.sin(t) + 2 * Math.sin(2 * t)) * S,
        ky = (Math.cos(t) - 2 * Math.cos(2 * t)) * S,
        kz = -Math.sin(3 * t) * S;
      const jr = 0.55,
        ja = Math.random() * Math.PI * 2,
        jb = Math.acos(2 * Math.random() - 1);
      knot[i * 3] = kx + jr * Math.sin(jb) * Math.cos(ja);
      knot[i * 3 + 1] = ky + jr * Math.sin(jb) * Math.sin(ja);
      knot[i * 3 + 2] = kz + jr * Math.cos(jb);

      const strand = i % 2,
        f = i / N,
        ang = f * Math.PI * 6 + strand * Math.PI,
        hr = 3.6 + (Math.random() - 0.5) * 0.5;
      helix[i * 3] = hr * Math.cos(ang) + (Math.random() - 0.5) * 0.35;
      helix[i * 3 + 1] = (f - 0.5) * 18;
      helix[i * 3 + 2] = hr * Math.sin(ang) + (Math.random() - 0.5) * 0.35;
    }
    shapes.sphere = sphere;
    shapes.torus = torus;
    shapes.knot = knot;
    shapes.helix = helix;
  }

  const posArr = new Float32Array(shapes.sphere);
  const phaseArr = new Float32Array(N),
    sizeArr = new Float32Array(N),
    colArr = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    phaseArr[i] = Math.random();
    sizeArr[i] = 1.5 + Math.random() * 1.9;
    if (Math.random() < 0.17) {
      colArr[i * 3] = 0.886;
      colArr[i * 3 + 1] = 0.306;
      colArr[i * 3 + 2] = 0.106;
    } else {
      colArr[i * 3] = 0.11;
      colArr[i * 3 + 1] = 0.102;
      colArr[i * 3 + 2] = 0.082;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phaseArr, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizeArr, 1));
  geo.setAttribute('aColor', new THREE.BufferAttribute(colArr, 3));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() } },
    vertexShader: `
      attribute float aPhase; attribute float aSize; attribute vec3 aColor;
      uniform float uTime; uniform float uPR;
      varying vec3 vColor;
      void main(){
        vColor = aColor;
        vec3 p = position + 0.17 * vec3(
          sin(uTime*1.35 + aPhase*6.2831),
          cos(uTime*1.05 + aPhase*9.4247),
          sin(uTime*0.85 + aPhase*12.566));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = aSize * uPR * (240.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.16, d);
        gl_FragColor = vec4(vColor, a);
      }`,
    transparent: true,
    depthWrite: false
  });
  spinGroup.add(new THREE.Points(geo, mat));

  const fromArr = new Float32Array(N * 3);
  let toArr = shapes.sphere,
    tM = 1;
  const DUR = 1.7;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function morphTo(name) {
    fromArr.set(posArr);
    toArr = shapes[name];
    tM = 0;
  }

  let dragging = false, px = 0, py = 0, velX = 0, velY = 0;
  let rotX = 0.18, rotY = 0, idle = 10;
  let tiltTX = 0, tiltTY = 0;
  let zTarget = 27;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  stage.addEventListener('pointerdown', function (e) {
    dragging = true;
    px = e.clientX;
    py = e.clientY;
    velX = velY = 0;
    idle = 0;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', function (e) {
    if (dragging) {
      const dx = e.clientX - px,
        dy = e.clientY - py;
      rotY += dx * 0.005;
      if (e.pointerType !== 'touch') {
        rotX = clamp(rotX + dy * 0.0035, -0.9, 0.9);
        velX = dy * 0.0035;
      }
      velY = dx * 0.005;
      px = e.clientX;
      py = e.clientY;
      idle = 0;
    }
    const r = stage.getBoundingClientRect();
    tiltTX = ((e.clientY - r.top) / r.height - 0.5) * -0.08;
    tiltTY = ((e.clientX - r.left) / r.width - 0.5) * 0.12;
  });

  function endDrag() {
    dragging = false;
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerleave', function () {
    if (!dragging) {
      tiltTX = tiltTY = 0;
    }
  });

  const ORDER = ['sphere', 'torus', 'knot', 'helix'];
  let shapeIdx = 0,
    lastUser = -99999;

  document.querySelectorAll('.shape-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const name = btn.dataset.shape;
      ORDER.forEach(function (n, k) {
        if (n === name) shapeIdx = k;
      });
      document.querySelectorAll('.shape-btn').forEach(function (b) {
        b.classList.toggle('on', b === btn);
      });
      morphTo(name);
      lastUser = performance.now();
    });
  });

  function stop(event) {
    event.stopPropagation();
  }

  const zoomIn = document.getElementById('zoomIn');
  const zoomOut = document.getElementById('zoomOut');

  if (zoomIn && zoomOut) {
    zoomIn.addEventListener('pointerdown', stop);
    zoomOut.addEventListener('pointerdown', stop);
    zoomIn.addEventListener('click', function () {
      zTarget = clamp(zTarget - 4, 15, 44);
    });
    zoomOut.addEventListener('click', function () {
      zTarget = clamp(zTarget + 4, 15, 44);
    });
  }

  setInterval(function () {
    if (performance.now() - lastUser < 12000) return;
    shapeIdx = (shapeIdx + 1) % ORDER.length;
    morphTo(ORDER[shapeIdx]);
    document.querySelectorAll('.shape-btn').forEach(function (b, k) {
      b.classList.toggle('on', k === shapeIdx);
    });
  }, 6500);

  function resize() {
    const r = stage.getBoundingClientRect();
    const w = Math.max(1, r.width),
      h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    mat.uniforms.uPR.value = renderer.getPixelRatio();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (camera.aspect < 0.9) zTarget = Math.max(zTarget, 38);
    else zTarget = Math.min(zTarget, 30);
  }

  new ResizeObserver(resize).observe(stage);
  resize();

  let visible = true;
  new IntersectionObserver(
    function (es) {
      visible = es[0].isIntersecting;
    },
    { threshold: 0 }
  ).observe(stage);

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible || document.hidden) return;

    mat.uniforms.uTime.value = clock.elapsedTime;

    if (tM < 1) {
      tM = Math.min(1, tM + dt / DUR);
      const e = ease(tM),
        a = posArr,
        b = fromArr,
        c = toArr;
      for (let k = 0, L = N * 3; k < L; k++) a[k] = b[k] + (c[k] - b[k]) * e;
      geo.attributes.position.needsUpdate = true;
    }

    if (!dragging) {
      rotY += velY;
      rotX = clamp(rotX + velX, -0.9, 0.9);
      velY *= 0.94;
      velX *= 0.94;
      idle += dt;
      const auto = idle > 2 ? Math.min(1, (idle - 2) / 2) : 0;
      rotY += 0.1 * dt * auto;
    }
    spinGroup.rotation.set(rotX, rotY, 0);
    tiltGroup.rotation.x += (tiltTX - tiltGroup.rotation.x) * 0.05;
    tiltGroup.rotation.y += (tiltTY - tiltGroup.rotation.y) * 0.05;

    camera.position.z += (zTarget - camera.position.z) * 0.06;

    renderer.render(scene, camera);
  }
  frame();
})();