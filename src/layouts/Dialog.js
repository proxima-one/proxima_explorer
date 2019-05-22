import React, { Component } from 'react'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PropTypes from "prop-types";
import * as actions from "../store/actions";
import { connect } from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
const styles = theme => ({
    root: {
     display: 'flex',
    },
});

const stateToProps = state => {
  return {
    dialogShowing:state.items.dialogShowing,
    dialogTitle:state.items.dialogTitle,
    dialogContent:state.items.dialogContent,
    dialogSize:state.items.dialogSize,
  };
};

/**
 *
 * @function dispatchToProps React-redux dispatch to props mapping function
 * @param {any} dispatch
 * @returns {Object} object with keys which would later become props to the `component`.
 */

const dispatchToProps = dispatch => {
  return {
      showDialog: (show, content) => {
          dispatch(actions.showDialog(show, content));
      },
      closeDialog: () => {
          dispatch(actions.closeDialog());
      },
  };
};


const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

/*
const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);
*/

class ShowDialog extends Component {
  static propTypes = {
      showDialog:PropTypes.func.isRequired,
      closeDialog:PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
    };
    this._isMounted = false;
  }

  handleClose = () => {
    if (this.props.dialogShowing)
      this.props.closeDialog();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  render() {
    var self=this;
    return(
      
      <MuiThemeProvider theme={theme}>
        <Dialog
              onClose={this.handleClose}
              aria-labelledby="customized-dialog-title"
              open={this.props.dialogShowing}
              onBackdropClick={() => {
                self.handleClose();

              }}
              >
              <DialogTitle id="customized-dialog-title" onClose={self.handleClose}>
              {this.props.dialogTitle}
              </DialogTitle>
              <DialogContent>
              {this.props.dialogContent}
              </DialogContent>
        </Dialog>
      </MuiThemeProvider>
    )
  }

}

export default withStyles(styles, { withTheme: true })(connect(stateToProps, dispatchToProps)(ShowDialog))