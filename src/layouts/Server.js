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
import Dialog from '@material-ui/core/Dialog';
import {DialogTitle, DialogContent } from './ServerInfo';

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
    this.getEthData();
    document.title = "Proxima Explorer";

  }

  getEthData=() => {

    var self=this;
    
    registry.getServices().then(services => {
      var seen={};
      services.map(serviceId => {
        seen[serviceId]=null;
        registry.getService(serviceId).then(service => {
          seen[serviceId]={ service: service[0].toString(),
            name: service[1],
            id: service[2],
            owner: service[3],
            stake: service[4].toString(),
            hasData:true
          }
          self.setState({servers:seen});
        }).catch(error => {
          seen[serviceId]=null;
        });
        return serviceId;
      })
      self.setState({table:Object.keys(seen)});

    })

    var contractAddress=registry.getContractAddress();
    
    self.setState({contractAddress});
  }

  getService=(serviceId) => {
    var self=this;
    document.body.style.cursor='progress';
    self.setState({hasData: false, name: 'Server ' + serviceId})
    registry.getService(serviceId).then(service => {
      self.setState({ service: service[0].toString(),
                      name: service[1],
                      id: service[2],
                      owner: service[3],
                      stake: service[4].toString(),
                      hasData:true
                    });
      document.body.style.cursor='initial';
    }).catch(error => {
      console.log(error);
    })
    registry.getBootstraps(serviceId).then(bootstraps => {
      var seen={};
      bootstraps.map(bootstrap => {
        seen[bootstrap]=1;
        return bootstrap;
      })

      self.setState({node:Object.keys(seen)});
    }).catch(error => {
      self.setState({node:[]});
    });
  }

  handleClickOpen = () => {
    this.setState({
      dialogOpen: true,
    });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
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
                        self.getService(serviceId);
                        if (!self.state.dialogOpen)
                        self.handleClickOpen();
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
                      
                      {this.state.service === serviceId && this.state.hasData && this.state.service && this.state.node ?
                          <Dialog
                          onClose={this.handleClose}
                          aria-labelledby="customized-dialog-title"
                          open={self.state.dialogOpen}
                          onBackdropClick={() => {
                            self.handleClose();

                          }}
                        >
                          <DialogTitle id="customized-dialog-title" onClose={self.handleClose}>
                          {name}
                          </DialogTitle>
                          <DialogContent>
                                <Card className={classes.card}>
                              <CardContent>
                                <div className = "App-stats">
                                <table width={'100%'}>
                                  <tbody>
                                      <tr>
                                          <td style={{width: '50%', textAlign:'right'}}><b>Server:</b></td>
                                          <td style={{width: '50%', textAlign:'left'}}> {this.state.service}
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style={{width: '50%', textAlign:'right'}}><b>Name:</b></td>
                                          <td style={{width: '50%', textAlign:'left'}}>{this.state.name}</td>
                                      </tr>
                                      <tr><td style={{width: '50%', textAlign:'right'}}><b>Contract Address:</b></td>
                                          <td style={{width: '50%', textAlign:'left'}}> {this.state.contractAddress}</td>
                                      </tr>
                                      <tr><td style={{width: '50%', textAlign:'right'}}><b>Owner:</b></td>
                                          <td style={{width: '50%', textAlign:'left'}}>{this.state.owner}</td>
                                      </tr>
                                      <tr><td style={{width: '50%', textAlign:'right'}}><b>ID:</b> </td>
                                          <td style={{width: '50%', textAlign:'left'}}>{this.state.id}</td>
                                      </tr>
                                      <tr><td style={{width: '50%', textAlign:'right'}}><b>Stake:</b></td>
                                          <td style={{width: '50%', textAlign:'left'}}>{this.state.stake}</td>
                                      </tr>
                                      {self.state.node && self.state.node.length > 0 && self.state.node.toString().replace(/\W/g, '') ? 
                                        <tr><td style={{width: '50%', textAlign:'right'}}><b>Node:</b></td>
                                          <td style={{width: '50%', textAlign:'left'}}>
                                                {this.state.node.map(address => {
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
                            </DialogContent>
                        </Dialog>
                              : null}
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

export default withStyles(styles)(Server);
