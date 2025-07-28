'use client';

import { useEffect, useRef } from 'react';

export function ShaderBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically load Three.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    document.head.appendChild(script);

    let scene: any, camera: any, renderer: any, material: any, mesh: any;
    let animationId: number;

    const initShader = () => {
      if (!window.THREE || !mountRef.current) return;

      const THREE = window.THREE;

      // Create scene
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({ alpha: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
          
          // Smooth fract function
          float sFract(float x, float sm) {
            const float sf = 1.0;
            vec2 u = vec2(x, fwidth(x) * sf * sm);
            u.x = fract(u.x);
            u += (1.0 - 2.0 * u) * step(u.y, u.x);
            return clamp(1.0 - u.x / u.y, 0.0, 1.0);
          }
          
          float sFloor(float x) {
            return x - sFract(x, 1.0);
          }
          
          // Hash function for noise
          vec3 hash33(vec3 p) {
            float n = sin(dot(p, vec3(7.0, 157.0, 113.0)));
            return fract(vec3(2097152.0, 262144.0, 32768.0) * n) * 2.0 - 1.0;
          }
          
          // Tetrahedral noise
          float tetraNoise(vec3 p) {
            vec3 i = floor(p + dot(p, vec3(1.0 / 3.0)));
            p -= i - dot(i, vec3(1.0 / 6.0));
            vec3 i1 = step(p.yzx, p);
            vec3 i2 = max(i1, 1.0 - i1.zxy);
            i1 = min(i1, 1.0 - i1.zxy);
            vec3 p1 = p - i1 + 1.0 / 6.0;
            vec3 p2 = p - i2 + 1.0 / 3.0;
            vec3 p3 = p - 0.5;
            vec4 v = max(0.5 - vec4(dot(p, p), dot(p1, p1), dot(p2, p2), dot(p3, p3)), 0.0);
            vec4 d = vec4(dot(p, hash33(i)), dot(p1, hash33(i + i1)), dot(p2, hash33(i + i2)), dot(p3, hash33(i + 1.0)));
            return clamp(dot(d, v * v * v * 8.0) * 1.732 + 0.5, 0.0, 1.0);
          }
          
          // Main pattern function
          float func(vec2 p) {
            float n = tetraNoise(vec3(p.x * 3.0, p.y * 3.0, 0.0) - vec3(0.0, 0.15, 0.3) * iTime);
            float taper = 0.08 + dot(p, p * vec2(0.25, 0.8));
            n = max(n - taper, 0.0) / max(1.0 - taper, 0.0001);
            const float palNum = 12.0;
            return n * 0.2 + clamp(sFloor(n * (palNum - 0.001)) / (palNum - 1.0), 0.0, 1.0) * 0.8;
          }
          
          void main() {
            vec2 uv = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
            float f = func(uv);
            vec2 e = vec2(1.0 / iResolution.y, 0.0);
            float fxl = func(uv + e.xy);
            float fxr = func(uv - e.xy);
            float fyt = func(uv + e.yx);
            float fyb = func(uv - e.yx);
            
            // Color palette
            vec3 col = pow(min(vec3(1.2, 0.8, 1.4) * (f * 0.6 + 0.4), 1.0), vec3(1.0, 1.5, 8.0) * 1.5) + 0.02;
            col = mix(vec3(0.1, 0.2, 0.4), vec3(0.2, 0.1, 0.3), f);
            col = mix(col, vec3(0.05, 0.1, 0.2), 1.0 - f);
            col *= max(1.0 - (abs(fxl - fxr) + abs(fyt - fyb)) * 3.0, 0.0);
            col *= 0.3;
            
            gl_FragColor = vec4(sqrt(clamp(col, 0.0, 1.0)), 1.0);
          }
        `,
        transparent: true,
        depthWrite: false
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        material.uniforms.iTime.value += 0.01;
        renderer.render(scene, camera);
      };

      const handleResize = () => {
        if (renderer && material) {
          renderer.setSize(window.innerWidth, window.innerHeight);
          material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
        }
      };

      window.addEventListener('resize', handleResize);
      animate();
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