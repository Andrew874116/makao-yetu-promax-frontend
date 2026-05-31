import React, { useEffect, useRef, useState } from 'react';

/**
 * CONSTRUCTION LORRY WITH FACE
 * - Tows the auth form away on successful login/signup
 * - Face changes expression: angry (accelerating) → happy (cruising) → tired (finishing)
 * - Creates dust particles and screen shake
 * - After exit, calls onComplete callback
 */

const ConstructionLorry = ({ onComplete, formRef }) => {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState(-250);
  const [phase, setPhase] = useState('accelerate');
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const dustRef = useRef([]);

  // Draw the lorry's face on canvas
  const drawFace = (ctx, width, height, mood) => {
    ctx.clearRect(0, 0, width, height);
    
    // Face background (cartoon yellow)
    ctx.fillStyle = '#FFD36E';
    ctx.beginPath();
    ctx.arc(45, 40, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Face outline
    ctx.strokeStyle = '#D4942A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(45, 40, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    // Eyes - white part
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(35, 35, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(55, 35, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils (follow direction based on mood)
    ctx.fillStyle = '#000000';
    if (mood === 'angry') {
      // Angry eyes - narrowed
      ctx.fillRect(32, 34, 8, 6);
      ctx.fillRect(52, 34, 8, 6);
    } else if (mood === 'tired') {
      // Tired eyes - half closed
      ctx.fillRect(31, 38, 10, 4);
      ctx.fillRect(51, 38, 10, 4);
    } else {
      // Happy eyes - normal
      ctx.beginPath();
      ctx.arc(35, 35, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(55, 35, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Eyebrows
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (mood === 'angry') {
      ctx.moveTo(28, 28);
      ctx.lineTo(38, 32);
      ctx.moveTo(62, 28);
      ctx.lineTo(52, 32);
    } else if (mood === 'happy') {
      ctx.moveTo(28, 28);
      ctx.lineTo(38, 26);
      ctx.moveTo(62, 28);
      ctx.lineTo(52, 26);
    } else {
      ctx.moveTo(28, 30);
      ctx.lineTo(38, 30);
      ctx.moveTo(62, 30);
      ctx.lineTo(52, 30);
    }
    ctx.stroke();
    
    // Mouth
    ctx.beginPath();
    if (mood === 'happy') {
      ctx.arc(45, 48, 12, 0.1, Math.PI - 0.1);
      ctx.stroke();
      // Add smile cheeks
      ctx.fillStyle = '#FF9999';
      ctx.beginPath();
      ctx.arc(28, 45, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(62, 45, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (mood === 'angry') {
      ctx.moveTo(35, 52);
      ctx.lineTo(55, 52);
      ctx.stroke();
      // Angry wrinkles
      ctx.beginPath();
      ctx.moveTo(28, 42);
      ctx.lineTo(22, 38);
      ctx.moveTo(62, 42);
      ctx.lineTo(68, 38);
      ctx.stroke();
    } else {
      ctx.moveTo(38, 50);
      ctx.quadraticCurveTo(45, 54, 52, 50);
      ctx.stroke();
    }
    
    // Construction hat
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(30, 10, 30, 12);
    ctx.fillRect(35, 5, 20, 8);
    
    // Hard hat detail
    ctx.fillStyle = '#E65520';
    ctx.fillRect(40, 12, 10, 5);
  };

  // Create dust particles
  const createDust = () => {
    const dustContainer = document.getElementById('dust-container');
    if (!dustContainer) return;
    
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'dust-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.width = `${5 + Math.random() * 10}px`;
      particle.style.height = `${5 + Math.random() * 10}px`;
      particle.style.animationDuration = `${0.5 + Math.random()}s`;
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      dustContainer.appendChild(particle);
      dustRef.current.push(particle);
    }
    
    setTimeout(() => {
      dustRef.current.forEach(p => p.remove());
      dustRef.current = [];
    }, 1000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let currentPos = -250;
    let speed = 4;
    let frameCount = 0;
    let shakeIntensity = 0;
    
    const animate = () => {
      frameCount++;
      
      // Update position
      currentPos += speed;
      setPosition(currentPos);
      
      // Determine phase based on position
      if (currentPos < 150) {
        if (phase !== 'accelerate') setPhase('accelerate');
        speed = 6;
        shakeIntensity = 2;
      } else if (currentPos < 400) {
        if (phase !== 'happy') setPhase('happy');
        speed = 5;
        shakeIntensity = 1;
      } else if (currentPos < 600) {
        if (phase !== 'tired') setPhase('tired');
        speed = 3;
        shakeIntensity = 0.5;
      } else {
        if (phase !== 'exit') setPhase('exit');
        speed = 2;
      }
      
      // Apply screen shake
      if (shakeIntensity > 0) {
        setScreenShake({
          x: (Math.random() - 0.5) * shakeIntensity,
          y: (Math.random() - 0.5) * shakeIntensity
        });
      } else {
        setScreenShake({ x: 0, y: 0 });
      }
      
      // Create dust occasionally
      if (frameCount % 10 === 0 && currentPos > 0 && currentPos < 700) {
        createDust();
      }
      
      // Draw the face based on current phase
      let mood = 'happy';
      if (phase === 'accelerate') mood = 'angry';
      else if (phase === 'tired') mood = 'tired';
      else mood = 'happy';
      
      drawFace(ctx, canvas.width, canvas.height, mood);
      
      // Move the form if ref provided
      const formElement = formRef?.current || document.querySelector('.auth-card');
      if (formElement) {
        formElement.style.transform = `translateX(${currentPos}px)`;
        formElement.style.transition = 'transform 0.02s linear';
        formElement.style.opacity = `${Math.max(0, 1 - currentPos / 800)}`;
      }
      
      // Continue or finish
      if (currentPos < window.innerWidth + 300) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Clean up
        if (formElement) {
          formElement.style.display = 'none';
        }
        setTimeout(() => {
          onComplete?.();
        }, 300);
      }
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [formRef, onComplete, phase]);

  return (
    <>
      <style>{`
        @keyframes dustFloat {
          0% {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateX(-50px) translateY(-30px) scale(0);
            opacity: 0;
          }
        }
        
        .dust-particle {
          position: fixed;
          background: #D2B48C;
          border-radius: 50%;
          pointer-events: none;
          animation: dustFloat 0.8s ease-out forwards;
          z-index: 10001;
        }
        
        #dust-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10000;
          overflow: hidden;
        }
        
        .lorry-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }
        
        .lorry-body {
          position: absolute;
          top: 40%;
          transform: translateY(-50%);
          width: 220px;
          height: 90px;
          transition: left 0.02s linear;
        }
        
        .lorry-cabin {
          position: absolute;
          left: 150px;
          width: 70px;
          height: 90px;
          background: #FF8C42;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 5px 0 #D47A2E;
        }
        
        .lorry-trailer {
          position: absolute;
          left: 20px;
          width: 140px;
          height: 80px;
          background: #FF6B35;
          border-radius: 8px;
          box-shadow: inset 0 -5px 0 #E65520;
        }
        
        .lorry-wheel {
          position: absolute;
          bottom: -15px;
          width: 32px;
          height: 32px;
          background: #333;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        
        .lorry-wheel::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: #666;
          border-radius: 50%;
        }
        
        .lorry-wheel-front {
          left: 160px;
        }
        
        .lorry-wheel-rear {
          left: 35px;
        }
        
        .lorry-exhaust {
          position: absolute;
          left: 20px;
          top: -15px;
          width: 15px;
          height: 25px;
          background: #888;
          border-radius: 5px 5px 0 0;
        }
        
        .lorry-window {
          position: absolute;
          left: 160px;
          top: 15px;
          width: 50px;
          height: 35px;
          background: #87CEEB;
          border-radius: 5px;
        }
        
        .canvas-face {
          position: absolute;
          left: 155px;
          top: 5px;
          width: 60px;
          height: 60px;
        }
        
        canvas {
          width: 100%;
          height: 100%;
        }
      `}</style>
      
      <div id="dust-container"></div>
      
      <div 
        className="lorry-container"
        style={{
          transform: `translate(${screenShake.x}px, ${screenShake.y}px)`,
          transition: 'transform 0.05s linear'
        }}
      >
        <div 
          className="lorry-body"
          style={{ left: `${position}px` }}
        >
          {/* Trailer */}
          <div className="lorry-trailer">
            <div className="lorry-exhaust"></div>
            {/* Exhaust smoke */}
            <div style={{ position: 'absolute', left: 10, top: -20, fontSize: '20px', whiteSpace: 'nowrap' }}>
              💨💨💨
            </div>
          </div>
          
          {/* Cabin */}
          <div className="lorry-cabin">
            <div className="lorry-window"></div>
            <div className="canvas-face">
              <canvas 
                ref={canvasRef} 
                width={60} 
                height={60}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
          
          {/* Wheels */}
          <div className="lorry-wheel lorry-wheel-rear"></div>
          <div className="lorry-wheel lorry-wheel-front"></div>
        </div>
      </div>
    </>
  );
};

export default ConstructionLorry;