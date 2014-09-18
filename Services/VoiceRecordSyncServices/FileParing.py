__author__ = 'rui'
# -*- coding: utf-8 -*-

import os
import os.path, time
from os.path import getsize, join, getctime
import jsonpickle


class FileInfo:
    def __init__(self, fileName, fullName, fileSize, createTime):
        self.fileName = fileName
        self.fullName = fullName
        self.fileSize = fileSize
        self.createTime = createTime


class FileParsing:
    def __init__(self):
        self.files = []
        self.path = ""

    def fillFileInfo(self, name):
        if os.path.splitext(name)[1] == '.wav' or os.path.splitext(name)[1] == '.pcm':
            fileName = name.decode("GBK").encode("utf8")
            fileSize = getsize(unicode(join(self.path, fileName), 'utf8'))
            fullName = join(self.path, fileName)
            createTime = time.ctime(getctime(unicode(join(self.path, fileName), 'utf8')))
            self.files.append(FileInfo(fileName, fullName, fileSize, createTime))


    def getFiles(self, path):
        self.path = path
        for root, dirs, files in os.walk(path):
            map(self.fillFileInfo, files)


if __name__ == "__main__":
    fp = FileParsing()
    fp.getFiles("//127.0.0.1/d$/Test")
    print jsonpickle.encode(fp.files, unpicklable = False)

