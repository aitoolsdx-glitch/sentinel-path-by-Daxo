// Этот скрипт ищет формы без защиты (например, без HTTPS или с паролями)
function scanForms() {
  const forms = document.querySelectorAll('form');
  let issues = [];
  forms.forEach(f => {
    if (!window.location.protocol.includes('https')) {
      issues.push("Insecure Form Submission (No HTTPS)");
    }
    const passwords = f.querySelectorAll('input[type="password"]');
    if (passwords.length > 0) {
      issues.push("Login Form Detected - Check encryption");
    }
  });
  return issues;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scan") {
    sendResponse({results: scanForms()});
  }
});
