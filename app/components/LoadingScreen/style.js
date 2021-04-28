import { StyleSheet, Dimensions } from 'react-native'

const {width, height} = Dimensions.get('window');


const styles = StyleSheet.create({

    viewContainer: {
        position: 'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        zIndex:220,
        flex:1,
        backgroundColor:'rgba(0,0,0,.5)',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        padding:20,
        elevation: 6,
    },
    loadingContainer:{
        
        
    },
    spinnerImage:{
        height:150,
        width:150
    }
    
});
export default styles;