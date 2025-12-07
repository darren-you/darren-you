export const CONFIG = {
  image: {
    targetSize: 300,
    scale: 0.5,
  },

  layout: {
    baseImageSize: 150,
    textHeight: 12,
    socialHeight: 12,
    spacing: 8,
    verticalScaleFactor: 2.4,
    horizontalScaleFactor: 3,
  },

  positions: {
    textY: -95,
    socialY: -110,
  },

  camera: {
    baseDistance: 300,
    fov: 70,
  },

  responsive: {
    desktop: {
      breakpoint: 1200,
      maxScale: 1.1,
    },
    tablet: {
      breakpoint: 768,
      maxScale: 1.4,
    },
    mobile: {
      maxScale: 1.6,
    },
  },

  stars: {
    radius: 300,
    depth: 100,
    count: 5000,
    factor: 6,
    saturation: 0.8,
    speed: 0.2,
    rotationSpeed: 0.0002,
  },

  particles: {
    baseSize: 1.2,
    scatterThreshold: 0.85,
    scatterAmount: 25.0,
    rotationSpeed: 0.3,
    rotationInnerRadius: 70.0,
    rotationOuterRadius: 100.0,
  },

  text: {
    content: 'No one is coming only DarrenYou',
    fontSize: 4,
    speed: 100,
    loop: true,
  },

  social: {
    fontSize: 3,
    spacing: 20,
    links: [
      {
        name: 'GitHub',
        url: 'https://github.com/darren-you',
        icon: '🐙',
      },
      {
        name: '小红书',
        url: 'https://www.xiaohongshu.com/user/profile/5fa7f65f0000000001006a68',
        icon: '📕',
      },
    ],
  },

  bloom: {
    luminanceThreshold: 0.15,
    intensity: 1.8,
    radius: 0.5,
  },

  controls: {
    enablePan: true,
    enableZoom: true,
    enableRotate: true,
    autoRotateSpeed: 0.5,
  },
};
