export const logInUser = user => ({
    type: 'LOG_IN_USER',
    user
});

export const storeImgs = imgs => ({
    type: 'STORE_IMGS',
    imgs
});

export const toggleHeaderMenu = () => ({type: 'TOGGLE_HEADER_MENU'});

export const toggleModal = open => ({
    type: 'TOGGLE_MODAL',
    open
});

export const openMsgModal = () => ({type: 'OPEN_MSG_MODAL'});
