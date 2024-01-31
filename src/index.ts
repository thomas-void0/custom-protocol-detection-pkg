import type { FailCb, SuccessCb, UnsupportedCb } from "./typings/type";
import { checkBrowser, createHiddenIframe, getInternetExplorerVersion, registerEvent } from "./utils";

function openUriWithHiddenFrame(uri: string, failCb: FailCb, successCb: SuccessCb) {

  let handler: ReturnType<typeof registerEvent> | null = null
  const timeout = setTimeout(function () {
    failCb();
    handler?.remove();
  }, 1000);

  const iframe: HTMLIFrameElement = document.querySelector("#hiddenIframe") || createHiddenIframe(document.body, "about:blank")

  handler = registerEvent(window, "blur", onBlur);

  function onBlur() {
    clearTimeout(timeout);
    handler?.remove();
    successCb();
  }

  iframe.contentWindow && (iframe.contentWindow.location.href = uri);
}

function openUriWithTimeoutHack(uri: string, failCb: FailCb, successCb: SuccessCb) {

  let handler: any = null;

  const timeout = setTimeout(function () {
    failCb();
    handler?.remove();
  }, 1000);

  //handle page running in an iframe (blur must be registered with top level window)
  let target = window;
  while (target != target.parent) {
    // @ts-expect-error
    target = target.parent;
  }

  handler = registerEvent(target, "blur", onBlur);

  // when an element lost focus. 
  function onBlur() {
    clearTimeout(timeout);
    handler.remove();
    successCb();
  }

  // @ts-expect-error
  window.location = uri;
}

function openUriUsingFirefox(uri: string, failCb: FailCb, successCb: SuccessCb) {
  const iframe: HTMLIFrameElement = document.querySelector("#hiddenIframe") || createHiddenIframe(document.body, "about:blank");
  try {
    iframe.contentWindow && (iframe.contentWindow.location.href = uri);
    successCb();
  } catch (e: any) {
    if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
      failCb();
    }
  }
}

function openUriUsingIEInOlderWindows(uri: string, failCb: FailCb, successCb: SuccessCb) {
  if (getInternetExplorerVersion() === 10) {
    openUriUsingIE10InWindows7(uri, failCb, successCb);
  } else if (getInternetExplorerVersion() === 9 || getInternetExplorerVersion() === 11) {
    openUriWithHiddenFrame(uri, failCb, successCb);
  } else {
    openUriInNewWindowHack(uri, failCb, successCb);
  }
}

function openUriUsingIE10InWindows7(uri: string, failCb: FailCb, successCb: SuccessCb) {
  const timeout = setTimeout(failCb, 1000);
  window.addEventListener("blur", function () {
    clearTimeout(timeout);
    successCb();
  });

  const iframe: HTMLIFrameElement = document.querySelector("#hiddenIframe") || createHiddenIframe(document.body, "about:blank")

  try {
    iframe.contentWindow && (iframe.contentWindow.location.href = uri);
  } catch (e) {
    failCb();
    clearTimeout(timeout);
  }
}

function openUriInNewWindowHack(uri: string, failCb: FailCb, successCb: SuccessCb) {
  const myWindow = window.open('', '', 'width=0,height=0');

  myWindow?.document.write("<iframe src='" + uri + "'></iframe>");

  setTimeout(function () {
    try {
      myWindow?.location.href;
      myWindow?.setTimeout("window.close()", 1000);
      successCb();
    } catch (e) {
      myWindow?.close();
      failCb();
    }
  }, 1000);
}

function openUriWithMsLaunchUri(uri: string, failCb: FailCb, successCb: SuccessCb) {
  navigator.msLaunchUri(uri,
    successCb,
    failCb
  );
}


export default function (uri: string, failCb: FailCb, successCb: SuccessCb, unsupportedCb: UnsupportedCb) {
  function failCallback() {
    failCb && failCb();
  }

  function successCallback() {
    successCb && successCb();
  }

  if (navigator.msLaunchUri) { //for IE and Edge in Win 8 and Win 10
    openUriWithMsLaunchUri(uri, failCb, successCb);
  } else {
    const browser = checkBrowser();

    if (browser.isFirefox) {
      openUriUsingFirefox(uri, failCallback, successCallback);
    } else if (browser.isChrome || browser.isIOS) {
      openUriWithTimeoutHack(uri, failCallback, successCallback);
    } else if (browser.isIE) {
      openUriUsingIEInOlderWindows(uri, failCallback, successCallback);
    } else if (browser.isSafari) {
      openUriWithHiddenFrame(uri, failCallback, successCallback);
    } else {
      unsupportedCb();
      //not supported, implement please
    }
  }
}
