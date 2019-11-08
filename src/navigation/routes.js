import {
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';

const MainViewStack = createStackNavigator(
  {
    MainView: {
      screen: CSS,
      navigationOptions: {
        header: () => null,
      },
    },
    CharData: {
      screen: CharData,
    }
  }
);

const AppStack = createStackNavigator(
  { Home: MainViewStack },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const AppStackNavigator = createSwitchNavigator(
  {
    App: AppStack,
  }
);

export default createAppContainer(AppStackNavigator);