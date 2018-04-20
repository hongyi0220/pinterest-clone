import React from 'react';

class CreatePinModal extends React.Component {
    render() {
        return (
            <div className="create-pin-modal-container">
                <h2>Create pin</h2>
                <div className="drag-target-area-wrapper">
                    <div className="drag-target-area">
                        <div className="text-wrapper">
                            <div className="img-wrapper">
                                <img src="./images/camera-icon.png"/>
                            </div>
                            Drag and drop <span>OR</span> click to upload
                        </div>
                    </div>
                </div>
                <div className="tags-input-container">
                    <input type="text"/>
                </div>
                <div className="modal-controls-container">
                    <div className="toggle-buttons-container">
                        <div className="button upload-button from-local"></div>
                        <div className="button upload-button from-src"></div>
                    </div>
                    <div className="done button">
                        Done
                    </div>
                </div>
            </div>
        );
    }
}

export default CreatePinModal;
