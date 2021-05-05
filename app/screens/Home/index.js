import React from 'react';
import {
  View,
  Text,
  Button,
  WebView,
  Alert,
  BackHandler,
  Linking,
  AsyncStorage,
  PermissionsAndroid,
} from 'react-native';
import HeaderTitle from '../../components/headerTitle/index';
import FooterMenu from '../../components/footerMenu/index';
import PrepareQuit from '../../components/prepareQuit/index';
import LoadingScreen from '../../components/LoadingScreen';
import {getPageLang} from '../../languages';
import config from '../../config';
import {AddMinutesToDate} from '../../global';
import globalStyles from '../global.style';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang('home');
    global.community = {code: '', text: ''};

    this.state = {
      title: '',
      canGoBack: false,
      webUri: 'http://109.203.100.85:7701',
      canChangeCommunity: true,
      communityList: [],
      hideTopbar: false,
      hideFooterMenu: false,
      prepareQuit: false,
      showLoading: false,
      phone: '',
      UserName: '',
      Password: '',
      linkAccount: {
        phonenumber: '',
        UserName: '',
        Password: '',
      },

      tokenAxs: {
        access_token: '',
        expires_in: '',
        refresh_at: '',
      },
    };

    this.flag = {
      sendLoginInfo: false,
      sendBindingInfo: false,
      sendUser: false,
      sendToken: false,
    };

    this.webview = null;
    // this.getCommunityList();

    this.refresh_token = false;

    this.intervalUser = null;
    this.intervalToken = null;
    this.intervalLogin = null;
    this.intervalBinding = null;
    this.intervalLogout = null;

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Access Permission',
        message: 'We would like to use your location',
        buttonPositive: 'Okay',
      },
    );
  }

  _doClearStorage = () => {
    AsyncStorage.setItem('smart-app-do-logout', '1');
    this.props.navigation.replace('Home');
  };

  _retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {}
  };

  storeDataUser = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {}
  };

  storeBinding = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {}
  };

  doCheckUserAcctBindingUnOwner = (phonenumberUnOwner, phonenumberOwner) => {
    let params = {
      phonenumberUnOwner: phonenumberUnOwner,
      phonenumberOwner: phonenumberOwner,
    };
    console.log(params);

    fetch(
      global.serverurl +
        global.webserviceurl +
        '/app_check_userbinding_unowner.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: JSON.stringify(params),
      },
    )
      .then((response) => {
        console.log(response);
        if (response.status === 200) return response.json();
        else throw new Error('Something wrong with api server');
      })
      .then((response) => {
        console.log(response);
        if (response.status === 'OK') {
          if (response.UserAcct.length > 0) {
            console.log(response.UserAcct[0]);
            this.storeDataUser(
              'Modernland-Account',
              JSON.stringify(response.UserAcct[0]),
            );
            this.doBindingAccountUnOwner(
              JSON.stringify(response.UserAcct[0]),
              JSON.stringify(response.UserRequest[0]),
            );
          }
        } else {
          //error
          Alert.alert(
            this.globallang.alert,
            response.message,
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log('OK Pressed'),
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doBindingAccountUnOwner = (AccountBindOwner, UserRequestUnit) => {
    var accountBindOwner = JSON.parse(AccountBindOwner);
    var userRequestUnit = JSON.parse(UserRequestUnit);
    console.log(AccountBindOwner);
    fetch(
      global.serverurl + global.webserviceurl + '/access_token_binding2.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: JSON.stringify(accountBindOwner),
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);
        if (response.status === 'OK') {
          if (response.status === 'Error') {
            Alert.alert(
              'Warning',
              'Invalid username and password!',
              [
                {
                  text: this.globallang.ok,
                  onPress: () => console.log('OK Pressed'),
                },
              ],
              {cancelable: false},
            );
          } else {
            let payload = {
              access_token: response.token.access_token,
              token_type: response.token.token_type,
              expires_in: response.token.expires_in,
            };

            console.log('Hasil dari response binding', response.data);
            console.log('unit yg akan di ambil', userRequestUnit);
            let dataAwal = response.data.filter(
              (item) => item.DebtorAcct === userRequestUnit.debtoracct,
            );
            console.log(dataAwal);
            this.storeBinding('smart-app-id-binding', JSON.stringify(dataAwal));
            this.setToken(payload);
          }
        } else {
          Alert.alert(
            this.globallang.alert,
            response.message,
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log('OK Pressed'),
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doCheckUserAcctBinding = (phone) => {
    let params = {
      phonenumber: phone,
    };

    fetch(
      global.serverurl + global.webserviceurl + '/app_check_userbinding2.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: JSON.stringify(params),
      },
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else throw new Error('Something wrong with api server');
      })
      .then((response) => {
        console.log(response);
        if (response.status === 'OK') {
          if (response.UserAcct.length > 0) {
            console.log(response.UserAcct[0]);
            this.storeDataUser(
              'Modernland-Account',
              JSON.stringify(response.UserAcct),
            );
            this.storeBinding(
              'smart-app-id-binding',
              JSON.stringify(response.UserAcct),
            );

            this.storeBinding(
              'smart-app-id-token',
              JSON.stringify(response.message),
            );

            this.doBindingCheckSendPost();

            // this.doBindingAccount(JSON.stringify(response.UserAcct[0]));
          }
        } else {
          //error
          Alert.alert(
            this.globallang.alert,
            response.message,
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log('OK Pressed'),
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doBindingAccount = (acctbinding) => {
    // console.log(JSON.parse(acctbinding));
    var bindingAcct = JSON.parse(acctbinding);
    fetch(
      global.serverurl + global.webserviceurl + '/access_token_binding2.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: JSON.stringify(bindingAcct),
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);
        if (response.status === 'OK') {
          if (response.status === 'Error') {
            Alert.alert(
              this.globallang.alert,
              'Invalid username and password!',
              [
                {
                  text: this.globallang.ok,
                  onPress: () => console.log('OK Pressed'),
                },
              ],
              {cancelable: false},
            );
          } else {
            let payload = {
              access_token: response.token.access_token,
              token_type: response.token.token_type,
              expires_in: response.token.expires_in,
            };
            this.setToken(payload);
            this.storeBinding(
              'smart-app-id-binding',
              JSON.stringify(response.data),
            );
          }
        } else {
          Alert.alert(
            this.globallang.alert,
            response.message,
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log('OK Pressed'),
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  userAkun = () => {
    this._retrieveData('Modernland-Account').then((info) => {
      //   console.log(info);
      if (info !== null) {
        this.setState({linkAccount: JSON.parse(info)});
      }
      let params = {
        phonenumber: this.state.linkAccount.phonenumber,
        UserName: this.state.linkAccount.UserName,
        Password: this.state.linkAccount.Password,
      };
      console.log(params);
    });
  };

  getTokenNew = () => {
    this._retrieveData('smart-app-id-token').then((info) => {
      //   console.log(info);
      if (info !== null) {
        this.setState({tokenAxs: JSON.parse(info)});
      }
      let pram = {
        access_token: this.state.tokenAxs.access_token,
        expires_in: this.state.tokenAxs.expires_in,
        refresh_at: this.state.tokenAxs.refresh_at,
      };
      let params = {
        phonenumber: this.state.linkAccount.phonenumber,
        UserName: this.state.linkAccount.UserName,
        Password: this.state.linkAccount.Password,
      };

      //   console.log(pram);
      //   console.log(params);
      //   console.log(this.state.tokenAxs.refresh_at);

      if (
        this.state.tokenAxs.refresh_at <= new Date().getTime() &&
        this.refresh_token === false
      ) {
        this.refresh_token = true;
        // console.log('Refresh token');
        fetch(
          global.serverurl +
            global.webserviceurl +
            '/access_token_binding2.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: JSON.stringify(params),
          },
        )
          .then((response) => {
            this.refresh_token = false;
            return response.json();
          })
          .then((response) => {
            // console.log(response);
            if (response.status === 'OK') {
              if (response.status === 'Error') {
                Alert.alert(
                  this.globallang.alert,
                  this.pagelang.invalid_account,
                  [
                    {
                      text: this.globallang.ok,
                      onPress: () => console.log('OK Pressed'),
                    },
                  ],
                  {cancelable: false},
                );
              } else {
                let payload = {
                  access_token: response.token.access_token,
                  token_type: response.token.token_type,
                  expires_in: response.token.expires_in,
                };
                this.setToken(payload);
                // this._storeData('smart-app-id-token', JSON.stringify(response.token));
                this._storeData(
                  'smart-app-id-binding',
                  JSON.stringify(response.data),
                );
                this.props.navigation.replace('Home');
              }
              // this._doClearStorage();
            } else {
              //error
              // AsyncStorage.removeItem('smart-app-id-token');
              Alert.alert(
                this.globallang.alert,
                response.message,
                [
                  {
                    text: this.globallang.ok,
                    onPress: () => console.log('OK Pressed'),
                  },
                ],
                {cancelable: false},
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  getTokenNewUnOwner = () => {
    this._retrieveData('smart-app-id-token').then((info) => {
      if (info !== null) {
        this.setState({tokenAxs: JSON.parse(info)});
      }
      let pram = {
        access_token: this.state.tokenAxs.access_token,
        expires_in: this.state.tokenAxs.expires_in,
        refresh_at: this.state.tokenAxs.refresh_at,
      };
      let params = {
        phonenumber: this.state.linkAccount.phonenumber,
        UserName: this.state.linkAccount.UserName,
        Password: this.state.linkAccount.Password,
      };

      if (
        this.state.tokenAxs.refresh_at <= new Date().getTime() &&
        this.refresh_token === false
      ) {
        this.refresh_token = true;
        // console.log('Refresh token');
        fetch(
          global.serverurl +
            global.webserviceurl +
            '/access_token_binding2.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: JSON.stringify(params),
          },
        )
          .then((response) => {
            this.refresh_token = false;
            return response.json();
          })
          .then((response) => {
            // console.log(response);
            if (response.status === 'OK') {
              if (response.status === 'Error') {
                Alert.alert(
                  'Warning',
                  'Invalid username and password!',
                  [
                    {
                      text: this.globallang.ok,
                      onPress: () => console.log('OK Pressed'),
                    },
                  ],
                  {cancelable: false},
                );
              } else {
                let payload = {
                  access_token: response.token.access_token,
                  token_type: response.token.token_type,
                  expires_in: response.token.expires_in,
                };
                this.setToken(payload);
                this._storeData(
                  'smart-app-id-binding',
                  JSON.stringify(response.data),
                );
                this.props.navigation.replace('Home');
              }
            } else {
              //error
              // AsyncStorage.removeItem('smart-app-id-token');
              Alert.alert(
                this.globallang.alert,
                response.message,
                [
                  {
                    text: this.globallang.ok,
                    onPress: () => console.log('OK Pressed'),
                  },
                ],
                {cancelable: false},
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  setToken = (payload) => {
    // console.log(payload);
    return new Promise((resolve, reject) => {
      if (typeof payload === 'undefined') {
        return reject({message: 'Error'});
      }

      try {
        // let str_data = JSON.stringify(data);
        let exp = new Date();
        let access_token = payload.access_token;
        let type_token = payload.token_type;
        let expires_in = payload.expires_in;
        var refresh_at = AddMinutesToDate(new Date(), 30).getTime();
        let data = {
          access_token: access_token,
          expires_in: expires_in,
          refresh_at: refresh_at,
          type_token: type_token,
        };
        console.log(data);

        let strData = JSON.stringify(data);
        resolve(AsyncStorage.setItem('smart-app-id-token', strData));
        this.doBindingCheckSendPost();
      } catch (e) {
        return reject(e);
      }
    });
  };

  doBindingCheckSendPost = () => {
    this._retrieveData('smart-app-id-token').then((info) => {
      if (info != null && info != 'null') {
        this.intervalToken = setInterval(() => {
          this.sendMessage('token', info);
        }, 500);
      }
    });

    this._retrieveData('smart-app-id-binding').then((info) => {
      console.log(info);
      if (info != null && info != 'null') {
        this.intervalBinding = setInterval(() => {
          this.sendMessage('binding', info);
        }, 500);
      }
    });

    this._retrieveData('Modernland-Account').then((info) => {
      if (info != null && info != 'null') {
        this.intervalUser = setInterval(() => {
          this.sendMessage('user', info);
        }, 500);
      }
      if (info !== null) {
        this.setState({linkAccount: JSON.parse(info)});
      }
    });
  };

  getCommunityList = () => {
    fetch(
      global.serverurl + global.webserviceurl + '/app_get_community_list.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: '{}',
      },
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else {
          //   console.log('err');
          //   console.log(response);
          throw new Error('Something wrong with api server');
        }
      })
      .then((response) => {
        if (response.status === 'OK') {
          let title = this.state.title;
          let d = new Date();
          if (global.community.code === '' && response.records.length > 0) {
            global.community = {
              code: response.records[0].id,
              text: response.records[0].name,
            };
            title = response.records[0].name;
          } else {
            title = global.community.text;
          }
          // this.setState({ communityList: response.records, title: title, webUri: 'http://172.30.2.115:3000/?community=' + global.community.code + '&t=' + d.getTime() });
          this.setState({
            communityList: response.records,
            title: title,
            webUri:
              global.serverurl +
              global.develbase +
              '/?community=' +
              global.community.code +
              '&t=' +
              d.getTime(),
          });
        } else {
          //error
          Alert.alert(
            'Alert',
            response.message,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkMustLogout = (phonenumber) => {
    let params = {
      phonenumber: phonenumber,
    };

    fetch(
      global.serverurl +
        global.webserviceurl +
        '/app_validation_must_logout.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: JSON.stringify(params),
      },
    )
      .then((response) => {
        this.setState({showLoading: false});
        if (response.status === 200) {
          return response.json();
        } else {
          Alert.alert(
            'Error',
            'Something wrong with api server',
            [
              {
                text: 'OK',
                onPress: () => console.log('OK Pressed'),
              },
            ],
            {cancelable: false},
          );
        }
      })
      .then((response) => {
        console.log(response);
        if (response.status === 'OK') {
          global.logininfo = undefined;
          AsyncStorage.removeItem('smart-app-id-login');
          AsyncStorage.removeItem('smart-app-id-binding');
          AsyncStorage.removeItem('smart-app-id-token');
          AsyncStorage.removeItem('Modernland-Account');
          AsyncStorage.setItem('smart-app-do-logout', '1');
          this.props.navigation.replace('Home');
        }
      })
      .catch((error) => {
        Alert.alert(
          'Error',
          'unable to connect, check your internet connection.',
          [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ],
          {cancelable: false},
        );
        console.log(error);
      });
  };

  componentDidMount() {
    // this._retrieveData('smart-app-id-login').then((info) => {
    //   console.log(info);
    //   if (info !== null) {
    //     info = JSON.parse(info);
    //     this.checkMustLogout(info.phonenumber);
    //     if (info.statusownerid === 1) {
    //       this.doCheckUserAcctBinding(info.phonenumber);
    //     } else if (info.statusownerid === 2 && info.phonenumberOwner !== '') {
    //       // this.doCheckUserAcctBindingUnOwner(
    //       //   info.phonenumber,
    //       //   info.phonenumberOwner,
    //       // );
    //       return null;
    //     } else if (info.statusownerid === 3) {
    //       return null;
    //     }
    //   }
    // });

    // //send back message as ack
    // this._retrieveData('smart-app-id-login').then((info) => {
    //   if (info != null && info != 'null') {
    //     this.intervalLogin = setInterval(() => {
    //       this.sendMessage('login', info);
    //     }, 500);
    //   }
    // });

    // this._retrieveData('smart-app-do-logout').then((info) => {
    //   if (info == '1') {
    //     this.intervalLogout = setInterval(() => {
    //       //   console.log('send logout');
    //       this.sendMessage('logout', {});
    //     }, 500);
    //   }
    // });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    // if (this.intervalLogin !== null) {
    //   clearInterval(this.intervalLogin);
    //   this.intervalLogin = null;
    // }
    // if (this.intervalToken !== null) {
    //   clearInterval(this.intervalToken);
    //   this.intervalToken = null;
    // }
    // if (this.intervalBinding !== null) {
    //   clearInterval(this.intervalBinding);
    //   this.intervalBinding = null;
    // }
    // if (this.intervalUser !== null) {
    //   clearInterval(this.intervalUser);
    //   this.intervalUser = null;
    // }
    // if (this.intervalLogout !== null) {
    //   clearInterval(this.intervalLogout);
    //   this.intervalLogout = null;
    // }
  }

  handleBackPress = () => {
    if (this.state.hideTopbar) {
      //go back
      this.webview.goBack();
    } else {
      if (this.state.prepareQuit) {
        //do quit
        BackHandler.exitApp();
      } else {
        this.setState({prepareQuit: true});
      }
    }
    return true;
  };

  cancelQuit = () => {
    this.setState({prepareQuit: false});
  };

  changeCommunity(community) {
    this.setState({showLoading: true});
    global.community = community;
    let d = new Date();
    // this.setState({ webUri: 'http://172.30.2.115:3000/?community=' + community.code + '&t=' + d.getTime(), title: community.text, canGoBack: false, canChangeCommunity: true });
    this.setState({
      webUri:
        global.serverurl +
        global.develbase +
        '/?community=' +
        community.code +
        '&t=' +
        d.getTime(),
      title: community.text,
      canGoBack: false,
      canChangeCommunity: true,
    });
    /*Alert.alert('title', community, [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => console.log('OK Pressed') }], { cancelable: false });*/
    setTimeout(() => {
      this.setState({showLoading: false});
    }, 500);
  }

  goBack() {
    let d = new Date();
    //if (global.community.code == "jakartagardencity") {
    // this.setState({ webUri: 'http://172.30.2.115:3000/?community=' + global.community.code + '&t=' + d.getTime(), title: global.community.text, canGoBack: false, canChangeCommunity: true });
    this.setState({
      webUri:
        global.serverurl +
        global.develbase +
        '/?community=' +
        global.community.code +
        '&t=' +
        d.getTime(),
      title: global.community.text,
      canGoBack: false,
      canChangeCommunity: true,
    });

    /*} else {
            this.setState({ webUri: global.serverurl + '/?t=' + d.getTime(), title: global.community.text, canGoBack: false, canChangeCommunity: true });
        }*/
  }

  //----receive on message from webview
  receivePost(param) {
    console.log(param);
    let jsonParam = JSON.parse(param);

    //sent message to webview
    //this.webview.postMessage('{"field":"value"}');

    if (jsonParam.code === undefined) {
      jsonParam.title = global.community.text;
      if (jsonParam.canChangeCommunity == undefined)
        jsonParam.canChangeCommunity = true;
      if (jsonParam.needLogin) {
        this.props.navigation.replace('Login');
        return false;
      }
      if (jsonParam.needBinding) {
        this.props.navigation.replace('AccountBindingModernland');
        return false;
      }
      this.setState({
        title: jsonParam.title,
        canGoBack: jsonParam.canGoBack,
        canChangeCommunity: jsonParam.canChangeCommunity,
        hideTopbar: jsonParam.hideTopbar,
        hideFooterMenu: jsonParam.hideFooterMenu,
      });
      // Alert.alert('title', param, [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      // { text: 'OK', onPress: () => console.log('OK Pressed') }], { cancelable: false });
    } else {
      if (jsonParam.code === 'openbrowser') {
        Linking.canOpenURL(jsonParam.url)
          .then((supported) => {
            if (!supported) {
              //console.log('Can\'t handle url: ' + url);
              Alert.alert(
                'Alert',
                'Can not handle url : ' + jsonParam.url,
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: false},
              );
            } else {
              return Linking.openURL(jsonParam.url);
            }
          })
          .catch((err) => {
            Alert.alert(
              'Alert',
              'Error : ' + err,
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
          });
      } else if (jsonParam.code === 'receivelogin') {
        this.flag.sendLoginInfo = true;
        clearInterval(this.intervalLogin);
        this.intervalLogin == null;
      } else if (jsonParam.code === 'receiveloginToken') {
        this.flag.sendToken = true;
        clearInterval(this.intervalToken);
        this.intervalToken == null;
      } else if (jsonParam.code === 'receiveloginUser') {
        this.flag.sendUser = true;
        clearInterval(this.intervalUser);
        this.intervalUser == null;
      } else if (jsonParam.code === 'receiveloginBinding') {
        this.flag.sendBindingInfo = true;
        clearInterval(this.intervalBinding);
        this.intervalBinding == null;
      } else if (jsonParam.code === 'receivelogout') {
        //this.flag.sendLoginInfo = true;
        AsyncStorage.removeItem('smart-app-do-logout');
        clearInterval(this.intervalLogout);
        this.intervalLogout == null;
      } else if (jsonParam.code === 'need-login') {
        this.props.navigation.replace('Login');
      } else if (jsonParam.code === 'need-binding') {
        this.props.navigation.replace('AccountBindingModernland');
      } else if (jsonParam.code === 'need-home') {
        this.props.navigation.replace('Home');
      } else if (jsonParam.code === 'need-moment') {
        this.props.navigation.replace('AddMoment');
      }
    }
  }

  sendMessage = (code, param) => {
    if (param.constructor != 'string'.constructor)
      param = JSON.stringify(param);

    // console.log(param);

    if (this.webview) {
      //console.log('sent message : '+param);
      let tmp = this.webview.postMessage(
        '{"code":"' + code + '", "param":' + param + '}',
      );
      //if(code === 'logout'){
      //AsyncStorage.removeItem(global.appId+'-do-logout');
      //}
    } else {
      setTimeout(() => {
        this.sendMessage(code, param);
      }, 300);
    }
  };
  //------------------------------------

  refreshPage = () => {
    let d = new Date();
    // this.setState({ webUri: 'http://172.30.2.115:3000/?community=' + global.community.code + '&t=' + d.getTime(), title: community.text, canGoBack: false, canChangeCommunity: true, hideTopbar: false, hideFooterMenu:false });
    this.setState({
      webUri:
        global.serverurl +
        global.develbase +
        '/?community=' +
        global.community.code +
        '&t=' +
        d.getTime(),
      title: community.text,
      canGoBack: false,
      canChangeCommunity: true,
      hideTopbar: false,
      hideFooterMenu: false,
    });
  };

  onErrorWebview() {
    //alert('testing');
  }

  renderHeader = () => {
    if (!this.state.hideTopbar) {
      return (
        <HeaderTitle
          param={{
            title: this.state.title,
            canGoBack: this.state.canGoBack,
            canChangeCommunity: this.state.canChangeCommunity,
            communityList: this.state.communityList,
          }}
          change={this.changeCommunity.bind(this)}
          navigation={this.props.navigation}
          back={this.goBack.bind(this)}
        />
      );
    }
  };

  renderFooter = () => {
    if (!this.state.hideFooterMenu) {
      return (
        <FooterMenu
          navigation={this.props.navigation}
          currentMenu={1}
          refreshPage={this.refreshPage}
        />
      );
    }
  };

  renderPrepareQuit = () => {
    if (this.state.prepareQuit) {
      return (
        <PrepareQuit
          started={this.state.prepareQuit}
          cancel={this.cancelQuit}
        />
      );
    }
  };

  renderLoading = () => {
    if (this.state.showLoading) {
      return <LoadingScreen></LoadingScreen>;
    }
  };

  render() {
    const INJECTEDJAVASCRIPT =
      "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); ";

    return (
      <View style={globalStyles.screenContainer}>
        {/* {this.renderHeader()} */}

        <View
          style={{
            position: 'absolute',
            top: this.state.hideTopbar ? 0 : 0,
            left: 0,
            right: 0,
            bottom: this.state.hideFooterMenu ? 0 : 0,
          }}>
          <WebView
            ref={(ref) => (this.webview = ref)}
            source={{uri: this.state.webUri}}
            onMessage={(event) => {
              this.receivePost(event.nativeEvent.data);
            }}
            scrollEnabled={false}
            geolocationEnabled={true}
            renderError={() => this.onErrorWebview()}
            injectedJavaScript={INJECTEDJAVASCRIPT}
          />
        </View>

        {/* <View>
          <Button
            title="Click me"
            onPress={() => {
              Linking.openURL('http://109.203.100.85');
            }}
          />
        </View> */}

        {/* {this.renderFooter()} */}
        {this.renderPrepareQuit()}
        {this.renderLoading()}
      </View>
    );
  }
}

export default HomeScreen;
