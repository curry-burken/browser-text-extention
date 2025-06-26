chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        const textarea = document.createElement('textarea');
        textarea.value = selectedText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert(`Copied: ${selectedText}`);
      } else {
        alert('Please select some text on the page.');
      }
    }
  });
});
