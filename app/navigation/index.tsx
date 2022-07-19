/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, Text } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import RecordScreen from '../screens/Record';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import Icon, { IC } from '../components/Icon';
import Library from '../screens/Library';
import Home from '../screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BLUE_COLOUR, ORANGE_COLOUR } from '../constants';
import { useSelector } from 'react-redux';
import { RootState } from '../services/reduxStore';
import { VideoPlayback } from '../components/VideoPlayback';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
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
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
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
  const selectedVideo = useSelector((state: RootState) => state.selectedMedia.selectedMedia)

  const withPlayback = (component: React.ComponentType<any>) => {
    // return selectedVideo ?
    //   (props: {}) => <VideoPlayback video={selectedVideo} {...props} /> :
    //   component
    return component
  }

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
          component={withPlayback(Home)}
          options={({ navigation }: RootTabScreenProps<'Home'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="home" family='Ionicons' color={color} />,
          })}
        />
        <BottomTab.Screen
          name="Record"
          component={withPlayback(RecordScreen)}
          options={({ navigation }: RootTabScreenProps<'Record'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="record-circle" family='MaterialCommunityIcons' color={color} />,
          })}
        />
        <BottomTab.Screen
          name="Library"
          component={withPlayback(Library)}
          options={({ navigation }: RootTabScreenProps<'Library'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="library" family='Ionicons' color={color} />,
          })}
        />
      </BottomTab.Navigator>
    </SafeAreaProvider>
  );
}

function TabBarIcon(props: {
  name: string;
  color: string;
  family?: IC['family'];
}) {
  return <Icon family={props.family} props={{ size: 30, style: { marginBottom: 0 }, ...props }} color={props.color} />;
}
