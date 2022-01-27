#! /bin/python
# flask build router
#
# @file: router
# @time: 2022/01/26
# @author: Mori
#
import flask
from .gsheet import compelete_sheet, reading_sheet


def build_router(app: flask.Flask):
    app.add_url_rule("/reading_sheet", view_func=reading_sheet, methods=["GET"])
    app.add_url_rule("/compelete_sheet", view_func=compelete_sheet, methods=["GET"])
