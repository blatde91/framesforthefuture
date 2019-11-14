/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { CharacterButton } from '../../components/Buttons';
import * as character from '../../assets/CharacterData/index';

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  cssContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 60,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
});

class CSS extends Component {
  render() {
    const { navigation } = this.props;
    return (

      <ImageBackground
        style={styles.background}
        source={require('../../assets/CSSAssets/Background.png')}
      >
        <View style={styles.cssContainer}>
          <View style={styles.column}>
            <CharacterButton
              char="Gouki"
              directory={character.Gouki}
              onPress={() => navigation.navigate('CharData', {
                char: 'Gouki',
                directory: character.Gouki,
              })}
              img={require('../../assets/CSSAssets/CSS-Gouki.png')}
            />
            <CharacterButton
              char="Urien"
              directory={character.Urien}
              onPress={() => navigation.navigate('CharData', {
                char: 'Urien',
                directory: character.Urien,
              })}
              img={require('../../assets/CSSAssets/CSS-Urien.png')}
            />
            <CharacterButton
              char="Necro"
              directory={character.Necro}
              onPress={() => navigation.navigate('CharData', {
                char: 'Necro',
                directory: character.Necro,
              })}
              img={require('../../assets/CSSAssets/CSS-Necro.png')}
            />
            <CharacterButton
              char="Ibuki"
              directory={character.Ibuki}
              onPress={() => navigation.navigate('CharData', {
                char: 'Ibuki',
                directory: character.Ibuki,
              })}
              img={require('../../assets/CSSAssets/CSS-Ibuki.png')}
            />
            <CharacterButton
              char="Sean"
              directory={character.Sean}
              onPress={() => navigation.navigate('CharData', {
                char: 'Sean',
                directory: character.Sean,
              })}
              img={require('../../assets/CSSAssets/CSS-Sean.png')}
            />
            <CharacterButton
              char="Alex"
              directory={character.Alex}
              onPress={() => navigation.navigate('CharData', {
                char: 'Alex',
                directory: character.Alex,
              })}
              img={require('../../assets/CSSAssets/CSS-Alex.png')}
            />

          </View>
          <View style={styles.column}>
            <CharacterButton
              char="Yun"
              directory={character.Yun}
              onPress={() => navigation.navigate('CharData', {
                char: 'Yun',
                directory: character.Yun,
              })}
              img={require('../../assets/CSSAssets/CSS-Yun.png')}
            />
            <CharacterButton
              char="Remy"
              directory={character.Remy}
              onPress={() => navigation.navigate('CharData', {
                char: 'Remy',
                directory: character.Remy,
              })}
              img={require('../../assets/CSSAssets/CSS-Remy.png')}
            />
            <CharacterButton
              char="Q"
              directory={character.Q}
              onPress={() => navigation.navigate('CharData', {
                char: 'Q',
                directory: character.Q,
              })}
              img={require('../../assets/CSSAssets/CSS-Q.png')}
            />
            <CharacterButton
              char="Chun-Li"
              directory={character.Chun}
              onPress={() => navigation.navigate('CharData', {
                char: 'Chun-Li',
                directory: character.Chun,
              })}
              img={require('../../assets/CSSAssets/CSS-ChunLi.png')}
            />
            <CharacterButton
              char="Makoto"
              directory={character.Makoto}
              onPress={() => navigation.navigate('CharData', {
                char: 'Makoto',
                directory: character.Makoto,
              })}
              img={require('../../assets/CSSAssets/CSS-Makoto.png')}
            />
            <CharacterButton
              char="Twelve"
              directory={character.Twelve}
              onPress={() => navigation.navigate('CharData', {
                char: 'Twelve',
                directory: character.Twelve,
              })}
              img={require('../../assets/CSSAssets/CSS-Twelve.png')}
            />
            <CharacterButton
              char="Yang"
              directory={character.Yang}
              onPress={() => navigation.navigate('CharData', {
                char: 'Yang',
                directory: character.Yang,
              })}
              img={require('../../assets/CSSAssets/CSS-Yang.png')}
            />
          </View>
          <View style={styles.column}>
            <CharacterButton
              char="Ryu"
              directory={character.Ryu}
              onPress={() => navigation.navigate('CharData', {
                char: 'Ryu',
                directory: character.Ryu,
              })}
              img={require('../../assets/CSSAssets/CSS-Ryu.png')}
            />
            <CharacterButton
              char="Oro"
              directory={character.Oro}
              onPress={() => navigation.navigate('CharData', {
                char: 'Oro',
                directory: character.Oro,
              })}
              img={require('../../assets/CSSAssets/CSS-Oro.png')}
            />
            <CharacterButton
              char="Dudley"
              directory={character.Dudley}
              onPress={() => navigation.navigate('CharData', {
                char: 'Dudley',
                directory: character.Dudley,
              })}
              img={require('../../assets/CSSAssets/CSS-Dudley.png')}
            />
            <CharacterButton
              char="Elena"
              directory={character.Elena}
              onPress={() => navigation.navigate('CharData', {
                char: 'Elena',
                directory: character.Elena,
              })}
              img={require('../../assets/CSSAssets/CSS-Elena.png')}
            />
            <CharacterButton
              char="Hugo"
              directory={character.Hugo}
              onPress={() => navigation.navigate('CharData', {
                char: 'Hugo',
                directory: character.Hugo,
              })}
              img={require('../../assets/CSSAssets/CSS-Hugo.png')}
            />
            <CharacterButton
              char="Ken"
              directory={character.Ken}
              onPress={() => navigation.navigate('CharData', {
                char: 'Ken',
                directory: character.Ken,
              })}
              img={require('../../assets/CSSAssets/CSS-Ken.png')}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default CSS;
