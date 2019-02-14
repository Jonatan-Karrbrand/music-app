import React, { PureComponent } from 'react';
import '../style/components/app.min.css';
import queryString from 'query-string';
import {ButtonToolbar,ToggleButtonGroup, ToggleButton} from 'react-bootstrap';

class TopTracks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playingUrl: '',
      audio: null,
      playing: false,
      topTracks: [],
      hasNoPreview: false,
      topArtists: [],
      timeRange: 'medium',
      addAnimationClass: true,
      firstSearch: true
    }
  }


  render() {
    return (
      <div>
        <h2>Your top tracks and artists</h2>
          <div>
            <h5>Time range</h5>
             <ButtonToolbar>
              <ToggleButtonGroup  className="options mx-auto" defaultValue={2} type="radio" name="options">
                <ToggleButton onClick={() => this.search('short')} className="option-button" value={1}>Short</ToggleButton>
                <ToggleButton onClick={() => this.search('medium')} className="option-button" value={2}>Medium</ToggleButton>
                <ToggleButton onClick={() => this.search('long')} className="option-button" value={3}>Long</ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>
          </div>

        {this.state.topArtists.map((artist, key) => {
          return (
            <div className="artist">
              <div className={(!this.state.firstSearch ? (this.state.addAnimationClass ? "bounce-in-top" : "scale-out-center") : '')}>
                <a href={artist.external_urls.spotify}>
                  <img
                    alt="Profile"
                    className="profile-img"
                    src={artist.images[2].url}
                  />
                  <p>{artist.name}</p>
                </a>
              </div>
            </div>
          )
        })
        }

        <br/>
        { this.state.hasNoPreview
          && <h4 className="error-message">Ops, this song doesn't have any preview</h4>
        }
        {this.state.topTracks.map((track, key) => {
          const trackImg = track.album.images[0].url;
          return (
            <div className="track">
              <div
                key={key}
                className={(!this.state.firstSearch ? (this.state.addAnimationClass ? "bounce-in-top" : "scale-out-center") : '')}
                onClick={() => this.playAudio(track.preview_url)}
                >
                <img
                  src={trackImg}
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
                <p className={(this.state.firstSearch ? "changed-bottom track-text" : "track-text")} >
                  {track.name}
                </p>
              </div>
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



  search(event) {
    if (typeof event !== 'undefined') {
      this.setState({firstSearch: false})
      this.setState({timeRange: event})
      this.setState({addAnimationClass: false})
    }

    const values = queryString.parse(window.location.search);
    const ACCESS_TOKEN = values.access_token;

    fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${this.state.timeRange}_term&limit=5&offset=0`, {
      headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(json => {
      this.setState({topArtists: json.items});

      fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${this.state.timeRange}_term&limit=10&offset=0`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(json => {
        this.setState({topTracks: json.items});

            setTimeout(function () {

            this.setState({addAnimationClass: true})
          }.bind(this), 600)

      })

    })
  }
  componentWillMount() {
    this.search();
  }
}

export default TopTracks;
