import { StyleSheet } from 'react-native'

const headerStyles = StyleSheet.create({
    headerTitle: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        height: 50,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        // backgroundColor: '#007aff',
        backgroundColor: '#f2f2f2',
        elevation: 5,
        borderBottomWidth: 1,
        borderColor: '#d9d9d9',
        zIndex: 150
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        height: 30,
        justifyContent: 'center',
        padding:0
    },
    textTitle: {
        color: '#000000',
        fontSize: 18,
        
    },
    leftContainer: {
        alignItems: 'center',
        width: 70
    },
    backButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center'
    },
    backButtonText: {
        color: '#379afb'
    },
    middleContainer: {
        alignItems: "center"
    },
    rightContainer: {
        alignItems: "center",
        width: 70
    },
    pointerImg:{
        height:20,
        width:20,
        resizeMode: 'contain',
        marginRight: 4
    }
});
export default headerStyles;