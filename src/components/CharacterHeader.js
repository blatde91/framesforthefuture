import React from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  View,
  Platform,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/Octicons';

// import { TouchableOpacity } from 'react-native-gesture-handler';


const styles = StyleSheet.create({
  stageContainer: {
    flex: 1.20,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    minHeight: 45,
    flexDirection: 'row',
  },
  characterText: {
    color: 'white',
    fontSize: 68,
    fontWeight: Platform.OS === 'ios' ? '800' : '1000',
    fontStyle: 'italic',
  },
  contentRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  info: {
    position: 'absolute',
    top: 40,
    right: 25,
    height: 25,
    width: 25,
  },
  img: {
    width: '100%',
    height: '100%',
  },
});

const CharacterHeader = (props) => (
  <ImageBackground
    source={props.stage}
    style={styles.stageContainer}
  >
    <View style={styles.info}>
      <TouchableOpacity onPress={props.onPress}>
        <Image style={styles.img} source={require('../assets/info.png')} />
      </TouchableOpacity>
    </View>
    <View style={styles.contentRow}>
      <Image source={props.idle} />
      <Text
        style={styles.characterText}
      >
        {props.character}
      </Text>
    </View>
  </ImageBackground>
);

export default CharacterHeader;
