import React, { PureComponent } from 'react';
import '../style/components/get-recommendation.min.css';
import '../style/components/app.min.css';
import queryString from 'query-string';
import AddToPLaylist from './Add-to-playlist.jsx';

import leftArrow from'../resources/images/arrow-alt-circle-left-solid.svg';
import rightArrow from'../resources/images/arrow-alt-circle-right-solid.svg';

class GetRecommendation extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      playingUrl: '',
      audio: null,
      playing: false,
      playlistLength: 20,
      tracks: [],
      tracksId: [],
      artists: [],
      artistsId: [],
      hasNoPreview: false,
      recommendedTracks: undefined,
      timeRange: 'medium',
      trackListPosition: 0,
      addAnimationClass: true
    }
  }

  render() {
    var recommendedTrack = this.state.recommendedTracks;
    var position = this.state.trackListPosition;

    return (
      <React.Fragment>
        { recommendedTrack ?
          <div className="get-recommendation-component">

            <h2 className="mb-4">Find your new favorite</h2>
            { this.state.hasNoPreview
              && <h4 className="error-message">Ops, this song doesn't have any preview</h4>
            }
            <div className="row d-flex align-items-center">

              <div className="col-4">
                <div className="track recommended-track">
                  <div
                    key='1'
                    className={(!this.state.firstSearch ? (this.state.addAnimationClass ? "bounce-in-top" : "scale-out-center") : '')}
                    onClick={() => this.playAudio(recommendedTrack.tracks[position].preview_url)}
                    >

                    <img
                      src={recommendedTrack.tracks[position].album.images[1].url}
                      className="track-img recommended-track-img"
                      alt="track"
                      />

                    <div className="track-play recommended-track-play">
                      <div className={"track-play-inner recommended-track-play-inner " + (this.state.playing === true && this.state.playingUrl === recommendedTrack.tracks[position].preview_url ? "track-is-playing" : '')}>
                        {
                          this.state.playing === true && this.state.playingUrl === recommendedTrack.tracks[position].preview_url
                          ? <span>&#10074; &#10074;</span>
                          : <span>&#9654;</span>
                        }
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className="col-4 text-center music-info">
                <h4 className="font-weight-bold text-primary"><a target="_blank" href={recommendedTrack.tracks[position].external_urls.spotify}>{recommendedTrack.tracks[position].name}</a></h4>
                <h5><a target="_blank" href={recommendedTrack.tracks[position].artists[0].external_urls.spotify}>{recommendedTrack.tracks[position].artists[0].name}</a></h5>
              </div>

              <div className="col-4 music-controls">
                  <div>
                    <h5>{position + 1 + " / " + this.state.playlistLength}</h5>
                  </div>
                  <div>
                    <img src={leftArrow}
                      className="mr-2"
                      alt="Left arrow"
                      onClick={() => { this.changeSong('backwards'); }}
                      />

                    <img src={rightArrow}
                      className="ml-2"
                      alt="Right arrow"
                      onClick={() => { this.changeSong('forwards'); }}
                      />
                  </div>
                  <div>
                    <AddToPLaylist></AddToPLaylist>
                  </div>
              </div>

            </div>
          </div>
          :
          <div>Ingen data hittades</div>
        }
      </React.Fragment>
    );
  }

  changeSong(direction) {
    var recommendedTrack = this.state.recommendedTracks;
    var position = this.state.trackListPosition;
    var length = recommendedTrack.tracks.length - 1;

    // Backwards
    if (direction === 'backwards') {

      if (position === 0) {
        this.setState({trackListPosition: length})
        this.playAudio(recommendedTrack.tracks[length].preview_url)
      }
      else {
        this.setState({trackListPosition: position - 1})
        this.playAudio(recommendedTrack.tracks[position - 1].preview_url)
      }
    }
    // Forwards
    if (direction === 'forwards') {

      if (position === length) {
        this.setState({trackListPosition: 0})
        this.playAudio(recommendedTrack.tracks[0].preview_url)
      }
      else {
        this.setState({trackListPosition: position + 1})
        this.playAudio(recommendedTrack.tracks[position + 1].preview_url)
      }
    }
  }

  search() {
    const values = queryString.parse(window.location.search);
    const ACCESS_TOKEN = values.access_token;

    fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${this.state.timeRange}_term&limit=2&offset=0`, {
      headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(json => {
      this.setState({artists: json.items});

      fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${this.state.timeRange}_term&limit=2&offset=0`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(json => {
        this.setState({tracks: json.items});

        if (this.state.tracks !== undefined && this.state.artists !== undefined) {
          this.getPlaylist();
        }

      })

    })
  }

  getPlaylist() {
    const values = queryString.parse(window.location.search);
    const ACCESS_TOKEN = values.access_token;

    // Convert tracks and artists to list with IDs
    this.state.tracks.map((track) => {
      return(
        this.setState({tracksId: this.state.tracksId + track.id + ','})
      )
    });

    this.state.artists.map((artist) => {
      return(
        this.setState({artistsId: this.state.artistsId + artist.id + ','})
      )
    });

    fetch(`https://api.spotify.com/v1/recommendations?limit=${this.state.playlistLength}&market=SE&seed_artists=${this.state.artistsId}&seed_tracks=${this.state.tracksId}&min_energy=0.4&min_popularity=20`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(json => {
      this.setState({recommendedTracks: json});
    })
  }

  playAudio(previewUrl) {
    let audio = new Audio(previewUrl);
    audio.volume = this.props.musicVolume;

    if (!previewUrl) {
      if (this.state.audio !== null) {      
        this.state.audio.pause();
      }
      this.setState({hasNoPreview: true, playing: false})
    }
    else {
      this.setState({hasNoPreview: false})

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

  componentWillMount() {
    this.search();
  }

}

export default GetRecommendation;
