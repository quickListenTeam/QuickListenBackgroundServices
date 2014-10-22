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

define("port", default = 9090, help = "run on the given port", type = int)
define("queuehost", default = 'localhost', help = "Queue server host (defaults to localhost)", type = str)
define("queueport", default = 61613, help = "Queue server host (defaults to 61613)", type = int)
define("indest", default = '/queue/intest', help = "Mqin Destination name", type = str)
define("outdest", default = '/queue/outtest', help = "Mqout Destination name", type = str)


class VoiceRecordsResource(web.RequestHandler):
    def post(self):
        producer = Messager.MessageProducer()
        resAudio = tornado.escape.json_decode(self.request.body)
        if len(resAudio):
            for res in resAudioList.GenerateResAudio(resAudio):
                producer.ParallelSend('hello', self.application.options)


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

        handlers = [
            (r'/voicerecord/', VoiceRecordsResource),
            (r'/file/path/', FilesResource)
        ]

        super(Application, self).__init__(handlers)


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
        options.parse_command_line()
        #p = multiprocessing.Pool(processes = 4)
        param = []
        param.append("%s_%s_%s" % (options.queuehost, options.queueport, options.outdest))
        p = multiprocessing.Process(target = Messager.ListenAsync, args = (param,))
        p.start()
        p.join()
        #p.apply_async(Messager.ListenAsync, param)
        app = Application(options)
        server = httpserver.HTTPServer(app)
        app.listen(options.port)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print "Service Error"


