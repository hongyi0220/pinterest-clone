import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
    state = {
        pin: null
    }

    highlightPin = e => {
        if (e) console.log(e.target.id);
        this.setState({ pin: e ? e.target.id : null });
    }

    render() {
        const { images } = this.props;
        const { pin } = this.state;

        return (
            <div className='wall-page-container'>
                <div className="wall">
                    {images ?
                        images.map((img, i) => <div id={`pin-${i}`} key={i} className='img-container' onMouseEnter={e=>{console.log('entering'); this.highlightPin(e)}} onMouseLeave={e=>{console.log('leaving'); this.highlightPin(null)}}>
                            <div id={`pin-${i}`} className={pin === `pin-${i}` ? 'img-overlay on': 'img-overlay'}>

                            </div>
                            <img src={img.src} />
                        </div>) : ''
                    }
                </div>
            </div>
        );
    }
}

export default WallPage;
