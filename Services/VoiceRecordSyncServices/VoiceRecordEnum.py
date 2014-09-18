__author__ = 'rui'
#-*- coding: utf-8 -*-

from richenum import RichEnumValue

class Encoding(RichEnumValue):
    pcm = RichEnumValue(canonical_name = 1, display_name = 1)
    alaw = RichEnumValue(canonical_name = 6, display_name = 6)


class AudioFormat(RichEnumValue):
    A8k_16bit_PCM = RichEnumValue(canonical_name = "A8k_16bit_PCM", display_name = "A8k_16bit_PCM")
    A16k_16bit_PCM = RichEnumValue(canonical_name = "A16k_16bit_PCM", display_name = "A16k_16bit_PCM")
    A8k_A_law = RichEnumValue(canonical_name = "A8k_A_law", display_name = "A8k_A_law")
    A16k_A_law = RichEnumValue(canonical_name = "A16k_A_law", display_name = "A16k_A_law")
    A8k_U_law = RichEnumValue(canonical_name = "A8k_U_law", display_name = "A8k_U_law")
    A16k_U_law = RichEnumValue(canonical_name = "A16k_U_law", display_name = "A16k_U_law")


class Channel(RichEnumValue):
    mono = RichEnumValue(canonical_name = 1, display_name = 1)
    Stereo = RichEnumValue(canonical_name = 2, display_name = 2)


class Bits(RichEnumValue):
    bit8 = RichEnumValue(canonical_name = 8, display_name = 8)
    bit16 = RichEnumValue(canonical_name = 16, display_name = 16)


class Rate(RichEnumValue):
    Hz8k = RichEnumValue(canonical_name = 8000, display_name = 8000)
    Hz16k = RichEnumValue(canonical_name = 16000, display_name = 16000)







