// Reality Frames - Sophisticated animated frame system matching REALITY page aesthetic
// Creates nested squares with glass-like borders and smooth character scrolling

export function renderRealityFrames(container: HTMLElement, year: number) {
  // Character sets for each frame layer
  const sumerian = "𒀀𒀁𒀂𒀃𒀄𒀅𒀆𒀇𒀈𒀉𒀊𒀋𒀌𒀍𒀎𒀏𒀐𒀑𒀒𒀓";
  const numbers = "0123456789ⅫⅩⅨⅧⅦⅥⅤⅣⅢⅡⅠ";
  const nato = "A⚔B⚡C🛡D🚀E⛨F⛯G⛲H⛳I⛴J⛵K⛶L⛷M⛸N⛹O⛺P";
  const egyptian = "𓀀𓁐𓂀𓃒𓄿𓅓𓆑𓇋𓈖𓉔𓊃𓋴𓌳𓍿𓎛";

  // Responsive sizing - Much larger frames
  const isMobile = window.innerWidth <= 768;
  const baseSize = isMobile ? 500 : 700;
  const frameGap = isMobile ? 35 : 50;
  
  // Frame configuration - matching project's sophisticated aesthetic
  const frameOffsets = [0, frameGap, frameGap * 2, frameGap * 3, frameGap * 4];
  const strokeColors = [
    'rgba(251, 191, 36, 0.8)', // Outer - Project amber
    'rgba(148, 163, 184, 0.7)', // Inner 1 - Subtle slate
    'rgba(203, 213, 225, 0.6)', // Inner 2 - Light slate
    'rgba(229, 231, 235, 0.5)', // Inner 3 - Very light
    'rgba(241, 245, 249, 0.4)'  // Inner 4 - Minimal
  ];
  const fillColors = [
    'rgba(30, 41, 59, 0.15)',   // Subtle glass background
    'rgba(30, 41, 59, 0.12)',
    'rgba(30, 41, 59, 0.08)',
    'rgba(30, 41, 59, 0.05)',
    'rgba(30, 41, 59, 0.02)'
  ];
  const charSets = [null, sumerian, numbers, nato, egyptian];

  // Smooth animation based on year
  const time = Date.now() * 0.001; // Current time for smooth animation
  const yearOffset = (year - 1900) * 0.1; // Year influences animation

  // Create responsive SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', `0 0 ${baseSize} ${baseSize}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.style.maxWidth = `${baseSize}px`;
  svg.style.maxHeight = `${baseSize}px`;

  // Create defs for sophisticated filters
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <filter id="subtleGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="softBlur"/>
      <feFlood flood-color="#fbbf24" flood-opacity="0.3"/>
      <feComposite in2="softBlur" operator="in"/>
      <feMerge> 
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/> 
      </feMerge>
    </filter>
    <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/> 
      </feMerge>
    </filter>
  `;
  svg.appendChild(defs);

  // Main group
  const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // Draw nested frames
  for (let i = 0; i < 5; i++) {
    const frameSize = baseSize - (frameOffsets[i] * 2);
    const x = frameOffsets[i];
    const y = frameOffsets[i];
    const cornerRadius = Math.max(8, 20 - i * 2);
    
    // Frame rectangle with sophisticated styling
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x.toString());
    rect.setAttribute('y', y.toString());
    rect.setAttribute('width', frameSize.toString());
    rect.setAttribute('height', frameSize.toString());
    rect.setAttribute('rx', cornerRadius.toString());
    rect.setAttribute('fill', fillColors[i]);
    rect.setAttribute('stroke', strokeColors[i]);
    rect.setAttribute('stroke-width', i === 0 ? '3' : '2');
    rect.setAttribute('filter', 'url(#subtleGlow)');
    
    // Add subtle pulsing animation
    rect.innerHTML = `<animate attributeName="opacity" values="0.8;1;0.8" dur="${3 + i}s" repeatCount="indefinite"/>`;
    
    mainGroup.appendChild(rect);
    
    // Add scrolling character text for inner frames
    if (i > 0 && charSets[i]) {
      const chars = charSets[i] as string;
      const charArray = chars.split('');
      const numChars = Math.floor(frameSize / 20); // Responsive character count
      
      // Create scrolling text paths around the frame
      ['top', 'right', 'bottom', 'left'].forEach((side, sideIndex) => {
        for (let j = 0; j < numChars; j++) {
          const charIndex = Math.floor((time * (10 + i * 2) + yearOffset + j * 2 + sideIndex * 5)) % charArray.length;
          const char = charArray[charIndex];
          
          let charX = 0, charY = 0, rotation = 0;
          const progress = (j / (numChars - 1));
          
          switch (side) {
            case 'top':
              charX = x + 15 + progress * (frameSize - 30);
              charY = y - 8;
              break;
            case 'right':
              charX = x + frameSize + 8;
              charY = y + 15 + progress * (frameSize - 30);
              rotation = 90;
              break;
            case 'bottom':
              charX = x + frameSize - 15 - progress * (frameSize - 30);
              charY = y + frameSize + 18;
              rotation = 180;
              break;
            case 'left':
              charX = x - 8;
              charY = y + frameSize - 15 - progress * (frameSize - 30);
              rotation = 270;
              break;
          }
          
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', charX.toString());
          text.setAttribute('y', charY.toString());
          text.setAttribute('font-family', 'ui-monospace, monospace');
          text.setAttribute('font-size', isMobile ? '10' : '12');
          text.setAttribute('font-weight', '600');
          text.setAttribute('fill', strokeColors[i]);
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('filter', 'url(#textGlow)');
          text.setAttribute('opacity', '0.8');
          
          if (rotation) {
            text.setAttribute('transform', `rotate(${rotation}, ${charX}, ${charY})`);
          }
          
          // Smooth character transition animation
          text.innerHTML = `
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="${2 + i * 0.5}s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" 
              values="0,0;${rotation ? '0,2' : '2,0'};0,0" dur="${1.5 + i * 0.3}s" repeatCount="indefinite"/>
          `;
          text.textContent = char;
          
          mainGroup.appendChild(text);
        }
      });
    }
  }

  svg.appendChild(mainGroup);
  
  // Clear container and add new SVG
  container.innerHTML = '';
  container.appendChild(svg);
}

// Export with legacy name for compatibility
export const renderNeonFrames = renderRealityFrames;
