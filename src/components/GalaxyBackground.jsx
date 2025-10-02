import React, { useRef, useEffect } from 'react';
import './GalaxyBackground.css';

// Controls how fast stars pulse (smaller = slower)
const PULSE_SPEED = 0.02; // default was ~0.1; this is ~10x slower

// Star color tuning (blue theme)
const STAR_HUE_BASE = 220;       // ~220° = blue
const STAR_HUE_SPREAD = 10;      // +/- around base hue
const STAR_SATURATION = 85;      // percent
const STAR_LIGHTNESS = 85;       // percent

const GalaxyBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initialize stars
    const stars = [];
    const initStars = () => {
      stars.length = 0;
      const starCount = Math.floor((canvas.width * canvas.height) / 1000);
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5;
        const opacity = Math.random();
        const hue = (Math.random() * 2 - 1) * STAR_HUE_SPREAD; // offset around base hue
        
        stars.push({
          x,
          y,
          radius,
          opacity,
          hue,
          pulse: Math.random() * PULSE_SPEED,
          pulseFactor: 0,
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
          trail: Math.random() > 0.98, // Some stars have trails
          trailLength: Math.random() * 10 + 5,
          speed: Math.random() * 0.05
        });
      }
    };
    
    // Draw stars
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgb(0, 0, 20)');
      gradient.addColorStop(1, 'rgb(0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw nebula clouds
      drawNebulaClouds();
      
      // Draw stars
      stars.forEach(star => {
        // Update pulsing effect
        star.pulseFactor += star.pulse * star.pulseDirection;
        if (star.pulseFactor > 0.5 || star.pulseFactor < -0.5) {
          star.pulseDirection *= -1;
        }
        
        const currentRadius = star.radius * (1 + star.pulseFactor);
        const currentOpacity = star.opacity * (1 + star.pulseFactor * 0.5);
        
        // (halo removed)

        // Draw star trail if it has one
        if (star.trail) {
          const gradient = ctx.createLinearGradient(
            star.x, star.y,
            star.x - star.trailLength, star.y
          );
          gradient.addColorStop(0, `hsla(${STAR_HUE_BASE + star.hue}, ${STAR_SATURATION}%, ${STAR_LIGHTNESS}%, ${currentOpacity})`);
          gradient.addColorStop(1, `hsla(${STAR_HUE_BASE + star.hue}, ${STAR_SATURATION}%, ${STAR_LIGHTNESS}%, 0)`);
          
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x - star.trailLength, star.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = currentRadius;
          ctx.stroke();
          
          // Move star with trail
          star.x += star.speed;
          if (star.x > canvas.width + star.trailLength) {
            star.x = -star.trailLength;
            star.y = Math.random() * canvas.height;
          }
        }
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${STAR_HUE_BASE + star.hue}, ${STAR_SATURATION}%, ${STAR_LIGHTNESS}%, ${currentOpacity})`;
        ctx.fill();

        // (specular highlight removed)
      });
      
      // Request next frame
      animationFrameId = requestAnimationFrame(drawStars);
    };
    
    // Draw nebula clouds
    const drawNebulaClouds = () => {
      const clouds = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: canvas.width * 0.3, color: 'rgba(0, 0, 0, 0.05)' },
        { x: canvas.width * 0.7, y: canvas.height * 0.6, radius: canvas.width * 0.4, color: 'rgba(0, 0, 0, 0.05)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.2, radius: canvas.width * 0.25, color: 'rgba(0, 0, 0, 0.03)' }
      ];
      
      clouds.forEach(cloud => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, cloud.radius
        );
        gradient.addColorStop(0, cloud.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    
    // Handle window resize
    const handleResize = () => {
      setCanvasDimensions();
      initStars();
    };
    
    // Initialize
    setCanvasDimensions();
    initStars();
    drawStars();
    
    // Add event listener for resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="galaxy-background" />;
};

export default GalaxyBackground;
