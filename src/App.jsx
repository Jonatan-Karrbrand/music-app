import React, {Component} from 'react';
import './style/app.min.css';
import {FormGroup, FormControl, InputGroup, Glyphicon, Button} from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';
import TopTracks from './top-tracks/Top-tracks.jsx';

import queryString from 'query-string';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      artist: null,
      isLoggedIn: false,
      tracks: [],
      userInfo: {},
      addAnimationClass: true,
      notFirstSearch: false
    }
  }

  render() {
    return (<div className="App">
      {
        this.state.isLoggedIn
          ? <React.Fragment>
            <nav>
              <ul>
                <li>
                  <a href={this.state.userInfo.url}>{this.state.userInfo.name}</a>
                </li>
              </ul>
            </nav>
              <div className="padding-between">
                <h1>Artist information</h1>
                <FormGroup>
                  <InputGroup>
                    <FormControl type="text" className="form" placeholder="Search for an Artist" query={this.state.query} onChange={event => {
                        this.setState({query: event.target.value})
                      }} onKeyPress={event => {
                        return event.key === 'Enter' && this.search();
                      }}/>
                    <InputGroup.Addon onClick={() => this.search()}>
                      <Glyphicon glyph="search"></Glyphicon>
                    </InputGroup.Addon>
                  </InputGroup>
                </FormGroup>
                {
                  this.state.artist !== undefined && this.state.artist !== null
                    ? <div className={(this.state.addAnimationClass ? "fade-in" : "fade-out")}>
                        <Profile artist={this.state.artist}/>
                        <Gallery tracks={this.state.tracks}/>
                      </div>
                    : <div>
                        {
                          this.state.artist === undefined
                            ? <h4>Sorry, dont find any artist with that name</h4>
                            : <div></div>
                        }
                      </div>
                }
              </div>

              <div className="padding-between">
                <TopTracks></TopTracks>
              </div>

            </React.Fragment>
          : <div className="App not-loggedin">
              <h1>You need to loggin</h1>
              <Button onClick={() => this.login()}>Login in</Button>
            </div>
      }
    </div>);
  }

  componentWillMount() {
    const values = queryString.parse(window.location.search);
    const ACCESS_TOKEN = values.access_token;

    if (typeof ACCESS_TOKEN == 'undefined' || '') {
      this.setState({isLoggedIn: false});
    } else {
      this.setState({isLoggedIn: true});

      fetch("https://api.spotify.com/v1/me/", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(json => {

        this.setState({userInfo: {name: json.display_name, url: json.external_urls.spotify} });
      });
    }

  }

  login() {
    window.location = 'http://localhost:8888/login';
  }

  search() {
    if (this.state.notFirstSearch) {

      this.setState({addAnimationClass: false})

      setTimeout(function () {
        this.fetch();
      }.bind(this), 500)
    }
    else {
      this.fetch();
    }
  }
  
  fetch() {
    const values = queryString.parse(window.location.search);
    const ACCESS_TOKEN = values.access_token;

    const BASE_URL = 'https://api.spotify.com/v1/search?';
    let FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1&access_token=${ACCESS_TOKEN}`;
    const ALBUM_URL = 'https://api.spotify.com/v1/artists/';

    fetch(FETCH_URL, {method: 'GET'}).then(response => response.json()).then(json => {

      const artist = json.artists.items[0];
      this.setState({artist});
      FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?market=SE&access_token=${ACCESS_TOKEN}`

      fetch(FETCH_URL, {method: 'GET'}).then(response => response.json()).then(json => {
        const {tracks} = json;
        this.setState({tracks});

        if (this.state.notFirstSearch) {

          setTimeout(function () {
            this.setState({notFirstSearch: true})
            this.setState({addAnimationClass: true})
          }.bind(this), 500)
        }
        else {
          this.setState({notFirstSearch: true})
          this.setState({addAnimationClass: true})
        }

      })
    })
  }

}

export default App;
