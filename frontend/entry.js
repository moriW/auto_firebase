let compeleteBtn = document.getElementById("compelete");
let autofillBtn = document.getElementById("autofill");

async function compelete() {
    let resp = await fetch('http://127.0.0.1:555/compelete_sheet');
    let resp_json = await resp.json()
    console.log(resp_json)
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

async function autofill() {
    let resp = await fetch('http://127.0.0.1:555/reading_sheet');
    let resp_json = await resp.json();
    await chrome.storage.sync.set({ 'fuck_fcm_resp': resp_json })
    let tabs = await chrome.tabs.query({ currentWindow: true, active: true })
    let tabId = tabs[0].id
    let result = await chrome.scripting.executeScript(
        {
            "target": {
                "tabId": tabId
            },
            "func": inject_func,
            "args": [resp_json.row]
        },
    )
};


async function inject_func(noti_list) {
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    console.log(noti_list)
    // for (const key in object) {
    //     if (Object.hasOwnProperty.call(object, key)) {
    //         const element = object[key];

    //     }
    // }
    for (let index = 0; index < noti_list.length; index++) {
        var noti = noti_list[index];

        // create new noti
        await document.getElementsByClassName("newCampaign")[0].click()
        await sleep(2000)

        // fill up noti content
        document.getElementsByClassName("message-title")[0].value = noti.title;
        document.getElementsByClassName("message-text")[0].value = noti.desc;
        document.getElementsByClassName("message-text")[0].dispatchEvent(new Event("input"));
        document.getElementsByClassName("notification-image-input")[0].value = noti.pic;
        document.getElementsByClassName("message-label")[0].value = noti.name;

        // next
        var btns = document.getElementsByClassName("mat-stepper-next")
        for (let index = 0; index < btns.length; index++) {
            var btn = btns.item(index)
            if (btn.textContent === "Next") {
                btn.click()
            }
        }
        await sleep(2000)

        // 触发选择app
        console.log("触发选择app")
        document.getElementsByClassName("mat-select-value")[1].click()
        // 选择第一个app
        console.log("选择第一个app")
        document.getElementsByClassName("mat-option")[0].click()
        // 添加第一个条件
        console.log("添加第一个条件")
        document.getElementsByClassName("and-button")[0].click()

        // // 触发添加条件
        // console.log("触发添加条件")
        // document.getElementsByClassName("mat-menu-trigger")[3].click()
        // // 选择语言
        // console.log("选择语言")
        // document.getElementsByClassName("mat-menu-item")[1].click()

        // document.getElementsByClassName("mat-select-value")[3].click()

        // document.getElementsByClassName("mat-menu-trigger")[3].click()
        // document.getElementsByClassName("add-app")[0].click()
        // document.getElementsByClassName("mat-select-value")[1].click()
        // document.getElementsByClassName("mat-select-panel")[0].children[0].click()

        // var btns = document.getElementsByClassName("mat-stepper-next")
        // for (let index = 0; index < btns.length; index++) {
        //     var btn = btns.item(index)
        //     if (btn.textContent === "Next") {
        //         btn.click()
        //     }
        // }
        // return
    }
}

compeleteBtn.addEventListener("click", compelete);
autofillBtn.addEventListener("click", autofill);
