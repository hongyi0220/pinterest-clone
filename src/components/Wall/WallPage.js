import React from 'react';
import PropTypes from 'prop-types';

class WallPage extends React.Component {
    state = {
        pindex: null
    };
    static propTypes = {
        storeImgs: PropTypes.func.isRequired,
        account: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired
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

    // processTags = user => {
    //     console.log('processing tags');
    //     const aggregateTags = user => user.pins.reduce((currPin, nextPin) => [...currPin, ...nextPin.tags], []);
    //
    //     const beautifyTags = tags => tags.map(tag => tag.toString().trim().toLowerCase()).sort();
    //
    //     // This will count how many times a tag is saved
    //     //     so top tags can be analyzed
    //     const analyzeTags = tags => {
    //         let holdIndex = 0;
    //         return tags.map((tag, i, _tags) => {
    //             if (tag === tags[i + 1]) {
    //                 holdIndex = i;
    //                 if (i === holdIndex) {
    //                     return { tag, score: 2 };
    //                 } else {
    //                     _tags[i].score++;
    //                 }
    //             }
    //         })
    //         filter(tag => typeof tag === 'object')
    //         .sort((a, b) => a.score - b.score);
    //     }
    //     const result = analyzeTags(beautifyTags(aggregateTags(user)));
    //     console.log('processing complete; result:', result);
    //     return result;
    // }

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

    filterPinsMatchingTopTags = pins => pins.filter(pin => {
        // console.log('pin.tags:', pin.tags);
        return this.props.imgs.topTags.some(topTag => {
            // console.log('topTag:', topTag.tag);
            // console.log('tags include topTag?', pin.tags.includes(topTag.tag));
            return pin.tags.includes(topTag.tag);
        });

    });
    // pins.filter(pin => this.props.imgs.topTags.some(topTag => pin.tags.includes(topTag.tag)));

    componentWillMount() {
        // const { imgs } = this.props.imgs;
        console.log('WallPage will mounted');
        this.getAllUsersWithPins()
            .then(users => this.extractPins(users))
            // .then(pins => {
            //
            //     return pins.filter(pin => {
            //         console.log('pin.tags:', pin.tags);
            //         return this.props.imgs.topTags.some(topTag => {
            //             console.log('topTag:', topTag.tag);
            //             console.log('tags include topTag?', pin.tags.includes(topTag.tag));
            //             return pin.tags.includes(topTag.tag);
            //         });
            //
            //     });
            // })
            .then(pins => this.filterPinsMatchingTopTags(pins))
            .then(topPins => {
                console.log('topPins:', topPins);

                // if (topPins.length < 60)



                return this.shuffleArr(topPins);
            })
            .then(curatedPins => this.props.storeImgs(curatedPins))
            .catch(err => console.log(err));
    }

    render() {
        const { imgs, ui } = this.props;
        const { pindex } = this.state;

        return (
            <div className='wall-page-container'>
                <div className="wall">
                    {imgs.search ?
                        imgs.search.map((img, i) => <div id={`pin-${i}`} key={i} className='img-container' onMouseEnter={e=>{console.log('entering'); this.highlightPin(e)}} onMouseLeave={e=>{console.log('leaving'); this.highlightPin(null)}}>
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
                <div className={ui.fetchingPics ? 'loading-icon on' : 'loading-icon'} >
                    <svg>
                        <circle cx='35%' cy='35%'/>
                        <circle cx='65%' cy='35%'/>
                        <circle cx='35%' cy='65%'/>
                        <circle cx='65%' cy='65%'/>
                    </svg>
                </div>
            </div>
        );
    }
}

export default WallPage;
