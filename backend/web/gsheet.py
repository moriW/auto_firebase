#! /bin/python
# gsheet flask entry handler
#
# @file: gsheet
# @time: 2022/01/26
# @author: Mori
#

import flask
from service.gsheet import (
    init_credentials,
    compelete_worksheet,
    reading_worksheet,
    read_wks_from_google_sheet,
)


SHEET_ID = "1vXqHdA6RTD9cMMv8CvRQMW-jM9GSajAZOVcdJMwEFDM"
WKS_TITLE = "lite填色通知配置记录2"

__all__ = ["compelete_sheet", "reading_sheet"]


def compelete_sheet():
    try:
        cred = init_credentials()
        wks = read_wks_from_google_sheet(SHEET_ID, WKS_TITLE, cred)
        compelete_worksheet(wks, cred)
        return flask.jsonify({"status": "OK"})
    except Exception as e:
        print(e)
        return flask.jsonify({"status": "ERROR", "msg": str(e)})


def reading_sheet():
    try:
        cred = init_credentials()
        wks = read_wks_from_google_sheet(SHEET_ID, WKS_TITLE, cred)
        payload = {"status": "OK", "row": [], "total": 0}
        payload["row"] = reading_worksheet(wks)
        payload["total"] = len(payload["row"])
        return flask.jsonify(payload)
    except Exception as e:
        return flask.jsonify({"status": "ERROR", "msg": str(e)})
