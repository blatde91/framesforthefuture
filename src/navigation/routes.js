import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { CSS, CharData } from '../screens/index';

const MainViewStack = createStackNavigator({
  CSS: {
    screen: CSS,
    // navigationOptions: {
    //   header: () => null,
    // },
  },
  CharData: {
    screen: CharData,
    navigationOptions: {
      header: () => null,
    },
  },
});

const AppStack = createStackNavigator(
  { Home: MainViewStack },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const AppStackNavigator = createSwitchNavigator({
  App: AppStack,
});

export default createAppContainer(AppStackNavigator);
