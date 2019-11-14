import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
} from 'react-native';

const styles = StyleSheet.create({
  buttonContainer: {
    height: '100%',
    width: '100%',
    flex: 1,
    borderColor: '#d4e4ef',
    borderLeftWidth: 2,
    borderRightWidth: 1,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  charButton: {
    height: 63,
    width: 90,
  },
  charButtImg: {
    height: '100%',
    width: '100%',
  },
});

const ToggleButton = (props) => (
  <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: props.active ? 'green' : 'red' }]} onPress={props.onPress}>
    <Text style={styles.buttonText}>{props.text}</Text>
  </TouchableOpacity>
);

const CharacterButton = (props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.charButton}>
    <Image source={props.img} style={styles.charButtImg} />
  </TouchableOpacity>
);

export { ToggleButton, CharacterButton };
