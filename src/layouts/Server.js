import React, { Component } from 'react';
import '../App.css';
import * as registry from "../util/registry/registryOnChain/registryOnChain";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import CloudIcon from '@material-ui/icons/Cloud';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ServerInfo from './ServerInfo';
import * as actions from "../store/actions";
import { connect } from "react-redux";

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  card: {
    minWidth: 275,
    color: 'white',
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
      showDialog: (show, content, title) => {
          dispatch(actions.showDialog(show, content, title));
      },
      closeDialog: () => {
          dispatch(actions.closeDialog());
      },
  };
};


class Server extends Component {
  constructor(props) {
    super(props)

    this.state={
      service : "",
      table : [],
      node : [],
      subscribers : "subscribers card",
      name : "{service registry}",
      contractAddress : '',
      dialogOpen: false,
      hasData:false,

    }

  }

  componentDidMount() {
    this.getRegistryServices();
    document.title = "Proxima Explorer";

  }

  getRegistryServices=() => {

    var self=this;
    
    registry.getServices().then(services => {
      var seen={};
      var servers={}
      services.map(serviceId => {
        if (!(serviceId in seen)) {
          seen[serviceId]=1;
          registry.getService(serviceId).then(service => {
            servers[serviceId]={ service: service[0].toString(),
              name: service[1],
              id: service[2],
              owner: service[3],
              stake: service[4].toString(),
              hasData:true
            }
            self.setState({servers:servers});
          
          }).catch(error => {
            seen[serviceId]=null;
          });
        }
        return serviceId;
      })
      self.setState({table:Object.keys(seen)});

    })

    var contractAddress=registry.getContractAddress();
    
    self.setState({contractAddress});
  }

  getRegistryServiceById=(serviceId) => {
    var self=this;
    document.body.style.cursor='progress';
    registry.getService(serviceId).then(service => {
      registry.getBootstraps(serviceId).then(bootstraps => {
        var seen={};
        bootstraps.map(bootstrap => {
          seen[bootstrap]=1;
          return bootstrap;
        })
  
        const info={ service: service[0].toString(),
          name: service[1],
          id: service[2],
          owner: service[3],
          stake: service[4].toString(),
          node:Object.keys(seen),
          contractAddress:self.state.contractAddress,
          hasData:true
        }
        self.handleClickOpen(info);
        document.body.style.cursor='initial';
      }).catch(error => {
        const info={ service: service[0].toString(),
          name: service[1],
          id: service[2],
          owner: service[3],
          stake: service[4].toString(),
          contractAddress:self.state.contractAddress,
          node:[],
          hasData:true
        }
        self.handleClickOpen(info);
        document.body.style.cursor='initial';
      });

    }).catch(error => {
      console.log(error);
    })
    
  }

  handleClickOpen = (info) => {
    const title=info.name;
    const content=<ServerInfo classes={this.props.classes} info={info}></ServerInfo>
    this.props.showDialog(true, content, title);
  };

  handleClose = () => {
    this.props.closeDialog();
  };

  render() {
    const { classes } = this.props;
    var self=this;

    return (

        <div className="App">
            <GridList className={classes.gridList} style={{'marginTop':"100px"}}>

            {this.state.table.map(serviceId => {
              if (self.state.servers != null && serviceId in self.state.servers && self.state.servers[serviceId] && 'name' in self.state.servers[serviceId]) {
                var name=self.state.servers[serviceId]['name'];

                return <GridListTile key={"Server" + serviceId}
                          onClick={() => {
                            self.getRegistryServiceById(serviceId);
                          }}
                          onMouseEnter={() => {
                            document.body.style.cursor='pointer';
                          }}
                          onMouseLeave={() => {
                            document.body.style.cursor='initial';

                          }}

                          >
                        <Card className={classes.card}>
                          <CardContent>
                            <h4>{name} <IconButton className={classes.icon}>
                                  <CloudIcon />
                                </IconButton>
                            </h4>
                          </CardContent>
                        </Card>
                      </GridListTile>
              } else {
                return null;
              }
            })}
            </GridList>
      </div>


    );
  }
}

Server.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(stateToProps, dispatchToProps)(Server));
