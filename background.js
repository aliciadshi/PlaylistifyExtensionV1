chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("tab status")
    console.log(changeInfo.status)

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['contentScript.js'],
    })
})