import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ButtonNotation from '../assets/ButtonNotation/index';


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
    flex: 3.3,
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
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'AvenirNext-Bold',
    margin: 0,
    textAlign: 'center',
  },
  lowRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#373737',
    height: 80,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingLeft: 10,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingLeft: 10,
  },
  plus: {
    fontSize: 25,
    fontWeight: '500',
    color: 'white',
  },
  stickImg: {
    // marginTop: 5,
    marginRight: 14,
    height: 34,
    width: 34,
    resizeMode: 'contain',
  },
  backChargeStickImg: {
    // marginRight: 14,
    height: 45,
    width: 75,
    resizeMode: 'contain',
  },
  downChargeStickImg: {
    // marginRight: 14,
    height: 45,
    width: 45,
    resizeMode: 'contain',
  },
  buttonImg: {
    marginLeft: 12,
    marginTop: 3,
    resizeMode: 'contain',
    height: 28,
    width: 28,
  },
  exButtonImg: {
    // marginLeft: 12,
    // marginTop: 3,
    resizeMode: 'contain',
    height: 32,
    width: 35,
  },
  largeButtonImg: {
    marginLeft: 10,
    resizeMode: 'contain',
    height: 32,
    width: 32,
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

  convertStringToImg = (str) => {
    const { ButtonPress, StickMotion } = ButtonNotation;
    let img;
    console.log('switch', str);
    switch (str) {
      case 'Punch':
        img = ButtonPress.punch;
        return img;
      case 'Kick':
        img = ButtonPress.kick;
        return img;
      case 'Punches':
        img = ButtonPress.punchEx;
        return img;
      case 'Kicks':
        img = ButtonPress.kickEx;
        return img;
      case 'Jab':
        img = ButtonPress.jab;
        return img;
      case 'Strong':
        img = ButtonPress.strong;
        return img;
      case 'Fierce':
        img = ButtonPress.fierce;
        return img;
      case 'Short':
        img = ButtonPress.short;
        return img;
      case 'Forward':
        img = ButtonPress.forward;
        return img;
      case 'Roundhouse':
        img = ButtonPress.roundhouse;
        return img;
      case 'RH':
        img = ButtonPress.roundhouse;
        return img;
      case '3P':
        img = ButtonPress.allPunch;
        return img;
      case 'Cr.':
        img = StickMotion.down;
        return img;
      case 'Down':
        img = StickMotion.down;
        return img;
      case 'J.':
        img = StickMotion.up;
        return img;
      case 'Twd.':
        img = StickMotion.twd;
        return img;
      case 'Back':
        img = StickMotion.back;
        return img;
      case 'Down-Twd.':
        img = StickMotion.downTwd;
        return img;
      case 'QCF':
        img = StickMotion.qcf;
        return img;
      case 'QCB':
        img = StickMotion.qcb;
        return img;
      case 'HCB':
        img = StickMotion.hcb;
        return img;
      case 'HCF':
        img = StickMotion.hcf;
        return img;
      case 'DPM':
        img = StickMotion.dpm;
        return img;
      case 'RDP':
        img = StickMotion.rdp;
        return img;
      case '360':
        img = StickMotion.threeSixty;
        return img;
      case '720':
        img = StickMotion.sevenTwenty;
        return img;
      case 'D...U':
        img = StickMotion.chargeDown;
        return img;
      case 'B...F':
        img = StickMotion.chargeBack;
        return img;
      case 'qcfx2':
        img = StickMotion.qcfx2;
        return img;
      default:
        return str;
    }
  }

  renderImages = (motion, name, type) => {
    if (type === 'normals') {
      const nml = name.split(' ');
      console.log('normal split arr', nml);
      if (nml[0] === '(Air)') {
        return (
          <View>
            <View style={styles.row}>
              <Text style={styles.smallerText}>{nml[0]}</Text>
            </View>
            <View style={styles.row}>
              <Image style={styles.buttonImg} source={this.convertStringToImg(nml[1])} />
              <Text style={styles.plus}>+</Text>
              <Image style={styles.buttonImg} source={this.convertStringToImg(nml[3])} />
            </View>
          </View>
        );
      }
      if (nml[0] === 'Throw' || nml[1] === 'Throw') {
        return (
          <View style={[styles.row, { marginRight: 5 }]}>
            <Image style={[styles.buttonImg, { marginRight: 18 }]} source={this.convertStringToImg('Jab')} />
            <Text style={[styles.plus, { marginRight: 5 }]}>+</Text>
            <Image style={styles.buttonImg} source={this.convertStringToImg('Short')} />
          </View>
        );
      }
      if (nml[0] === 'Universal') {
        return (
          <View style={[styles.row, { marginRight: 5 }]}>
            <Image style={[styles.buttonImg, { marginRight: 18 }]} source={this.convertStringToImg('Strong')} />
            <Text style={[styles.plus, { marginRight: 5 }]}>+</Text>
            <Image style={styles.buttonImg} source={this.convertStringToImg('Forward')} />
          </View>
        );
      }
      if (nml[0] === 'Flying' && nml[1] === 'Cross') {
        return (
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.row}>
              <Text style={styles.smallerText}>(Air)</Text>
            </View>
            <View style={styles.row}>
              <Image style={styles.stickImg} source={this.convertStringToImg('Cr.')} />
              <Text style={styles.plus}>+</Text>
              <Image style={styles.buttonImg} source={this.convertStringToImg('Fierce')} />
            </View>
          </View>
        );
      }
      if (nml[0] === 'Dive' && nml[1] === 'Kick') {
        if (nml[2]) {
          return (
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.row}>
                <Text style={styles.motionText}>Forward Jump</Text>
              </View>
              <View style={styles.row}>
                <Image style={styles.stickImg} source={this.convertStringToImg('Cr.')} />
                <Text style={styles.plus}>+</Text>
                <Image style={styles.buttonImg} source={this.convertStringToImg(nml[2])} />
              </View>
            </View>
          );
        }
        return (
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.row}>
              <Text style={styles.motionText}>Forward Jump</Text>
            </View>
            <View style={styles.row}>
              <Image style={[styles.stickImg, { marginTop: 5, marginLeft: 1 }]} source={this.convertStringToImg('Cr.')} />
              <Text style={[styles.plus, { marginRight: 3 }]}>+</Text>
              <Image style={styles.buttonImg} source={this.convertStringToImg('Forward')} />
            </View>
          </View>
        );
      }
      if (nml[0] === ('Drill' || 'Dive')) {
        return (
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.row}>
              <Text style={styles.smallerText}>Jump</Text>
            </View>
            <View style={styles.row}>
              <Image style={styles.buttonImg} source={this.convertStringToImg('Cr.')} />
              <Text style={styles.plus}>+</Text>
              <Image style={styles.buttonImg} source={this.convertStringToImg(nml[1])} />
            </View>
          </View>
        );
      }
      if (nml[0] === 'Back') {
        if (nml[2] === 'Throw') {
          return (
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.row, { marginRight: 10 }]}>
                <Image style={styles.stickImg} source={this.convertStringToImg(nml[0])} />
                <Text style={styles.plus}>{nml[1]}</Text>
              </View>
              <View style={styles.row}>
                <Image style={[styles.buttonImg, { marginRight: 16 }]} source={this.convertStringToImg('Jab')} />
                <Text style={styles.plus}>+</Text>
                <Image style={styles.buttonImg} source={this.convertStringToImg('Short')} />
              </View>
            </View>
          );
        }
        // if
        return (
          <View style={styles.row}>
            <Image style={styles.stickImg} source={this.convertStringToImg(nml[0])} />
            <Text style={styles.plus}>{nml[1]}</Text>
            <Image style={styles.buttonImg} source={this.convertStringToImg(nml[2])} />
          </View>
        );
      }
      if (nml[0] === 'Neutral' && nml[1] === 'J.') {
        return (
          <View>
            <View style={styles.row}>
              <Text style={styles.smallerText}>In Air</Text>
            </View>
            <View style={styles.row}>
              <Image style={styles.buttonImg} source={this.convertStringToImg(nml[2])} />
            </View>
          </View>
        );
      }
      if (nml[0] === 'Far') {
        return (<Image style={styles.largeButtonImg} source={this.convertStringToImg(nml[1])} />);
      }
      if (nml[0] === 'Cr.') {
        return (
          <View style={styles.row}>
            <Image style={[styles.stickImg, { marginTop: 5, marginLeft: 1 }]} source={this.convertStringToImg(nml[0])} />
            <Text style={[styles.plus, { marginRight: 3 }]}>+</Text>
            <Image style={styles.buttonImg} source={this.convertStringToImg(nml[1])} />
          </View>
        );
      }
      if (nml[0] === 'Down-Twd.') {
        return (
          <View style={styles.row}>
            <Image style={styles.stickImg} source={this.convertStringToImg(nml[0])} />
            <Text style={styles.plus}>+</Text>
            <Image style={styles.buttonImg} source={this.convertStringToImg(nml[2])} />
          </View>
        );
      }
      if (nml[0] === 'Twd.') {
        if (nml[2] === 'Throw') {
          return (
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.row, { marginRight: 10 }]}>
                <Image style={styles.stickImg} source={this.convertStringToImg(nml[0])} />
                <Text style={styles.plus}>{nml[1]}</Text>
              </View>
              <View style={styles.row}>
                <Image style={styles.stickImg} source={this.convertStringToImg('Jab')} />
                <Text style={styles.plus}>+</Text>
                <Image style={styles.stickImg} source={this.convertStringToImg('Short')} />
              </View>
            </View>
          );
        }
        return (
          <View style={styles.row}>
            <Image style={styles.stickImg} source={this.convertStringToImg(nml[0])} />
            <Text style={styles.plus}>+</Text>
            <Image style={styles.buttonImg} source={this.convertStringToImg(nml[2])} />
          </View>
        );
      }
      if (nml[0] === 'J.') {
        return (
          <View style={styles.row}>
            <Image style={[styles.largeButtonImg, { marginRight: 3 }]} source={this.convertStringToImg(nml[1])} />
          </View>
        );
      }
      if (nml[0] === 'Taunt') {
        return (
          <View style={[styles.row, { marginRight: 5 }]}>
            <Image style={[styles.buttonImg, { marginRight: 18 }]} source={this.convertStringToImg('Fierce')} />
            <Text style={[styles.plus, { marginRight: 5 }]}>+</Text>
            <Image style={styles.buttonImg} source={this.convertStringToImg('Roundhouse')} />
          </View>
        );
      }
      if (nml[0] === 'Throw' || nml[1] === 'Throw') {
        return (
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {nml[0] === 'Air' && <View style={styles.row}><Text style={styles.smallerText}>In Air</Text></View>}
            <View style={styles.row}>
              <Image style={styles.buttonImg} source={this.convertStringToImg('Jab')} />
              <Text style={styles.plus}>+</Text>
              <Image style={styles.buttonImg} source={this.convertStringToImg('Short')} />
            </View>
          </View>
        );
      }
      if (nml.length === 1) {
        console.log(nml[0]);
        return (<Image style={styles.largeButtonImg} source={this.convertStringToImg(nml[0])} />);
      }
    }
    if (type === 'specials') {
      const spl = motion.split(' ');
      console.log(spl);
      console.log(name);
      if (name === 'Ashura Senkuu') {
        console.log('sup');
        return (
          <View style={styles.row}>
            <Image style={styles.stickImg} source={this.convertStringToImg(spl[0])} />
            <Text style={styles.plus}>+</Text>
            <Image style={styles.largeButtonImg} source={this.convertStringToImg('3P')} />
          </View>
        );
      }
      if (spl[0] === 'Ducking') {
        return (
          <View>
            <View style={styles.row}>
              <Text style={styles.motionText}>Ducking Rush, then</Text>
            </View>
            <View style={styles.row}>
              <Image style={styles.stickImg} source={this.convertStringToImg(spl[3])} />
            </View>
          </View>
        );
      }
      if (spl[0] === 'Hyakki') {
        return (
          <View>
            <View style={styles.row}>
              <Text style={styles.motionText}>Hyakki Shuu, then</Text>
            </View>
            <View style={styles.row}>
              <Image style={[styles.buttonImg, { marginRight: 10 }]} source={this.convertStringToImg(spl[3])} />
            </View>
          </View>
        );
      }
      if (spl[0] === 'Mash') {
        return (
          <View style={styles.row}>
            <Text style={styles.motionText}>Mash</Text>
            {spl[1] === '2' ? <Image style={styles.buttonImg} source={this.convertStringToImg(spl[2])} /> : <Image style={styles.buttonImg} source={this.convertStringToImg(spl[1])} />}
          </View>
        );
      }
      if (spl[0] === '(Air)') {
        return (
          <View>
            <View style={styles.row}>
              <Text style={styles.motionText}>In Air</Text>
            </View>
            <View style={styles.row}>
              <Image style={styles.stickImg} source={this.convertStringToImg(spl[1])} />
              <Text style={styles.plus}>+</Text>
              {spl[3] === '2' ? <Image style={styles.buttonImg} source={this.convertStringToImg(spl[4])} /> : <Image style={styles.buttonImg} source={this.convertStringToImg(spl[3])} />}
            </View>
          </View>
        );
      }
      if (spl.length === 3) {
        return (
          <View style={styles.row}>
            <Image style={styles.stickImg} source={this.convertStringToImg(spl[0])} />
            <Text style={styles.plus}>+</Text>
            <Image style={styles.buttonImg} source={this.convertStringToImg(spl[2])} />
          </View>
        );
      }
      if (spl[2] === '2') {
        if (spl[3] === 'Punches') {
          return (
            <View style={styles.row}>
              <Image style={styles.stickImg} source={this.convertStringToImg(spl[0])} />
              <Text style={styles.plus}>+</Text>
              <Image style={styles.buttonImg} source={this.convertStringToImg(spl[3])} />
            </View>
          );
        }
        if (spl[3] === 'Kicks') {
          return (
            <View style={styles.row}>
              <Image style={styles.stickImg} source={this.convertStringToImg(spl[0])} />
              <Text style={styles.plus}>+</Text>
              <Image style={styles.buttonImg} source={this.convertStringToImg(spl[3])} />
            </View>
          );
        }
      }
      if (spl[0] === 'Hold') {
        if (spl[1] === 'D...U') {
          return (
            <View>
              <View style={styles.row}>
                <Image style={styles.downChargeStickImg} source={this.convertStringToImg(spl[1])} />
              </View>
              <View style={styles.row}>
                <Text style={styles.plus}>+</Text>
                {spl[3] !== '2' ? <Image style={styles.buttonImg} source={this.convertStringToImg(spl[3])} /> : <Image style={styles.buttonImg} source={this.convertStringToImg(spl[4])} />}
              </View>
            </View>
          );
        }
        if (spl[1] === 'B...F') {
          return (
            <View>
              <View style={styles.row}>
                <Image style={styles.backChargeStickImg} source={this.convertStringToImg(spl[1])} />
              </View>
              <View style={styles.row}>
                <Text style={styles.plus}>+</Text>
                {spl[3] !== '2' ? <Image style={styles.buttonImg} source={this.convertStringToImg(spl[3])} /> : <Image style={styles.buttonImg} source={this.convertStringToImg(spl[4])} />}
              </View>
            </View>
          );
        }
      }
      if (spl[3] === '(hold)') {
        return (
          <View>
            <View style={styles.row}>
              <Image style={styles.stickImg} source={this.convertStringToImg(spl[0])} />
              <Text style={styles.plus}>+</Text>
              <Image style={styles.buttonImg} source={this.convertStringToImg(spl[2])} />
            </View>
            <View style={styles.row}>
              <Text style={styles.motionText}>hold</Text>
            </View>
          </View>
        );
      }
      return null;
    }
    if (type === 'supers') {
      const spr = motion.split(' ');
      console.log(spr);
      if (spr.length === 1) {
        return (
          <Image style={styles.largeButtonImg} source={this.convertStringToImg(spr[0])} />
        );
      }
      if (spr.length === 1) {
        return (
          <Image style={styles.stickImg} source={this.convertStringToImg(spr[0])} />
        );
      }
      if (spr.length === 2 && spr[0] === '(Air)') {
        return (
          <View>
            <View style={styles.row}>
              <Text style={[styles.smallerText, { marginLeft: 2, marginBottom: 4 }]}>In Air</Text>
            </View>
            <View style={styles.row}>
              <Image style={styles.largeButtonImg} source={this.convertStringToImg(spr[1])} />
            </View>
          </View>
        );
      }
      if (spr.length === 3) {
        return (
          <View style={styles.row}>
            <Image style={styles.stickImg} source={this.convertStringToImg(spr[0] === '360' ? '360' : '720')} />
            <Text style={styles.plus}> +</Text>
            <Image style={styles.buttonImg} source={this.convertStringToImg(spr[2])} />
          </View>
        );
      }
      if (spr.length === 5) {
        if (spr[2] === '2') {
          if (spr[0] === 'QCF') {
            return (
              <View style={styles.row}>
                <Image style={styles.stickImg} source={this.convertStringToImg('qcfx2')} />
                <Text style={styles.plus}> +</Text>
                <Image style={styles.buttonImg} source={this.convertStringToImg(spr[4])} />
              </View>
            );
          }
        }
        return (
          <View style={styles.row}>
            <Image style={styles.stickImg} source={this.convertStringToImg(spr[0])} />
            <Text style={styles.plus}> +</Text>
            <Image style={styles.buttonImg} source={this.convertStringToImg(spr[4])} />
          </View>
        );
      }
      if (spr.length === 6) {
        if (spr[0] === '(Air)') {
          if (spr[3] === '2') {
            if (spr[1] === 'QCF') {
              return (
                <View>
                  <View style={styles.row}>
                    <Text style={styles.motionText}>In Air</Text>
                  </View>
                  <View style={styles.row}>
                    <Image style={styles.stickImg} source={this.convertStringToImg('qcfx2')} />
                    <Text style={styles.plus}>+</Text>
                    <Image style={styles.buttonImg} source={this.convertStringToImg(spr[5])} />
                  </View>
                </View>
              );
            }
          }
        }
        if (spr[4] === '2') {
          if (spr[5] === 'Punches') {
            return (
              <View style={styles.row}>
                <Image style={styles.stickImg} source={this.convertStringToImg('qcfx2')} />
                <Text style={styles.plus}>+</Text>
                <Image style={styles.buttonImg} source={this.convertStringToImg(spr[5])} />
              </View>
            );
          }
          if (spr[5] === 'Kicks') {
            return (
              <View style={styles.row}>
                <Image style={styles.stickImg} source={this.convertStringToImg(spr[0])} />
                <Text style={styles.plus}>+</Text>
                <Image style={styles.buttonImg} source={this.convertStringToImg(spr[5])} />
              </View>
            );
          }
        }
      }
      return null;
    }
    return null;
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
          </View>
        </View>
        {expanded
          ? (
            <View style={styles.expandedContainer}>
              <View style={styles.lowRow}>
                <View style={[styles.moveDisplay]}>
                  <View>{this.renderImages(motion, name, type)}</View>
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
            </View>
          )
          : null }
      </View>
    );
  }
}

export default MoveCard;
