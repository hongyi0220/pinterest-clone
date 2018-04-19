export const logInUser = user => ({
    type: 'LOG_IN_USER',
    user
});

export const storeImages = images => ({
    type: 'STORE_IMAGES',
    images
});

export const toggleHeaderMenu = () => ({type: 'TOGGLE_HEADER_MENU'});

export const togglePasswordModal = open => ({
    type: 'TOGGLE_PASSWORD_WINDOW',
    open
});

// export const closePasswordModal = () => ({type: 'CLOSE_PASSWORD_WINDOW'})
