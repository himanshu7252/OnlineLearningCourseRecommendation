import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0F172A"
        />
        <RootNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;