import React from 'react';

class CreatePinModal extends React.Component {
    state = {
        tempTagInput: '',
        tags: [],
        isTagInputDisabled: false,
        uploadedImg: null,
        imgFile: null
    };
    inputTypeFile = null;
    handleImageUpload = e => {
        console.log('handling ImageUplaod from createPinModal');
        console.log('e.target.files[0]:', e.target.files[0]);
        const imgFile = e.target.files[0];
        const uploadedImg = URL.createObjectURL(imgFile);
        this.setState({ uploadedImg, imgFile });
    }
    submitForm = () => {
        const { tags, imgFile } = this.state;
        let formData = new FormData();
        formData.append('imgFile', imgFile);
        formData.append('tags', tags)

        // console.log('formData after appending data:', formData);
        fetch('/pic', {
            method: 'post',
            credentials: 'include',
            body: formData
        })
        .then(res => {
            console.log('res from /pin:', res);
            return res.json();
        })
        .then(resJson => {
            console.log('resJson from /pin:',resJson);
            // this.setState({ uploadedImg: resJson.url })
        })
        .catch(err => console.log(err));
    }
    openInputTypeFile = () => this.inputTypeFile.click();
    handleTagInputChange = e => this.setState({ tempTagInput: e.target.value });
    removeTag = e => {

        const tagIndex = +e.target.id.split('#')[1];
        console.log('tagIndex:',tagIndex);
        const state = { ...this.state };
        state.tags = [...state.tags.slice(0, tagIndex), ...state.tags.slice(tagIndex + 1)];
        state.isTagInputDisabled = false;
        console.log('state.tags after removeTag:',state.tags);
        this.setState(state);
    }
    createTag = e => {
        // console.log('e.code:', e.code);
        if (this.state.tags.length >= 5) {
            this.setState({ isTagInputDisabled: true });
            return;
        }
        if (e.key === 'Tab') {
            console.log('e.key:', e.key);
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
                console.log('e.dataTransfer.items');
                let imgFile = e.dataTransfer.items[0].getAsFile();
                const uploadedImg = URL.createObjectURL(imgFile);
                this.setState({ uploadedImg, imgFile });
                // console.log('imgFile:', imgFile);
                this.removeDragData(e);
        } else {
                console.log('e.dataTransfer.files');
                let imgFile = e.dataTransfer.files[0];
                const uploadedImg = URL.createObjectURL(imgFile);
                this.setState({ uploadedImg, imgFile });
                // console.log('imgFile:', imgFile);
                this.removeDragData(e);
        }
        // this.removeDragData(e);
    }
    removeDragData = e => {
        console.log('Removing drag data')
        if (e.dataTransfer.items) {
            e.dataTransfer.items.clear();
        } else {
            e.dataTransfer.clearData();
        }
    }
    handleDragOver = e => {
        console.log('File(s) in drop zone');
        e.preventDefault();
    }
    render() {
        const { tags, tempTagInput, isTagInputDisabled, uploadedImg } = this.state;
        return (
            <div className="create-pin-modal-container">
                <h2>Create Pin</h2>
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
                <div className="modal-controls-container">
                    <div className="all-buttons-container">
                        <div className="toggle-buttons-container">
                            <div className="button upload from-local">Upload Pin</div>
                            <div className="button upload from-src">Save from site</div>
                        </div>
                        <div className="button done" onClick={this.submitForm}>Done</div>
                    </div>

                </div>
            </div>
        );
    }
}

export default CreatePinModal;
