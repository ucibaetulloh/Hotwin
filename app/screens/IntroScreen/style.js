import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({

    MainContainer:{
        flex: 1,
        justifyContent: 'center',
        alignContent:'center',
        alignItems:'center',
        paddingTop: 0,
        padding: 8,
    },
    pictureContainer: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        paddingTop: 16,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom: 16,
        elevation: 6
    },
    paragraph: {
        margin: 12,
        fontSize: 20,
        fontWeight: 'bold',
        color:'#000',
        textAlign: 'center',
    },
    
    formRowContainer:{
        paddingRight:15,
        paddingLeft:15,
        backgroundColor:'#fff',
    },
    formRow:{
        flex:0,
        flexShrink:1,
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#d9d9d9',
        paddingLeft:10,
        paddingRight:10
    },
    formColumn:{
        flex:1,
        paddingTop:15,
        paddingBottom:15,
        justifyContent:"center"
    },
    formColumnAlignRight:{
        textAlign:'right',
    },
    picture:{
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:1,
        borderColor:'#d9d9d9'
    },
    center:{
        textAlign:'center',
        color:'#dd0000'
    }

});
export default styles;
