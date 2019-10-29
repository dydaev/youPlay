export default {
  useFullScreenMode: async (isActive: boolean) => {
    try {
      if (typeof window.orientation !== 'undefined' && document.fullscreenEnabled) {
        // addEventListener('click', async () => {
        // tslint:disable-next-line:one-variable-per-declaration

        const elem: any = document.documentElement;
        //   rfs = isActive
        //     ? el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
        //     : el.exitFullscreen;
        // const res: Promise<any> = await rfs.call(el);
        if (isActive && !document.fullscreen) {
          elem.requestFullscreen().catch((err: any) => {
            console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
          });
        }

        if (!isActive && document.fullscreen) {
          document.exitFullscreen();
        }
        // console.log(res);
        // });
      }
    } catch (e) {
      console.log('Can not use full screen mode(.');
    }
  },
  usePlaingInTry: (isSavePlaying: any, setPlaying: any) => {
    try {
      window.addEventListener(
        'visibilitychange',
        () => {
          if (isSavePlaying) {
            console.log('playing after lost the focus');
            setPlaying(true);
          } else {
            setPlaying(false);
          }
        },
        false,
      );
    } catch (e) {
      console.log('Can not playing in tray(.', e);
    }
  },
};
