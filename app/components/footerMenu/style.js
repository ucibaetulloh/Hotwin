import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    height: 60,
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: '#ac181c',
    backgroundColor: '#ac181c',
  },
  menuView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  menuItem: {
    alignItems: 'center',
  },
  image: {
    flex: 1,
  },
  activelink: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  nonactivelink: {
    fontSize: 11,
    color: '#d9d9d9',
  },
});
export default styles;
