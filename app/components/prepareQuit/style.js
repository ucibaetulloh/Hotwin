import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    viewContainer: {
        position: 'absolute',
        bottom:100,
        left:0,
        right:0,
        zIndex:200,
        flex:1,
        
    },
    floatingTextContainer: {
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor:'rgba(0,0,0,.5)',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    floatingText:{
        color:'#ffffff'
    },

});
export default styles;