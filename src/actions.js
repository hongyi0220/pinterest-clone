export const logInUser = user => ({
    type: 'LOG_IN_USER',
    user
});

export const storeImages = images => ({
    type: 'STORE_IMAGES',
    images
});

export const toggleHeaderMenu = () => {
    console.log('toggling headerMenu');

    return { type: 'TOGGLE_HEADER_MENU' };

};
