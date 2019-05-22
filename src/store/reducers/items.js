import React from 'react';
import * as actionTypes from "../actions/actionTypes";

const initialState = {
    posts: undefined,
    current: -1,
    metaData: {},
    dialogShowing:false,
    dialogContent: (<div></div>),
    dialogTitle: null,
    dialogSize: 'large',

};


const reducer = (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.VIEW_NODE:

        console.log('view node');
        console.log(action.item);
        return {
            ...state,
            node_item:action.item
    };

    case actionTypes.SHOW_DIALOG:

      //console.log('show dialog');
      return {
          ...state,
          dialogShowing:true,
          dialogContent:action.content,
          dialogTitle:action.title,
          dialogSize:action.dialogType
      };
    case actionTypes.CLOSE_DIALOG:

      //console.log('close dialog');
      return {
          ...state,
          dialogShowing:false,
          dialogContent: (<div></div>),
          dialogTitle:null
      };

    default:
      return state;
  }
};


export default reducer;
