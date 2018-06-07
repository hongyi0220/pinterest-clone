export const logInUser = user => ({
    type: 'LOG_IN_USER',
    user,
});

export const storeImgs = imgs => ({
    type: 'STORE_IMGS',
    imgs,
});

export const toggleHeaderMenu = () => ({ type: 'TOGGLE_HEADER_MENU' });

export const toggleModal = open => ({
    type: 'TOGGLE_MODAL',
    open,
});

export const toggleMsgModal = content => ({
    type: 'TOGGLE_MSG_MODAL',
    content,
});

export const concatImgsToStore = imgs => ({
    type: 'CONCAT_IMGS_TO_STORE',
    imgs,
});

export const storeTopTags = tags => ({
    type: 'STORE_TOP_TAGS',
    tags,
});

export const toggleLoadingSpinner = () => ({
    type: 'TOGGLE_LOADING_SPINNER',
});

export const storeOtherUserInfo = otherUser => ({
  type: 'STORE_OTHER_USER_INFO',
  otherUser,
});

export const storeMagnifiedPinInfo = magnifiedPin => ({
  type: 'STORE_MAGNIFIED_PIN_INFO',
  magnifiedPin,
});

export const storeSearchKeywords = keywords => ({
  type: 'STORE_SEARCH_KEYWORDS',
  keywords,
});

export const storeCuratedPins = pins => ({
  type: 'STORE_CURATED_PINS',
  pins,
});

export const concatToUserPins = pin => ({
  type: 'CONCAT_TO_USER_PINS',
  pin,
});
