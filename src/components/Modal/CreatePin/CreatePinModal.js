import React from 'react';
// import {
//     storeImages
// } from '../../../actions';

class CreatePinModal extends React.Component {
    state = {
        tempTagInput: '',
        tags: [],
        isTagInputDisabled: false,
        uploadedImg: null,
        imgFile: null,
        isUploadFromLocalClicked: true,
        uploadFromURL: ''
    };
    inputTypeFile = null;
    handleImageUpload = e => {


        const imgFile = e.target.files[0];
        const uploadedImg = URL.createObjectURL(imgFile);
        this.setState({ uploadedImg, imgFile });
    }
    submitForm = () => {

        const { tags, imgFile, uploadFromURL } = this.state;

        if (uploadFromURL) {
            console.log('uploadFromURL:',uploadFromURL);
            const isValidDomain = /\.{1}(?=\w{2,})/;
            const isValidImgFile = /\.{1}(?=jpg|jpeg|png|gif)/i;
            if (isValidImgFile.test(uploadFromURL)) {
                console.log('isValidImgFile');
                fetch('/pic', {
                    method: 'put',
                    headers: {
                        'content-type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ pic: { src: uploadFromURL, tags: [] } })
                })
                .then(res => {

                    return res.json();
                })
                .then(resJson => {

                    // this.setState({ uploadedImg: resJson.url })
                });

            } else if (isValidDomain.test(uploadFromURL)) {
                console.log('isValidDomain fetching html...');
                let url;
                if (!/https?/.test(uploadFromURL)) {
                    console.log('no http(s), attaching one');
                    url = 'http://' + uploadFromURL;
                } else {
                    url = uploadFromURL;
                }
                const proxyurl = "https://cors-anywhere.herokuapp.com/";
                fetch(proxyurl + url)
                .then(res => res.text())
                .then(resTxt => {
                    console.log('res after fetching from vaildDomain:',resTxt);
                    const imgsArr = this.parseHTML(resTxt).map(img => ({
                        src: `${url}/${img.src}`,
                        tags: img.tags
                    })); // Display imgs scraped from the URL on wall @ route: /find
                    console.log('imgsArr:', imgsArr);
                    console.log('storeImages triggered');
                    this.props.storeImages(imgsArr);
                    console.log('navigating to /find');
                    this.props.history.push('/find');

                })
                .catch(err => console.log(err));
            }
        } else {
            let formData = new FormData();
            formData.append('imgFile', imgFile);
            formData.append('tags', tags)


            fetch('/pic', {
                method: 'post',
                credentials: 'include',
                body: formData
            })
            .then(res => {

                return res.json();
            })
            .then(resJson => {

                // this.setState({ uploadedImg: resJson.url })
            })
            .catch(err => console.log(err));
        }
    }
    parseHTML = html => {
        console.log('parseHTML triggered');
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        console.log('doc after parsing:', doc);
        return this.getAllImgSrcs(doc);
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
            }
        });
    }
    openInputTypeFile = () => this.inputTypeFile.click();
    handleTagInputChange = e => this.setState({ tempTagInput: e.target.value });
    handleURLInputChange = e => this.setState({ uploadFromURL: e.target.value });
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
                const uploadedImg = URL.createObjectURL(imgFile);
                this.setState({ uploadedImg, imgFile });

                this.removeDragData(e);
        } else {

                let imgFile = e.dataTransfer.files[0];
                const uploadedImg = URL.createObjectURL(imgFile);
                this.setState({ uploadedImg, imgFile });

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
    clickUploadFromLocal = () => this.setState({ isUploadFromLocalClicked: true });
    clickUploadFromUrl = () => this.setState({ isUploadFromLocalClicked: false });
    clearImgFileInState = () => this.setState({ imgFile: null });
    render() {
        const { tags, tempTagInput, isTagInputDisabled, uploadedImg, imgFile, isUploadFromLocalClicked, uploadFromURL } = this.state;
        return (
            <div className="create-pin-modal-container">

                <h2>Create Pin</h2>
                {isUploadFromLocalClicked ?
                    <div className="create-pin-from-local-container">
                        <div className="drag-target-area-wrapper" onClick={this.openInputTypeFile}>
                            <div className="drag-target-area" onDrop={this.handleImgFileDrop} onDragOver={this.handleDragOver}>

                                {uploadedImg ? <img className='preview-img' src={uploadedImg}/> : <div className="imgFileInputAreaDefaultImgTxt">
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
                            <div className={isUploadFromLocalClicked ? 'button upload-from-local clicked' : 'button upload-from-local'} onClick={this.clickUploadFromLocal}>Upload Pin</div>
                            <div className={isUploadFromLocalClicked ? 'button upload-from-url' : 'button upload-from-url clicked'} onClick={() => {this.clickUploadFromUrl(); this.clearImgFileInState()}}>Save from site</div>
                        </div>
                        <div className={imgFile || uploadFromURL ? 'button done' : 'button done disabled'} onClick={this.submitForm}>Done</div>
                    </div>

                </div>
            </div>
        );
    }
}

export default CreatePinModal;
