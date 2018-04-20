import React from 'react';

class CreatePinModal extends React.Component {
    state = {
        tempTagInput: '',
        tags: [],
        isTagInputDisabled: false
    };
    inputTypeFile = null;
    handleImageUpload = e => {
        console.log('handling ImageUplaod from createPinModal');
        console.log('e.target.files[0]:', e.target.files[0]);
        const imgFile = e.target.files[0];
        // const uploadedImg = URL.createObjectURL(imgFile);
        // this.setState({ uploadedImg });
        const { tags } = this.state;
        let formData = new FormData();
        formData.append('imgFile', imgFile);
        formData.append('tags', tags)

        console.log('formData after appending data:', formData);
        fetch('/pin', {
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
        // console.log('e at removeTAG:', e);
        // this.setState({ isTagInputDisabled: false }, () => console.log('this.state after remove tag:',this.state));
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
    render() {
        const { tags, tempTagInput, isTagInputDisabled } = this.state;
        return (
            <div className="create-pin-modal-container">
                <h2>Create Pin</h2>
                <div className="drag-target-area-wrapper" onClick={this.openInputTypeFile}>
                    <div className="drag-target-area">
                        <div className="img-wrapper">
                            <img src="./images/camera-icon.png"/>
                        </div>
                        <div className="text-wrapper">
                            Drag and drop <span>OR</span> click to upload
                        </div>
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
                        <div className="button done">Done</div>
                    </div>

                </div>
            </div>
        );
    }
}

export default CreatePinModal;
