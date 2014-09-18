__author__ = 'rui'
#-*- coding: utf-8 -*-

import stomp
import pp
import time


class MessageProducer:
    def ParallelSend(self, options):
        connection = stomp.Connection(host_and_ports = [(options.host, options.port)])
        try:
            connection.start()
            connection.connect()
            connection.send(options.message, destination = options.destination)
        finally:
            connection.disconnect()


class MessageConsumer(object):
    def on_error(self, headers, message):
        print '=> Received an error %s', message

    def on_message(self, headers, message):
        #入库
        print '=> Received an message %s', message

    def Listen(self, options):
        connection = stomp.Connection(host_and_ports = [(options.host, options.port)])
        try:
            connection.set_listener('', MessageConsumer())
            connection.start()
            connection.connect(wait = True)
            connection.subscribe(destination = options.destination, id = 1, ack = 'auto',
                                 headers = {'selector': "flag='1'", 'transformation': 'jms-json'})
            while True:
                time.sleep(60)
        finally:
            connection.disconnect()

