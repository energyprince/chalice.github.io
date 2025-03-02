import React, { useState, useRef, useEffect, useCallback } from 'react';
import './SlideToEscape.css';

const SlideToEscape = ({ onUnlock }) => {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);
  
  const getSliderWidth = useCallback(() => {
    if (sliderRef.current) {
      return sliderRef.current.offsetWidth - (thumbRef.current ? thumbRef.current.offsetWidth : 0);
    }
    return 0;
  }, [sliderRef, thumbRef]);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
    setPosition(getSliderWidth());
    
    // Call the parent's onUnlock callback
    if (onUnlock) {
      setTimeout(() => {
        onUnlock();
      }, 500); // Small delay for animation
    }
  }, [onUnlock, getSliderWidth]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || unlocked) return;
    
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newPosition = Math.max(0, Math.min(e.clientX - sliderRect.left, getSliderWidth()));
    setPosition(newPosition);
    
    // Check if slider is at the end
    if (newPosition >= getSliderWidth() * 0.95) {
      handleUnlock();
    }
  }, [isDragging, unlocked, getSliderWidth, handleUnlock]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || unlocked) return;
    
    const touch = e.touches[0];
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newPosition = Math.max(0, Math.min(touch.clientX - sliderRect.left, getSliderWidth()));
    setPosition(newPosition);
    
    // Check if slider is at the end
    if (newPosition >= getSliderWidth() * 0.95) {
      handleUnlock();
    }
    
    e.preventDefault(); // Prevent scrolling while dragging
  }, [isDragging, unlocked, getSliderWidth, handleUnlock]);

  const handleMouseUp = useCallback(() => {
    if (unlocked) return;
    
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Reset position if not unlocked
    if (position < getSliderWidth() * 0.95) {
      setPosition(0);
    }
  }, [position, unlocked, getSliderWidth, handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    if (unlocked) return;
    
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    
    // Reset position if not unlocked
    if (position < getSliderWidth() * 0.95) {
      setPosition(0);
    }
  }, [position, unlocked, getSliderWidth, handleTouchMove]);

  const handleMouseDown = useCallback((e) => {
    if (unlocked) return;
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  }, [unlocked, handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback((e) => {
    if (unlocked) return;
    setIsDragging(true);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    e.preventDefault();
  }, [unlocked, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    // Add event listeners when component mounts
    const thumbElement = thumbRef.current;
    
    if (thumbElement) {
      thumbElement.addEventListener('mousedown', handleMouseDown);
      thumbElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    }
    
    // Clean up event listeners when component unmounts
    return () => {
      if (thumbElement) {
        thumbElement.removeEventListener('mousedown', handleMouseDown);
        thumbElement.removeEventListener('touchstart', handleTouchStart);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseDown, handleTouchStart, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className={`slide-to-escape ${unlocked ? 'unlocked' : ''}`} ref={sliderRef}>
      <div className="slide-track">
        <div className="slide-text">SLIDE TO ESCAPE</div>
      </div>
      <div 
        className="slide-thumb" 
        ref={thumbRef}
        style={{ left: `${position}px` }}
      >
        <div className="thumb-icon">→</div>
      </div>
    </div>
  );
};

export default SlideToEscape;
