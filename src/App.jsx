import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import SlideToEscape from './components/SlideToEscape';
import GalaxyBackground from './components/GalaxyBackground';
import './App.css';

// 3D Model component
function Model() {
  const gltf = useGLTF('/fxf3dlogo.glb');
  const modelRef = useRef();
  
  useEffect(() => {
    if (gltf.scene) {
      console.log('Model loaded successfully');
      
      // Reset position
      gltf.scene.position.set(-3, -2.9, 0);
       // Rotate the model to make it vertical
      gltf.scene.rotation.set(Math.PI/2, 0, 0);
      // Start with a smaller scale in case the model is huge
      gltf.scene.scale.set(50.0, 50.0, 50.0);
      
      // Add material properties to ensure visibility
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Ensure material has good defaults
          child.material.metalness = 0.3;
          child.material.roughness = 0.5;
          child.material.color.set('#ffffff');  // White color
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltf]);
  
  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} />
      
      {/* Add a small sphere to mark the center/origin point */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
}

// Add this component to debug model loading issues
function ModelDebugger() {
  useEffect(() => {
    console.log('Debugging model loading issues...');
    
    // List of possible file paths to check
    const possiblePaths = [
      '/fxf3dlogo.glb',
      '/models/fxf3dlogo.glb',
      '/public/fxf3dlogo.glb',
      '/public/models/fxf3dlogo.glb',
      '/model.glb',
      '/public/model.glb',
      '/models/model.glb',
      '/fx3dlogo.glb'
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

// Preload the model
useGLTF.preload('/fxf3dlogo.glb');

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    // You can redirect to main shop or show main content here
  };

  return (
    <div className="app">
      <GalaxyBackground />
      <ModelDebugger /> {/* Add the debugger component */}
      
      {loading ? (
        <div className="loading">
          <div className="logo-container">
            <img src="/logo.svg" alt="Logo" className="logo" />
          </div>
          <div className="loading-text">Loading experience...</div>
        </div>
      ) : (
        <>
          {!isUnlocked ? (
            <div className="landing-container">
              <div className="logo-container">
                <img src="/logo.svg" alt="Logo" className="logo" />
              </div>
              
              <div className="model-container">
                <Canvas 
                  camera={{ position: [0, 0, 5], fov: 75 }}  // Wider field of view
                  shadows
                  gl={{ alpha: true }}  // Enable transparency
                >
                  {/* Enhanced lighting */}
                  <ambientLight intensity={1.0} />  
                  <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
                  <directionalLight position={[-5, -5, -5]} intensity={0.5} />
                  
                  <Suspense fallback={
                    <mesh>
                      <boxGeometry args={[1, 1, 1]} />
                      <meshStandardMaterial color="hotpink" />
                    </mesh>
                  }>
                    <Model />
                    <Environment preset="sunset" />
                  </Suspense>
                  
                  {/* Enable zoom and pan to help you find your model */}
                  <OrbitControls 
                    enableZoom={true}
                    enablePan={true}
                    autoRotate={true}  // Enable auto-rotation
                    autoRotateSpeed={3.5}  // Control rotation speed (higher = faster)
                  />
                </Canvas>
              </div>
              
              <div className="slide-container">
                <SlideToEscape onUnlock={handleUnlock} />
              </div>
              
              <div className="inspiration-text">
                <p>never give up on what you believe in</p>
                <p>find happiness</p>
                <p>find love</p>
                <p>find peace</p>
              </div>
            </div>
          ) : (
            <div className="main-content">
              {/* Main shop content after unlocking */}
              <h1>Welcome to our Collection</h1>
              {/* Add your shop content here */}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
