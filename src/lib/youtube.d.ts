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
    getPlayerState: () => number;
    unloadModule?: (module: string) => void;
    setOption?: (module: string, option: string, value: unknown) => void;
    destroy: () => void;
  }
}
