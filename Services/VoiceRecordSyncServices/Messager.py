__author__ = 'rui'
#-*- coding: utf-8 -*-

import stomp
import pp
import time
from tornado.options import define, options


class MessageProducer:
    def ParallelSend(self, message, options):
        connection = stomp.Connection(host_and_ports = [(options.queuehost, options.queueport)])
        try:
            connection.start()
            connection.connect()
            connection.send(message, destination = options.indest)
        finally:
            connection.disconnect()


class MessageConsumer(object):
    def on_error(self, headers, message):
        print '=> Received an error %s', message

    def on_message(self, headers, message):
        #入库
        print '=> Received an message %s', message


def ListenAsync(options):
    opt = options.split("_")
    connection = stomp.Connection(host_and_ports = [(opt[0], int(opt[1]))])
    try:
        connection.set_listener('', MessageConsumer())
        connection.start()
        connection.connect(wait = True)
        connection.subscribe(destination = opt[2], id = 1, ack = 'auto',
                             headers = {'selector': "flag='1'", 'transformation': 'jms-json'})
        while True:
            time.sleep(60)
    finally:
        connection.disconnect()

