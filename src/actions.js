export const logInUser = user => ({
    type: 'LOG_IN_USER',
    user
});

export const storeImages = images => ({
    type: 'STORE_IMAGES',
    images
});

export const toggleHeaderMenu = () => ({type: 'TOGGLE_HEADER_MENU'});

export const toggleModal = open => ({
    type: 'TOGGLE_MODAL',
    open
});

export const openMsgModal = () => ({type: 'OPEN_MGS_MODAL'});
