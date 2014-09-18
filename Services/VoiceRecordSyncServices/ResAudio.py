__author__ = 'rui'
#-*- coding: utf-8 -*-
import uuid


class resAudio:
    def __init__(self, uri, encoding, bits, rate, chnl, spkn):
        self.aid = uuid.uuid1()
        self.uri = uri
        self.encoding = encoding
        self.bits = bits
        self.rate = rate
        self.chnl = chnl
        self.spkn = spkn


class resAudioList:
    @classmethod
    def GenerateResAudio(cls, data):
        resAudios = []
        for temp in data:
            res = resAudio(temp["uri"], temp["encoding"], temp["bits"], temp["rate"], temp["chnl"], temp["spkn"])
            resAudios.append(res)
        return resAudios