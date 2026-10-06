# ⚡ Krishan Kumar — Interactive Developer Portfolio

A high-performance, dark-editorial developer portfolio engineered with **HTML5, CSS3, Vanilla JavaScript, and Three.js (WebGL)**. Built to showcase deep learning vision pipelines, NLP applications, and cybersecurity tooling through interactive 3D particle sculptures, custom cursor physics, and responsive flip-card UI modules.

![Portfolio Preview Banner](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20Three.js-e24e1b?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## ✨ Features

- **3D Morphing Particle Sculpture:** A custom Three.js WebGL canvas featuring 2,400 points morphing dynamically across 4 geometric states (*Sphere, Torus, Knot, Helix*) with interactive pointer drag, inertia physics, and pinch-zoom capabilities.
- **Dual-Face Flip Cards:** Interactive 3D CSS flip-card project displays with embedded SVG wireframe previews, technical specs, and project links.
- **Custom Pointer Physics:** Fluid, contextual cursor supporting hover dynamics (`FLIP`, `DRAG`, `LINK`) with touch/desktop graceful degradation.
- **Text & UI Dynamics:**
  - Decryption title scramble animation triggered on viewport intersection.
  - Smooth vertical text rotor for technical focus area rotation.
  - Interactive skill accordion drawer system.
- **Fully Responsive & Accessible:**
  - Glassmorphic navigation bar with scroll-state blur.
  - Slide-out mobile menu overlay.
  - Full support for `prefers-reduced-motion` and system high-contrast modes.

---

## 🛠️ Tech Stack

### Frontend & Graphics
- **Core:** Semantic HTML5, CSS3 (Custom Variables & Modern Flex/Grid Layouts)
- **Scripting:** Vanilla ES6+ JavaScript
- **3D Engine:** [Three.js v0.160.0](https://threejs.org/) (Custom Shader Materials, Buffer Geometries & Particle Systems)
- **Icons:** [Lucide Icons v0.294.0](https://lucide.dev/)
- **Typography:** Bricolage Grotesque, Instrument Serif, Manrope, Space Mono

### Project Content Focus
- **AI / Machine Learning:** Deep Learning, TensorFlow, OpenCV, CNNs, NLP, Scikit-Learn
- **Cybersecurity:** Penetration Testing, Wireshark, Vulnerability Assessment, Cisco Packet Tracer
- **Backend & Tooling:** Python, Flask, APIs, Git, SQL

---

## 📂 Project Structure

```text
portfolio/
├── index.html            # Main HTML document & structure
├── css/
│   └── style.css         # Custom tokens, reset, typography & component styles
└── js/
    ├── app.js            # Core UI controller (Cursor, Navigation, Reveals, Interactions)
    └── morph-sculpture.js# WebGL 3D Particle Morphing Engine (Three.js)