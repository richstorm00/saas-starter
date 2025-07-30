'use client';

import { useEffect, useRef } from 'react';

export function ShaderBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Performance checks
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasBatteryAPI = 'getBattery' in navigator;
    
    // Skip on mobile or low battery
    if (isMobile) {
      return;
    }

    // Check battery level if available
    let shouldSkip = false;
    if (hasBatteryAPI) {
      navigator.getBattery().then(battery => {
        if (battery.level < 0.2 || !battery.charging) {
          shouldSkip = true;
          return;
        }
      });
    }

    if (shouldSkip) return;

    // Dynamically load Three.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    document.head.appendChild(script);

    let scene: any, camera: any, renderer: any, material: any, mesh: any;
    let animationId: number;
    let lastTime = 0;
    let frameCount = 0;

    const initShader = () => {
      if (!window.THREE || !mountRef.current) return;

      const THREE = window.THREE;

      // Create scene
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        powerPreference: 'low-power' // Use integrated GPU
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Reduced from 2
      mountRef.current.appendChild(renderer.domElement);

      // Create geometry
      const geometry = new THREE.PlaneGeometry(2, 2);
      
      // Shader material
      material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float iTime;
          uniform vec2 iResolution;
          
          // Simplified noise function for better performance
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 3; i++) { // Reduced from 4-5 octaves
              value += amplitude * noise(p);
              p *= 2.0;
              amplitude *= 0.5;
            }
            return value;
          }
          
          void main() {
            vec2 uv = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
            float time = iTime * 0.3; // Slower animation
            
            float n = fbm(uv * 2.0 + time);
            
            // Simplified color palette
            vec3 color = mix(
              vec3(0.1, 0.2, 0.4),
              vec3(0.3, 0.1, 0.5),
              n
            );
            
            color *= 0.4; // Dimmer
            
            gl_FragColor = vec4(color, 0.8);
          }
        `,
        transparent: true,
        depthWrite: false
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const animate = (currentTime: number) => {
        if (document.hidden) return;
        
        // Limit to 30fps
        if (currentTime - lastTime < 33.33) {
          animationId = requestAnimationFrame(animate);
          return;
        }
        lastTime = currentTime;

        material.uniforms.iTime.value += 0.005; // Half speed
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };

      const handleResize = () => {
        if (renderer && material) {
          renderer.setSize(window.innerWidth, window.innerHeight);
          material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
        }
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        } else {
          animationId = requestAnimationFrame(animate);
        }
      };

      window.addEventListener('resize', handleResize);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      animationId = requestAnimationFrame(animate);
    };

    script.onload = initShader;

    return () => {
      document.head.removeChild(script);
      
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
      
      window.removeEventListener('resize', () => {});
      document.removeEventListener('visibilitychange', () => {});
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ willChange: 'transform' }}
    />
  );
}

// Fallback component for development
export function StaticBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}