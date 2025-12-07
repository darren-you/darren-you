import { useState, useEffect } from 'react';
import Scene from './components/Scene';
import { processImage } from './utils/imageProcessor';
import type { ParticleData } from './types';

function App() {
  const [particleData, setParticleData] = useState<ParticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const data = processImage(img);
        setParticleData(data);
      } catch (error) {
        console.error('Error processing image:', error);
      } finally {
        setLoading(false);
      }
    };
    img.onerror = () => {
      console.error('Error loading image');
      setLoading(false);
    };
    img.src = 'https://xdarren.com/res/files/pics/test_61.jpeg';
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '20px',
          zIndex: 10
        }}>
          Loading...
        </div>
      )}
      <Scene particleData={particleData} />
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '10px',
        lineHeight: '1.4',
        color: '#EDEDED',
        opacity: 0.4,
        pointerEvents: 'auto',
        zIndex: 10,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        paddingBottom: '16px'
      }}>
        <p style={{ margin: '4px 0' }}>Copyright © 2025 青白江游同学网络工作室. All rights reserved.</p>
        <p style={{ margin: '4px 0' }}>
          <a 
            href="https://beian.miit.gov.cn" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#EDEDED', textDecoration: 'none' }}
          >
            蜀ICP备2025151840号-2
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
