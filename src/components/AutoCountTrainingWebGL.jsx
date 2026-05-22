import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// YouTube video thumbnail to use as the WebGL texture
const THUMBNAIL_SRC = "https://img.youtube.com/vi/ztmg4hvro6U/maxresdefault.jpg";

export default function AutoCountTrainingWebGL() {
  const [webglError, setWebglError] = useState(false);
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rightTextRef = useRef(null);
  const overlayRef = useRef(null);
  const playWordRef = useRef(null);
  const reelWordRef = useRef(null);
  const playCircleRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);

  useGSAP(() => {
    if (webglError) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Use an orthographic camera or perspective? 
    // Perspective is needed for Z-axis distortion to look 3D.
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Position camera so that 1 Three.js unit = 1 pixel at z=0
    // distance = (height / 2) / tan(FOV / 2)
    const fovY = (camera.fov * Math.PI) / 180;
    const cameraZ = (window.innerHeight / 2) / Math.tan(fovY / 2);
    camera.position.z = cameraZ;
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

    // 2. Texture setup (Using YouTube Thumbnail instead of Video for WebGL compatibility)
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(THUMBNAIL_SRC);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;

    // A 1x1 plane geometry. We will scale it in the vertex shader.
    // High segment count for smooth wave distortion.
    const geometry = new THREE.PlaneGeometry(1, 1, 128, 64);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uProgress: { value: 0.0 },
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMediaSize: { value: new THREE.Vector2(1920, 1080) },
        uPlaneSizeInitial: { value: new THREE.Vector2(window.innerWidth * 0.4, window.innerHeight * 0.6) },
        uPlaneSizeFinal: { value: new THREE.Vector2(window.innerWidth * 0.95, window.innerHeight * 0.9) }
      },
      vertexShader: `
        uniform float uProgress;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uPlaneSizeInitial;
        uniform vec2 uPlaneSizeFinal;
        varying vec2 vUv;
        varying float vDistortion;

        void main() {
          vUv = uv;
          vec3 pos = position; // Ranges from -0.5 to 0.5
          
          float initW = uPlaneSizeInitial.x;
          float initH = uPlaneSizeInitial.y;
          // Initial position: Left side, centered vertically
          float initX = -uResolution.x * 0.5 + initW * 0.5 + uResolution.x * 0.08; // 8vw left margin
          float initY = 0.0;
          
          float finalW = uPlaneSizeFinal.x;
          float finalH = uPlaneSizeFinal.y;
          // Final position: Perfectly centered
          float finalX = 0.0;
          float finalY = 0.0;
          
          float currentW = mix(initW, finalW, uProgress);
          float currentH = mix(initH, finalH, uProgress);
          float currentX = mix(initX, finalX, uProgress);
          float currentY = mix(initY, finalY, uProgress);
          
          // Apply scale and translation
          pos.x *= currentW;
          pos.y *= currentH;
          pos.x += currentX;
          pos.y += currentY;
          
          // Lusion-style Distortion
          // Peaks at uProgress = 0.5, 0 at 0.0 and 1.0
          float waveIntensity = sin(uProgress * 3.14159);
          
          // Wave frequency and speed
          float freq = vUv.x * 6.28 - uTime * 2.5;
          
          float bendZ = sin(freq) * uResolution.x * 0.08 * waveIntensity;
          float bendY = cos(freq * 0.8) * uResolution.y * 0.05 * waveIntensity;
          
          pos.z += bendZ;
          pos.y += bendY;

          // Pass distortion to fragment for fake lighting
          vDistortion = cos(freq) * waveIntensity;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uMediaSize;
        uniform float uProgress;
        uniform vec2 uPlaneSizeInitial;
        uniform vec2 uPlaneSizeFinal;
        varying vec2 vUv;
        varying float vDistortion;

        // Signed Distance Field for Rounded Box
        float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
          return length(max(abs(CenterPosition) - Size + Radius, 0.0)) - Radius;
        }

        void main() {
          float currentW = mix(uPlaneSizeInitial.x, uPlaneSizeFinal.x, uProgress);
          float currentH = mix(uPlaneSizeInitial.y, uPlaneSizeFinal.y, uProgress);
          vec2 currentSize = vec2(currentW, currentH);
          
          float currentRadius = mix(24.0, 40.0, uProgress);
          
          // Map uv to pixel coordinates relative to center
          vec2 pixelPos = (vUv - 0.5) * currentSize;
          float dist = roundedBoxSDF(pixelPos, currentSize * 0.5, currentRadius);
          
          // Anti-aliased alpha
          float alpha = smoothstep(0.5, -0.5, dist);
          if (alpha <= 0.0) discard;

          // Object-fit: cover
          vec2 ratio = vec2(
            min((currentW / currentH) / (uMediaSize.x / uMediaSize.y), 1.0),
            min((currentH / currentW) / (uMediaSize.y / uMediaSize.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );

          vec4 texColor = texture2D(uTexture, uv);
          
          // Add a blue/purple tint during transition to match the Lusion vibe
          vec3 tint = vec3(0.4, 0.2, 0.9);
          float tintStrength = sin(uProgress * 3.14159) * 0.5;
          vec3 finalColor = mix(texColor.rgb, tint, tintStrength);
          
          // Add fake 3D shading
          finalColor += vDistortion * 0.15;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let time = 0;
    let raf;
    const render = () => {
      time += 0.01;
      if (materialRef.current) materialRef.current.uniforms.uTime.value = time;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    // GSAP ScrollTrigger Sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%", // Pin for 200vh for a longer, smoother stretch
        scrub: 1,
        pin: true,
      }
    });

    // Animate WebGL Plane
    tl.to(material.uniforms.uProgress, {
      value: 1.0,
      ease: "power2.inOut",
      duration: 1
    }, 0);

    // Fade out Right Text
    tl.to(rightTextRef.current, {
      opacity: 0,
      x: 50,
      ease: "power1.in",
      duration: 0.4
    }, 0);

    // Fade in "PLAY" and "REEL"
    tl.fromTo(playWordRef.current, { opacity: 0, x: -100 }, { opacity: 1, x: 0, ease: "power2.out", duration: 0.5 }, 0.5);
    tl.fromTo(reelWordRef.current, { opacity: 0, x: 100 }, { opacity: 1, x: 0, ease: "power2.out", duration: 0.5 }, 0.5);
    
    // Scale in Center Circle
    tl.fromTo(playCircleRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, ease: "back.out(1.5)", duration: 0.5 }, 0.6);

    const handleResize = () => {
      const iw = window.innerWidth;
      const ih = window.innerHeight;
      
      camera.aspect = iw / ih;
      const fovY = (camera.fov * Math.PI) / 180;
      camera.position.z = (ih / 2) / Math.tan(fovY / 2);
      camera.updateProjectionMatrix();
      
      renderer.setSize(iw, ih);
      
      material.uniforms.uResolution.value.set(iw, ih);
      material.uniforms.uPlaneSizeInitial.value.set(iw * 0.4, ih * 0.6);
      material.uniforms.uPlaneSizeFinal.value.set(iw * 0.95, ih * 0.9);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
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
            <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.6rem" }}>
              Free Training
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "0.9rem" }}>
              Learn AutoCount Accounting in Just 60 Minutes
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#6b6f91", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 1.5rem" }}>
              Skip the long manuals. AutoCount's 60-minute guide covers everything you need to know to navigate AutoCount Accounting with confidence.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a href="https://youtu.be/ztmg4hvro6U" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#2f315a", color: "#ffffff", padding: "0.75rem 1.75rem", borderRadius: 50, fontSize: "0.88rem", fontWeight: 600, textDecoration: "none" }}>
                Watch on YouTube
              </a>
            </div>
          </div>
          <div style={{ borderRadius: 18, overflow: "hidden", boxShadow: "0 20px 60px rgba(47,49,90,0.16)", border: "1px solid rgba(47,49,90,0.08)" }}>
            <div style={{ paddingBottom: "56.25%", position: "relative", background: "#0f1128" }}>
              <iframe src="https://www.youtube.com/embed/ztmg4hvro6U" title="Training" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section ref={containerRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#f8f9fc" }}>
      {/* 3D Canvas */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>

      {/* Initial State Text (Right Side) */}
      <div 
        ref={rightTextRef}
        style={{
          position: "absolute", top: "50%", right: "5vw", width: "40vw",
          transform: "translateY(-50%)", zIndex: 2, pointerEvents: "auto",
          display: "flex", flexDirection: "column", justifyContent: "center"
        }}
      >
        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 500, color: "#111", lineHeight: 1.3, marginBottom: "1.5rem" }}>
          We combine design, motion, 3D, and development to create digital experiences that feel visually striking and technically seamless.
        </h2>
        <div>
          <a
            href="https://youtu.be/ztmg4hvro6U?si=hojFUhwFF0gOmzA8"
            target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.8rem",
              background: "#ffffff", color: "#111", padding: "1rem 2rem", borderRadius: 50,
              fontSize: "0.9rem", fontWeight: 700, textDecoration: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)", transition: "transform 0.2s"
            }}
            onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#111" }}></span>
            FREE TRAINING
          </a>
        </div>
      </div>

      {/* Final State Overlay (PLAY REEL) */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "4vw"
        }}
      >
        <div ref={playWordRef} style={{ fontSize: "12vw", fontWeight: 400, color: "#ffffff", letterSpacing: "0.02em", opacity: 0 }}>
          PLAY
        </div>
        
        <a
          ref={playCircleRef}
          href="https://youtu.be/ztmg4hvro6U?si=hojFUhwFF0gOmzA8"
          target="_blank" rel="noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "12vw", height: "12vw", borderRadius: "50%", background: "#ffffff",
            pointerEvents: "auto", opacity: 0, transition: "transform 0.3s", flexShrink: 0,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
          }}
          onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <svg width="3vw" height="3vw" viewBox="0 0 24 24" fill="#111" style={{ marginLeft: "0.5vw" }}>
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </a>

        <div ref={reelWordRef} style={{ fontSize: "12vw", fontWeight: 400, color: "#ffffff", letterSpacing: "0.02em", opacity: 0 }}>
          REEL
        </div>
      </div>
    </section>
  );
}
