#! /bin/python
#
#
# @file: gsheet
# @time: 2022/01/26
# @author: Mori
#

from itertools import chain
import os
import datetime

from typing import List, Dict

import pygsheets
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.cloud import translate_v2

NOW = datetime.datetime.now()
IS_CONFIG_KEY = "已配置"
PUSHDATE_KEY = "发布日期"
TITLE_KEY = "标题"
DESC_KEY = "描述"
NAME_KEY = "名称"
PIC_KEY = "配图链接"
CATE_KEY = "配图"
I18NS = ["de", "es", "fr", "pt", "ru"]
I18N_MAP = {
    "de": ["German"],
    "es": ["Spanish(Mexico)", "Spanish(Spain)"],
    "fr": ["French"],
    "pt": ["Portuguese(Brazil)", "Portuguese(Portugal)"],
    "ru": ["Russian"],
}

ALPHA_ASIC_START = 64
DATETIME_FMT = "%Y/%m/%d"

TOKEN_FILE, CLIENT_SECRET_FILE = "token.json", "client_secret.json"


def init_credentials():
    scopes = (
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/cloud-translation",
    )
    creds = None

    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, scopes=scopes)

    if creds:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
    else:
        flow = Flow.from_client_secrets_file(
            CLIENT_SECRET_FILE, scopes=scopes, redirect_uri="urn:ietf:wg:oauth:2.0:oob"
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

    with open(TOKEN_FILE, "w") as _f:
        _f.write(creds.to_json())
    return creds


def read_wks_from_google_sheet(
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


def parse_line_dict(line_dict: Dict) -> List[Dict]:
    push_date = line_dict[PUSHDATE_KEY]
    pic_url = line_dict[PIC_KEY]
    cate_name = line_dict[CATE_KEY]
    return [
        {
            "push_date": push_date,
            "title": line_dict[f"{i18n_item}_title"],
            "desc": line_dict[f"{i18n_item}_desc"],
            "lan": {
                "operation": "in",
                "lan_list": I18N_MAP[i18n_item],
            },
            "pic": pic_url,
            "name": push_date + " / " + cate_name + " / " + i18n_item,
        }
        for i18n_item in I18NS
    ] + [
        {
            "push_date": push_date,
            "title": line_dict[TITLE_KEY],
            "desc": line_dict[DESC_KEY],
            "lan": {
                "operation": "not in",
                "lan_list": list(chain(I18N_MAP.values())),
            },
            "pic": pic_url,
            "name": push_date + " / " + cate_name + " / en",
        }
    ]


def reading_worksheet(worksheet: pygsheets.Worksheet):
    paresed_lines = []
    for line_dict in worksheet.get_all_records():
        try:
            pushdate = datetime.datetime.strptime(line_dict[PUSHDATE_KEY], DATETIME_FMT)
            assert pushdate > NOW
        except Exception:
            continue
        if line_dict[IS_CONFIG_KEY] == ["是", ""]:
            continue
        if (
            len(
                [v for k, v in line_dict.items() if "title" in k and v == ""]
                + [v for k, v in line_dict.items() if "desc" in k and v == ""]
            )
            != 0
        ):
            continue
        paresed_lines.extend(parse_line_dict(line_dict))
    return paresed_lines


if __name__ == "__main__":
    cred = init_credentials()
    wks = read_wks_from_google_sheet(
        sheet_id="1vXqHdA6RTD9cMMv8CvRQMW-jM9GSajAZOVcdJMwEFDM",
        worksheet_title="lite填色通知配置记录2",
        credentials=cred,
    )
    for data in reading_worksheet(wks):
        print(data)
