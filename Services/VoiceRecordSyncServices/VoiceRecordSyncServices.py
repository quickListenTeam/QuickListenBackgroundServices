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

define("port", default = 8000, help = "run on the given port", type = int)


class VoiceRecordsResource(web.RequestHandler):
    def initialize(self):
        pass

    def post(self):
        consumer = Messager.MessageConsumer()
        producer = Messager.MessageProducer()
        resAudio = tornado.escape.json_decode(self.request.body)
        if len(resAudio):
            consumer.Listen('')
        for res in resAudioList.GenerateResAudio(resAudio):
            producer.ParallelSend('')


class FilesResource(web.RequestHandler):
    def post(self):
        print self.request.body
        filePath = tornado.escape.json_decode(self.request.body)
        fileParsing = FileParing.FileParsing()
        fileParsing.getFiles(filePath["filePath"].encode("utf-8"))
        self.write({
            "files": jsonpickle.encode(fileParsing.files, unpicklable = False)})


class Application(web.Application):
    def __init__(self):
        pass


if __name__ == "__main__":
    try:
        print "Services Start"
        options.parse_command_line()
        app = wsgi.WSGIApplication([(r"/files/path", FilesResource)])
        app.listen(options.port)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print "Service Error"


