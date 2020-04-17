import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as SuperArt from '../assets/SAIcons/index';


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#1d1d1d',
    flexDirection: 'column',
  },
  header: {
    padding: 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: 'white',
    flex: 1,
    margin: 7,
  },
  headerText: {
    marginBottom: 0,
    color: '#e3dedb',
    fontSize: 44,
    fontWeight: Platform.OS === 'ios' ? '800' : '900',
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
    color: '#fc4d54',
    // fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 32,
  },
  hthree: {
    color: 'white',
    fontWeight: '600',
    fontSize: 24,
  },
  elevatedCard: {
    backgroundColor: '#373737',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  bodyText: {
    color: '#e3dedb',
  },
  frameCell: {
    flexDirection: 'row',
  },
  tableCell: {
    borderColor: '#e3dedb',
    borderWidth: 0.3,
    borderRadius: 2,
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  statsTable: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 10,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableHead: {
    fontWeight: '600',
    color: '#fc8c4d',
    textAlign: 'center',
  },
  tableBody: {
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
  },
  saIcon: {
    // marginLeft: 12,
    // marginTop: 3,
    resizeMode: 'stretch',
    height: 34,
    width: 34,

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

  makeSet = (data) => {
    const supers = new Set();
    let SA1 = false;
    let SA2 = false;
    let SA3 = false;
    data.map((item) => {
      if (item.move.super === 'SA1' && !SA1) {
        supers.add(
          {
            SA1: {
              gauge: item.move.gauge,
              stock: item.move.stock,
            },
          },

        );
        SA1 = true;
      }
      if (item.move.super === 'SA2' && !SA2) {
        supers.add(
          {
            SA2: {
              gauge: item.move.gauge,
              stock: item.move.stock,
            },
          },

        );
        SA2 = true;
      }
      if (item.move.super === 'SA3' && !SA3) {
        supers.add(
          {
            SA3: {
              gauge: item.move.gauge,
              stock: item.move.stock,
            },
          },

        );
        SA3 = true;
      }
    });

    const supersArray = Array.from(supers);
    console.log(supersArray);
    return supersArray;
  }

  renderWakeups = (data) => (
    <View style={styles.statsTable}>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
          Normal Wakeup
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
          Quick Wakeup
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[10].move.frames}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[11].move.frames}</Text>
        </View>
      </View>
    </View>
  );

  renderStats = (data) => (
    <View style={styles.statsTable}>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>Life</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>Stun</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>Stun Recovery</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data.life}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data.stun}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data.stunRecovery}</Text>
        </View>
      </View>
    </View>
  )

  renderJumps = (data) => (
    <View style={styles.statsTable}>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            Jump Frame Data
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            Back
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            Neutral
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            Forward
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>Normal Jump</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[1].move.frames}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[0].move.frames}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[2].move.frames}</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>Super Jump</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[4].move.frames}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[3].move.frames}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[5].move.frames}</Text>
        </View>
      </View>
    </View>
  )

  renderDashes = (data) => (
    <View style={styles.statsTable}>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            Dash Frame Data
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            Back Dash
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            Forward Dash
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>Full Animation</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[6].move.frames}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[8].move.frames}</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>Recovery Cancelled</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[7].move.frames}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[9].move.frames}</Text>
        </View>
      </View>
    </View>
  );

  renderWalkSpeed = (data) => (
    <View style={styles.statsTable}>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            Walk Back
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            Walk Forward
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[12].move.speed}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>{data[13].move.speed}</Text>
        </View>
      </View>
    </View>
  )

  renderSupers = (data) => (
    <View style={styles.statsTable}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, { border: 'none' }]}>
          <Text style={styles.tableHead}>
            Super Stats
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Image source={SuperArt.sa1} style={[styles.saIcon, { width: 22, height: 30 }]} />
        </View>
        <View style={styles.tableCell}>
          <Image source={SuperArt.sa2} style={styles.saIcon} />
        </View>
        <View style={styles.tableCell}>
          <Image source={SuperArt.sa3} style={styles.saIcon} />
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            # of Stocks
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>
            {data[0].SA1.stock}
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>
            {data[1].SA2.stock}
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>
            {data[2].SA3.stock}
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHead}>
            Gauge Length
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>
            {data[0].SA1.gauge}
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>
            {data[1].SA2.gauge}
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableBody}>
            {data[2].SA3.gauge}
          </Text>
        </View>
      </View>
    </View>
  );

  render() {
    const {
      char, data, modalClose,
    } = this.props;

    const {
      idle, MP, HP, LK, MK, HK, LMH, stats, basics, supers,
    } = data;


    const superSet = this.makeSet(supers);
    return (
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity onPress={() => modalClose()}>
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.closeButton}>
            <Text style={styles.headerText}>{`${char} Details`}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.elevatedCard}>
              <View style={styles.cardHead}>
                <Text style={styles.htwo}>Basic Stats</Text>
              </View>
              <View style={styles.cardBody}>
                {this.renderStats(stats.stats)}
              </View>
              <View style={styles.cardBody}>
                {this.renderJumps(basics)}
              </View>
              <View style={styles.cardBody}>
                {this.renderDashes(basics)}
              </View>
              <View style={styles.cardBody}>
                {this.renderWalkSpeed(basics)}
              </View>
              <View style={styles.cardBody}>

                {this.renderWakeups(basics)}

              </View>
            </View>
            <View style={styles.elevatedCard}>
              <View style={styles.cardHead}>
                <Text style={styles.htwo}>Super Arts</Text>
              </View>
              <View style={styles.cardBody}>
                {this.renderSupers(superSet)}
              </View>
            </View>
            <View style={styles.elevatedCard}>
              <View style={styles.cardHead}>
                <Text style={styles.htwo}>Pallete Swaps</Text>
              </View>
              <View>
                <View style={styles.gifRow}>
                  <View style={styles.imgContainer}>
                    <Text style={styles.bodyText}>LP</Text>
                    <Image source={idle} />
                  </View>
                  <View style={styles.imgContainer}>
                    <Text style={styles.bodyText}>MP</Text>
                    <Image source={MP} />
                  </View>
                </View>
                <View style={styles.gifRow}>
                  <View style={styles.imgContainer}>
                    <Text style={styles.bodyText}>HP</Text>
                    <Image source={HP} />
                  </View>
                  <View style={styles.imgContainer}>
                    <Text style={styles.bodyText}>LK</Text>
                    <Image source={LK} />
                  </View>
                </View>
                <View style={styles.gifRow}>
                  <View style={styles.imgContainer}>
                    <Text style={styles.bodyText}>MK</Text>
                    <Image source={MK} />
                  </View>
                  <View style={styles.imgContainer}>
                    <Text style={styles.bodyText}>HK</Text>
                    <Image source={HK} />
                  </View>
                </View>
                <View style={styles.gifRow}>
                  <View style={styles.imgContainer}>
                    <Text style={styles.bodyText}>LP + MK + HP</Text>
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
