export function checkBrowser() {
  const isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  const ua = navigator.userAgent.toLowerCase();
  return {
    isOpera: isOpera,
    isFirefox: typeof window.InstallTrigger !== 'undefined',
    isSafari: (~ua.indexOf('safari') && !~ua.indexOf('chrome')) || Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    isChrome: !!window.chrome && !isOpera,
    isIE: /*@cc_on!@*/false || !!document.documentMode // At least IE6
  }
}

type AddEventListenerArg = Parameters<HTMLElement["addEventListener"]>
export function registerEvent(target: any, eventType: AddEventListenerArg[0], cb: AddEventListenerArg[1]) {
  if (target.addEventListener) {
    target.addEventListener(eventType, cb);
    return {
      remove: function () {
        target.removeEventListener(eventType, cb);
      }
    };
  } else {
    // < IE9
    target.attachEvent(eventType, cb);
    return {
      remove: function () {
        target.detachEvent(eventType, cb);
      }
    };
  }
}

export function createHiddenIframe(target: HTMLElement, uri: string) {
  const iframe = document.createElement("iframe");
  iframe.src = uri;
  iframe.id = "hiddenIframe";
  iframe.style.display = "none";
  target.appendChild(iframe);

  return iframe;
}

export function getInternetExplorerVersion() {
  let rv = -1;
  const ua = navigator.userAgent;
  if (navigator.appName === "Microsoft Internet Explorer") {
    const re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    re.exec(ua) != null && (rv = parseFloat(RegExp.$1));
  } else if (navigator.appName === "Netscape") {
    const re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    re.exec(ua) != null && (rv = parseFloat(RegExp.$1));
  }
  return rv;
}
