import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  ImageBackground,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { ToggleButton } from '../../components/Buttons';
import CharacterHeader from '../../components/CharacterHeader';

const styles = StyleSheet.create({
  cells: {
    flex: 1,
    borderRightWidth: 0.5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: 'white',
    textAlign: 'center',
    marginRight: 5,
    fontWeight: '600',
    fontSize: 15,
  },
  cellRow: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#282c33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellRowAlt: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#464D59',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    padding: 2,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ea6204',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    height: 50,
  },
  dataContainer: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 40 : 0,
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#282c33',
  },

});

class CharData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topActive: 'first',
      lowActive: 'first',
    };
  }

  renderHeaders = (data) => {
    const { topActive, lowActive } = this.state;
    const frameHeaders = ['Move', 'Startup', 'Hit', 'Recovery'];
    const advHeaders = ['Move', 'Blk Adv', 'Hit Adv', 'CrHit Adv'];
    const otherHeaders = ['Move', 'Parry', 'Dmg', 'Stun'];
    let items;
    if (lowActive === 'first') {
      items = frameHeaders.map((item) => (
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>{item}</Text>
        </View>
      ));
    } if (lowActive === 'second') {
      items = advHeaders.map((item) => (
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>{item}</Text>
        </View>
      ));
    } if (lowActive === 'third') {
      items = otherHeaders.map((item) => (
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>{item}</Text>
        </View>
      ));
    }
    return <View style={styles.headerRow}>{items}</View>;
  };

  renderFrameData = (data) => {
    const { topActive, lowActive } = this.state;
    let rows;
    if (lowActive === 'first') {
      rows = data.map((item, id) => (
        <View style={id % 2 === 0 ? styles.cellRow : styles.cellRowAlt}>
          <View style={styles.cells}>
            <Text style={styles.cellText}>{item.move.name}</Text>
          </View>
          <View style={styles.cells}>
            <Text style={styles.cellText}>{item.move.startup}</Text>
          </View>
          <View style={styles.cells}>
            <Text style={styles.cellText}>{item.move.hit}</Text>
          </View>
          <View style={styles.cells}>
            <Text style={styles.cellText}>{item.move.recovery}</Text>
          </View>
        </View>
      ));
    } if (lowActive === 'second') {
      rows = data.map((item, id) => {
        const {
          name, blockAdv, hitAdv, crHitAdv,
        } = item.move;
        return (
          <View style={id % 2 === 0 ? styles.cellRow : styles.cellRowAlt}>
            <View style={styles.cells}>
              <Text style={styles.cellText}>{name}</Text>
            </View>
            <View style={styles.cells}>
              <Text style={[styles.cellText, this.determineColor(blockAdv)]}>{this.addPlusSign(blockAdv)}</Text>
            </View>
            <View style={styles.cells}>
              <Text style={[styles.cellText, this.determineColor(hitAdv)]}>{this.addPlusSign(hitAdv)}</Text>
            </View>
            <View style={styles.cells}>
              <Text style={[styles.cellText, this.determineColor(crHitAdv)]}>{this.addPlusSign(crHitAdv)}</Text>
            </View>
          </View>
        );
      });
    } if (lowActive === 'third') {
      rows = data.map((item, id) => {
        const {
          name, parry, damage, stun,
        } = item.move;
        return (
          <View style={id % 2 === 0 ? styles.cellRow : styles.cellRowAlt}>
            <View style={styles.cells}>
              <Text style={styles.cellText}>{name}</Text>
            </View>
            <View style={styles.cells}>
              <Text style={styles.cellText}>{parry}</Text>
            </View>
            <View style={styles.cells}>
              <Text style={styles.cellText}>{damage}</Text>
            </View>
            <View style={styles.cells}>
              <Text style={styles.cellText}>{stun}</Text>
            </View>
          </View>
        );
      });
    }
    return (
      <ScrollView style={styles.dataContainer}>
        {rows}
      </ScrollView>
    );
  };


  toggleData = (active) => {
    this.setState({
      lowActive: active,
    });
  }

  toggleMoves = (active) => {
    this.setState({
      topActive: active,
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

  render() {
    const { navigation } = this.props;
    const { lowActive, topActive } = this.state;
    const char = navigation.getParam('char');
    const directory = navigation.getParam('directory');
    const capChar = char.toUpperCase();
    const { stage, data, idle } = directory;
    return (
      <View style={styles.mainContainer}>
        <CharacterHeader
          character={capChar}
          stage={stage}
          idle={idle}
        />
        <View style={{ flex: 0.5, flexDirection: 'column' }}>
          {/* <View style={styles.buttonRow}>
            <ToggleButton text="Normals" active={topActive === 'first'} onPress={() => this.toggleMoves('first')} />
            <ToggleButton text="Specials" active={topActive === 'second'} onPress={() => this.toggleMoves('second')} />
            <ToggleButton text="Supers" active={topActive === 'third'} onPress={() => this.toggleMoves('third')} />
            <ToggleButton text="Basics" active={topActive === 'fourth'} onPress={() => this.toggleMoves('fourth')} />
          </View> */}
          <View style={styles.buttonRow}>
            <ToggleButton text="Frame Data" active={lowActive === 'first'} onPress={() => this.toggleData('first')} />
            <ToggleButton text="Frame Adv" active={lowActive === 'second'} onPress={() => this.toggleData('second')} />
            <ToggleButton text="Other" active={lowActive === 'third'} onPress={() => this.toggleData('third')} />
          </View>
        </View>
        <View style={{ flex: 5, flexDirection: 'column' }}>
          {this.renderHeaders()}
          {this.renderFrameData(data)}
        </View>
      </View>
    );
  }
}

export default CharData;
