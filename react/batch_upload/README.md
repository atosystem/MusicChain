## Batch Upload Music
1. Download all the music file folder to `react/batch_upload/music`
2. Right Click on anywhere in ganache

    ![](https://i.imgur.com/r23JSb4.png)
3. Click on **Inspect**

    ![](https://i.imgur.com/uamKo73.jpg)
4. Right click on `<div id="app">`

    ![](https://i.imgur.com/xICaySG.png)

5. select **Edit as HTML** and copy all the html codes

    ![](https://i.imgur.com/tlAarYJ.jpg)

6. Run ```$ bash uploadBatch.sh```
    
    The result should be as the following:
    ![](https://i.imgur.com/JBUttVx.png)
    ...
    ![](https://i.imgur.com/uqhrpeW.png)



    
    if you see something like this:
    ![](https://i.imgur.com/0l1COT3.png)
    
    You should copy the html codes from ganache again.
7. Go to test page `http://localhost:3000/test` and click **Chose file** to upload `react/batch_upload/song_entries.json`

    ![](https://i.imgur.com/JkpKEXO.png)
8. Click **Batch Upload**

