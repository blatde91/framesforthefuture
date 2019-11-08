import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';

class CSS extends Component {
  render() {
    return (
      <View>
        <Button
          title="Alex"
          onPress={() => navigate('CharData', {char: 'Alex'})}
        />
      </View>
    );
  }
}

export default CSS;
