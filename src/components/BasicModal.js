import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  View,
  Platform,
  ScrollView,
} from 'react-native';


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#1d1d1d',
    flexDirection: 'column',
  },
  header: {
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: 'white',
    flex: 1,
  },
  headerText: {
    color: 'white',
    fontSize: 42,
    fontWeight: Platform.OS === 'ios' ? '800' : '1000',
    fontStyle: 'italic',
  },
  body: {
    padding: 10,
    flex: 6,
  },
  gifRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  htwo: {
    color: 'white',
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 32,
  },
  elevatedCard: {
    backgroundColor: '#373737',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
});

class BasicModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jumps: [],
      dashes: [],
      wakeups: [],
    };
  }

  renderWakeups = (data) => {
    const wakeups = data.map((item) => (
      <View>
        <View style={styles.nameHeader}>
          <Text>{item.move.name}</Text>
        </View>
        <View style={styles.frameCell}>
          <Text>{item.move.frames}</Text>
        </View>
      </View>
    ));
    return wakeups;
  };

  renderDashes = (data) => {
    const dashes = data.map((item) => (
      <View>
        <View style={styles.nameHeader}>
          <Text>{item.move.name}</Text>
        </View>
        <View style={styles.frameCell}>
          <Text>{item.move.frames}</Text>
        </View>
      </View>
    ));
    return dashes;
  };

  renderJumps = (data) => {
    const jumps = data.map((item) => (
      <View>
        <View style={styles.nameHeader}>
          <Text>{item.move.name}</Text>
        </View>
        <View style={styles.frameCell}>
          <Text>{item.move.frames}</Text>
        </View>
      </View>
    ));
    return jumps;
  };

  render() {
    const {
      char, data,
    } = this.props;
    const {
      idle, MP, HP, LK, MK, HK, LMH,
    } = data;
    return (
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{`${char} Stats`}</Text>
        </View>
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.elevatedCard}>
              <View style={styles.cardHead}>
                <Text style={styles.htwo}>Life and Stun</Text>
              </View>
            </View>
            <View style={styles.elevatedCard}>
              <View style={styles.cardHead}>
                <Text style={styles.htwo}>Basic Movement</Text>
              </View>
            </View>
            <View style={styles.elevatedCard}>
              <View style={styles.cardHead}>
                <Text style={styles.htwo}>Super Arts</Text>
              </View>
            </View>
            <View style={styles.elevatedCard}>
              <View style={styles.cardHead}>
                <Text style={styles.htwo}>Pallete Swaps</Text>
              </View>
              <View>
                <View style={styles.gifRow}>
                  <View style={styles.imgContainer}>
                    <Text>LP</Text>
                    <Image source={idle} />
                  </View>
                  <View style={styles.imgContainer}>
                    <Text>MP</Text>
                    <Image source={MP} />
                  </View>
                </View>
                <View style={styles.gifRow}>
                  <View style={styles.imgContainer}>
                    <Text>HP</Text>
                    <Image source={HP} />
                  </View>
                  <View style={styles.imgContainer}>
                    <Text>LK</Text>
                    <Image source={LK} />
                  </View>
                </View>
                <View style={styles.gifRow}>
                  <View style={styles.imgContainer}>
                    <Text>MK</Text>
                    <Image source={MK} />
                  </View>
                  <View style={styles.imgContainer}>
                    <Text>HK</Text>
                    <Image source={HK} />
                  </View>
                </View>
                <View style={styles.gifRow}>
                  <View style={styles.imgContainer}>
                    <Text>LP + MK + HP</Text>
                    <Image source={LMH} />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default BasicModal;
