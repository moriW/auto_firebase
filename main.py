#! /bin/python
# firebase auto fill
#
# @file: main
# @time: 2022/01/23
# @author: Mori
#


import logging
from selenium import webdriver
from google.oauth2.credentials import Credentials



# const
logging.basicConfig(format="%(asctime)s %(message)s", level=logging.INFO)


def init_browser():
    logging.info("正在启动chrome")
    browser = webdriver.Chrome()

    logging.info("正在打开商店")
    browser.get("https://appstoreconnect.apple.com/")

    # logging.info("正在加载react")
    # browser.execute_script(TRIGGER_JS)

    logging.info("请手动登陆 并移动至多语言页面")
    return browser


def init_data_from_google_sheet(sheet_id: str):
    Credentials.from_authorized_user_info()
