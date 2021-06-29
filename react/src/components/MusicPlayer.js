import React, { useState, useEffect } from "react";
import clsx from "clsx";

import {
  makeStyles,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Slider,
  Paper,
  Badge,
  Popover,
  AppBar,
  ListItem,
  Button,
} from "@material-ui/core";

import MusicNoteIcon from "@material-ui/icons/MusicNote";
import ReplayIcon from "@material-ui/icons/Replay";
import SkipPrevious from "@material-ui/icons/SkipPrevious";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import RepeatIcon from "@material-ui/icons/Repeat";
import RepeatOneIcon from "@material-ui/icons/RepeatOne";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import ReorderIcon from "@material-ui/icons/Reorder";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import QueueMusicIcon from "@material-ui/icons/QueueMusic";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";

// const test = [
//   {id: 0, name: "Silence", artist: "Khalid", onChoose: true, onPlay: false, src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/Marshmello%20-%20Silence%20ft.%20Khalid.mp3'},
//   {id: 1, name: "Fireproof", artist: "VAX, Teddy Sky", onChoose: false, onPlay: false, src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/VAX%20-%20Fireproof%20Feat%20Teddy%20Sky.mp3'},
// ]

const useStyles = makeStyles((theme) => ({
  iconPaper: {
    padding: theme.spacing(1.5),
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fafafa",
    borderRadius: theme.spacing(4),
  },
  icon: {
    color: "#909090",
  },
  songInfo: {
    marginLeft: 20,
    width: "36%",
    display: "flex",
    flexDirection: "column",
    color: "#808080",
  },
  sliderInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "#808080",
  },
  songSlider: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    color: "#909090",
  },
  volumeSlider: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "10%",
    color: "#909090",
  },
  playlistPaper: {
    width: 500,
    height: 450,
    backgroundColor: "#FDFAF6",
  },
  listItemPaper: {
    height: "100%",
    width: "100%",
    marginTop: "10%",
    overflowY: "auto",
  },
  playlistTitle: {
    paddingLeft: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCFAFA",
    height: "10%",
  },
  listItem: {
    width: "100%",
    height: "15%",
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    color: "#606060",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#FFEEEE",
    },
  },
  listItem_chosen: {
    backgroundColor: "#FFEEEE",
  },
}));

export default function MusicPlayer(props) {
  const classes = useStyles();
  const [controlState, setControlState] = useState(1);
  const [onplayState, setOnplayState] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const [anchorEl, setAnchorEl] = useState(null);
  const musicList = props.musicList;
  const setMusicList = props.setMusicList;

  const defaultPlaying = musicList.find((m) => m.onChoose === true)
    ? musicList.find((m) => m.onChoose === true)
    : {
        id: "dummy",
        name: "Song name",
        artist: "Song artist",
        onChoose: false,
        onPlay: false,
        src: null,
      };
  const [nowPlaying, setNowPlaying] = useState(defaultPlaying);
  const [audio, setAudio] = useState(new Audio(nowPlaying.src));
  const [durationTime, setDurationTime] = useState(0);
  const [progressTime, setProgressTime] = useState(0);

  useEffect(() => {
    let music = musicList.find((m) => m.onChoose === true);
    if (music) {
      handleSwitchAudio(music);
    }
  }, [defaultPlaying]);

  useEffect(() => {
    audio.onloadedmetadata = () => {
      setDurationTime(audio.duration);
    };
    audio.onloadeddata = () => {
      audio.play();
    };
    audio.ontimeupdate = () => {
      setProgressTime(audio.currentTime);
    };
    audio.onended = () => {
      setProgressTime(0);
      audio.currentTime = 0;
      setOnplayState(false);
    };
  }, [audio]);
  audio.volume = volume;

  const getTime = (timeload) => {
    let min = Math.floor(timeload / 60);
    let sec = Math.floor(timeload % 60);

    if (min < 10) {
      if (sec < 10) {
        return "0" + min + ":0" + sec;
      }
      return "0" + min + ":" + sec;
    } else {
      if (sec < 10) {
        return min + ":0" + sec;
      }
      return min + ":" + sec;
    }
  };

  const handlePlaylistClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePlaylistClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchAudio = (music) => {
    music.id === "dummy" ? setOnplayState(false) : setOnplayState(true);
    audio.pause();
    audio.remove();
    setProgressTime(0);
    setNowPlaying(music);
    setAudio(new Audio(music.src));
    audio.currentTime = 0;
  };

  const playlist_open = Boolean(anchorEl);
  const playlist_id = playlist_open ? "simple-popover" : undefined;

  const useSpinStyles = makeStyles(() => ({
    iconPaper_rotate: {
      animation: "$spin 8s linear infinite",
    },
    "@keyframes spin": {
      "0%": {
        transform: `rotate(-${(audio.currentTime * 45) % 360}deg)`,
      },
      "100%": {
        transform: `rotate(-${360 + ((audio.currentTime * 45) % 360)}deg)`,
      },
    },
  }));
  const spinIconClasses = useSpinStyles();

  document.body.onkeyup = function (event) {
    if (event.keyCode == 32) {
      if (onplayState === false) {
        audio.play();
      } else {
        audio.pause();
      }
      setOnplayState(!onplayState);
    }
  };

  const PlayPauseControl = (onplay, size = "large") => {
    switch (onplay) {
      case false:
        return (
          <Tooltip title="Click to play" aria-label="click to play">
            <IconButton
              edge="start"
              onClick={() => {
                setOnplayState(true);
                let newList = musicList.map((m) => {
                  if (m.id === nowPlaying.id) {
                    m.onPlay = !onplayState;
                  }
                  return m;
                });
                setMusicList(newList);
                audio.play();
              }}
            >
              <PlayCircleFilledIcon fontSize={size} className={classes.icon} />
            </IconButton>
          </Tooltip>
        );
      case true:
        return (
          <Tooltip title="Click to pause" aria-label="click to pause">
            <IconButton
              edge="start"
              onClick={() => {
                setOnplayState(false);
                let newList = musicList.map((m) => {
                  if (m.id === nowPlaying.id) {
                    m.onPlay = !onplayState;
                  }
                  return m;
                });
                setMusicList(newList);
                audio.pause();
              }}
            >
              <PauseCircleFilledIcon fontSize={size} className={classes.icon} />
            </IconButton>
          </Tooltip>
        );
    }
  };

  const SubControls = (control) => {
    switch (control) {
      case 0:
        var id = musicList.findIndex((m) => m.id === nowPlaying.id);
        audio.onended = () => {
          var newList = musicList.map((m) => {
            m.onPlay = true;
            m.onChoose = false;
            if (id !== musicList.length - 1) {
              if (m.id === musicList[id + 1].id) {
                m.onChoose = true;
              }
            }
            if (m.id === nowPlaying.id && m.id !== musicList[id].id) {
              m.onPlay = !onplayState;
            }
            return m;
          });
          setMusicList(newList);
          if (id === musicList.length - 1) {
            setProgressTime(0);
            setDurationTime(0);
            handleSwitchAudio({
              id: "dummy",
              name: "Song name",
              artist: "Song artist",
              onChoose: false,
              onPlay: false,
              src: "",
            });
          }
        };
        return (
          <Tooltip title="Play in order" aria-label="play in order">
            <IconButton
              edge="start"
              onClick={() => {
                setControlState(controlState + 1);
              }}
            >
              <ReorderIcon fontSize="large" className={classes.icon} />
            </IconButton>
          </Tooltip>
        );
      case 1:
        var id = Math.floor(Math.random() * musicList.length);
        audio.onended = () => {
          var newList = musicList.map((m) => {
            m.onPlay = true;
            m.onChoose = false;
            if (m.id === musicList[id].id) {
              m.onChoose = true;
            }
            if (m.id === nowPlaying.id && m.id !== musicList[id].id) {
              m.onPlay = !onplayState;
            }
            return m;
          });
          setMusicList(newList);
          if (newList.length !== 0) {
            audio.pause();
            audio.remove();
            if (nowPlaying.id === musicList[id].id) {
              handleSwitchAudio(musicList[id]);
            }
          } else {
            setProgressTime(0);
            setDurationTime(0);
            handleSwitchAudio({
              id: "dummy",
              name: "Song name",
              artist: "Song artist",
              onChoose: false,
              onPlay: false,
              src: null,
            });
          }
        };
        return (
          <Tooltip title="Shuffle playback" aria-label="shuffle playback">
            <IconButton
              edge="start"
              onClick={() => {
                setControlState(controlState + 1);
              }}
            >
              <ShuffleIcon fontSize="large" className={classes.icon} />
            </IconButton>
          </Tooltip>
        );
      case 2:
        var id = musicList.findIndex((m) => m.id === nowPlaying.id);
        audio.onended = () => {
          var newList = musicList.map((m) => {
            m.onPlay = true;
            m.onChoose = false;
            if (id !== musicList.length - 1) {
              if (m.id === musicList[id + 1].id) {
                m.onChoose = true;
              }
            } else {
              if (m.id === musicList[0].id) {
                m.onChoose = true;
              }
            }
            if (m.id === nowPlaying.id && m.id !== musicList[id].id) {
              m.onPlay = !onplayState;
            }
            return m;
          });
          setMusicList(newList);
          if (newList.length === 0) {
            setProgressTime(0);
            setDurationTime(0);
            handleSwitchAudio({
              id: "dummy",
              name: "Song name",
              artist: "Song artist",
              onChoose: false,
              onPlay: false,
              src: null,
            });
          } else if (newList.length === 1) {
            handleSwitchAudio(musicList[0]);
          }
        };
        return (
          <Tooltip title="List loop" aria-label="list loop">
            <IconButton
              edge="start"
              onClick={() => {
                setControlState(controlState + 1);
              }}
            >
              <RepeatIcon fontSize="large" className={classes.icon} />
            </IconButton>
          </Tooltip>
        );
      case 3:
        audio.onended = () => {
          audio.pause();
          setProgressTime(0);
          setOnplayState(true);
          audio.currentTime = 0;
          audio.play();
        };
        return (
          <Tooltip title="Single loop" aria-label="single loop">
            <IconButton
              edge="start"
              onClick={() => {
                setControlState(0);
              }}
            >
              <RepeatOneIcon fontSize="large" className={classes.icon} />
            </IconButton>
          </Tooltip>
        );
    }
  };

  return (
    <Toolbar>
      {/* <Button
        onClick={() => {
          let music = {
            id: test[0].id,
            name: test[0].name,
            artist: test[0].artist,
            onChoose: true, 
            onPlay: true, 
            src: test[0].src,
          }
          let newList = musicList.map(m => {
            m.onPlay = true;
            m.onChoose = false;
            return m;
          })
          setMusicList([...newList, music]);
        }} 
      >
        click 1
      </Button>
      <Button
        onClick={() => {
          let music = {
            id: test[1].id,
            name: test[1].name,
            artist: test[1].artist,
            onChoose: true, 
            onPlay: true, 
            src: test[1].src,
          }
          let newList = musicList.map(m => {
            m.onPlay = true;
            m.onChoose = false;
            return m;
          })
          setMusicList([...newList, music]);
        }} 
      >
        click 2
      </Button> */}
      <Paper
        className={clsx(
          classes.iconPaper,
          onplayState && spinIconClasses.iconPaper_rotate
        )}
        style={{
          transform: `rotate(-${(audio.currentTime * 45) % 360}deg)`,
        }}
      >
        <MusicNoteIcon className={classes.icon} />
      </Paper>

      <div className={classes.songInfo}>
        <Typography>
          {nowPlaying.name} - {nowPlaying.artist}
        </Typography>

        <div className={classes.sliderInfo}>
          <span>{getTime(progressTime)}</span>
          <Slider
            min={0}
            value={progressTime}
            max={durationTime}
            onChange={(_, newValue) => {
              setProgressTime(newValue);
              audio.currentTime = newValue;
            }}
            className={classes.songSlider}
            aria-labelledby="continuous-slider"
          />
          <span>{getTime(durationTime)}</span>
        </div>
      </div>

      <Paper style={{ width: "4%" }}></Paper>

      <Tooltip title="Replay" aria-label="click to replay">
        <IconButton
          edge="start"
          onClick={() => {
            audio.pause();
            setProgressTime(0);
            setOnplayState(true);
            audio.currentTime = 0;
            audio.play();
          }}
        >
          <ReplayIcon fontSize="large" className={classes.icon} />
        </IconButton>
      </Tooltip>

      {nowPlaying.id === "dummy" || musicList.length === 0 ? (
        <IconButton
          edge="start"
          disabled={nowPlaying.id === "dummy" || musicList.length === 0}
        >
          <SkipPrevious fontSize="large" className={classes.icon} />
        </IconButton>
      ) : (
        <Tooltip title="Previous track" aria-label="skip to previous">
          <IconButton
            edge="start"
            onClick={() => {
              let id = musicList.findIndex((m) => m.id === nowPlaying.id);
              let music =
                id === 0 ? musicList[musicList.length - 1] : musicList[id - 1];
              let newList = musicList.map((m) => {
                m.onPlay = true;
                m.onChoose = false;
                if (m.id === music.id) {
                  m.onChoose = true;
                }
                if (m.id === nowPlaying.id && m.id !== music.id) {
                  m.onPlay = !onplayState;
                }
                return m;
              });
              setMusicList(newList);
              if (nowPlaying.id === music.id) {
                handleSwitchAudio(music);
              }
            }}
          >
            <SkipPrevious fontSize="large" className={classes.icon} />
          </IconButton>
        </Tooltip>
      )}

      {PlayPauseControl(onplayState)}

      {nowPlaying.id === "dummy" || musicList.length === 0 ? (
        <IconButton
          edge="start"
          disabled={nowPlaying.id === "dummy" || musicList.length === 0}
        >
          <SkipNextIcon fontSize="large" className={classes.icon} />
        </IconButton>
      ) : (
        <Tooltip title="Next track" aria-label="skip to next">
          <IconButton
            edge="start"
            onClick={() => {
              let id = musicList.findIndex((m) => m.id === nowPlaying.id);
              let music =
                id === musicList.length - 1 ? musicList[0] : musicList[id + 1];
              let newList = musicList.map((m) => {
                m.onPlay = true;
                m.onChoose = false;
                if (m.id === music.id) {
                  m.onChoose = true;
                }
                if (m.id === nowPlaying.id && m.id !== music.id) {
                  m.onPlay = !onplayState;
                }
                return m;
              });
              setMusicList(newList);
              if (nowPlaying.id === music.id) {
                handleSwitchAudio(music);
              }
            }}
          >
            <SkipNextIcon fontSize="large" className={classes.icon} />
          </IconButton>
        </Tooltip>
      )}

      {SubControls(controlState)}

      <Paper style={{ width: "3%" }}></Paper>

      <VolumeDownIcon fontSize="large" className={classes.icon} />
      <Slider
        className={classes.volumeSlider}
        min={0}
        step={0.02}
        max={1}
        value={volume}
        onChange={(_, newValue) => {
          setVolume(newValue);
        }}
        aria-labelledby="continuous-slider"
      />
      <VolumeUpIcon fontSize="large" className={classes.icon} />

      <Paper style={{ width: "3%" }}></Paper>

      <Tooltip title="Playlists" aria-label="playlists">
        <IconButton
          edge="start"
          aria-describedby={playlist_id}
          onClick={(event) => {
            handlePlaylistClick(event);
          }}
        >
          <Badge
            badgeContent={musicList.length}
            color="secondary"
            style={{
              backgroundColor: "#eaeaea",
              borderRadius: "12px",
              padding: "2px",
            }}
            showZero
          >
            <QueueMusicIcon fontSize="large" className={classes.icon} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        id={playlist_id}
        open={playlist_open}
        anchorEl={anchorEl}
        onClose={() => {
          handlePlaylistClose();
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Paper className={classes.playlistPaper}>
          <AppBar position="absolute" className={classes.playlistTitle}>
            <Typography
              component="h2"
              variant="h6"
              color="inherit"
              noWrap
              style={{ color: "#808080", flexGrow: 1 }}
            >
              Playlists / {musicList.length}
            </Typography>

            <Tooltip title="Delete audio lists" aria-label="delete audio lists">
              <IconButton
                edge="start"
                onClick={() => {
                  // Fix
                  audio.pause();
                  audio.remove();
                  setProgressTime(0);
                  setDurationTime(0);
                  handleSwitchAudio({
                    id: "dummy",
                    name: "Song name",
                    artist: "Song artist",
                    onChoose: false,
                    onPlay: false,
                    src: null,
                  });
                  setMusicList([]);
                }}
              >
                <DeleteIcon className={classes.icon} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Close Playlists" aria-label="close lists">
              <IconButton
                edge="start"
                onClick={() => {
                  setAnchorEl(null);
                }}
              >
                <CloseIcon className={classes.icon} />
              </IconButton>
            </Tooltip>
          </AppBar>

          <div className={classes.listItemPaper}>
            {musicList.map((music) => {
              return (
                <div
                  key={music.id}
                  button="true"
                  className={clsx(
                    classes.listItem,
                    music.onChoose && classes.listItem_chosen
                  )}
                >
                  <ListItem
                    style={{ height: "100%" }}
                    onClick={() => {
                      let newList = musicList.map((m) => {
                        m.onPlay = true;
                        m.onChoose = false;
                        if (m.id === music.id) {
                          m.onChoose = true;
                        }
                        if (m.id === nowPlaying.id) {
                          m.onPlay = !onplayState;
                        }
                        return m;
                      });
                      setMusicList(newList);
                      if (nowPlaying.id === music.id) {
                        if (onplayState) {
                          setOnplayState(false);
                          audio.pause();
                        } else {
                          setOnplayState(true);
                          audio.play();
                        }
                      }
                    }}
                  >
                    {music.onChoose ? (
                      !music.onPlay ? (
                        <PlayCircleFilledIcon
                          style={{ position: "absolute", width: "5%" }}
                          className={classes.icon}
                        />
                      ) : (
                        <PauseCircleFilledIcon
                          style={{ position: "absolute", width: "5%" }}
                          className={classes.icon}
                        />
                      )
                    ) : null}

                    <Typography
                      noWrap
                      style={{
                        width: "50%",
                        marginLeft: "10%",
                        marginRight: "10%",
                      }}
                    >
                      {music.name}
                    </Typography>

                    <Typography
                      noWrap
                      style={{
                        width: "25%",
                        marginRight: "5%",
                      }}
                    >
                      {music.artist}
                    </Typography>
                  </ListItem>

                  {music.id === nowPlaying.id ? null : (
                    <Tooltip
                      title="Click to delete"
                      aria-label="click to delete"
                    >
                      <IconButton
                        edge="start"
                        onClick={() => {
                          let newList = musicList.filter(
                            (m) => m.id !== music.id
                          );
                          console.log(newList);
                          setMusicList(newList);
                        }}
                      >
                        <CloseIcon fontSize="small" className={classes.icon} />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              );
            })}
          </div>
        </Paper>
      </Popover>

      <Paper style={{ width: "7%" }}></Paper>

      {/* <Tooltip title="Close" aria-label="close">
        <IconButton
          edge="end"
          onClick={() => {

          }}
        >
          <CloseIcon className={classes.icon}/>
        </IconButton>
      </Tooltip> */}
    </Toolbar>
  );
}
