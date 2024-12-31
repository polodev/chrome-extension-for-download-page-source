// Toast notification function
function showToast(message, duration = 2000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Load the last used element ID when popup opens
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['lastElementId'], function(result) {
    if (result.lastElementId) {
      document.getElementById('elementId').value = result.lastElementId;
    }
  });
});

// Save element ID whenever it changes
document.getElementById('elementId').addEventListener('input', (e) => {
  chrome.storage.local.set({ lastElementId: e.target.value });
});

document.getElementById('downloadBtn').addEventListener('click', async () => {
  const elementId = document.getElementById('elementId').value;
  
  if (!elementId) {
    showToast('Please enter an element ID');
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'getHTML', elementId }, response => {
    if (response.error) {
      showToast(response.error);
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

// Add clipboard functionality
document.getElementById('copyBtn').addEventListener('click', async () => {
  const elementId = document.getElementById('elementId').value;
  
  if (!elementId) {
    showToast('Please enter an element ID');
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'getHTML', elementId }, async response => {
    if (response.error) {
      showToast(response.error);
      return;
    }

    try {
      await navigator.clipboard.writeText(response.html);
      showToast('Copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy: ' + err.message);
    }
  });
});

// Download full page HTML
document.getElementById('downloadFullBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'getFullHTML' }, response => {
    if (response.error) {
      showToast(response.error);
      return;
    }

    // Create blob and download
    const blob = new Blob([response.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const filename = `${tab.url.split('/').pop() || 'page'}_full.html`;

    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
    
    showToast('Downloading full page...');
  });
});
