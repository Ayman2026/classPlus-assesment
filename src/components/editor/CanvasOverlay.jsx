/**
 * CardEditor — the HTML5 Canvas preview component.
 * Renders the greeting card with user's photo and name overlaid.
 */
import { useRef, useEffect } from 'react';
import useCanvas from '../../hooks/useCanvas';

export default function CanvasOverlay({ template, userProfile, canvasRef: externalRef }) {
  const internalRef = useRef(null);
  const canvasRef = externalRef || internalRef;
  const { render } = useCanvas();

  useEffect(() => {
    if (canvasRef.current && template) {
      render(canvasRef.current, template, userProfile);
    }
  }, [template, userProfile, render, canvasRef]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 400,
        aspectRatio: '4/5',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        background: '#f0f0f0',
        margin: '0 auto',
      }}
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
