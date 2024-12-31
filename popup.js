document.getElementById('downloadBtn').addEventListener('click', async () => {
  const elementId = document.getElementById('elementId').value;
  
  if (!elementId) {
    alert('Please enter an element ID');
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'getHTML', elementId }, response => {
    if (response.error) {
      alert(response.error);
      return;
    }

    // Create blob and download
    const blob = new Blob([response.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const filename = `${tab.url.split('/').pop() || 'page'}_${elementId}.html`;

    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
  });
});
