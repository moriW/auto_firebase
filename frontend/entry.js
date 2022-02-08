let compeleteBtn = document.getElementById("compelete");
let autofillBtn = document.getElementById("autofill");

async function compelete() {
    let resp = await fetch('https://gsheet.moridisa.com/autofirebase/compelete_sheet');
    let resp_json = await resp.json()
    console.log(resp_json)
    var li = document.createElement("li");
    var i = document.createElement("i")
    li.setAttribute("class", "list-group-item")

    if (resp_json.status === "OK") {
        i.setAttribute("class", "bi-check-circle")
        li.textContent = "Done"
    }
    else {
        i.setAttribute("class", "bi-x-circle")
        li.textContent = "Failed"
    }
    li.appendChild(i)
    document.getElementById("translate_card_body").appendChild(li)
    //     chrome.notifications.create(
    //         "FCM noti",
    //         {
    //             iconUrl: "icon.png",
    //             type: "basic",
    //             title: "啵啵提醒你",
    //             message: "shit 翻译完成",
    //         },
    //     )
    // } else {
    //     chrome.notifications.create(
    //         "FCM noti",
    //         {
    //             iconUrl: "icon.png",
    //             type: "basic",
    //             title: "啵啵提醒你",
    //             message: "shit 翻译失败",
    //         },
    //     )
    // }
}

async function autofill() {
    let resp = await fetch('https://gsheet.moridisa.com/autofirebase/reading_sheet');
    let resp_json = await resp.json();
    console.log(resp_json)
    // await chrome.storage.sync.set({ 'fuck_fcm_resp': resp_json })
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

        var basic_time = 1000
        if (time != null) {
            basic_time *= time
        }
        return new Promise((resolve) => setTimeout(resolve, basic_time));
    }

    for (let index = 0; index < noti_list.length; index++) {
        now = Date.now()
        var noti = noti_list[index];

        // create new noti
        await document.getElementsByClassName("newCampaign")[0].click()
        await sleep(0.8)

        // fill up noti content
        document.getElementsByClassName("message-title")[0].value = noti.title;
        document.getElementsByClassName("message-title")[0].dispatchEvent(new Event("input"));
        document.getElementsByClassName("message-text")[0].value = noti.desc;
        document.getElementsByClassName("message-text")[0].dispatchEvent(new Event("input"));
        document.getElementsByClassName("notification-image-input")[0].value = noti.pic;
        document.getElementsByClassName("notification-image-input")[0].dispatchEvent(new Event("input"));
        document.getElementsByClassName("message-label")[0].value = noti.name;
        document.getElementsByClassName("message-label")[0].dispatchEvent(new Event("input"));

        // next
        await sleep(0.8)
        document.getElementsByClassName("mat-stepper-next")[0].click()
        await sleep(1)

        // 触发选择app
        console.log("触发选择app")
        document.getElementsByClassName("mat-select-value")[1].click()
        await sleep(0.3)

        // 选择第一个app
        console.log("选择第一个app")
        document.getElementsByClassName("mat-option")[0].click()
        await sleep(0.3)

        // 添加第一个条件
        console.log("添加第一个条件")
        document.getElementsByClassName("and-button")[0].click()
        await sleep(0.3)

        // 触发添加条件
        console.log("触发添加条件")
        document.getElementsByTagName("fire-rx-targeting-options")[1].children[0].click()
        await sleep(0.3)

        // 选择语言条件
        console.log("选择语言条件")
        document.getElementsByClassName("mat-menu-item")[1].click()
        await sleep(0.3)

        // 触发选择语言
        console.log("触发选择语言")
        document.getElementsByClassName("mat-select-value")[3].click()
        await sleep(0.3)

        // 选择语言
        var lans = document.getElementsByClassName("mat-option")
        for (let index = 0; index < lans.length; index++) {
            var lan = lans.item(index)
            var lan_text = lan.textContent.split(" ")[1];
            var flag = false;
            if (noti.lan.operation === 'in') {
                flag = noti.lan.lan_list.indexOf(lan_text) !== -1
            } else {
                flag = noti.lan.lan_list.indexOf(lan_text) === -1
            }
            if (flag) {
                lan.click()
                // await sleep(0.8)
            }
        }
        await sleep(0.3)
        // 关闭弹框
        document.getElementsByClassName("cdk-overlay-backdrop")[0].click()
        await sleep(0.8)

        // 添加第二个app
        document.getElementsByClassName("add-app")[0].click()
        await sleep(0.3)

        // 触发选择第二个app
        console.log("触发选择第二个app")
        document.getElementsByClassName("mat-select-value")[4].click()
        await sleep(0.3)

        // 选择第二个app
        console.log("选择第二个app")
        document.getElementsByClassName("mat-option")[0].click()
        await sleep(0.3)

        // 添加第二套的条件
        console.log("添加第二套的条件")
        document.getElementsByClassName("and-button")[2].click()
        await sleep(0.3)

        // 触发第二套的添加语言
        console.log("触发第二套的添加语言")
        document.getElementsByTagName("fire-rx-targeting-options")[3].children[0].click()
        await sleep(0.3)

        // 添加第二套语言条件
        console.log("添加第二套语言条件")
        document.getElementsByClassName("mat-menu-item")[1].click()
        await sleep(0.3)

        // 触发选择语言
        console.log("触发选择语言")
        document.getElementsByClassName("mat-select-value")[6].click()
        await sleep(0.3)

        // 选择语言
        var lans = document.getElementsByClassName("mat-option")
        for (let index = 0; index < lans.length; index++) {
            var lan = lans.item(index)
            var lan_text = lan.textContent.split(" ")[1];
            var flag = false;
            if (noti.lan.operation === 'in') {
                flag = noti.lan.lan_list.indexOf(lan_text) !== -1
            } else {
                flag = noti.lan.lan_list.indexOf(lan_text) === -1
            }
            if (flag) {
                lan.click()
                // await sleep(0.8)
            }
        }
        // 关闭弹框
        document.getElementsByClassName("cdk-overlay-backdrop")[0].click()
        await sleep(0.8)

        // next
        await sleep(0.8)
        document.getElementsByClassName("mat-stepper-next")[1].click()
        await sleep(1)

        // 触发时间选择
        console.log("触发时间选择")
        document.getElementsByTagName("fcm-datepicker")[0].getElementsByTagName("input")[0].click()
        await sleep(0.3)

        // 选择时间
        console.log("选择时间")
        document.getElementsByClassName("mat-menu-item")[1].click()
        await sleep(0.3)

        // 触发日期选择
        console.log("触发日期选择")
        document.getElementsByClassName("mat-calendar-period-button")[0].click()
        await sleep(0.3)

        // 选年
        console.log("选年")
        var calendar_year_cells = document.getElementsByClassName("mat-calendar-body-cell")
        for (let index = 0; index < calendar_year_cells.length; index++) {
            let calendar_year_cell = calendar_year_cells.item(index)
            if (calendar_year_cell.textContent.trim() === noti.push_date.year) {
                calendar_year_cell.click()
                break
            }
        }
        await sleep(0.3)

        // 选月
        console.log("选月")
        var calendar_month_cells = document.getElementsByClassName("mat-calendar-body-cell")
        for (let index = 0; index < calendar_month_cells.length; index++) {
            let calendar_month_cell = calendar_month_cells.item(index)
            if (calendar_month_cell.textContent.trim() === noti.push_date.month.str) {
                calendar_month_cell.click()
                break
            }
        }
        await sleep(0.3)

        // 选日
        console.log("选日")
        var calendar_day_cells = document.getElementsByClassName("mat-calendar-body-cell")
        for (let index = 0; index < calendar_day_cells.length; index++) {
            let calendar_day_cell = calendar_day_cells.item(index)
            if (calendar_day_cell.textContent.trim() === noti.push_date.day) {
                calendar_day_cell.click()
                break
            }
        }
        await sleep(0.3)

        // 输入时间
        console.log("输入时间")
        document.getElementsByTagName("fcm-datetimepicker")[0].getElementsByTagName("input")[1].value = `${noti.push_time.hour}:${noti.push_time.minute}`
        document.getElementsByTagName("fcm-datetimepicker")[0].getElementsByTagName("input")[1].dispatchEvent(new Event("input"))
        // await sleep(0.8)

        // 触发时区
        console.log("触发时区")
        document.getElementsByClassName("fcm-timezonepicker-button")[0].click()
        // await sleep(0.8)

        // 时区
        console.log("选时区")
        var btns = document.getElementsByClassName("mat-menu-item")
        for (let index = 0; index < btns.length; index++) {
            let btn = btns.item(index)
            if (btn.textContent === "Recipient time zone") {
                btn.click()
                break
            }
        }
        await sleep(0.3)

        // next
        document.getElementsByClassName("mat-stepper-next")[2].click()
        await sleep(0.8)

        document.getElementsByClassName("mat-stepper-next")[3].click()
        await sleep(0.8)

        // kv
        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[1].value = "push_from"
        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[1].dispatchEvent(new Event("input"));

        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[2].value = "FcmPush"
        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[2].dispatchEvent(new Event("input"));

        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[3].value = "notify_id"
        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[3].dispatchEvent(new Event("input"));

        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[4].value = `${noti.push_date.year}${noti.push_date.month.int}${noti.push_date.day}`
        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[4].dispatchEvent(new Event("input"));

        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[5].value = "notify_time"
        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[5].dispatchEvent(new Event("input"));

        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[6].value = `${noti.push_time.hour}${noti.push_time.minute}`
        document.getElementsByClassName("abt-message-options-form")[0].getElementsByTagName("input")[6].dispatchEvent(new Event("input"));
        await sleep(0.3)

        document.getElementsByClassName("mat-select-value")[7].click()
        await sleep(0.3)

        var options = document.getElementsByClassName("mat-option")
        for (let index = 0; index < options.length; index++) {
            let option = options.item(index)
            if (option.textContent.trim() == 'Enabled') {
                option.click()
                break
            }
        }
        await sleep(0.3)

        document.getElementsByClassName("mat-select-value")[8].click()
        await sleep(0.3)

        var options = document.getElementsByClassName("mat-option")
        for (let index = 0; index < options.length; index++) {
            let option = options.item(index)
            if (option.textContent.trim() == 'Enabled') {
                option.click()
                break
            }
        }
        await sleep(0.3)

        document.getElementsByClassName("badge-count-input")[0].value = 1
        document.getElementsByClassName("badge-count-input")[0].dispatchEvent(new Event("input"))
        // await sleep(0.8)

        document.getElementsByClassName("cta-bottom")[0].getElementsByTagName("button")[1].click()
        await sleep(0.3)

        document.getElementsByClassName("fire-dialog-actions")[0].getElementsByTagName("button")[1].click()
        console.log(`完成第: ${index + 1}个 not自动化填写, 剩余: ${noti_list.length - 1 - index}个, 耗时: ${Date.now() - now}ms, 10s后开始下一条`)
        await sleep(10)
    }
    alert("Shift Bro, 填完了");

}

compeleteBtn.addEventListener("click", compelete);
autofillBtn.addEventListener("click", autofill);
