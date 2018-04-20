import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
    state = {
        pindex: null
    }

    highlightPin = e => {
        if (e) console.log(e.target.id);
        this.setState({ pindex: e ? e.target.id : null });
    }

    savePin = () => {
        const { pindex } = this.state;
        console.log(`/save-pindex/${pindex.split('-')[1]}`);
        fetch(`/pin?pindex=${pindex.split('-')[1]}`, {credentials: 'include'})
        .catch(err => console.log(err));
    }
    render() {
        const { images } = this.props;
        const { pindex } = this.state;

        return (
            <div className='wall-page-container'>
                <div className="wall">
                    {images ?
                        images.map((img, i) => <div id={`pin-${i}`} key={i} className='img-container' onMouseEnter={e=>{console.log('entering'); this.highlightPin(e)}} onMouseLeave={e=>{console.log('leaving'); this.highlightPin(null)}}>
                            <div id={`pin-${i}`} className={pindex === `pin-${i}` ? 'img-overlay on': 'img-overlay'}>
                                <div className="action-button">
                                    <img src="./images/pin.png" alt="" className="pin"/>
                                    <div className='action-button-text' onClick={this.savePin}>Save</div>
                                </div>
                                <div className="share-button"></div>
                            </div>
                            <img className='wall-img' src={img.src} />
                        </div>) : ''
                    }
                </div>
            </div>
        );
    }
}

export default WallPage;
