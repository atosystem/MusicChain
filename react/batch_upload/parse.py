from __future__ import unicode_literals
import codecs
import os
import sys
import glob
import ipfsApi
from shutil import copyfile
import random
from datetime import datetime
import json
import pyperclip
random.seed(datetime.now())

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


# get html from clipboard
account_html = pyperclip.paste()

eth_accounts = []

pos = 0
while(1):
    a = account_html.find("AccountAddress", pos)
    if a == -1:
        break
    a = account_html.find('class="Value"', a)
    a = account_html.find('span', a)
    b = account_html.find('span', a+1)
    # print(account_html[a+5:b-2])
    eth_accounts.append(account_html[a+5:b-2])
    pos = b

if not len(eth_accounts):
    print(getRed("Cannot get accounts"))
    print(getRed("Please copy Ganache Account Page HTML to clipboard"))
    exit()
print(getGreen("ETH Accounts"))
for x in eth_accounts:
    print(getLightPurple(x))
print("="*10)


HPCP_DATA_PATH = "../../docker/backend/hpcp_data"

all_meta_data = []

songs_folder = [f.path for f in os.scandir("./music") if f.is_dir()]

for sf in songs_folder:
    print("Processing {}".format(getGreen(sf)))
    # place original mp3 on the front of the list
    all_files = sorted(glob.glob("{}/*.mp3".format(sf)),
                       key=lambda x: os.path.basename(x).split("_")[-1])
    all_files.reverse()

    # random shuffle cover songs order
    all_files_covers = all_files[1:]
    random.shuffle(all_files_covers)
    all_files[1:] = all_files_covers

    uploader_list = []
    while(len(all_files) > len(uploader_list)):
        random.shuffle(eth_accounts)
        uploader_list.extend(eth_accounts[:len(all_files)-len(uploader_list)])

    for i, f in enumerate(all_files):
        d = os.path.basename(f).split("_")
        if d[-1] == "original.mp3":
            entry = {
                "title": d[0],
                "artist": d[1],
                "path": f,
                "coverFrom": "None"
            }
        else:
            entry = {
                "title": d[0],
                "artist": d[1],
                "path": f,
                "coverFrom": all_meta_data[-1]["ipfs_hash"]  # last song ipfs
            }
        entry["uploader"] = uploader_list[i]
        print("Title: {} Artist: {} ...  ".format(
            getYellow(entry["title"]), getCyan(entry["artist"])), end='')

        # upload ipfs
        api = ipfsApi.Client('127.0.0.1', 5001)
        res = api.add(f)
        res = list(filter(lambda e: entry["artist"] in e["Name"], res))
        entry["ipfs_hash"] = res[0]["Hash"]

        # copy mp3 file to backend database and rename it with its ipfs hash
        copyfile(f, os.path.join(HPCP_DATA_PATH,
                 "{}.mp3".format(entry["ipfs_hash"])))
        all_meta_data.append(entry)

        print("ipfs_hash: {} [{}]".format(
            getLightPurple(entry["ipfs_hash"]), getGreen("done")))

# save to json file with codec
with codecs.open("song_entries.json", "w", 'utf-8') as f:
    f.write(json.dumps(all_meta_data, ensure_ascii=False))


print(getGreen("Entries saved : {}".format("song_entries.json")))
