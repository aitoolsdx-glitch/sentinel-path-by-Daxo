document.getElementById('analyze').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, {action: "scan"}, (response) => {
    const status = document.getElementById('status');
    if (response && response.results.length > 0) {
      status.innerHTML = "<strong>Issues found:</strong><br>" + response.results.join('<br>');
      status.className = "critical";
    } else {
      status.innerHTML = "No basic vulnerabilities detected on this layer.";
      status.className = "";
    }
  });
});
