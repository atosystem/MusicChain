'use strict';

const express = require('express');
const fs = require('fs');
const cors = require('cors');

const allowedOrigins = ['http://localhost:3000'];

run().catch((err) => console.log(err));

async function run() {
  const app = express();
  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            'The CORS policy for this site does not ' +
            'allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    })
  );

  app.get('/processupload', async function (req, res) {
    console.log('Got /events');
    let filehash = req.query.h;
    console.log(`Got filehash:${req.query.h}`);
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
    });
    res.flushHeaders();

    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write('retry: 10000\n\n');

    let count = 0;
    res.write(`data: {"status" : "server_get_msg"}\n\n`);

    let tmp_fn = `tmp_files/${filehash}.mp3`;
    downloadAudioIPFS(filehash, tmp_fn);

    res.write(`data: {"status" : "file_downloaded"}\n\n`);

    let spawn = require('child_process').spawn;

    let process_child_rec = spawn('python3', [
      'cover_similarity_engine.py',
      tmp_fn,
    ]);

    process_child_rec.stdout.on('data', (data) => {
      console.log(`[From python engine] ${String(data).trim()}`);
      res.write(`data: ${String(data).trim()}\n\n`);
    });

    process_child_rec.stderr.on('data', (data) => {
      String(data)
        .split('\n')
        .map((x) => {
          console.log(`[ERROR]From python engine ${x}`);
          // res.write(`data: ${x}\n\n`);
        });
    });
  });

  await app.listen(3001);
  console.log('Listening on port 3001');
}

const { create } = require('ipfs-http-client');
const all = require('it-all');
const uint8Array = require('uint8arrays');

const downloadAudioIPFS = async (cid, out_fn) => {
  const node = create('http://host.docker.internal:5001');
  
  const dataArr = uint8Array.concat(await all(node.cat(cid)));

  // Save to disk
  console.log(`Saving file ${out_fn}`);

  fs.appendFileSync(out_fn, Buffer.from(dataArr));
};
