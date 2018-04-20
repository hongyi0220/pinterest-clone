import React from 'react';

class CreatePinModal extends React.Component {
    state = {

    };
    inputTypeFile = null;
    handleImageUpload = e => {
        console.log('handling ImageUplaod');
        console.log('e.target.files[0]:', e.target.files[0]);
        const imgFile = e.target.files[0];
        const uploadedImg = URL.createObjectURL(imgFile);
        this.setState({ uploadedImg });

        let formData = new FormData();
        formData.append('imgFile', imgFile);

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
            this.setState({ uploadedImg: resJson.url })
        })
        .catch(err => console.log(err));
    }
    openInputTypeFile = () => this.inputTypeFile.click();
    render() {
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
                    <input type="text" id='tags'/>
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
