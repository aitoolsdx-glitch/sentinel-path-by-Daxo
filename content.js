function analyzePage() {
    let issues = [];

    // 1. Проверка протокола
    if (window.location.protocol !== 'https:') {
        issues.push("CRITICAL: Site is using insecure HTTP protocol.");
    }

    // 2. Поиск смешанного контента (Mixed Content)
    const insecureResources = Array.from(document.querySelectorAll('img, script, link'))
        .filter(el => (el.src || el.href || "").startsWith('http://'));
    if (insecureResources.length > 0) {
        issues.push(`WARNING: Found ${insecureResources.length} insecure (HTTP) resources on this HTTPS page.`);
    }

    // 3. Проверка форм
    const passwordFields = document.querySelectorAll('input[type="password"]');
    if (passwordFields.length > 0 && window.location.protocol !== 'https:') {
        issues.push("DANGER: Password fields found on unencrypted page!");
    }

    // 4. Поиск чувствительных комментариев
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT, null, false);
    let node;
    while(node = walker.nextNode()) {
        if (node.nodeValue.toLowerCase().includes('password') || node.nodeValue.toLowerCase().includes('api')) {
            issues.push("INFO: Potential sensitive information in HTML comments.");
        }
    }

    return issues.length > 0 ? issues : ["No basic vulnerabilities detected."];
}

// Слушатель для связи с popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scan") {
        sendResponse({results: analyzePage()});
    }
});
