import {StyleSheet} from 'react-native';

const headerStyles = StyleSheet.create({
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    //backgroundColor: '#007aff',
    backgroundColor: '#ac181c',
    elevation: 5,
    borderBottomWidth: 1,
    borderColor: '#ac181c',
    zIndex: 150,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    padding: 0,
  },
  textTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leftContainer: {
    alignItems: 'center',
    width: 70,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#379afb',
  },
  middleContainer: {
    alignItems: 'center',
  },
  rightContainer: {
    alignItems: 'center',
    width: 70,
  },
  pointerImg: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 4,
  },
});
export default headerStyles;
