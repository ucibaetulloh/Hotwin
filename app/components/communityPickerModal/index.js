import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  WebView,
  Image,
  TouchableHighlight,
  Modal,
} from 'react-native';

import styles from './style';
import {getPageLang} from '../../languages';

class CommunityPickerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      communityList: props.communityList,
    };
    this.pagelang = getPageLang('communityselect');
  }

  componentWillReceiveProps = (props) => {
    this.setState({communityList: props.communityList});
  };

  selectCommunity(select) {
    this.setModalVisible(!this.state.modalVisible);
    this.props.changeCommunity(select);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  renderCommunityList = () => {
    if (this.state.communityList !== undefined) {
      return (
        <View>
          {this.state.communityList.map((comm, i) => (
            <TouchableHighlight
              key={i}
              onPress={() => {
                this.selectCommunity({code: comm.id, text: comm.name});
              }}
              underlayColor={'#f2f2f2'}
              style={styles.modalItemContainer}>
              <Text style={styles.modalItem}>{comm.name}</Text>
            </TouchableHighlight>
          ))}
        </View>
      );
    }
  };

  render() {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            //alert('Modal has been closed.');
          }}>
          <TouchableHighlight
            underlayColor={'rgba(0,0,0,0)'}
            onPress={() => this.setModalVisible(false)}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              paddingTop: 50,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              paddingLeft: 40,
              paddingRight: 40,
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.topContainer}>
                {this.renderCommunityList()}
              </View>
            </View>
          </TouchableHighlight>
        </Modal>
      </View>
    );
  }
}

export default CommunityPickerModal;
