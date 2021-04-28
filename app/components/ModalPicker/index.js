import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Button,
  Image,
  TouchableHighlight,
} from 'react-native';

import styles from './style';

import {getPageLang} from '../../languages';

class ModalPicker extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang('modalpicker');
    this.state = {
      data: props.data,
      selectedValue: props.selectedValue,
    };
  }

  componentWillReceiveProps = (props) => {
    this.setState({data: props.data, selectedValue: props.selectedValue});
  };

  pick = (item) => {
    this.props.onPick(item);
  };

  cancel = () => {
    this.props.onCancel();
  };

  renderItem = (item, i) => {
    let style = i === 0 ? styles.itemContainerTop : styles.itemContainer;
    if (item.value === this.state.selectedValue) {
      return (
        <TouchableHighlight
          key={i}
          onPress={() => this.pick(item)}
          underlayColor={'rgba(0,0,0,0)'}>
          <View style={style}>
            <Text style={styles.itemTextSelected}>{item.text}</Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight
          key={i}
          onPress={() => this.pick(item)}
          underlayColor={'rgba(0,0,0,0)'}>
          <View style={style}>
            <Text style={styles.itemText}>{item.text}</Text>
          </View>
        </TouchableHighlight>
      );
    }
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <View style={styles.pickerContainer}>
          <ScrollView style={styles.scrollContainer}>
            {this.state.data.map((item, i) => this.renderItem(item, i))}
          </ScrollView>
          <View style={styles.cancelContainer}>
            <Button
              onPress={() => this.cancel()}
              title="Cancel"
              color="#ac181c"
              accessibilityLabel={'test'}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default ModalPicker;
