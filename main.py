#! /bin/python
# firebase auto fill
#
# @file: main
# @time: 2022/01/23
# @author: Mori
#

import os
import json
import logging
import argparse
import datetime
import pygsheets
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow

# from google.cloud.translate_v2 import Client as TranslateClient
from google.cloud import translate_v2
from selenium import webdriver


# const
logging.basicConfig(format="%(asctime)s %(message)s", level=logging.INFO)
NOW = datetime.datetime.now()
IS_CONFIG_KEY = "已配置"
PUSHDATE_KEY = "发布日期"
TITLE_KEY = "标题"
DESC_KEY = "描述"
NAME_KEY = "名称"
I18NS = ["de", "es", "fr", "pt", "ru"]

ALPHA_ASIC_START = 64
DATETIME_FMT = "%Y/%m/%d"


def init_browser():
    logging.info("正在启动chrome")
    browser = webdriver.Chrome()

    logging.info("正在打开商店")
    browser.get("https://appstoreconnect.apple.com/")

    # logging.info("正在加载react")
    # browser.execute_script(TRIGGER_JS)

    logging.info("请手动登陆 并移动至多语言页面")
    return browser


def init_credentials(token_file: str, client_secret_file: str):
    scopes = (
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/cloud-translation",
    )
    creds = None

    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, scopes=scopes)

    if creds:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
    else:
        flow = Flow.from_client_secrets_file(
            client_secret_file, scopes=scopes, redirect_uri="urn:ietf:wg:oauth:2.0:oob"
        )
        auth_url, _ = flow.authorization_url(prompt="consent")
        print(
            "Please go to this URL and finish the authentication flow: {}".format(
                auth_url
            )
        )
        code = input("Enter the authorization code: ")
        flow.fetch_token(code=code)
        creds = flow.credentials
        print(flow.credentials.to_json())

    with open(token_file, "w") as _f:
        _f.write(creds.to_json())
    return creds


def read_data_from_google_sheet(
    sheet_id: str, worksheet_title: str, credentials: Credentials
):
    gc = pygsheets.authorize(credentials=credentials)
    sheet = gc.open_by_key(sheet_id)
    # worksheet = sheet.worksheet_by_title(worksheet_title)
    return sheet.worksheet_by_title(worksheet_title)


def compelete_worksheet(worksheet: pygsheets.Worksheet, credentials: Credentials):
    translate_client = translate_v2.Client(credentials=credentials)
    header = worksheet.get_row(1, returnas="cell", include_tailing_empty=False)
    first_i18n_index = [
        x.col for x in header if "title" in x.value or "desc" in x.value
    ][0] - 1

    payload = worksheet.get_all_records()
    for index, line_dict in enumerate(payload):
        try:
            pushdate = datetime.datetime.strptime(line_dict[PUSHDATE_KEY], DATETIME_FMT)
            assert pushdate > NOW
        except Exception:
            continue

        if line_dict[IS_CONFIG_KEY] == "是":
            continue

        if (
            len(line_dict[TITLE_KEY].strip()) == 0
            or len(line_dict[DESC_KEY].strip()) == 0
        ):
            continue

        if (
            len(
                [v for k, v in line_dict.items() if "title" in k and v == ""]
                + [v for k, v in line_dict.items() if "desc" in k and v == ""]
            )
            == 0
        ):
            continue

        title, desc = line_dict[TITLE_KEY], line_dict[DESC_KEY]
        update_values = (
            [
                translate_client.translate(
                    values=title, source_language="en", target_language=lan
                )["translatedText"]
                for lan in I18NS
            ]
            + [
                translate_client.translate(
                    values=desc, source_language="en", target_language=lan
                )["translatedText"]
                for lan in I18NS
            ]
            + ["否"]
        )
        update_values = [x.replace("C&#39;est l&#39;", "") for x in update_values]
        worksheet.update_row(
            index + 2, values=update_values, col_offset=first_i18n_index
        )


def reading_worksheet(worksheet: pygsheets.Worksheet):
    payload = worksheet.get_all_records()
    for index, line_dict in enumerate(payload):
        try:
            pushdate = datetime.datetime.strptime(line_dict[PUSHDATE_KEY], DATETIME_FMT)
            assert pushdate > NOW
        except Exception:
            continue
        if line_dict[IS_CONFIG_KEY] == ["是", ""]:
            continue
        yield index, line_dict


def read_cli():
    parser = argparse.ArgumentParser(
        prog="fcm_auto_fill",
        description="firebase cloud message autofill helper.",
        argument_default="config.json",
    )
    parser.add_argument("config_file")
    args = parser.parse_args()
    with open(args.config_file, "r") as _f:
        config = json.load(_f)
        return (
            config["sheet_id"],
            config["token_file"],
            config["worksheet_title"],
            config["client_secret_json"],
        )


def main():
    init_browser()
    # sheet_id, token_file, worksheet_title, client_secret_json = read_cli()
    # credentials = init_credentials(
    #     token_file=token_file, client_secret_file=client_secret_json
    # )
    # wks = read_data_from_google_sheet(
    #     sheet_id=sheet_id,
    #     worksheet_title=worksheet_title,
    #     credentials=credentials,
    # )
    # compelete_worksheet(worksheet=wks, credentials=credentials)
    # return wks.get_all_values(returnas="cell", include_tailing_empty_rows=False)


if __name__ == "__main__":
    main()
