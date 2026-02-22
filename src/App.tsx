import React, { useState, useEffect } from 'react';

// Wake Up Screen Component
function WakeUpScreen({ onWake }: { onWake: () => void }): React.ReactElement {
  const [tapCount, setTapCount] = useState(0);
  const [isWaking, setIsWaking] = useState(false);

  const playBootSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Sci-fi power up sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (tapCount === 1) {
      timer = setTimeout(() => setTapCount(0), 500);
    } else if (tapCount >= 2 && !isWaking) {
      setIsWaking(true);
      playBootSound();
      setTimeout(() => {
        onWake();
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [tapCount, isWaking, onWake]);

  const handleTap = () => {
    if (!isWaking) {
      setTapCount(prev => prev + 1);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center cursor-pointer"
      style={{backgroundColor: '#000000'}}
      onDoubleClick={handleTap}
      onClick={handleTap}
    >
      {/* Eyelid animation */}
      <div 
        className={`absolute top-0 left-0 w-full bg-black transition-all duration-[1500ms] ease-in-out ${
          isWaking ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{height: '50%'}}
      ></div>
      <div 
        className={`absolute bottom-0 left-0 w-full bg-black transition-all duration-[1500ms] ease-in-out ${
          isWaking ? 'translate-y-full' : 'translate-y-0'
        }`}
        style={{height: '50%'}}
      ></div>
      
      {/* Content */}
      <div className={`relative z-10 text-center transition-opacity duration-500 ${isWaking ? 'opacity-0' : 'opacity-100'}`}>
        <div className="mb-8">
          <svg viewBox="0 0 64 64" className="w-24 h-24 mx-auto" style={{filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.6))'}}>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.3"/>
            <text x="32" y="46" textAnchor="middle" fill="#00f0ff" fontSize="40" fontFamily="Arial, sans-serif" fontWeight="bold">
              λ
            </text>
          </svg>
        </div>
        
        <h1 
          className="text-2xl md:text-3xl font-bold tracking-widest mb-4 animate-pulse"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            color: '#00f0ff',
            textShadow: '0 0 20px #00f0ff, 0 0 40px #00f0ff'
          }}
        >
          TAP TWICE TO WAKE UP
        </h1>
        
        <div className="flex items-center justify-center gap-4 text-xs text-cyan-400/60">
          <span>{'<'}</span>
          <span className="tracking-widest">SYSTEM SLEEPING</span>
          <span>{'>'}</span>
        </div>
        
        <div className="mt-8 text-xs text-gray-600">
          {isWaking ? 'INITIALIZING...' : `TAP COUNT: ${tapCount}`}
        </div>
      </div>
      
      {/* Decorative binary code */}
      <div className="absolute top-10 left-10 text-xs text-cyan-400/10">
        01001000 01000101 01001100<br/>
        01001100 01001111 00100001
      </div>
      <div className="absolute bottom-10 right-10 text-xs text-cyan-400/10">
        01010111 01000001 01001011<br/>
        01000101 00100000 01010101
      </div>
    </div>
  );
}

// Matrix Rain Background
function MatrixRain(): React.ReactElement {
  const [columns, setColumns] = useState<Array<{chars: string[], delay: number, speed: number}>>([]);
  
  useEffect(() => {
    const chars = '01アイウエオカキクケコ';
    const numColumns = 50;
    const newColumns = [];
    
    for (let i = 0; i < numColumns; i++) {
      const columnChars = [];
      const length = Math.floor(Math.random() * 15) + 5;
      for (let j = 0; j < length; j++) {
        columnChars.push(chars[Math.floor(Math.random() * chars.length)]);
      }
      newColumns.push({
        chars: columnChars,
        delay: Math.random() * 10,
        speed: Math.random() * 10 + 5
      });
    }
    setColumns(newColumns);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      <div className="flex h-full">
        {columns.map((col, i) => (
          <div
            key={i}
            className="matrix-char flex flex-col text-xs text-cyan-400 w-5"
            style={{
              animationDuration: col.speed + 's',
              animationDelay: col.delay + 's'
            }}
          >
            {col.chars.map((char, j) => (
              <span key={j} style={{ opacity: 1 - (j / col.chars.length) * 0.7 }}>
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Lambda Logo (Half-Life)
function CyberpunkAvatar(): React.ReactElement {
  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 opacity-50 blur-md animate-pulse"></div>
      <div className="relative w-full h-full rounded-full border-2 border-cyan-400 overflow-hidden flex items-center justify-center bg-gray-900" style={{boxShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff'}}>
        <svg viewBox="0 0 64 64" className="w-20 h-20 md:w-24 md:h-24" style={{filter: 'drop-shadow(0 0 15px rgba(0,240,255,0.9))'}}>
          {/* Outer ring */}
          <circle cx="32" cy="32" r="28" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.3"/>
          <circle cx="32" cy="32" r="24" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.5"/>
          
          {/* Lambda symbol */}
          <text x="32" y="46" textAnchor="middle" fill="#00f0ff" fontSize="40" fontFamily="Arial, sans-serif" fontWeight="bold">
            λ
          </text>
          
          {/* Decorative elements */}
          <circle cx="50" cy="14" r="4" fill="#ff00ff" opacity="0.8"/>
          
          {/* Circuit lines */}
          <line x1="8" y1="32" x2="4" y2="32" stroke="#00f0ff" strokeWidth="1" opacity="0.4"/>
          <line x1="56" y1="32" x2="60" y2="32" stroke="#00f0ff" strokeWidth="1" opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// Project Card
function ProjectCard(props: {title: string, description: string, imageContent: React.ReactNode, borderColor: string, listItems?: string[]}): React.ReactElement {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const borderStyle = props.borderColor === 'pink' 
    ? {boxShadow: '0 0 10px #ff2a6d', borderColor: '#ff2a6d'} 
    : {boxShadow: '0 0 10px #00f0ff', borderColor: '#00f0ff'};

  const handleFlip = () => {
    if (props.listItems) {
      setIsFlipped(!isFlipped);
    }
  };
  
  return (
    <div 
      className={`relative perspective-1000 h-[350px] ${props.listItems ? 'cursor-pointer' : ''}`}
      onClick={handleFlip}
    >
      <div 
        className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 backface-hidden bg-gray-900 border-2 rounded-lg overflow-hidden flex flex-col group hover:scale-[1.02] transition-transform duration-300"
          style={borderStyle}
        >
          <div className="relative h-48 overflow-hidden bg-gray-950 shrink-0">
            {props.imageContent}
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white tracking-wider mb-2" style={{fontFamily: 'Orbitron, sans-serif'}}>
              {props.title}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              {props.description}
            </p>
            {props.listItems && (
              <div className="mt-auto text-xs text-cyan-400 animate-pulse flex items-center gap-2">
                <span>[CLICK TO ACCESS DATA]</span>
                <span className="text-[10px]">▶</span>
              </div>
            )}
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-900 border-2 rounded-lg overflow-hidden p-5 flex flex-col"
          style={borderStyle}
        >
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
            <h3 className="text-lg font-bold text-white tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
              TOP 10 LIST
            </h3>
            <span className="text-xs text-cyan-400 font-mono">10/10</span>
          </div>
          
          <ol className="text-xs text-gray-300 space-y-2 overflow-y-auto flex-1 list-decimal pl-5 font-mono custom-scrollbar">
            {props.listItems?.map((item, idx) => (
              <li key={idx} className="hover:text-cyan-400 transition-colors pl-1">
                <span className="text-fuchsia-500 opacity-70 mr-1">::</span> {item}
              </li>
            ))}
          </ol>
          
          <div className="mt-3 text-[10px] text-center text-gray-500 font-mono">
             -- END OF RECORD --
          </div>
        </div>
      </div>
    </div>
  );
}

// Hunter x Hunter Logo SVG
function HxHLogo(): React.ReactElement {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      <rect width="200" height="150" fill="#0a0a15"/>
      {/* Background X shape */}
      <path d="M40 20 L160 130" stroke="#ff2a6d" strokeWidth="5" opacity="0.5"/>
      <path d="M160 20 L40 130" stroke="#ff2a6d" strokeWidth="5" opacity="0.5"/>
      
      {/* H Left */}
      <path d="M40 40 L40 110" stroke="#00f0ff" strokeWidth="8" strokeLinecap="round"/>
      <path d="M70 40 L70 110" stroke="#00f0ff" strokeWidth="8" strokeLinecap="round"/>
      <path d="M40 75 L70 75" stroke="#00f0ff" strokeWidth="8"/>
      
      {/* x Middle */}
      <path d="M90 65 L110 85" stroke="#ff00ff" strokeWidth="4" strokeLinecap="round"/>
      <path d="M110 65 L90 85" stroke="#ff00ff" strokeWidth="4" strokeLinecap="round"/>
      
      {/* H Right */}
      <path d="M130 40 L130 110" stroke="#00f0ff" strokeWidth="8" strokeLinecap="round"/>
      <path d="M160 40 L160 110" stroke="#00f0ff" strokeWidth="8" strokeLinecap="round"/>
      <path d="M130 75 L160 75" stroke="#00f0ff" strokeWidth="8"/>
      
      {/* Japanese Text (Hunter) simplified representation */}
      <text x="100" y="135" textAnchor="middle" fill="#ff2a6d" fontSize="16" fontFamily="Arial" fontWeight="bold">HUNTER X HUNTER</text>
    </svg>
  );
}

// Kanye Bear Logo SVG
function KanyeBearLogo(): React.ReactElement {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      <defs>
        <filter id="bearGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="200" height="150" fill="#0a0a15"/>
      
      {/* Bear Head Base */}
      <path d="M60 50 Q100 30 140 50 Q150 80 140 100 Q100 120 60 100 Q50 80 60 50" fill="#8B4513" stroke="#FFD700" strokeWidth="2"/>
      
      {/* Ears */}
      <circle cx="55" cy="45" r="15" fill="#8B4513" stroke="#FFD700" strokeWidth="2"/>
      <circle cx="55" cy="45" r="8" fill="#CD853F"/>
      <circle cx="145" cy="45" r="15" fill="#8B4513" stroke="#FFD700" strokeWidth="2"/>
      <circle cx="145" cy="45" r="8" fill="#CD853F"/>
      
      {/* Face Lighter Area */}
      <path d="M70 60 Q100 50 130 60 Q135 80 130 95 Q100 105 70 95 Q65 80 70 60" fill="#CD853F"/>
      
      {/* Eyes - Classic Dropout Bear */}
      <g>
        <circle cx="85" cy="70" r="10" fill="white" stroke="black" strokeWidth="1"/>
        <circle cx="85" cy="70" r="3" fill="black"/>
        <circle cx="115" cy="70" r="10" fill="white" stroke="black" strokeWidth="1"/>
        <circle cx="115" cy="70" r="3" fill="black"/>
      </g>
      
      {/* Snout */}
      <ellipse cx="100" cy="85" rx="15" ry="10" fill="#DEB887" stroke="black" strokeWidth="0.5"/>
      <ellipse cx="100" cy="82" rx="6" ry="4" fill="black"/>
      
      {/* Mouth - Smile */}
      <path d="M90 95 Q100 105 110 95" stroke="black" strokeWidth="2" fill="none"/>
      
      {/* Cyberpunk Elements */}
      <rect x="75" y="65" width="50" height="15" rx="2" fill="#ff00ff" opacity="0.3" stroke="#ff00ff" strokeWidth="1"/>
      <line x1="40" y1="72" x2="160" y2="72" stroke="#ff00ff" strokeWidth="1" opacity="0.5" strokeDasharray="4 4"/>
      
      <text x="100" y="135" textAnchor="middle" fill="#00f0ff" fontSize="16" fontFamily="Arial" fontWeight="bold" filter="url(#bearGlow)">DROPOUT</text>
    </svg>
  );
}

// Fsociety Mask Logo SVG
function FsocietyLogo(): React.ReactElement {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      <defs>
        <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff4d4d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="150" fill="#0a0a15"/>
      
      {/* Face Shape */}
      <path d="M60 40 Q100 30 140 40 Q155 80 140 115 Q100 135 60 115 Q45 80 60 40" fill="#fdfdfd" stroke="#333" strokeWidth="1"/>
      
      {/* Hat */}
      <path d="M65 35 L135 35 L125 10 L75 10 Z" fill="#000" stroke="#fff" strokeWidth="1"/>
      <path d="M55 35 L145 35 L145 42 L55 42 Z" fill="#000" stroke="#fff" strokeWidth="1"/>
      
      {/* Rosy Cheeks */}
      <circle cx="75" cy="95" r="12" fill="url(#cheekGlow)" />
      <circle cx="125" cy="95" r="12" fill="url(#cheekGlow)" />
      
      {/* Eyes */}
      <g transform="translate(70, 60)">
        <path d="M0 5 Q15 -5 30 5 Q15 15 0 5" fill="#fff" stroke="#000" strokeWidth="1"/>
        <circle cx="15" cy="5" r="3" fill="#000"/>
      </g>
      <g transform="translate(100, 60)">
        <path d="M0 5 Q15 -5 30 5 Q15 15 0 5" fill="#fff" stroke="#000" strokeWidth="1"/>
        <circle cx="15" cy="5" r="3" fill="#000"/>
      </g>
      
      {/* Eyebrows */}
      <path d="M72 58 Q85 52 98 58" stroke="#000" strokeWidth="2" fill="none"/>
      <path d="M102 58 Q115 52 128 58" stroke="#000" strokeWidth="2" fill="none"/>
      
      {/* Mustache */}
      <path d="M75 100 Q100 85 125 100 Q145 95 150 110 Q125 105 100 100 Q75 105 50 110 Q55 95 75 100" fill="#000"/>
      
      {/* Mouth/Smile */}
      <path d="M85 115 Q100 125 115 115" stroke="#000" strokeWidth="1.5" fill="none"/>
      
      {/* Glitch Overlay */}
      <rect x="50" y="70" width="100" height="1" fill="#00f0ff" opacity="0.3"/>
      <rect x="50" y="100" width="100" height="1" fill="#ff00ff" opacity="0.2"/>
      
      <text x="100" y="145" textAnchor="middle" fill="#00f0ff" fontSize="12" fontFamily="monospace" fontWeight="bold">F.SOCIETY</text>
    </svg>
  );
}

// HUD Elements
function HUDElements(): React.ReactElement {
  return (
    <React.Fragment>
      <div className="fixed bottom-6 left-6 z-50 text-cyan-400/40">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="30" cy="30" r="10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
          <line x1="30" y1="5" x2="30" y2="15" stroke="currentColor" strokeWidth="1" />
          <line x1="30" y1="45" x2="30" y2="55" stroke="currentColor" strokeWidth="1" />
          <line x1="5" y1="30" x2="15" y2="30" stroke="currentColor" strokeWidth="1" />
          <line x1="45" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="1" />
        </svg>
        <div className="text-xs mt-1">X: 0042 Y: 0087</div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 text-fuchsia-500/40 text-xs text-right" style={{fontFamily: 'Share Tech Mono, monospace'}}>
        <div>PWR: ████████░░ 82%</div>
        <div>NET: ██████████ 100%</div>
      </div>
    </React.Fragment>
  );
}

// Main App Component
export function App(): React.ReactElement {
  const [activeSection, setActiveSection] = useState('HOME');
  const [showWakeUp, setShowWakeUp] = useState(true);

  const projects = [
    {
      title: 'ANIME',
      description: 'My absolute favorite anime series list.',
      image: React.createElement(HxHLogo),
      borderColor: 'pink',
      listItems: [
        "Hunter x Hunter",
        "JoJo's Bizarre Adventure",
        "Gintama",
        "Monogatari Series",
        "Grand Blue",
        "Code Geass",
        "Samurai Champloo",
        "Beck: Mongolian Chop Squad",
        "FLCL",
        "Bakuman"
      ]
    },
    {
      title: 'FAV KANYE ALBUM',
      description: 'My favorite Kanye West albums.',
      image: React.createElement(KanyeBearLogo),
      borderColor: 'cyan',
      listItems: [
        "Ye",
        "The Life of Pablo",
        "Yeezus",
        "My Beautiful Dark Twisted Fantasy",
        "Graduation",
        "The College Dropout",
        "Late Registration",
        "808s & Heartbreak",
        "Donda",
        "Watch the Throne"
      ]
    },
    {
      title: 'FAV TV SERIES',
      description: 'The shows that rewired my brain.',
      image: React.createElement(FsocietyLogo),
      borderColor: 'pink',
      listItems: [
        "Mr. Robot",
        "The Sopranos",
        "The Walking Dead",
        "Avatar: The Last Airbender",
        "Invincible",
        "Chernobyl",
        "BEEF",
        "Brooklyn Nine-Nine",
        "The Big Bang Theory",
        "Modern Family"
      ]
    }
  ];

  return (
    <React.Fragment>
      {showWakeUp && (
        <WakeUpScreen onWake={() => setShowWakeUp(false)} />
      )}
      
      <div className="min-h-screen text-white relative overflow-hidden" style={{backgroundColor: '#0a0a12'}}>
        <MatrixRain />
      <div className="crt-overlay"></div>
      <HUDElements />
      
      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div 
          className="max-w-7xl mx-auto min-h-[calc(100vh-4rem)] border-2 border-cyan-400/30 rounded-3xl overflow-hidden"
          style={{
            boxShadow: '0 0 20px rgba(0,240,255,0.3), 0 0 40px rgba(0,240,255,0.2), inset 0 0 20px rgba(0,240,255,0.05)',
            backgroundColor: 'rgba(10,10,18,0.8)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            
            {/* Top Navigation Bar */}
            <nav className="border-b border-cyan-400/20 bg-gray-900/50">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-6">
                  {['HOME', 'FAVOURITES'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveSection(item)}
                      className={
                        activeSection === item 
                          ? "px-4 py-2 text-sm tracking-widest text-cyan-400 border-b-2 border-cyan-400 hover-glitch"
                          : "px-4 py-2 text-sm tracking-widest text-gray-400 border-b-2 border-transparent hover:text-cyan-400 hover:border-cyan-400/50 hover-glitch"
                      }
                      style={{textShadow: activeSection === item ? '0 0 10px #00f0ff' : 'none'}}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-fuchsia-500 animate-pulse"></div>
                  <span className="text-xs tracking-widest text-fuchsia-500">SYSTEM v2.087</span>
                </div>
              </div>
            </nav>
            
            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-auto">
              <section>
                {activeSection === 'HOME' && (
                  <React.Fragment>
                    <header className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12 gap-6">
                      <div className="flex-1">
                        <div className="text-xs text-cyan-400/60 mb-2 tracking-widest">
                          {'>'} WELCOME_TO //
                        </div>
                        <h1 
  className="glitch-text text-xl md:text-3xl font-bold tracking-wider text-white"
  data-text="SRIJITH'S POPCULTURE PORTFOLIO"
  style={{fontFamily: 'Orbitron, sans-serif'}}
>
  SRIJITH'S POPCULTURE PORTFOLIO
</h1>
                        <p className="mt-4 text-gray-400 text-sm max-w-md">
                          Hey fellow gooners, this site shows my interests and obsessions so feel free to check it out! :P
                        </p>
                      </div>
                      <CyberpunkAvatar />
                    </header>
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-lg">
                        Welcome to the main hub. Navigate to different sections using the menu above.
                      </p>
                    </div>
                  </React.Fragment>
                )}

                {activeSection === 'FAVOURITES' && (
                  <React.Fragment>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px flex-1 bg-gradient-to-r from-fuchsia-500/50 to-transparent"></div>
                      <h2 
                        className="text-xl md:text-2xl font-bold tracking-widest text-white"
                        style={{fontFamily: 'Orbitron, sans-serif'}}
                      >
                        MY TOP TEN
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-l from-cyan-400/50 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project, index) => (
                        <ProjectCard
                          key={index}
                          title={project.title}
                          description={project.description}
                          imageContent={project.image}
                          borderColor={project.borderColor}
                          listItems={project.listItems}
                        />
                      ))}
                    </div>
                  </React.Fragment>
                )}

              </section>
              
              <footer className="mt-16 pt-8 border-t border-cyan-400/10">
                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-400/40">{'<>'}</span>
                    <span>CRAFTED WITH NEURAL PRECISION</span>
                    <span className="text-fuchsia-500/40">{'</>'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-glow"></span>
                    <span>ALL SYSTEMS NOMINAL</span>
                  </div>
                </div>
              </footer>
            </main>
          </div>
        </div>
      </div>
      
      {/* Corner Decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-50">
        <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400/20">
          <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="fixed top-0 right-0 w-32 h-32 pointer-events-none z-50">
        <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400/20">
          <path d="M100 0 L70 0 L70 5 L95 5 L95 30 L100 30 Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="fixed bottom-0 left-0 w-32 h-32 pointer-events-none z-50">
        <svg viewBox="0 0 100 100" className="w-full h-full text-fuchsia-500/20">
          <path d="M0 100 L30 100 L30 95 L5 95 L5 70 L0 70 Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="fixed bottom-0 right-0 w-32 h-32 pointer-events-none z-50">
        <svg viewBox="0 0 100 100" className="w-full h-full text-fuchsia-500/20">
          <path d="M100 100 L70 100 L70 95 L95 95 L95 70 L100 70 Z" fill="currentColor"/>
        </svg>
      </div>
    </div>
    </React.Fragment>
  );
}

export default App;
