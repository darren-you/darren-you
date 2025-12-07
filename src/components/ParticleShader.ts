export const vertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform float uRotationSpeed;
  uniform float uRotationInnerRadius;
  uniform float uRotationOuterRadius;
  
  attribute float scale;
  attribute vec3 color;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying vec3 vPos;
  varying float vRadialDist;
  
  void main() {
    vColor = color;
    vec3 pos = position;
    
    float fadeIn = smoothstep(0.0, 0.5, uTime);
    
    float dist = length(pos.xy);
    float angle = atan(pos.y, pos.x);
    
    float rotationStrength = smoothstep(uRotationInnerRadius, uRotationOuterRadius, dist);
    
    float angleOffset = uTime * uRotationSpeed * rotationStrength * fadeIn;
    
    angle += angleOffset;
    
    pos.x = cos(angle) * dist;
    pos.y = sin(angle) * dist;
    
    float wave1 = sin(pos.y * 0.02 + uTime * 0.5) * 2.0 * fadeIn;
    float wave2 = cos(pos.x * 0.02 + uTime * 0.4) * 2.0 * fadeIn;
    float shimmer = sin(pos.z * 0.1 + uTime * 2.0) * 0.5 * fadeIn;

    pos.x += wave1 + shimmer;
    pos.y += wave2 + shimmer;
    pos.z += sin(dist * 0.05 - uTime) * 4.0 * fadeIn; 

    vPos = pos;
    vRadialDist = dist;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    float pulsate = 1.0 + sin(uTime * 3.0 + scale * 10.0) * 0.3 * fadeIn;
    
    gl_PointSize = uSize * scale * pulsate * (300.0 / -mvPosition.z);
    
    float cameraSoftness = smoothstep(5.0, 50.0, -mvPosition.z);
    vAlpha = cameraSoftness * fadeIn;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying vec3 vPos;
  varying float vRadialDist;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float glow = 1.0 - (dist * 2.0);
    glow = pow(glow, 2.0);
    float center = smoothstep(0.1, 0.0, dist);
    
    float bands = 1.0;
    if (vRadialDist > 120.0) {
        float band1 = sin(vRadialDist * 0.15);
        float band2 = sin(vRadialDist * 0.4 + 2.0);
        bands = 0.5 + 0.5 * (band1 * band2);
    }

    float edgeFade = 1.0 - smoothstep(145.0, 170.0, vRadialDist);

    vec3 finalColor = vColor + vec3(center * 0.1); 
    
    gl_FragColor = vec4(finalColor, glow * vAlpha * bands * edgeFade * 0.75);
  }
`;
