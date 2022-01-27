let compelete = document.getElementById("compelete");
let autofill = document.getElementById("autofill");

compelete.addEventListener("click", async () => {
    fetch('http://127.0.0.1:5000/compelete_sheet').then(resp => {
        console.log(resp);
    }).then(() => {
        chrome.notifications.create(
            "FCM noti",
            {
                iconUrl: "icon.png",
                type: "basic",
                title: "啵啵提醒你",
                message: "shit 翻译完成",
            },
        );
    })
});

autofill.addEventListener("click", async () => {
    fetch('http://127.0.0.1:5000/reading_sheet').then(resp => {
        let resp_json = resp.json()
        chrome.storage.sync.set({'fuck_fcm_resp': resp_json})
        console.log(resp_json)
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            let tabId = tabs[0].id;
            console.log(chrome.scripting)
            chrome.scripting.executeScript(
                {

                    "files": ["inject.js"],
                    "target": {
                        "tabId": tabId
                    },
                    "world": "MAIN",
                },
                (result => {
                    console.log(result)
                })
            )
        });
    })
})