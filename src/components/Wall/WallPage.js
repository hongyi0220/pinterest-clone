import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
    state = {
        pindex: null
    };
    static propTypes = {
        storeImgs: PropTypes.func.isRequired
    };

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

    getAllUsersWithPins = () => {
        return fetch('/pins',{
            credentials: 'include'
        })
        .then(res => res.json())
        .then(resJson => resJson)
        .catch(err => console.log(err));
    }

    extractPins = users => {
        return users.map(user => user.pins).reduce((currPins, nextPins) => [...currPins, ...nextPins], []);
    }

    shuffleArr = arr => {
        let result = [];
        let ns = [...arr];
        const helper = ns => {
            if (!ns.length) { return; }
            const randomIndex = Math.floor(Math.random() * ns.length);
            result.push(ns[randomIndex]);
            ns.splice(randomIndex, 1);
            helper(ns);
        }
        helper(ns);
        return result;
    };

    componentWillMount() {
        console.log('WallPage mounted');
        this.getAllUsersWithPins()
            .then(users => this.extractPins(users))
            .then(pins => this.shuffleArr(pins))
            .then(shuffledPins => this.props.storeImgs(shuffledPins))
            .catch(err => console.log(err));
    }

    render() {
        const { imgs } = this.props;
        const { pindex } = this.state;

        return (
            <div className='wall-page-container'>
                <div className="wall">
                    {imgs ?
                        imgs.map((img, i) => <div id={`pin-${i}`} key={i} className='img-container' onMouseEnter={e=>{console.log('entering'); this.highlightPin(e)}} onMouseLeave={e=>{console.log('leaving'); this.highlightPin(null)}}>
                            <div id={`pin-${i}`} className={pindex === `pin-${i}` ? 'img-overlay on': 'img-overlay'}>
                                <div className="action-button">
                                    <img src="./images/pin.png" alt="" className="pin"/>
                                    <div className='action-button-text' onClick={this.savePin}>Save</div>
                                </div>
                                <div className="share-button"></div>
                            </div>
                            <img className='wall-img' src={img.src} onError={e => e.target.src = './images/default-no-img.jpg'}/>
                        </div>) : <div className="no-imgs-msg-wrapper">No images found</div>
                    }
                </div>
            </div>
        );
    }
}

export default WallPage;
