import { Platform, StyleSheet, Dimensions } from 'react-native'


let isIphoneX =()=>{
    const dimen = Dimensions.get('window');
    return(Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
    )
}

const globalStyles = StyleSheet.create({
    screenContainer:{
        flex:1,
        marginTop: Platform.OS === 'ios' ? (isIphoneX() === true ? 54 : 20) : 0
    }
});

export default globalStyles;