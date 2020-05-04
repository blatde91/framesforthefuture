import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  closeButton: {
    alignSelf: 'flex-end',
  },
  elevatedCard: {
    backgroundColor: '#373737',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  htwo: {
    color: '#fc4d54',
    // fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 20,
  },
  bodyText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'right',
  },
  column: {
    flexDirection: 'column',
  },

});

class CreditsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { modalClose } = this.props;
    return (
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity onPress={() => modalClose()}>
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.closeButton}>
            <Text style={styles.headerText}>Credits</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.elevatedCard}>
            <View style={styles.cardHead}>
              <Text style={styles.htwo}>Frame Data</Text>
              <Text style={styles.bodyText}>Ensabahnur (http://ensabahnur.free.fr/BastonNew/index.php)</Text>
              <Text style={styles.bodyText}>GameRestaurant (http://gr.qee.jp/01_3rd/index.html)</Text>
            </View>
            <View style={styles.cardHead}>
              <Text style={styles.htwo}>Images and Graphics</Text>
              <Text style={styles.bodyText}>Zweifuss (zweifuss.ca)</Text>
            </View>
          </View>
          <View style={styles.elevatedCard}>
            <View style={styles.cardHead}>
              <View style={styles.column}>
                <Text style={styles.htwo}>Programming and Design</Text>
                <Text style={styles.bodyText}>Daniel Blat</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.htwo}>Consultant / Graphic Design /</Text>
                <Text style={styles.htwo}>Data Management Assistant</Text>
                <Text style={styles.bodyText}>GK Lai</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.htwo}>Graphic Design</Text>
                <Text style={styles.bodyText}>Alex Bobyarchick</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default CreditsModal;
