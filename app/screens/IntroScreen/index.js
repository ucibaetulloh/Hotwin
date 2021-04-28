import React from 'react';
import {
  View,
  BackHandler,
  AsyncStorage,
  ImageBackground,
  DeviceEventEmitter,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

class IntroScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideTopbar: false,
      prepareQuit: false,
      show_Main_App: true,
    };

    this.setInterval = null;
  }

  componentWillMount() {
    DeviceEventEmitter.addListener('timer', this.clearTimer.bind(this));
  }

  componentDidMount() {
    // this.startTimer();

    AsyncStorage.getItem('first_time').then((value) => {
      this.setState({show_Main_App: !!value});
    });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    // this.clearTimer();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  startTimer() {
    this.timeout = setInterval(() => {
      this.tick();
    }, 2000);
  }

  clearTimer() {
    // Handle an undefined timer rather than null
    this.timeout !== undefined ? this.clearInterval(this.timeout) : null;
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

  on_Done_All_slide = () => {
    AsyncStorage.setItem('first_time', 'true').then(() => {
      this.setState({show_Main_App: true});
      //   this.props.navigation.navigate('Home');
    });
  };

  on_Skip_slides = () => {
    AsyncStorage.setItem('first_time', 'true').then(() => {
      this.setState({show_Main_App: true});
      //   this.props.navigation.navigate('Home');
    });
  };

  goToHome = () => {
    setTimeout(() => {
      this.props.navigation.navigate('Home');
    }, 1000);
  };

  i = 0;

  tick = () => {
    if (this.state.show_Main_App === false) {
      this.slider.goToSlide(this.i); //this.slider is ref of <AppIntroSlider....
      this.i += 1;
      if (this.i == slides.length) {
        // this.i = 0;
        clearInterval(this.timeout);
      }
      return;
    } else {
    }
  };

  render() {
    return (
      <ImageBackground style={styles.pictureContainer}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 50,
          }}>
          <Image
            source={require('../../assets/images/logo-trail.png')}
            style={{
              height: 120,
              width: 250,
            }}
          />

          {this.goToHome()}
        </View>
      </ImageBackground>
    );
    // if (this.state.show_Main_App) {
    //   return (
    //     <ImageBackground style={styles.pictureContainer}>
    //       <View
    //         style={{
    //           flex: 1,
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           padding: 50,
    //         }}>
    //         <Image
    //           source={require('../../assets/images/MainLogoPNG.png')}
    //           style={{
    //             height: 250,
    //             width: 250,
    //             marginTop: -50,
    //             marginBottom: 10,
    //           }}
    //         />

    //         {this.goToHome()}
    //       </View>
    //     </ImageBackground>
    //   );
    // } else {
    //   return (
    //     <AppIntroSlider
    //       ref={(ref) => (this.slider = ref)}
    //       slides={slides}
    //       onDone={this.on_Done_All_slide}
    //       bottomButton
    //     />
    //   );
    // }
  }
}
export default IntroScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
  image: {
    marginTop: 50,
    width: '100%',
    height: '100%',
  },
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  pictureContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 16,
    elevation: 6,
    backgroundColor: '#fff',
  },
});

const slides = [
  {
    key: 'k1',
    image: require('../../assets/images/banner01.jpg'),
    imageStyle: styles.image,
    title: 'Innovation',
    text: 'Work together with partners to create industrial technology',
  },
  {
    key: 'k2',
    image: require('../../assets/images/banner02.jpg'),
    imageStyle: styles.image,
    title: 'Ecology',
    text:
      'Ecological aggregation, providing one-stop service of industry chain',
  },
  {
    key: 'k3',
    image: require('../../assets/images/banner03.jpg'),
    imageStyle: styles.image,
    title: 'Service',
    text: 'Market place food garden, laundry, maintenance, service etc.',
  },
];
