export {};

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }

  interface YTPlayer {
    mute: () => void;
    unMute: () => void;
    playVideo: () => void;
    pauseVideo: () => void;
    setVolume: (volume: number) => void;
    destroy: () => void;
  }
}
