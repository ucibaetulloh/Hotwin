import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  WebView,
  Image,
  TouchableHighlight,
} from 'react-native';

import styles from './style';
import {getPageLang} from '../../languages';

import HomePressed from '../../assets/images/icon/33-trail-home.png';
import HomeNormal from '../../assets/images/icon/33-trail-home-2.png';
import IotPressed from '../../assets/images/icon/32-ccc-smarthome.png';
import IotNormal from '../../assets/images/icon/37-ccc-smarthome-2.png';
import NewsPressed from '../../assets/images/icon/31-trail-entertain.png';
import NewsNormal from '../../assets/images/icon/31-trail-entertain-2.png';
import SmartPressed from '../../assets/images/icon/35-trail-marketplace.png';
import SmartNormal from '../../assets/images/icon/35-trail-marketplace-2.png';
import ProfilePressed from '../../assets/images/icon/34-trail-profile.png';
import ProfileNormal from '../../assets/images/icon/34-trail-profile-2.png';

class FooterMenu extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang('menu');
    this.state = {
      currentMenu: parseInt(props.currentMenu),
      menu: [
        {
          id: 1,
          text: this.pagelang['menu1'],
          style:
            props.currentMenu == 1 ? styles.activelink : styles.nonactivelink,
          imgSource: props.currentMenu == 1 ? HomePressed : HomeNormal,
        },
        // {
        //   id: 2,
        //   text: this.pagelang['menu2'],
        //   style:
        //     props.currentMenu == 2 ? styles.activelink : styles.nonactivelink,
        //   imgSource: props.currentMenu == 2 ? IotPressed : IotNormal,
        // },
        {
          id: 3,
          text: this.pagelang['menu3'],
          style:
            props.currentMenu == 3 ? styles.activelink : styles.nonactivelink,
          imgSource: props.currentMenu == 3 ? NewsPressed : NewsNormal,
        },
        {
          id: 4,
          text: this.pagelang['menu4'],
          style:
            props.currentMenu == 4 ? styles.activelink : styles.nonactivelink,
          imgSource: props.currentMenu == 4 ? SmartPressed : SmartNormal,
        },
        {
          id: 5,
          text: this.pagelang['menu5'],
          style:
            props.currentMenu == 5 ? styles.activelink : styles.nonactivelink,
          imgSource: props.currentMenu == 5 ? ProfilePressed : ProfileNormal,
        },
      ],
    };
  }

  _changeMenu(idx) {
    if (this.state.currentMenu != idx) {
      this.setState({currentMenu: idx});
      if (idx == 1) {
        this.props.navigation.replace('Home');
      } else if (idx == 3) {
        this.props.navigation.replace('Entertainment');
      } else if (idx == 4) {
        this.props.navigation.replace('Marketplace');
      } else if (idx == 5) {
        this.props.navigation.replace('MyPage');
      }
    } else {
      this.props.refreshPage();
    }
  }

  render() {
    return (
      <View style={styles.footer}>
        {this.state.menu.map((menu, i) => (
          <View style={styles.menuView} key={menu.id}>
            <TouchableHighlight
              onPress={() => this._changeMenu(menu.id)}
              underlayColor={'rgba(0,0,0,0)'}>
              <View style={styles.menuItem}>
                <Image
                  source={menu.imgSource}
                  style={{
                    resizeMode: 'contain',
                    flex: 1,
                    width: 28,
                    height: 28,
                  }}
                />
                <Text style={menu.style}>{menu.text}</Text>
              </View>
            </TouchableHighlight>
          </View>
        ))}
      </View>
    );
  }
}

export default FooterMenu;
