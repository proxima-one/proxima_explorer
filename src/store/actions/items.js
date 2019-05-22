import * as actionTypes from "./actionTypes";


export const viewNode = (item) => {
    return { type: actionTypes.VIEW_NODE, 
             item 
          };
};

export const showDialog = (show, content, title, dialogType='large') => {
    return { type: actionTypes.SHOW_DIALOG, 
        show, 
        content, 
        title,
        dialogType };
};

export const closeDialog = () => {
    return { type: actionTypes.CLOSE_DIALOG,  };
};

