import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import MuxPlayer from '@mux/mux-player-react';

// This entire module (including React and Mux) is imported only after a card click.
export function mountPlayer({ container, project, onReady, onError }) {
  const root = createRoot(container);
  const ref = React.createRef();
  flushSync(() => root.render(
    <MuxPlayer ref={ref} playbackId={project.muxPlaybackId}
      poster={project.poster} videoTitle={project.title}
      streamType="on-demand" autoPlay playsInline preload="auto"
      primaryColor="#eeeae2" secondaryColor="#101a16" accentColor="#c5aa80"
      disableTracking disableCookies onLoadedMetadata={onReady} onCanPlay={onReady} onPlaying={onReady}
      onError={event => onError(ref.current?.error || event.detail)}
      metadata={{ video_id: project.id, video_title: project.title }} />
  ));
  return () => {
    const player = ref.current;
    player?.pause();
    // Removing the source tears down HLS before React disconnects the element.
    if (player) { player.removeAttribute('playback-id'); player.removeAttribute('src'); }
    root.unmount();
  };
}
