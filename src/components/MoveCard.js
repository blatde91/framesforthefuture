import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#373737',
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    overflow: 'hidden',
  },
  initialDisplay: {
    flexDirection: 'row',
    flex: 1,
    height: 80,
  },
  moveDisplay: {
    flex: 1,
    flexDirection: 'column',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    // borderRightWidth: 1,
    // backgroundColor: '#e6a474',
  },
  contentContainer: {
    flex: 3.5,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dataDisplay: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#373737',
  },
  dataColumn: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // height: '100%',
    flex: 1,
  },
  arrowContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#373737',
  },
  headerText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '300',
    alignSelf: 'center',
    opacity: 0.6,
    fontFamily: 'AvenirNext-Bold',
  },
  frameText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 17,
    fontFamily: 'AvenirNext-Bold',
  },
  moveText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    fontFamily: 'AvenirNext-Bold',
  },
  smallerText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
  motionText: {
    color: 'white',
    fontSize: 13.5,
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'AvenirNext-Bold',
  },
  lowRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#373737',
    height: 80,
  },
});

class MoveCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  expandCard = () => {
    this.setState({
      expanded: !this.state.expanded,
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
    const { expanded } = this.state;
    const {
      name,
      startup,
      hit,
      recovery,
      onBlock,
      onHit,
      onCrHit,
      type,
      motion,
      parry,
      damage,
      stun,
      color,
      textColor,
    } = this.props;
    return (
      <View style={styles.cardContainer}>
        <View style={styles.initialDisplay}>
          <TouchableOpacity style={[styles.moveDisplay, { backgroundColor: color }, expanded ? { borderBottomRightRadius: 10 } : null]} onPress={this.expandCard}>
            <Text style={[styles.moveText, { color: textColor }]}>{name}</Text>
          </TouchableOpacity>
          <View style={styles.contentContainer}>
            <View style={styles.dataDisplay}>
              <View style={styles.dataColumn}>
                <Text style={styles.headerText}>S</Text>
                <Text style={styles.frameText}>{startup || '-'}</Text>
              </View>
              <View style={styles.dataColumn}>
                <Text style={styles.headerText}>H</Text>
                <Text style={styles.frameText}>{hit || '-'}</Text>
              </View>
              <View style={styles.dataColumn}>
                <Text style={styles.headerText}>R</Text>
                <Text style={styles.frameText}>{recovery || '-'}</Text>
              </View>
              <View style={styles.dataColumn}>
                <Text style={styles.headerText}>oB</Text>
                <Text style={[styles.frameText, this.determineColor(onBlock)]}>{this.addPlusSign(onBlock) || '-'}</Text>
              </View>
              <View style={styles.dataColumn}>
                <Text style={styles.headerText}>oH</Text>
                <Text style={[styles.frameText, this.determineColor(onHit)]}>{this.addPlusSign(onHit) || '-'}</Text>
              </View>
              <View style={styles.dataColumn}>
                <Text style={styles.headerText}>oCH</Text>
                <Text style={[styles.frameText, this.determineColor(onCrHit)]}>{this.addPlusSign(onCrHit) || '-'}</Text>
              </View>
            </View>
            {/* {expanded ? null : (
              <View style={styles.arrowContainer}>

                  <Icon name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'} size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )} */}

          </View>
        </View>
        {expanded
          ? (
            <View style={styles.expandedContainer}>
              <View style={styles.lowRow}>
                <View style={[styles.moveDisplay]}>
                  {motion && <Text style={[styles.motionText, { color: textColor }]}>{motion}</Text>}
                </View>
                <View style={{ flex: 4, flexDirection: 'row' }}>
                  <View style={styles.dataColumn}>
                    <Text style={styles.headerText}>Parry</Text>
                    <Text style={styles.frameText}>{parry || '-'}</Text>
                  </View>
                  <View style={styles.dataColumn}>
                    <Text style={styles.headerText}>Dmg</Text>
                    <Text style={styles.frameText}>{damage || '-'}</Text>
                  </View>
                  <View style={styles.dataColumn}>
                    <Text style={styles.headerText}>Stun</Text>
                    <Text style={styles.frameText}>{stun || '-'}</Text>
                  </View>
                </View>
              </View>
              {/* <View style={styles.arrowContainer}>
                <TouchableOpacity onPress={this.expandCard}>
                  <Icon name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'} size={18} color="#ffffff" />
                </TouchableOpacity>
              </View> */}
            </View>
          )
          : null }
      </View>
    );
  }
}

export default MoveCard;
