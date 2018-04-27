export const logInUser = user => ({
    type: 'LOG_IN_USER',
    user
});

export const storeImgs = imgs => ({
    type: 'STORE_IMGS',
    imgs
});

export const toggleHeaderMenu = () => ({ type: 'TOGGLE_HEADER_MENU' });

export const toggleModal = open => ({
    type: 'TOGGLE_MODAL',
    open
});

export const openMsgModal = (title, msg) => ({
    type: 'OPEN_MSG_MODAL',
    content: {
        title,
        msg
    }
});

export const concatImgsToStore = imgs => ({
    type: 'CONCAT_IMGS_TO_STORE',
    imgs
});

export const storeTopTags = tags => ({
    type: 'STORE_TOP_TAGS',
    tags
});
