declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export const loadFacebookSDK = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve();
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1417585822997480',
        cookie: true,
        xfbml: false,
        version: 'v20.0',
      });
      resolve();
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  });
};
