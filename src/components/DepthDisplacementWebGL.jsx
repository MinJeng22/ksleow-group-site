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
    vec4 depthData = texture2D(uDepth, vUv);
    // Depth map is grayscale. Usually white (1.0) is foreground, black (0.0) is background.
    float depth = depthData.r;
    
    // Soften extreme edges slightly
    depth = smoothstep(0.02, 0.98, depth);

    // Subtraction makes the pixels move towards the mouse direction.
    // We just use 'depth' instead of 'depth - 0.5' so the background stays completely glued,
    // and only the foreground person moves.
    vec2 offset = uMouse * depth * uDepthScale;
    
    vec2 distortedUv = vUv - offset;
    
    // Clamp to prevent edge bleeding or repeating
    distortedUv = clamp(distortedUv, 0.0, 1.0);
    
    vec4 color = texture2D(uImage, distortedUv);
    
    gl_FragColor = color;
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
      // x and y are expected to be from -1 to 1
      stateRef.current.targetMouse.set(x, y);
      stateRef.current.active = active;
    }
  }));

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Orthographic camera fits the plane perfectly
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Textures
    const textureLoader = new THREE.TextureLoader();
    let imgTexture, depthTexture;

    imgTexture = textureLoader.load(imageSrc);
    depthTexture = textureLoader.load(depthSrc);
    
    imgTexture.minFilter = THREE.LinearFilter;
    depthTexture.minFilter = THREE.LinearFilter;
    
    // We want the texture to cover the plane nicely.
    // By default, it maps 0-1. The CSS object-fit: contain can be simulated,
    // but in OurTeam, the image is 'contain' positioned at bottom center.
    // If we just pass the original image, we'll need to make sure the canvas aspect ratio matches the image,
    // OR we just use CSS object-fit on the WebGL canvas! Wait, canvas isn't an img.
    // CSS object-fit works on canvas elements!
    // But does the ShaderMaterial stretch? Yes, the shader outputs exactly what the texture is.
    // Wait, if the canvas element is stretched by object-fit, the internal resolution might be warped.
    // Actually, object-fit on <canvas> works perfectly fine!

    const uniforms = {
      uImage: { value: imgTexture },
      uDepth: { value: depthTexture },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDepthScale: { value: 0.016 } // Tune intensity
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
      // Smoothly interpolate towards target
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
