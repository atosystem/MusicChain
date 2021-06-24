
import essentia.standard as estd
from essentia.pytools.spectral import hpcpgram
import pickle
import argparse
import glob
import os
import filecmp
import numpy as np
import json

THRESHOLD_COVER = 0.12

# color output
def prRed(skk): print("\033[91m{}\033[00m" .format(skk))
def prGreen(skk): print("\033[92m{}\033[00m" .format(skk))
def prYellow(skk): print("\033[93m{}\033[00m" .format(skk))
def prLightPurple(skk): print("\033[94m{}\033[00m" .format(skk))
def prPurple(skk): print("\033[95m{}\033[00m" .format(skk))
def prCyan(skk): print("\033[96m{}\033[00m" .format(skk))
def prLightGray(skk): print("\033[97m{}\033[00m" .format(skk))
def prBlack(skk): print("\033[98m{}\033[00m" .format(skk))


def getRed(skk): return ("\033[91m{}\033[00m" .format(skk))
def getGreen(skk): return ("\033[92m{}\033[00m" .format(skk))
def getYellow(skk): return ("\033[93m{}\033[00m" .format(skk))
def getLightPurple(skk): return ("\033[94m{}\033[00m" .format(skk))
def getPurple(skk): return ("\033[95m{}\033[00m" .format(skk))
def getCyan(skk): return ("\033[96m{}\033[00m" .format(skk))
def getLightGray(skk): return ("\033[97m{}\033[00m" .format(skk))
def getBlack(skk): return ("\033[98m{}\033[00m" .format(skk))


# check if hpcp directory exists
if not os.path.isdir('hpcp_data'):
    exit()

all_mp3_files = sorted(glob.glob("hpcp_data/*.mp3"))

for i,fn in enumerate(all_mp3_files):
    print("[{}/{}] Calculating hpcp of {} ... ".format(i,len(all_mp3_files),getPurple(os.path.basename(fn).split(".")[0])),end="")
    query_audio = estd.MonoLoader(filename=fn,
                              sampleRate=32000)()
    # compute frame-wise hpcp with default params
    query_hpcp = hpcpgram(query_audio,
                        sampleRate=32000)
    with open("hpcp_data/{}.hpcp".format(os.path.basename(fn).split(".")[0]), "wb") as f:
        pickle.dump(query_hpcp, f, pickle.HIGHEST_PROTOCOL)
    # delete the mp3 file
    os.remove(fn)
    print("[{}]".format(getGreen("done")))
