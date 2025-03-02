import React, { useState, useRef, useEffect, useCallback } from 'react';
import './SlideToEscape.css';

const SlideToEscape = ({ onUnlock }) => {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);
  const startXRef = useRef(0);

  const getSliderWidth = useCallback(() => {
    return sliderRef.current ? 
      sliderRef.current.offsetWidth - (thumbRef.current ? thumbRef.current.offsetWidth : 0) 
      : 0;
  }, [sliderRef, thumbRef]);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
    setPosition(getSliderWidth());
    
    if (onUnlock) {
      setTimeout(onUnlock, 500);
    }
  }, [onUnlock, getSliderWidth]);

  const updatePosition = useCallback((clientX) => {
    if (!sliderRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newPosition = Math.max(0, Math.min(
      clientX - sliderRect.left - startXRef.current, 
      getSliderWidth()
    ));

    setPosition(newPosition);

    // Unlock condition
    if (newPosition >= getSliderWidth() * 0.9) {
      handleUnlock();
    }
  }, [getSliderWidth, handleUnlock]);

  const startDragging = useCallback((clientX) => {
    if (unlocked) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    startXRef.current = clientX - sliderRect.left - position;
    setIsDragging(true);
  }, [position, unlocked]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    startDragging(e.clientX);
  }, [startDragging]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    startDragging(e.touches[0].clientX);
  }, [startDragging]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || unlocked) return;
    updatePosition(e.clientX);
  }, [isDragging, unlocked, updatePosition]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || unlocked) return;
    updatePosition(e.touches[0].clientX);
  }, [isDragging, unlocked, updatePosition]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    if (!unlocked) {
      setPosition(0);
    }
  }, [unlocked]);

  useEffect(() => {
    const handleMouseUp = () => stopDragging();
    const handleTouchEnd = () => stopDragging();

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove, stopDragging]);

  return (
    <div className="slide-to-escape-wrapper">
      <div 
        ref={sliderRef} 
        className={`slide-to-escape ${unlocked ? 'unlocked' : ''}`}
      >
        <div className="slide-track">
          <span className="slide-text">
            {unlocked ? 'Unlocked!' : 'Slide to Unlock'}
          </span>
        </div>
        <div 
          ref={thumbRef}
          className="slide-handle"
          style={{ transform: `translateX(${position}px)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
      </div>
    </div>
  );
};

export default SlideToEscape;
