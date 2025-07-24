export {};

declare global {
  interface Window {
    FB: {
      login: (
        callback: (response: {
          authResponse: {
            accessToken: string;
            userID: string;
          };
        }) => void,
        options: { scope: string },
      ) => void;
      init: (options: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version?: string;
        [key: string]: string | boolean | undefined;
      }) => void;
    };
    fbAsyncInit: () => void;
    webkitSpeechRecognition: {
      prototype: WebkitSpeechRecognition;
      new (): WebkitSpeechRecognition;
    };
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (
            callback?: (notification: {
              isDisplayed: () => boolean;
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
              isDismissedMoment: () => boolean;
              getNotDisplayedReason: () => string;
              getSkippedReason: () => string;
              getDismissedReason: () => string;
            }) => void,
          ) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: string | number;
              locale?: string;
              [key: string]: string | number | boolean | undefined;
            },
          ) => void;
        };
      };
    };
  }
}

// SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key2: number]: {
        transcript: string;
      };
    };
  };
  resultIndex: number;
}

interface WebkitSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
}
