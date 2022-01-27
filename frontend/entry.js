let compeleteBtn = document.getElementById("compelete");
let autofillBtn = document.getElementById("autofill");

async function autofill() {
    let resp = await fetch('http://127.0.0.1:5000/compelete_sheet');
    let resp_json = await resp.json()
    if (resp_json.status === "OK") {
        chrome.notifications.create(
            "FCM noti",
            {
                iconUrl: "icon.png",
                type: "basic",
                title: "啵啵提醒你",
                message: "shit 翻译完成",
            },
        )
    } else {
        chrome.notifications.create(
            "FCM noti",
            {
                iconUrl: "icon.png",
                type: "basic",
                title: "啵啵提醒你",
                message: "shit 翻译失败",
            },
        )
    }
}

async function compelete() {
    let resp = await fetch('http://127.0.0.1:5000/compelete_sheet');
    let resp_json = await resp.json();
    await chrome.storage.sync.set({ 'fuck_fcm_resp': resp_json })
    let tabs = await chrome.tabs.query({ currentWindow: true, active: true })
    let tabId = tabs[0]
    let result = await chrome.scripting.executeScript(
        {
            "target": {
                "tabId": tabId
            },
            "func": inject_func,
            "args": [resp_json]
        },
    )
    console.log(result)
};

async function inject_func(resp_json) {
    console.log(resp_json)
}

compeleteBtn.addEventListener("click", compelete);
autofillBtn.addEventListener("click", autofill);

// compelete.addEventListener("click", async () => {
//     fetch('http://127.0.0.1:5000/compelete_sheet').then(resp => {
//         console.log(resp);
//     }).then(() => {
//         chrome.notifications.create(
//             "FCM noti",
//             {
//                 iconUrl: "icon.png",
//                 type: "basic",
//                 title: "啵啵提醒你",
//                 message: "shit 翻译完成",
//             },
//         );
//     })
// });

// autofill.addEventListener("click", async () => {
//     fetch('http://127.0.0.1:5000/reading_sheet').then(resp => {
//         let resp_json = resp.json()
//         chrome.storage.sync.set({ 'fuck_fcm_resp': resp_json })
//         console.log(resp_json)
//         chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//             let tabId = tabs[0].id;
//             console.log(chrome.scripting)
//             chrome.scripting.executeScript(
//                 {

//                     "files": ["inject.js"],
//                     "target": {
//                         "tabId": tabId
//                     },
//                     "world": "MAIN",
//                 },
//                 (result => {
//                     console.log(result)
//                 })
//             )
//         });
//     })
// })