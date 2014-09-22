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

define("port", default = 9090, help = "run on the given port", type = int)
define("queuehost", default = 'localhost', help = "activeMQ host Uri", type = str)
define("queueport", default = 61613, help = "activeMQ host port", type = int)
define("indest", default = '/queue/intest/', help = "activeMQ host port", type = str)
define("outdest", default = '/queue/outtest', help = "activeMQ host port", type = str)


class VoiceRecordsResource(web.RequestHandler):
    def post(self):
        consumer = Messager.MessageConsumer()
        producer = Messager.MessageProducer()
        resAudio = tornado.escape.json_decode(self.request.body)
        if len(resAudio):
            consumer.Listen(self.application.options)
        for res in resAudioList.GenerateResAudio(resAudio):
            producer.ParallelSend(self.application.options)


class FilesResource(web.RequestHandler):
    def post(self):
        print self.request.body
        filePath = tornado.escape.json_decode(self.request.body)
        fileParsing = FileParing.FileParsing()
        fileParsing.getFiles(filePath["filePath"].encode("utf-8"))
        self.write({
            "files": jsonpickle.encode(fileParsing.files, unpicklable = False)})


class Application(web.Application):
    def __init__(self, opts):
        self.options = opts

        handler = [
            (r'/voicerecord/', VoiceRecordsResource),
            (r'/file/path/', FilesResource)
        ]

        super(Application, self).__init__(handler)


if __name__ == "__main__":
    try:
        print "Services Start"
        options.parse_command_line()
        app = web.Application(options)
        server = httpserver.HTTPServer(app)
        app.listen(options.port)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print "Service Error"


