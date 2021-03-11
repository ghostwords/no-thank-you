function injectScript(text) {
  var parent = document.documentElement,
    script = document.createElement('script');

  script.text = text;
  script.async = false;

  parent.insertBefore(script, parent.firstChild);
  parent.removeChild(script);
}

function getPageScript() {

  // code below is not a content script: no chrome.* APIs /////////////////////

  // return a string
  return "(" + function () {

    let meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "Content-Security-Policy");
    meta.setAttribute("content", "worker-src 'none'");

    let obs = new MutationObserver(function (mutations) {
      for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
          let node_name = node.nodeName.toLowerCase();
          if (node_name == "video") {
            console.log("Removing autoplay and preload from", node.outerHTML);
            node.setAttribute('autoplay', "false");
            node.removeAttribute('preload');

            // TODO
            //Object.defineProperty(node, "play", {
            //  configurable: true,
            //  writable: false,
            //  enumerable: true,
            //  value: function () {
            //    console.log("HERE!!!!");
            //    return node.play();
            //  }
            //});

          } else if (node_name == "iframe") {
            if (node.getAttribute('allow') == "autoplay") {
              console.log("Removing allow=autoplay from", node.outerHTML);
              node.removeAttribute('allow');
            }
          }
        }
      }
    });

    window.addEventListener('DOMContentLoaded', function () {
      // disable Service Workers
      document.getElementsByTagName('head')[0].appendChild(meta);

      // stop video autoplay
      obs.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false,
        attributes: false,
      });
    });

  } + "());";

  // code above is not a content script: no chrome.* APIs /////////////////////

}

// END FUNCTION DEFINITIONS ///////////////////////////////////////////////////

(function () {

  // don't inject into non-HTML documents (such as XML documents)
  // but do inject into XHTML documents
  if (document instanceof HTMLDocument === false && (
    document instanceof XMLDocument === false ||
    document.createElement('div') instanceof HTMLDivElement === false
  )) {
    return;
  }

  injectScript(getPageScript());

}());
