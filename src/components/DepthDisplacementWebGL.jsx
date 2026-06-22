import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uImage;
  uniform sampler2D uDepth;
  uniform vec2 uMouse;
  uniform float uDepthScale;
  varying vec2 vUv;

  void main() {
    float depth = texture2D(uDepth, vUv).r;
    
    // Smooth the depth gently to prevent hard tears
    depth = smoothstep(0.05, 0.95, depth);

    // Subtle offset for 3D bulge
    vec2 offset = uMouse * depth * uDepthScale;
    vec2 distortedUv = vUv - offset;
    
    gl_FragColor = texture2D(uImage, distortedUv);
  }
`;

const DepthDisplacementWebGL = forwardRef(({ 
  imageSrc, 
  depthSrc, 
  className = "",
  style = {}
}, ref) => {
  const mountRef = useRef(null);
  const stateRef = useRef({
    targetMouse: new THREE.Vector2(0, 0),
    active: 0
  });

  useImperativeHandle(ref, () => ({
    updateMouse: (x, y, active) => {
      stateRef.current.targetMouse.set(x, y);
      stateRef.current.active = active;
    }
  }));

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    // Orthographic camera for perfect 2D UV mapping
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const imgTexture = textureLoader.load(imageSrc);
    const depthTexture = textureLoader.load(depthSrc);
    
    imgTexture.minFilter = THREE.LinearFilter;
    depthTexture.minFilter = THREE.LinearFilter;

    const uniforms = {
      uImage: { value: imgTexture },
      uDepth: { value: depthTexture },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDepthScale: { value: 0.015 } // Safe intensity to avoid edge tearing on cutouts
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId;
    const currentMouse = new THREE.Vector2(0, 0);

    const render = () => {
      currentMouse.lerp(stateRef.current.targetMouse, 0.08);
      const activeMult = stateRef.current.active;
      
      uniforms.uMouse.value.x = currentMouse.x * activeMult;
      // Invert Y because WebGL UV origin is bottom-left
      uniforms.uMouse.value.y = currentMouse.y * activeMult * -1;
      
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      if (!mountRef.current) return;
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      imgTexture.dispose();
      depthTexture.dispose();
    };
  }, [imageSrc, depthSrc]);

  return (
    <div 
      ref={mountRef} 
      className={className} 
      style={style} 
    />
  );
});

export default DepthDisplacementWebGL;
