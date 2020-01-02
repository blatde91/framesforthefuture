import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image, Platform,
} from 'react-native';

const styles = StyleSheet.create({
  buttonContainer: {
    height: '100%',
    width: '100%',
    flex: 1,
    borderColor: 'black',
    backgroundColor: '#1d1d1d',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  lowButtonContainer: {
    height: '100%',
    width: '100%',
    flex: 1,
    borderColor: 'black',
    justifyContent: 'center',
    padding: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 22,
    marginTop: Platform.OS === 'ios' ? 10 : 5,
    marginBottom: Platform.OS === 'ios' ? 0 : 10,
    opacity: 0.5,
  },
  charButton: {
    height: 58,
    width: 85,
    marginBottom: 1,
  },
  charButtImg: {
    height: '100%',
    width: '100%',

  },
});

const ToggleButton = (props) => (
  <TouchableOpacity
    style={[styles.buttonContainer, props.active ? {
      borderBottomWidth: 3,
      borderColor: props.altColor,
    } : null]}
    onPress={props.onPress}
  >
    <Text style={[styles.buttonText, props.active ? {
      color: props.altColor,
      opacity: 1,
    } : null]}
    >
      {props.text}
    </Text>
  </TouchableOpacity>
);

const LowToggleButton = (props) => (
  <TouchableOpacity
    style={[styles.lowButtonContainer, {
      backgroundColor: props.active ? '#ea6204' : '#555555',
      borderTopWidth: props.active ? 1 : 0,
      borderLeftWidth: props.active ? 1 : 0,
      borderRightWidth: props.active ? 1 : 0,
      borderBottomWidth: props.active ? 0 : 1,
    }]}
    onPress={props.onPress}
  >
    <Text style={styles.buttonText}>{props.text}</Text>
  </TouchableOpacity>
);

const CharacterButton = (props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.charButton}>
    <Image source={props.img} style={styles.charButtImg} />
  </TouchableOpacity>
);

export { ToggleButton, LowToggleButton, CharacterButton };
