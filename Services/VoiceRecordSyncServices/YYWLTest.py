__author__ = 'rui'
#-*- coding: utf-8 -*-

import tornado
from tornado import ioloop
import VoiceRecordEnum
import FileParing
from tornado import web, wsgi
import Messager
from tornado import escape
from tornado import httpserver
import jsonpickle
from ResAudio import resAudioList
from tornado.options import define, options
import multiprocessing
import itertools
import os


class FilesResource(web.RequestHandler):
    def post(self):
        print self.request.body
        filePath = tornado.escape.json_decode(self.request.body)
        fileParsing = FileParing.FileParsing()
        fileParsing.getFiles(filePath["filePath"].encode("utf-8"))
        self.write({
            "files": jsonpickle.encode(fileParsing.files, unpicklable = False)})

    def get(self):
        rst = []
        rst.append({'name': 'case1', 'value': '1'})
        rst.append({'name': 'case2', 'value': '2'})
        rst.append({'name': 'case3', 'value': '3'})
        self.write(jsonpickle.encode(rst, unpicklable = False))


class HtmlResource(web.RequestHandler):
    def get(self):
        self.render("index.html")


class GridResource(web.RequestHandler):
    def get(self):
        rst = []
        rst.append({'taskname': 'case1', 'catalogname': '1', 'attstarttime': '2', 'attendtime': '3', 'status': '4',
                    'newtodaynum': '5', 'havenotlistennum': '6', 'totalnum': '7'})
        rst.append({'taskname': 'case2', 'catalogname': '11', 'attstarttime': '12', 'attendtime': '13', 'status': '14',
                    'newtodaynum': '15', 'havenotlistennum': '16', 'totalnum': '17'})
        rst.append({'taskname': 'case3', 'catalogname': '111', 'attstarttime': '112', 'attendtime': '113', 'status': '114',
                    'newtodaynum': '115', 'havenotlistennum': '116', 'totalnum': '117'})
        self.write(jsonpickle.encode(rst, unpicklable = False))


settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static")
}

application = tornado.web.Application([
                                          (r"/", FilesResource),
                                          (r"/html", HtmlResource),
                                          (r"/grid", GridResource)
                                      ], **settings)

#def universal_worker(input_pair):
#    function, args = input_pair
#    return function(*args)
#
#
#def pool_args(function, *args):
#    return zip(itertools.repeat(function), zip(*args))


if __name__ == "__main__":
    try:
        print "Services Start"
        application.listen(8080)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print "Service Error"


