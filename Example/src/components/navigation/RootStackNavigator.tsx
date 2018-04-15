import React from 'react';
import { AsyncStorage, View, Platform } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import Intro from '@screen/Intro';
import NotFound from '@screen/NotFound';
import { inject, observer } from 'mobx-react/native';

interface IState {
  startPage: string;
}

@inject('store') @observer
class RootNavigator extends React.Component<any, IState> {
  constructor(props) {
    super(props);
    this.state = {
      startPage: '',
    };
  }

  public componentDidMount() {
    this.initPage();
  }

  public initPage = async () => {
    const startPage = 'Intro';
    console.log('startPage: ' + startPage);
    this.setState({ startPage });
  }

  public render() {
    const routeConfig = {
      Intro: {
        screen: Intro,
        path: 'intro',
      },
      NotFound: {
        screen: NotFound,
      },
    };

    const navigatorConfig = {
      initialRouteName: this.state.startPage,
      header: null,
      headerMode: 'none',
      gesturesEnabled: true,
      statusBarStyle: 'light-content',
      transitionConfig: () => ({ screenInterpolator:
        this.props.store.rootNavigatorActionHorizontal
          ? CardStackStyleInterpolator.forHorizontal
          : CardStackStyleInterpolator.forVertical,
      }),
    };

    // FIXED: Current fix for navigating twice
    const RootStackNavigator = StackNavigator(routeConfig, navigatorConfig);
    // if (Platform.OS === 'ios') {
    //   const navigateOnce = (getStateForAction) => (action, state) => {
    //     const { type, routeName } = action;
    //     return (
    //       state &&
    //       type === NavigationActions.NAVIGATE &&
    //       routeName === state.routes[state.routes.length - 1].routeName
    //     ) ? null : getStateForAction(action, state);
    //   };
    //   RootStackNavigator.router.getStateForAction = navigateOnce(RootStackNavigator.router.getStateForAction);
    // }

    return (
      <RootStackNavigator />
    );
  }
}

export default RootNavigator;
