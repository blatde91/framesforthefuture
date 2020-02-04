import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  View,
  Platform,
} from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  header: {
    flex: 1,
  },
  body: {
    flex: 6,
  },
  gifRow: {
    flexDirection: 'row',
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
    return (
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text>{`Hello Im ${char}`}</Text>
        </View>
        <View style={styles.body}>
          {/* <View style={styles.jumpCard}>
            <View style={styles.sectionHeader}>
              <Text styles={styles.headerText}>Jumps</Text>
            </View>
            <View style={styles.sectionBody}>
              {jumps.length > 0 && this.renderJumps(jumps)}
            </View>
          </View>
          <View style={styles.dashCard}>
            <View style={styles.sectionHeader}>
              <Text styles={styles.headerText}>Dashes</Text>
            </View>
            <View style={styles.sectionBody}>
              {dashes.length > 0 && this.renderDashes(dashes)}
            </View>
          </View>
          <View style={styles.wakeupCard}>
            <View style={styles.sectionHeader}>
              <Text styles={styles.headerText}>Wakeups</Text>
            </View>
            <View style={styles.sectionBody}>
              {wakeups.length > 0 && this.renderWakeups(wakeups)}
            </View>
          </View> */}
          <View style={styles.paletteContainer}>
            <View style={styles.gifRow}>
              <View>
                <Text>LP</Text>
                <Image source={data.idle} />
              </View>
              <View>
                <Text>MP</Text>
                <Image source={data.MP} />
              </View>
              <View>
                <Text>HP</Text>
                <Image source={data.HP} />
              </View>
            </View>
            <View style={styles.gifRow}>
              <View>
                <Text>LK</Text>
                <Image source={data.LK} />
              </View>
              <View>
                <Text>MK</Text>
                <Image source={data.MK} />
              </View>
              <View>
                <Text>HK</Text>
                <Image source={data.HK} />
              </View>
            </View>
            <View style={styles.gifRow}>
              <View>
                <Text>LP + MK + HP</Text>
                <Image source={data.LMH} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default BasicModal;
