/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CreditsModal from '../../components/CreditsModal';
import { CharacterButton } from '../../components/Buttons';
import * as character from '../../assets/CharacterData/index';

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: '#555555',
  },
  topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    marginHorizontal: 40,
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
    marginHorizontal: 60,
  },
  cssContainer: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 80,
    // marginTop: 90,
  },
  headerText: {
    color: 'white',
    fontSize: 36,
    fontWeight: Platform.OS === 'ios' ? '800' : '900',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  column: {
    flexDirection: 'column',
  },
});

class CSS extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = { backgroundColor: '#555555', height: 80 };
    const headerTitle = (<Image source={require('../../assets/logo.png')} style={{ width: 100, height: 80, marginBottom: 10 }} />);
    return { headerStyle, headerTitle };
  };

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
  }

  toggleCredits = () => {
    const { modalOpen } = this.state;
    this.setState({
      modalOpen: !modalOpen,
    });
  }

  render() {
    const { navigation } = this.props;
    const { modalOpen } = this.state;
    return (

      <ImageBackground
        style={styles.background}
        source={require('../../assets/CSSAssets/Background.png')}
      >
        <View style={styles.topContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Choose a Fighter</Text>
          </View>
        </View>
        <View style={styles.cssContainer}>
          <View style={styles.column}>
            <CharacterButton
              char="Gouki"
              directory={character.Gouki}
              onPress={() => navigation.navigate('CharData', {
                char: 'Gouki',
                directory: character.Gouki,
                color: '#414152',
                textColor: '#ffffff',
                altColor: '#F03A2E',
              })}
              img={require('../../assets/CSSAssets/CSS-Gouki.png')}
            />
            <CharacterButton
              char="Urien"
              directory={character.Urien}
              onPress={() => navigation.navigate('CharData', {
                char: 'Urien',
                directory: character.Urien,
                color: '#c3cbcb',
                textColor: '#000000',
                altColor: '#bd6a10',
              })}
              img={require('../../assets/CSSAssets/CSS-Urien.png')}
            />
            <CharacterButton
              char="Necro"
              directory={character.Necro}
              onPress={() => navigation.navigate('CharData', {
                char: 'Necro',
                directory: character.Necro,
                altColor: '#A3CBFF',
                textColor: '#121212',
                color: '#C19AFC',
              })}
              img={require('../../assets/CSSAssets/CSS-Necro.png')}
            />
            <CharacterButton
              char="Ibuki"
              directory={character.Ibuki}
              onPress={() => navigation.navigate('CharData', {
                char: 'Ibuki',
                directory: character.Ibuki,
                color: '#eac483',
                textColor: '#121212',
                altColor: '#f6c462',
              })}
              img={require('../../assets/CSSAssets/CSS-Ibuki.png')}
            />
            <CharacterButton
              char="Sean"
              directory={character.Sean}
              onPress={() => navigation.navigate('CharData', {
                char: 'Sean',
                directory: character.Sean,
                color: '#ffcd02',
                textColor: '#121212',
                altColor: '#ff0200',
              })}
              img={require('../../assets/CSSAssets/CSS-Sean.png')}
            />
            <CharacterButton
              char="Alex"
              directory={character.Alex}
              onPress={() => navigation.navigate('CharData', {
                char: 'Alex',
                directory: character.Alex,
                color: '#669933',
                textColor: '#ffffff',
                altColor: '#ff0200',
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
                color: '#037bcd',
                textColor: '#ffffff',
                altColor: '#FFFF00',
              })}
              img={require('../../assets/CSSAssets/CSS-Yun.png')}
            />
            <CharacterButton
              char="Remy"
              directory={character.Remy}
              onPress={() => navigation.navigate('CharData', {
                char: 'Remy',
                directory: character.Remy,
                color: '#8bc5ac',
                textColor: '#000000',
                altColor: '#ff0200',
              })}
              img={require('../../assets/CSSAssets/CSS-Remy.png')}
            />
            <CharacterButton
              char="Q"
              directory={character.Q}
              onPress={() => navigation.navigate('CharData', {
                char: 'Q',
                directory: character.Q,
                color: '#dec4a4',
                textColor: '#000000',
                altColor: '#ff0200',
              })}
              img={require('../../assets/CSSAssets/CSS-Q.png')}
            />
            <CharacterButton
              char="Chun-Li"
              directory={character.Chun}
              onPress={() => navigation.navigate('CharData', {
                char: 'Chun-Li',
                directory: character.Chun,
                color: '#63b4f6',
                textColor: '#000000',
                altColor: '#ffcd02',
              })}
              img={require('../../assets/CSSAssets/CSS-ChunLi.png')}
            />
            <CharacterButton
              char="Makoto"
              directory={character.Makoto}
              onPress={() => navigation.navigate('CharData', {
                char: 'Makoto',
                directory: character.Makoto,
                color: '#eddeb5',
                textColor: '#000000',
                altColor: '#fef538',
              })}
              img={require('../../assets/CSSAssets/CSS-Makoto.png')}
            />
            <CharacterButton
              char="Twelve"
              directory={character.Twelve}
              onPress={() => navigation.navigate('CharData', {
                char: 'Twelve',
                directory: character.Twelve,
                color: '#d4cde6',
                textColor: '#000000',
                altColor: '#e6eec5',
              })}
              img={require('../../assets/CSSAssets/CSS-Twelve.png')}
            />
            <CharacterButton
              char="Yang"
              directory={character.Yang}
              onPress={() => navigation.navigate('CharData', {
                char: 'Yang',
                directory: character.Yang,
                color: '#ff5952',
                textColor: '#ffffff',
                altColor: '#FFFF00',
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
                color: '#fffafa',
                textColor: '#121212',
                altColor: '#ff0200',
              })}
              img={require('../../assets/CSSAssets/CSS-Ryu.png')}
            />
            <CharacterButton
              char="Oro"
              directory={character.Oro}
              onPress={() => navigation.navigate('CharData', {
                char: 'Oro',
                directory: character.Oro,
                color: '#E3A739',
                textColor: '#121212',
                altColor: '#FF6459',
              })}
              img={require('../../assets/CSSAssets/CSS-Oro.png')}
            />
            <CharacterButton
              char="Dudley"
              directory={character.Dudley}
              onPress={() => navigation.navigate('CharData', {
                char: 'Dudley',
                directory: character.Dudley,
                color: '#738c4a',
                textColor: '#ffffff',
                altColor: '#68a5fe',
              })}
              img={require('../../assets/CSSAssets/CSS-Dudley.png')}
            />
            <CharacterButton
              char="Elena"
              directory={character.Elena}
              onPress={() => navigation.navigate('CharData', {
                char: 'Elena',
                directory: character.Elena,
                color: '#d16062',
                textColor: '#ffffff',
                altColor: '#68a5fe',
              })}
              img={require('../../assets/CSSAssets/CSS-Elena.png')}
            />
            <CharacterButton
              char="Hugo"
              directory={character.Hugo}
              onPress={() => navigation.navigate('CharData', {
                char: 'Hugo',
                directory: character.Hugo,
                color: '#ff6273',
                textColor: '#ffffff',
                altColor: '#d58251',
              })}
              img={require('../../assets/CSSAssets/CSS-Hugo.png')}
            />
            <CharacterButton
              char="Ken"
              directory={character.Ken}
              onPress={() => navigation.navigate('CharData', {
                char: 'Ken',
                directory: character.Ken,
                color: '#FF383B',
                textColor: '#ffffff',
                altColor: '#FFFF00',
              })}
              img={require('../../assets/CSSAssets/CSS-Ken.png')}
            />
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.aboutContainer}>
            <TouchableOpacity onPress={this.toggleCredits}>
              <Icon name="info-circle" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalOpen}
          onRequestClose={() => {
            this.setState({
              modalOpen: false,
            });
          }}
        >
          <CreditsModal
            modalClose={() => this.setState({
              modalOpen: false,
            })}
          />
        </Modal>
      </ImageBackground>
    );
  }
}

export default CSS;
