import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Using a generic open-source video for demonstration
const VIDEO_SRC = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function AutoCountTrainingWebGL() {
  const [webglError, setWebglError] = useState(false);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textContainerRef = useRef(null);
  const playBtnRef = useRef(null);
  const videoRef = useRef(null);
  
  // Three.js instances
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const meshRef = useRef(null);
  
  useGSAP(() => {
    // 1. Basic Three.js setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;
    cameraRef.current = camera;
    
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    } catch (e) {
      console.error("WebGL initialization failed:", e);
      setWebglError(true);
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    
    // 2. Video setup
    const video = document.createElement('video');
    video.src = VIDEO_SRC;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play().catch(() => { /* Autoplay might be blocked until interaction */ });
    videoRef.current = video;
    
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    // Calculate plane dimensions to exactly fit the camera view
    const vFov = (camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFov / 2) * camera.position.z;
    const width = height * camera.aspect;
    
    const geometry = new THREE.PlaneGeometry(width, height, 128, 64);
    
    // 3. Shader Material for Cloth Unfurling
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uProgress: { value: 0.0 }, // 0: folded on the left, 1: fully flat
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMediaSize: { value: new THREE.Vector2(1920, 1080) } // Assuming standard 1080p
      },
      vertexShader: `
        uniform float uProgress;
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;
        varying float vShading;

        void main() {
          vUv = uv;
          vec3 pos = position; // Original flat position
          
          float W = uResolution.x;
          
          // Folded state (compressed into the left half of the screen)
          // Maps vUv.x (0 to 1) directly to [-W/2, 0]
          float foldedX = -W * 0.5 + vUv.x * (W * 0.5);
          
          float foldAmount = 1.0 - uProgress;
          
          // Z-axis displacement for the cloth ripple effect
          float ripples = sin(vUv.x * 30.0 - uTime * 2.5) * W * 0.03 * foldAmount * (vUv.x * 1.5 + 0.2);
          
          // Slight X-axis bunching to make folds look tight
          float bunching = cos(vUv.x * 30.0 - uTime * 2.5) * W * 0.005 * foldAmount;
          
          // Overall large bend so the left edge curves away
          float bend = sin(vUv.x * 3.14159) * W * 0.1 * foldAmount;

          // Interpolate between the folded state and the flat fullscreen state
          pos.x = mix(foldedX + bunching, pos.x, uProgress);
          pos.z += ripples - bend;

          // Fake shading derivative based on the ripples
          vShading = cos(vUv.x * 30.0 - uTime * 2.5) * 0.15 * foldAmount;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform vec2 uMediaSize;
        varying vec2 vUv;
        varying float vShading;

        void main() {
          // Object-fit: cover mapping
          vec2 ratio = vec2(
            min((uResolution.x / uResolution.y) / (uMediaSize.x / uMediaSize.y), 1.0),
            min((uResolution.y / uResolution.x) / (uMediaSize.y / uMediaSize.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );

          vec4 texColor = texture2D(uTexture, uv);
          
          // Apply fake shading
          vec3 finalColor = texColor.rgb + vec3(vShading);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // 4. Animation Loop
    let time = 0;
    let animationFrameId;
    const render = () => {
      time += 0.01;
      if (materialRef.current) materialRef.current.uniforms.uTime.value = time;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // 5. GSAP ScrollTrigger Sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%", // Pinned for 150vh
        scrub: 1,      // Smooth scrub
        pin: true,
      }
    });

    // Unfurl WebGL cloth
    tl.to(material.uniforms.uProgress, {
      value: 1.0,
      ease: "power2.inOut",
      duration: 1
    }, 0);

    // Fade out right text, moving up slightly
    tl.to(textContainerRef.current, {
      opacity: 0,
      y: -60,
      ease: "power2.in",
      duration: 0.6
    }, 0);

    // Fade and scale in center PLAY button
    tl.fromTo(playBtnRef.current, {
      opacity: 0,
      scale: 0.5
    }, {
      opacity: 1,
      scale: 1,
      ease: "back.out(1.5)",
      duration: 0.4
    }, 0.6);

    // 6. Handle Window Resize
    const handleResize = () => {
      const iw = window.innerWidth;
      const ih = window.innerHeight;
      
      camera.aspect = iw / ih;
      camera.updateProjectionMatrix();
      renderer.setSize(iw, ih);
      
      const newVFov = (camera.fov * Math.PI) / 180;
      const newH = 2 * Math.tan(newVFov / 2) * camera.position.z;
      const newW = newH * camera.aspect;
      
      material.uniforms.uResolution.value.set(newW, newH);
      
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(newW, newH, 128, 64);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, { scope: containerRef });

  if (webglError) {
    return (
      <div className="ac-section-tight" style={{ background: "#ffffff", padding: "4.5rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)", scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.6rem",
            }}>
              Free Training
            </div>
            <h2 style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", fontWeight: 700,
              color: "#2f315a", lineHeight: 1.2, marginBottom: "0.9rem",
            }}>
              Learn AutoCount Accounting in Just 60 Minutes
            </h2>
            <p style={{
              fontSize: "0.95rem", color: "#6b6f91", lineHeight: 1.8,
              maxWidth: 560, margin: "0 auto 1.5rem",
            }}>
              Skip the long manuals. AutoCount's 60-minute guide covers
              everything you need to know to navigate AutoCount Accounting
              with confidence — from basic setup to daily transactions.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href="https://youtu.be/ztmg4hvro6U?si=hojFUhwFF0gOmzA8"
                target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "#2f315a", color: "#ffffff",
                  padding: "0.75rem 1.75rem", borderRadius: 50,
                  fontSize: "0.88rem", fontWeight: 600,
                  textDecoration: "none", transition: "background 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
                onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
                Watch on YouTube
              </a>
              <span style={{
                display: "inline-flex", alignItems: "center",
                fontSize: "0.82rem", color: "#a8abcc", fontWeight: 500,
                padding: "0.75rem 1rem",
              }}>
                Free · 60 min · By AutoCount
              </span>
            </div>
          </div>

          <div style={{
            borderRadius: 18, overflow: "hidden",
            boxShadow: "0 20px 60px rgba(47,49,90,0.16)",
            border: "1px solid rgba(47,49,90,0.08)",
          }}>
            <div style={{ paddingBottom: "56.25%", position: "relative", background: "#0f1128" }}>
              <iframe
                src="https://www.youtube.com/embed/ztmg4hvro6U"
                title="Learn AutoCount Accounting in 60 Minutes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section ref={containerRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#f5f5f8" }}>
      {/* Background container for the WebGL Canvas */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>

      {/* Initial state UI (Right side text) */}
      <div 
        ref={textContainerRef}
        style={{
          position: "absolute",
          top: "50%",
          right: "0",
          width: "50vw",
          transform: "translateY(-50%)",
          zIndex: 2,
          padding: "0 6vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pointerEvents: "none" // Allow clicks to pass through to canvas if needed
        }}
      >
        <div style={{
          fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.8rem",
        }}>
          Free Training
        </div>
        <h2 style={{
          fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800,
          color: "#2f315a", lineHeight: 1.15, marginBottom: "1.2rem",
        }}>
          Learn AutoCount Accounting in Just 60 Minutes
        </h2>
        <p style={{
          fontSize: "1.05rem", color: "#6b6f91", lineHeight: 1.7,
          marginBottom: "2rem", maxWidth: "480px"
        }}>
          Skip the long manuals. AutoCount's 60-minute guide covers
          everything you need to know to navigate AutoCount Accounting
          with confidence — from basic setup to daily transactions.
        </p>
        <div style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <a
            href="https://youtu.be/ztmg4hvro6U?si=hojFUhwFF0gOmzA8"
            target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "#2f315a", color: "#ffffff",
              padding: "0.85rem 2rem", borderRadius: 50,
              fontSize: "0.95rem", fontWeight: 700,
              textDecoration: "none", transition: "background 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
            onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
            Watch on YouTube
          </a>
          <span style={{ fontSize: "0.85rem", color: "#a8abcc", fontWeight: 500 }}>
            Free · 60 min
          </span>
        </div>
      </div>

      {/* Final State UI (Center Play Button) */}
      <div
        ref={playBtnRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 3,
          opacity: 0,
          pointerEvents: "auto"
        }}
      >
        <a
          href="https://youtu.be/ztmg4hvro6U?si=hojFUhwFF0gOmzA8"
          target="_blank" rel="noreferrer"
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            width: "140px", height: "140px", borderRadius: "50%",
            background: "rgba(47, 49, 90, 0.85)", backdropFilter: "blur(6px)",
            color: "#ffffff", textDecoration: "none", transition: "transform 0.3s, background 0.3s"
          }}
          onMouseOver={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.background = "rgba(47, 49, 90, 0.98)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(47, 49, 90, 0.85)"; }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white" style={{ marginBottom: "0.5rem" }}>
            <polygon points="5,3 19,12 5,21" />
          </svg>
          <span style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.1em" }}>WATCH NOW</span>
        </a>
      </div>
    </section>
  );
}
