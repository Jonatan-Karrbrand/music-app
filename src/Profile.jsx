import React, { Component } from 'react';
import './style/app.min.css'

class Profile extends Component {

  render() {
    let artist = {name: '', followers: {total: ''}, images: [{url: ''}], genres: []};
    artist = this.props.artist !== null ? this.props.artist : artist;

    return (
      <div className="profile">
        <a href={artist.external_urls.spotify}>
        <img
          alt="Profile"
          className="profile-img"
          src={artist.images[2].url}
        />
        </a>
        <div className="profile-info">
          <h2 className="profile-name">{artist.name}</h2>
          <div className="profile-followers">
            {artist.followers.total} followers
          </div>
          <div className="profile-genres">
          {
            artist.genres.map((genre, key) => {
              genre = genre !== artist.genres[artist.genres.length-1]
                            ? ` ${genre},`
                            : ` & ${genre}`;
              return <span key={key}>{genre}</span>;
            })
          }
          </div>
        </div>
      </div>
    );
  }

}

export default Profile;
