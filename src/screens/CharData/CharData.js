import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { ToggleButton, LowToggleButton } from '../../components/Buttons';
import CharacterHeader from '../../components/CharacterHeader';
import MoveCard from '../../components/MoveCard';
import BasicModal from '../../components/BasicModal';


const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#1d1d1d',
    marginHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 30,
    marginBottom: Platform.OS === 'ios' ? 40 : 0,
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  tabRow: {
    height: '100%',
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1d1d1d',
  },
  optionContainer: {
    flex: 0.35,
    flexDirection: 'column',
  },

});

class CharData extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = { backgroundColor: '#282c33', height: 60 };
    const headerTitle = (<Image source={require('../../assets/logo.png')} style={{ width: 100, height: 80, marginBottom: 10 }} />);
    return { headerStyle, headerTitle };
  };

  constructor(props) {
    super(props);
    this.state = {
      topActive: 'normals',
      lowActive: 'first',
      displayOption: 'card',
      basicModal: false,
    };
  }

  componentDidMount() {
    this.createBasicArrays();
  }

  toggleModal = () => {
    const { basicModal } = this.state;
    this.setState({
      basicModal: !basicModal,
    });
  }

  createBasicArrays = () => {
    const { navigation } = this.props;
    const directory = navigation.getParam('directory');
    const { basics } = directory;
    const jumps = [];
    const wakeups = [];
    const dashes = [];

    basics.map((item, id) => {
      const { type } = item.move;
      if (type === 'Jump') {
        jumps.push(item);
      } if (type === 'Dash') {
        dashes.push(item);
      } if (type === 'Wakeup') {
        wakeups.push(item);
      }
    });
    this.setState({
      jumps,
      dashes,
      wakeups,
    });
  }

  toggleDisplayOption = (option) => {
    this.setState({
      displayOption: option,
    });
  }

  toggleData = (active) => {
    this.setState({
      lowActive: active,
    });
  }

  toggleMoves = (active) => {
    this.setState({
      topActive: active,
      lowActive: 'first',
    });
  }

  determineColor = (str) => {
    const int = parseInt(str);
    if (int > 0) {
      return { color: '#4fff42' };
    } if (int < 0) {
      return { color: 'red' };
    } if (str === 'D') {
      return { color: 'yellow' };
    } return { color: 'white' };
  }

  addPlusSign = (str) => {
    const int = parseInt(str);
    if (int > 0) {
      return `+${str}`;
    } return str;
  }

  moveTypeRender = () => {
    const { navigation } = this.props;
    const directory = navigation.getParam('directory');
    const {
      data, specials, supers,
    } = directory;
    const { topActive } = this.state;
    if (topActive === 'normals') {
      return this.renderFrameData(data);
    } if (topActive === 'specials') {
      return this.renderSpecSup(specials);
    } if (topActive === 'supers') {
      return this.renderSpecSup(supers);
    } return null;
  }

  renderSecondButtonRow = () => {
    const { topActive, lowActive } = this.state;

    if (topActive === 'normals') {
      return (
        <View style={styles.tabRow}>
          <LowToggleButton text="Frame Data" active={lowActive === 'first'} onPress={() => this.toggleData('first')} />
          <LowToggleButton text="Frame Adv" active={lowActive === 'second'} onPress={() => this.toggleData('second')} />
          <LowToggleButton text="Other" active={lowActive === 'third'} onPress={() => this.toggleData('third')} />
        </View>
      );
    } return (
      <View style={styles.tabRow}>
        <LowToggleButton text="Frame Data" active={lowActive === 'first'} onPress={() => this.toggleData('first')} />
        <LowToggleButton text="Other" active={lowActive === 'second'} onPress={() => this.toggleData('second')} />
      </View>
    );
  }

  renderCardView = () => {
    const { topActive } = this.state;
    const { navigation } = this.props;
    const directory = navigation.getParam('directory');
    const charColor = navigation.getParam('color');
    const textColor = navigation.getParam('textColor');
    const altColor = navigation.getParam('altColor');
    const {
      data, specials, supers,
    } = directory;
    let cards;
    if (topActive === 'normals') {
      cards = data.map((item) => {
        const {
          name, startup, hit, recovery, blockAdv, hitAdv, crHitAdv, parry, damage, stun,
        } = item.move;
        return (
          <MoveCard
            key={`${name}${startup}`}
            name={name}
            startup={startup}
            hit={hit}
            recovery={recovery}
            onBlock={blockAdv}
            onHit={hitAdv}
            onCrHit={crHitAdv}
            parry={parry}
            damage={damage}
            stun={stun}
            type={topActive}
            motion={false}
            color={charColor}
            textColor={textColor}
            altColor={altColor}
          />
        );
      });
    } if (topActive === 'specials') {
      cards = specials.map((item) => {
        const {
          name, startup, hit, recovery, blockAdv, hitAdv, crHitAdv, parry, damage, stun, motion,
        } = item.move;
        return (
          <MoveCard
            key={`${name}${startup}`}
            name={name}
            startup={startup}
            hit={hit}
            recovery={recovery}
            onBlock={blockAdv}
            onHit={hitAdv}
            onCrHit={crHitAdv}
            parry={parry}
            damage={damage}
            stun={stun}
            type={topActive}
            motion={motion}
            color={charColor}
            textColor={textColor}
          />
        );
      });
    } if (topActive === 'supers') {
      cards = supers.map((item) => {
        const {
          name, startup, hit, recovery, blockAdv, hitAdv, crHitAdv, parry, damage, stun, motion,
        } = item.move;
        return (
          <MoveCard
            key={`${name}${startup}`}
            name={name}
            startup={startup}
            hit={hit}
            recovery={recovery}
            onBlock={blockAdv}
            onHit={hitAdv}
            onCrHit={crHitAdv}
            parry={parry}
            damage={damage}
            stun={stun}
            type={topActive}
            motion={motion}
            color={charColor}
            textColor={textColor}
          />
        );
      });
    }
    return (
      <ScrollView style={styles.cardContainer}>
        {cards}
        <View style={{ marginTop: 75 }} />
      </ScrollView>
    );
  }

  render() {
    const { navigation } = this.props;
    const {
      // jumps,
      // dashes,
      // wakeups,
      topActive,
      displayOption,
      basicModal,
    } = this.state;
    const char = navigation.getParam('char');
    const directory = navigation.getParam('directory');
    const altColor = navigation.getParam('altColor');
    const capChar = char.toUpperCase();
    const { stage, idle } = directory;
    return (
      <View style={styles.mainContainer}>
        <CharacterHeader
          character={capChar}
          stage={stage}
          idle={idle}
          onPress={this.toggleModal}
        />
        <View style={styles.optionContainer}>
          <View style={styles.buttonRow}>
            <ToggleButton text="Normals" altColor={altColor} active={topActive === 'normals'} onPress={() => this.toggleMoves('normals')} />
            <ToggleButton text="Specials" altColor={altColor} active={topActive === 'specials'} onPress={() => this.toggleMoves('specials')} />
            <ToggleButton text="Supers" altColor={altColor} active={topActive === 'supers'} onPress={() => this.toggleMoves('supers')} />
          </View>
        </View>
        <View style={{ flex: 5, flexDirection: 'column' }}>
          {displayOption === 'card' && this.renderCardView()}
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={basicModal}
          onRequestClose={() => {
            this.setState({
              basicModal: false,
            });
          }}
        >
          <BasicModal
            modalClose={this.toggleModal}
            data={directory}
            char={char}
          />
        </Modal>
      </View>
    );
  }
}

export default CharData;
