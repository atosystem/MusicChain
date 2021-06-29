# Cover Song Backend Engine (for docker)

## Prerequisite
1. set up python environment
- For linux
    ```
    pip install essentia
    pip install -r requirements.txt
    ```
- For mac (please use python 3.9)
    
    install package using homwbrew
    ```
    brew tap MTG/essentia
    brew install essentia --HEAD
    ```
    change .so file name
    ```
    cd /usr/local/Cellar/essentia/HEAD-90d3814/lib/python3.9/site-packages/essentia/
    mv _essentia.cpython-39-darwin.so _essentia.so
    ```
    create link to your python site-packages (using pyenv for example)
    ```
    ln -s  /usr/local/Cellar/essentia/HEAD-90d3814/lib/python3.9/site-packages/essentia .pyenv/versions/3.9.0/lib/python3.9/site-packages/
    ```
    install packages
    ```
    pip install -r requirements.txt
    ```

- for details, see https://essentia.upf.edu/installing.html

2. set up node environment
    ```
    npm i
    ```

## Start our backend
```
npm start
```
our backend listen on port 3001

## Clear all data
```
./reset.sh
```