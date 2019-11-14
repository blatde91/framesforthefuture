import React from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Image,
} from 'react-native';


const styles = StyleSheet.create({
  stageContainer: {
    flex: 1.25,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    minHeight: 45,
    flexDirection: 'row',
  },
  characterText: {
    color: 'white',
    fontSize: 68,
    fontWeight: '800',
    fontStyle: 'italic',
  },
});

const CharacterHeader = (props) => (
  <ImageBackground
    source={props.stage}
    style={styles.stageContainer}
  >
    <Image source={props.idle} />
    <Text
      style={styles.characterText}
    >
      {props.character}
    </Text>
  </ImageBackground>
);

export default CharacterHeader;
