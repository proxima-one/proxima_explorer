import React, { Component } from 'react'
import PropTypes from "prop-types";
import * as actions from "../store/actions";
import { connect } from "react-redux";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


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
      showDialog: (show, content, title) => {
          dispatch(actions.showDialog(show, content, title));
      },
      closeDialog: () => {
          dispatch(actions.closeDialog());
      },
  };
};



class ServerInfo extends Component {
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

  componentDidMount() {
    this._isMounted = true;
  }

  render() {
    var self=this;
    const { classes } = this.props;
    return(
      <Card className={classes.card}>
          <CardContent>
            <div className = "App-stats">
            <table width={'100%'}>
              <tbody>
                  <tr>
                      <td style={{width: '50%', textAlign:'right'}}><b>Server:</b></td>
                      <td style={{width: '50%', textAlign:'left'}}> {this.props.info.service}
                      </td>
                  </tr>
                  <tr>
                      <td style={{width: '50%', textAlign:'right'}}><b>Name:</b></td>
                      <td style={{width: '50%', textAlign:'left'}}>{this.props.info.name}</td>
                  </tr>
                  <tr><td style={{width: '50%', textAlign:'right'}}><b>Contract Address:</b></td>
                      <td style={{width: '50%', textAlign:'left'}}> {this.props.info.contractAddress}</td>
                  </tr>
                  <tr><td style={{width: '50%', textAlign:'right'}}><b>Owner:</b></td>
                      <td style={{width: '50%', textAlign:'left'}}>{this.props.info.owner}</td>
                  </tr>
                  <tr><td style={{width: '50%', textAlign:'right'}}><b>ID:</b> </td>
                      <td style={{width: '50%', textAlign:'left'}}>{this.props.info.id}</td>
                  </tr>
                  <tr><td style={{width: '50%', textAlign:'right'}}><b>Stake:</b></td>
                      <td style={{width: '50%', textAlign:'left'}}>{this.props.info.stake}</td>
                  </tr>
                  {self.props.info.node && self.props.info.node.length > 0 && self.props.info.node.toString().replace(/\W/g, '') ? 
                    <tr><td style={{width: '50%', textAlign:'right'}}><b>Node:</b></td>
                      <td style={{width: '50%', textAlign:'left'}}>
                            {this.props.info.node.map(address => {
                          return <span key={address}>
                          <a href={address} target="_newWindow" >
                          <font color={'white'} size={'2'}><b>{address}</b></font></a></span>
                        })}</td>
                  </tr>
                      : null}
                  
                  <tr><td style={{width: '50%', textAlign:'right'}}><b>Subscribers:</b></td>
                      <td style={{width: '50%', textAlign:'left'}}></td>
                      </tr>

              </tbody>
            </table>

          </div>
          </CardContent>
      </Card>
    )
  }

}

export default connect(stateToProps, dispatchToProps)(ServerInfo)