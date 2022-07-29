/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import RecordScreen from '../screens/Record';
import { MyMedia, RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import Icon, { IC } from '../components/Icon';
import Home from '../screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BLUE_COLOUR } from '../constants';
import { Playback } from '../components/Playback';
import { useLastNotificationResponse, DEFAULT_ACTION_IDENTIFIER } from 'expo-notifications';
import Library from '../screens/Library';
import { useSelector } from 'react-redux';
import { RootState } from '../services/reduxStore';
import { showError } from '../components/Error';
import Groups from '../screens/Groups';
import Settings from '../screens/Settings';

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
  const lastNotificationResponse = useLastNotificationResponse();
  const navigation = useNavigation()
  const medias = useSelector((state: RootState) => state.media.medias)

  React.useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.media &&
      lastNotificationResponse.actionIdentifier === DEFAULT_ACTION_IDENTIFIER
    ) {
      const id = lastNotificationResponse.notification.request.content.data.id as string
      const video = medias?.find((saved) => saved.id === id)
      if (video) navigation.navigate('Playback', { media: video })
      else showError(`tried to nav from notification but media not found (id=${id})`)
    }
  }, [lastNotificationResponse]);


  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Playback" component={Playback} options={{ headerShown: false }} />
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
        {/* <BottomTab.Screen
          name="Home"
          component={Home}
          options={({ navigation }: RootTabScreenProps<'Home'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="home" family='Ionicons' color={color} />,
          })}
        /> */}
        <BottomTab.Screen
          name="Library"
          component={LibraryStackScreen}
          options={({ navigation }: RootTabScreenProps<'Library'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="library" family='Ionicons' color={color} />,
          })}
        />
        <BottomTab.Screen
          name="Record"
          component={RecordScreen}
          options={({ navigation }: RootTabScreenProps<'Record'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="record-circle" family='MaterialCommunityIcons' color={color} />,
          })}
        />
        <BottomTab.Screen
          name="Groups"
          component={Groups}
          options={({ navigation }: RootTabScreenProps<'Groups'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="account-group" family='MaterialCommunityIcons' color={color} />,
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
  return <Icon family={props.family} props={{ size: 30, style: { marginBottom: 0, paddingTop: 5 }, ...props }} color={props.color} />;
}

const LibraryStack = createNativeStackNavigator();

function LibraryStackScreen() {
  return (
    <LibraryStack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <LibraryStack.Screen name="MainLibrary" component={Library} />
      <LibraryStack.Screen name="Settings" component={Settings} />
    </LibraryStack.Navigator >
  );
}
