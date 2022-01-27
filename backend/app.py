#! /bin/python
# flask web backend
#
# @file: main
# @time: 2022/01/26
# @author: Mori
#


import flask
from web.router import build_router

app = flask.Flask(__name__)

build_router(app)