
import essentia.standard as estd
from essentia.pytools.spectral import hpcpgram
import pickle
import argparse
import glob
import os
import filecmp
import numpy as np
import json
from argparse import RawTextHelpFormatter
parser = argparse.ArgumentParser(
    description="Backend Engine For CoverSongSimilarity",
    formatter_class=RawTextHelpFormatter)
parser.add_argument("query_file")
parser.add_argument('-s', '--searchfiles', nargs='*',
                    help='hpcp Files to search\n'
                    'leave blank to search for all')
args = parser.parse_args()

THRESHOLD_COVER = 0.12

# check if hpcp directory exists
if not os.path.isdir('hpcp_data'):
    os.mkdir('hpcp_data')


def formatoutput(status, payload=[]):
    out_obj = {
        "status": status,
        "payload": payload
    }
    print(json.dumps(out_obj), flush=True)


query_filename = args.query_file
# print(query_filename)
# exit()
# true_ref_filename = "../database_mp3/whats_wrong_eric_original.mp3"
# false_ref_filename = "../database_mp3/how_have_you_been_eric_original.mp3"
formatoutput("engine_start")
# query cover song
query_audio = estd.MonoLoader(filename=query_filename,
                              sampleRate=32000)()
# # true cover
# true_cover_audio = estd.MonoLoader(filename=true_ref_filename,
#                                    sampleRate=32000)()
# # wrong match
# false_cover_audio = estd.MonoLoader(filename=false_ref_filename,
#                                     sampleRate=32000)()

formatoutput("calculate_query_hpcp")
# compute frame-wise hpcp with default params
query_hpcp = hpcpgram(query_audio,
                      sampleRate=32000)

cross_similarity = estd.ChromaCrossSimilarity(frameStackSize=9,
                                              frameStackStride=3,
                                              binarizePercentile=0.095,
                                              oti=True)

cover_similarity = estd.CoverSongSimilarity(disOnset=0.5,
                                            disExtension=0.5,
                                            alignmentType='serra09',
                                            distanceType='asymmetric')

all_hpcp_files = args.searchfiles
if all_hpcp_files == None:
    all_hpcp_files = sorted(glob.glob("hpcp_data/*.hpcp"))

formatoutput("start_matching_process")
results = []
exact_match = False
for i, hpcp_file in enumerate(all_hpcp_files):
    formatoutput("matching", {"current_idx": i+1,
                             "total_len": len(all_hpcp_files)})
    # print("Calculating {}".format(os.path.basename(hpcp_file)),flush=True)
    with open(hpcp_file, "rb") as f:
        ref_cover_hpcp = pickle.load(f)
    if np.array_equal(query_hpcp, ref_cover_hpcp):
        # print("Exact",flush=True)
        results.append({
            "song_hash": os.path.basename(hpcp_file).split(".")[0],
            "dist": 0,
            "exact": True
        })
        exact_match = True
    else:
        sim_matrix = cross_similarity(query_hpcp, ref_cover_hpcp)
        score_matrix, distance = cover_similarity(sim_matrix)
        # print("Distance : {}".format(distance),flush=True)
        results.append({
            "song_hash": os.path.basename(hpcp_file).split(".")[0],
            "dist": distance,
            "exact": False
        })

results = sorted(results,key=lambda x:x["dist"])
formatoutput("matching_results", results)

os.remove(query_filename)
# if not exact match, we should save the hpcp file
if not exact_match:
    formatoutput("saving_query_hpcp")
    with open("hpcp_data/{}.hpcp".format(os.path.basename(query_filename).split(".")[0]), "wb") as f:
        pickle.dump(query_hpcp, f, pickle.HIGHEST_PROTOCOL)
    
    if len(results) > 0 and results[0]["dist"] <= THRESHOLD_COVER:
        formatoutput("saved_query_hpcp",[results[0]["song_hash"]])
    else:
        formatoutput("saved_query_hpcp")
    formatoutput("done")
else:
    formatoutput("music_exist")
