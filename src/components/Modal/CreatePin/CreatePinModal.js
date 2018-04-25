import React from 'react';
import PropTypes from 'prop-types';

class CreatePinModal extends React.Component {
    state = {
        tempTagInput: '',
        tags: [],
        isTagInputDisabled: false,
        previewImg: null,
        imgFile: null,
        isSaveFromSiteClicked: true,
        saveFromSiteURL: ''
    };
    static propTypes = {
        history: PropTypes.object.isRequired,
        toggleModal: PropTypes.func.isRequired
    };
    inputTypeFile = null;

    handleImageUpload = e => {

        const imgFile = e.target.files[0];
        const previewImg = URL.createObjectURL(imgFile);
        this.setState({ previewImg, imgFile });
    }

    formatURL = url => {
        let result;
        if (!/^https?/i.test(url)) {
            console.log('no http(s), attaching one');
            result = `http://${url}`;
        }
        while (/[/]$/.test(result)) {
            result = result.slice(0, result.length - 1);
        }
        return result;
    }

    formatImgSrc = (rootDomain, src) => {
        if (/(^https?:|^[/]{2})/i.test(src)) {
            return src;
        } else if (/^[/]{1}/.test(src)) {
            return rootDomain + src;
        } else {
            return `${rootDomain}/${src}`
        }
    }

    closeModal = () => {
        console.log('closing modal');
        this.props.toggleModal(false);
    }

    submitForm = () => {
        const { tags, imgFile, saveFromSiteURL } = this.state;

        if (saveFromSiteURL) {
            console.log('saveFromSiteURL:',saveFromSiteURL);
            const isValidDomain = /\.{1}(?=\w{2,})/i;
            const isValidImgFile = /\.{1}(?=jpg|jpeg|png|gif)^/i;

            if (isValidImgFile.test(saveFromSiteURL)) {
                console.log('isValidImgFile');
                fetch('/pic', {
                    method: 'put',
                    headers: {
                        'content-type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ pic: { src: saveFromSiteURL, tags: [] } })
                })
                .then(res => {
                    console.log('res after save pin:', res);
                    return res.json();
                })
                .then(resJson => {
                    if (!resJson.matchedCount) {
                        this.props.openMsgModal('Error!', 'Something went wrong on our side');
                    } else if (resJson.matchedCount && resJson.modifiedCount) {
                        this.props.openMsgModal('Pin saved!', 'Your Pin has been saved successfully.');
                    }
                })
                .catch(err => console.log(err));

            } else if (isValidDomain.test(saveFromSiteURL)) {
                console.log('isValidDomain fetching html...');

                const url = this.formatURL(saveFromSiteURL);
                const proxyurl = "https://cors-anywhere.herokuapp.com/";
                fetch(proxyurl + url)
                .then(res => res.text())
                .then(resTxt => {
                    console.log('res after fetching from vaildDomain:',resTxt);
                    const htmlDoc = this.parseHTML(resTxt)
                    const imgs = this.getAllImgSrcs(htmlDoc).map(img => {

                        if (img.src) {
                            return {
                                src: this.formatImgSrc(url, img.src),
                                tags: img.tags
                            };
                        }
                    })
                    // Display imgs scraped from the URL on wall @ route: /find
                    console.log('imgsArr:', imgs);
                    console.log('storeImgs triggered');
                    this.props.storeImgs(imgs);
                    fetch('/session', {
                        method: 'post',
                        credentials: 'include',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({ imgs })
                    });

                    console.log('this :', this);
                    console.log('navigating to /find');
                    this.props.history.push('/find');
                    // this.closeModal(); 
                    this.props.toggleModal(false);
                    console.log('toggling modal..');
                    // this.props.openMsgModal('Pin saved!', 'Your Pin has been saved successfully.');
                })
                .catch(err => {
                    console.log(err);
                    // console.log('this :', this)
                    this.props.openMsgModal('Error!', 'Something went wrong on our side')
                });
            }
        } else { // upload img from drag & drop component
            let formData = new FormData();
            formData.append('imgFile', imgFile);
            formData.append('tags', tags)


            fetch('/pic', {
                method: 'post',
                credentials: 'include',
                body: formData
            })
            .then(res => {
                console.log('res after save pin from dragg & drop:', res);
                return res.json();
            })
            .then(resJson => {
                if (!resJson.matchedCount) {
                    this.props.openMsgModal('Error!', 'Something went wrong on our side');
                } else if (resJson.matchedCount && resJson.modifiedCount) {
                    this.props.openMsgModal('Pin saved!', 'Your Pin has been saved successfully.');
                }
            })
            .catch(err => console.log(err));
        }
    }

    parseHTML = html => {
        console.log('parseHTML triggered');
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        console.log('doc after parsing:', doc);
        return doc;
    }

    getAllImgSrcs = doc => {
        console.log('getAllImgSrcs triggered');
        const imgs = doc.getElementsByTagName('img');
        console.log('imgs:', imgs);
        return Array.prototype.map.call(imgs, img => {
            console.log(img);

            if (img.attributes.src) {
                return {
                    src: img.attributes.src.value,
                    tags: img.attributes.alt ? [img.attributes.alt.value] : []
                }
            } else {
                return null;
            }
        }).filter(img => img !== null);
    }

    openInputTypeFile = () => this.inputTypeFile.click();

    handleTagInputChange = e => this.setState({ tempTagInput: e.target.value });

    handleURLInputChange = e => this.setState({ saveFromSiteURL: e.target.value });

    removeTag = e => {

        const tagIndex = +e.target.id.split('#')[1];

        const state = { ...this.state };
        state.tags = [...state.tags.slice(0, tagIndex), ...state.tags.slice(tagIndex + 1)];
        state.isTagInputDisabled = false;

        this.setState(state);
    }

    createTag = e => {

        if (this.state.tags.length >= 5) {
            this.setState({ isTagInputDisabled: true });
            return;
        }
        if (e.key === 'Tab') {

            e.preventDefault();
            const state = { ...this.state };
            state.tags.push(e.target.value);
            state.tempTagInput = '';
            this.setState(state);
            return;
        }
    }

    handleImgFileDrop = e => {
        e.preventDefault();
        if (e.dataTransfer.items) {

                let imgFile = e.dataTransfer.items[0].getAsFile();
                const previewImg = URL.createObjectURL(imgFile);
                this.setState({ previewImg, imgFile, saveFromSiteURL: null });

                this.removeDragData(e);
        } else {

                let imgFile = e.dataTransfer.files[0];
                const previewImg = URL.createObjectURL(imgFile);
                this.setState({ previewImg, imgFile });

                this.removeDragData(e);
        }
        // this.removeDragData(e);
    }

    removeDragData = e => {

        if (e.dataTransfer.items) {
            e.dataTransfer.items.clear();
        } else {
            e.dataTransfer.clearData();
        }
    }

    handleDragOver = e => {

        e.preventDefault();
    }

    clickUploadFromLocal = () => this.setState({ isSaveFromSiteClicked: true });

    clicksaveFromSiteURL = () => this.setState({ isSaveFromSiteClicked: false });

    clearImgFileInState = () => this.setState({ imgFile: null });

    componentDidMount() {
        console.log('CreatePinModal mounted');
    }
    // componentWillUnmount() {
    //     console.log('CreatePinModal will UNmount');
    //     this.closeModal();
    // }

    render() {
        console.log('CreatePinModal rendered');
        const { tags, tempTagInput, isTagInputDisabled, previewImg, imgFile, isSaveFromSiteClicked, saveFromSiteURL } = this.state;
        return (
            <div className="create-pin-modal-container">

                <h2>Create Pin</h2>
                {isSaveFromSiteClicked ?
                    <div className="create-pin-from-local-container">
                        <div className="drag-target-area-wrapper" onClick={this.openInputTypeFile}>
                            <div className="drag-target-area" onDrop={this.handleImgFileDrop} onDragOver={this.handleDragOver}>

                                {previewImg ? <img className='preview-img' src={previewImg}/> : <div className="imgFileInputAreaDefaultImgTxt">
                                    <div className="img-wrapper">
                                        <img src="./images/camera-icon.png"/>
                                    </div>
                                    <div className="text-wrapper">
                                        Drag and drop <span>OR</span> click to upload
                                    </div>
                                </div>}

                                <input ref={el => this.inputTypeFile = el} type="file" accept='image/*' onChange={this.handleImageUpload}/>
                            </div>
                        </div>
                        <div className="input-field-container tags">

                            <label htmlFor="tags">Tags</label>
                            <input type="text" id='tags' className={isTagInputDisabled ? 'enough-tags' : ''} placeholder="Tab to create a new tag" onChange={this.handleTagInputChange} onKeyDown={this.createTag} value={tempTagInput} disabled={isTagInputDisabled} />
                            <div className="tags-overlay-container">
                                {tags.map((t, i) => <div key={i} className="tag">
                                    {t} <div id={`tag#${i}`} className="remove-tag-button" onClick={this.removeTag}><img id={`tag#${i}`} src="./images/create-pin.png"/></div>
                                </div>)}
                            </div>

                        </div>
                    </div> :
                    <div className="create-pin-from-url-container">
                        <div className="input-field upload-from-url">
                            <label htmlFor="'upload-from-url">Add a URL</label>
                            <input type="text" id='upload-from-url' placeholder='https://' onChange={this.handleURLInputChange}/>
                        </div>
                    </div>
                }
                <div className="modal-controls-container">
                    <div className="all-buttons-container">
                        <div className="toggle-buttons-container">
                            <div className={isSaveFromSiteClicked ? 'button upload-from-local clicked' : 'button upload-from-local'} onClick={this.clickUploadFromLocal}>Upload Pin</div>
                            <div className={isSaveFromSiteClicked ? 'button upload-from-url' : 'button upload-from-url clicked'} onClick={() => {this.clicksaveFromSiteURL(); this.clearImgFileInState()}}>Save from site</div>
                        </div>
                        <div className={imgFile || saveFromSiteURL ? 'button done' : 'button done disabled'} onClick={this.submitForm}>Done</div>
                    </div>

                </div>
            </div>
        );
    }
}

export default CreatePinModal;
