chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getHTML') {
    const element = document.getElementById(request.elementId);
    
    if (!element) {
      sendResponse({ error: `Element with ID "${request.elementId}" not found` });
      return;
    }

    sendResponse({ html: element.outerHTML });
  }
});
