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

  componentDidMount = () => {
    // console.log('hello');
    // console.log(this.props);
    const { data } = this.props;
    alert(data);
  }

  // createBasicArrays = (data) => {
  //   const jumps = [];
  //   const wakeups = [];
  //   const dashes = [];

  //   data.map((item, id) => {
  //     const { type } = item.move;
  //     if (type === 'Jump') {
  //       console.log(item);
  //       jumps.push(item);
  //     } if (type === 'Dash') {
  //       console.log(item);
  //       dashes.push(item);
  //     } if (type === 'Wakeup') {
  //       console.log(item);
  //       wakeups.push(item);
  //     }
  //   });
  //   this.setState({
  //     jumps,
  //     dashes,
  //     wakeups,
  //   }, () => console.log(this.state));
  // }

  renderWakeups = (data) => {
    data.map((item) => {
      const {
        name, frames,
      } = item.move;
      console.log(name, frames);
      return (
        <View>
          <View style={styles.nameHeader}>
            <Text>{name}</Text>
          </View>
          <View style={styles.frameCell}>
            <Text>{frames}</Text>
          </View>
        </View>
      );
    });
  };

  renderDashes = (data) => {
    data.map((item) => {
      const {
        name, frames,
      } = item.move;
      console.log(name, frames);
      return (
        <View>
          <View style={styles.nameHeader}>
            <Text>{name}</Text>
          </View>
          <View style={styles.frameCell}>
            <Text>{frames}</Text>
          </View>
        </View>
      );
    });
  };

  renderJumps = (data) => {
    data.map((item) => {
      const {
        name, frames,
      } = item.move;
      console.log(name, frames);
      return (
        <View>
          <View style={styles.nameHeader}>
            <Text>{name}</Text>
          </View>
          <View style={styles.frameCell}>
            <Text>{frames}</Text>
          </View>
        </View>
      );
    });
  };

  render() {
    const {
      char, jumps, dashes, wakeups,
    } = this.props;
    return (
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text>{`Hello Im ${char}`}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.jumpCard}>
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
          </View>
        </View>
      </View>
    );
  }
}

export default BasicModal;
