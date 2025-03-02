import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import SlideToEscape from './components/SlideToEscape';
import GalaxyBackground from './components/GalaxyBackground';
import './App.css';

// 3D Model component
function Model() {
  const { scene } = useGLTF('/fxf3dlogo.glb');
  
  // Make sure the model is visible and properly scaled
  useEffect(() => {
    if (scene) {
      // Center the model
      scene.position.set(0, 0, 0);
      
      // Make sure the model is visible (adjust scale if needed)
      scene.scale.set(1.5, 1.5, 1.5);
      
      // Ensure proper lighting
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.needsUpdate = true;
        }
      });
    }
  }, [scene]);
  
  return <primitive object={scene} />;
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
                  camera={{ position: [0, 0, 5], fov: 45 }}
                  shadows
                >
                  <color attach="background" args={['transparent']} />
                  <ambientLight intensity={0.7} />
                  <spotLight 
                    position={[10, 10, 10]} 
                    angle={0.15} 
                    penumbra={1} 
                    intensity={1} 
                    castShadow 
                  />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  <Suspense fallback={null}>
                    <Model />
                    <Environment preset="city" />
                    <ContactShadows 
                      position={[0, -1.5, 0]}
                      opacity={0.4}
                      scale={10}
                      blur={1.5}
                      far={1.5}
                    />
                    <OrbitControls 
                      enableZoom={false} 
                      autoRotate 
                      autoRotateSpeed={1}
                      enablePan={false}
                    />
                  </Suspense>
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
