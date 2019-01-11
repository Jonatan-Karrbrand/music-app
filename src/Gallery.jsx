import React, { Component } from 'react';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playingUrl: '',
      audio: null,
      playing: false,
      hasNoPreview: false
    }
  }

  render() {
    const { tracks } = this.props;
    return (
      <div>
        { this.state.hasNoPreview
          && <h4>Ops, this song doesn't have any preview</h4>
        }
        {tracks.map((track, key) => {
          return (
            <div
              key={key}
              className="track"
              onClick={() => this.playAudio(track.preview_url)}
              >
              <img
                src={track.album.images[0].url}
                className="track-img"
                alt="track"
                />
              <div className="track-play">
                <div className={"track-play-inner " + (this.state.playing === true && this.state.playingUrl === track.preview_url ? "track-is-playing" : '')}>
                  {
                    this.state.playing === true && this.state.playingUrl === track.preview_url
                    ? <span>&#10074; &#10074;</span>
                    : <span>&#9654;</span>
                  }
                </div>
              </div>
              <p className="track-text changed-bottom">
                {track.name}
              </p>
            </div>
          )}
        )}
      </div>
    );
  }

  playAudio(previewUrl) {
    if (!previewUrl) {
      this.setState({hasNoPreview: true})
    }
    else {
      this.setState({hasNoPreview: false})

      let audio = new Audio(previewUrl);
      if (!this.state.playing) {
        audio.play();
        this.setState({
          playing: true,
          playingUrl: previewUrl,
          audio
        })
      }
      else {
        if (this.state.playingUrl === previewUrl) {
          this.state.audio.pause();
          this.setState({
            playing: false
          })
        }
        else {
          this.state.audio.pause();
          audio.play();
          this.setState({
            playing: true,
            playingUrl: previewUrl,
            audio
          })
        }
      }
    }
  }

}

export default Gallery;
