import React, { Component } from 'react';
import '../style/components/get-recommendation.min.css';
import '../style/components/app.min.css';
import queryString from 'query-string';
import {ButtonToolbar,ToggleButtonGroup, ToggleButton} from 'react-bootstrap';


class AddToPlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
{/*        <ButtonToolbar>
         <ToggleButtonGroup  className="options mx-auto" defaultValue={2} type="radio" name="options">
           <ToggleButton onClick={() => this.search('short')} className="option-button mt-3" value={1}>Add to playlist</ToggleButton>
         </ToggleButtonGroup>
       </ButtonToolbar>*/}
       <button onClick={() => this.search('short')} className="my-btn-primary mt-3">
          Add to playlist
       </button>
      </div>
    );
  }

}

export default AddToPlaylist;
