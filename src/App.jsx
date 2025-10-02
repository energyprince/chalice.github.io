import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
// TouchToEnter removed per request
import GalaxyBackground from './components/GalaxyBackground';
import Home from './components/Home';
import Blog from './components/Blog';
import './App.css';

const VIEW = {
  BLOG: 'blog',
  LANDING: 'landing',
  HOME: 'home',
};

const getHashForView = (view) => {
  switch (view) {
    case VIEW.HOME:
      return '#home';
    case VIEW.LANDING:
      return '#experience';
    case VIEW.BLOG:
    default:
      return '#blog';
  }
};

const resolveViewFromLocation = () => {
  try {
    const { pathname, hash, search } = window.location;

    if (hash === '#home' || pathname === '/home' || /(?:^|[?&])home(?:=1|(?=&|$))/.test(search)) {
      return VIEW.HOME;
    }

    if (hash === '#experience' || pathname === '/experience' || /(?:^|[?&])experience(?:=1|(?=&|$))/.test(search)) {
      return VIEW.LANDING;
    }

    if (hash === '#blog' || pathname === '/blog' || pathname === '/blog.html' || /(?:^|[?&])(view|page)=blog(?:&|$)/.test(search)) {
      return VIEW.BLOG;
    }
  } catch (_) {
    // ignore location parsing errors
  }

  return VIEW.BLOG;
};

// Lightning removed per request

// 3D Model component
function Model() {
  const gltf = useGLTF('/chalice.glb');
  const modelRef = useRef();
  
  
  useEffect(() => {
    if (gltf.scene) {
      console.log('Model loaded successfully');
      
      const scene = gltf.scene;
      // Reset transforms
      scene.position.set(0, 0, 0);
      scene.rotation.set(0, 0, 0);
      scene.scale.set(1, 1, 1);

      // Compute bounding box
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);

      // Heuristic: if Y dimension is smaller than X/Z, rotate to make it upright
      if (size.y < size.z && size.z >= size.x) {
        // Likely lying along Z; bring Z up to Y
        scene.rotation.x = -Math.PI / 2;
      } else if (size.y < size.x && size.x >= size.z) {
        // Likely lying along X; bring X up to Y
        scene.rotation.z = Math.PI / 2;
      }

      // Recompute box after potential rotation
      const box2 = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      box2.getCenter(center);
      // Center at origin
      scene.position.sub(center);

      const size2 = new THREE.Vector3();
      box2.getSize(size2);
      const maxDim = Math.max(size2.x, size2.y, size2.z);
      const targetSize = 1.6; // smaller default size
      if (maxDim > 0) {
        const scale = targetSize / maxDim;
        scene.scale.setScalar(scale);
      }

      // Lower the model further in view
      scene.position.y -= 1.6;

      // Tilt model upward slightly toward the camera
      const tiltUpDeg = 0; // adjust to taste
      scene.rotation.x += THREE.MathUtils.degToRad(tiltUpDeg);

      // Add material properties to ensure visibility (no shadows for perf)
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Ensure material has good defaults
          child.material.metalness = 0.3;
          child.material.roughness = 0.5;
          child.material.color.set('#ffffff');  // White color
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });

      // (Lightning removed)
    }
  }, [gltf]);

  
  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// Add this component to debug model loading issues
function ModelDebugger() {
  useEffect(() => {
    console.log('Debugging model loading issues...');
    
    // List of possible file paths to check
    const possiblePaths = [
      '/chalice.glb',
      '/models/chalice.glb',
      '/public/chalice.glb',
      '/public/models/chalice.glb'
    ];
    
    // Try to fetch each path to see if the file exists
    possiblePaths.forEach(path => {
      fetch(path)
        .then(response => {
          if (response.ok) {
            console.log(`✅ File exists at: ${path}`);
          } else {
            console.log(`❌ File not found at: ${path}`);
          }
        })
        .catch(error => {
          console.log(`❌ Error checking ${path}:`, error);
        });
    });
  }, []);
  
  return null; // This component doesn't render anything
}

// Preload the model (chalice)
useGLTF.preload('/chalice.glb');

// (Lightning component removed)

function App() {
  const initialViewRef = useRef(null);
  if (initialViewRef.current === null) {
    initialViewRef.current = resolveViewFromLocation();
  }

  const [view, setView] = useState(initialViewRef.current);
  const [loading, setLoading] = useState(initialViewRef.current !== VIEW.BLOG);

  useEffect(() => {
    if (view === VIEW.BLOG) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [view]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncFromURL = () => {
      const nextView = resolveViewFromLocation();
      setView(nextView);
    };

    window.addEventListener('popstate', syncFromURL);
    window.addEventListener('hashchange', syncFromURL);

    return () => {
      window.removeEventListener('popstate', syncFromURL);
      window.removeEventListener('hashchange', syncFromURL);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const targetHash = getHashForView(view);
    if (window.location.hash === targetHash) {
      return;
    }

    try {
      window.history.replaceState({}, '', targetHash);
    } catch (_) {
      window.location.hash = targetHash;
    }
  }, [view]);

  const navigateToView = (nextView, { push = false } = {}) => {
    if (typeof window !== 'undefined') {
      const hash = getHashForView(nextView);
      try {
        if (push && window.history && window.history.pushState) {
          window.history.pushState({}, '', hash);
        } else if (window.history && window.history.replaceState) {
          window.history.replaceState({}, '', hash);
        } else {
          window.location.hash = hash;
        }
      } catch (_) {
        window.location.hash = hash;
      }
    }

    setView(nextView);
  };

  const handleShowExperience = () => {
    navigateToView(VIEW.LANDING, { push: true });
  };

  if (view === VIEW.BLOG) {
    return <Blog onShowExperience={handleShowExperience} />;
  }

  const isUnlocked = view === VIEW.HOME;

  return (
    <div className={`app ${isUnlocked ? 'home' : 'landing'}`}>
      {!isUnlocked && <GalaxyBackground />}
      <ModelDebugger /> {/* Add the debugger component */}

      {loading ? (
        <div className="loading">
          <div className="loading-text">Loading experience...</div>
        </div>
      ) : (
        <>
          {!isUnlocked ? (
            <div className="landing-container">
              <div className="model-container">
                <Canvas
                  camera={{ position: [0, 0, 3], fov: 75 }} // Higher camera for a more head-on view
                  dpr={[1, 1.25]}
                  shadows={false}
                  gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }} // Perf tweaks
                  style={{ width: '100%', height: '100%', display: 'block' }}
                >
                  {/* Enhanced lighting */}
                  <ambientLight intensity={0.9} />
                  <directionalLight position={[5, 5, 5]} intensity={0.8} />
                  <directionalLight position={[-5, -5, -5]} intensity={0.4} />

                  <Suspense
                    fallback={
                      <mesh>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="hotpink" />
                      </mesh>
                    }
                  >
                    <Model />
                    <Environment preset="sunset" />
                  </Suspense>

                  {/* Enable zoom and pan to help you find your model */}
                  <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={2.0}
                    minDistance={2}
                    maxDistance={3.25}
                    target={[0, -0.6, 0]}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI}
                    enableDamping={false}
                  />
                </Canvas>
              </div>

              {/* Touch to enter button removed; click anywhere to enter */}

              <div className="inspiration-text">chaliceofenergy</div>
            </div>
          ) : (
            <Home />
          )}
        </>
      )}
    </div>
  );
}

export default App;
