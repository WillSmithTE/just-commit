/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import RecordScreen from '../screens/Record';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import Icon, { IC } from '../components/Icon';
import Home from '../screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BLUE_COLOUR } from '../constants';
import { VideoPlayback } from '../components/VideoPlayback';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      theme={DarkTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Playback" component={VideoPlayback} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <BottomTab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: BLUE_COLOUR,
          headerShown: false,
        }}
      >
        <BottomTab.Screen
          name="Home"
          component={Home}
          options={({ navigation }: RootTabScreenProps<'Home'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="home" family='Ionicons' color={color} />,
          })}
        />
        <BottomTab.Screen
          name="Record"
          component={RecordScreen}
          options={({ navigation }: RootTabScreenProps<'Record'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="record-circle" family='MaterialCommunityIcons' color={color} />,
          })}
        />
        {/* <BottomTab.Screen
          name="Library"
          component={Library}
          options={({ navigation }: RootTabScreenProps<'Library'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="library" family='Ionicons' color={color} />,
          })}
        /> */}
      </BottomTab.Navigator>
    </SafeAreaProvider>
  );
}

function TabBarIcon(props: {
  name: string;
  color: string;
  family?: IC['family'];
}) {
  return <Icon family={props.family} props={{ size: 30, style: { marginBottom: 0, paddingTop: 5}, ...props }} color={props.color} />;
}
