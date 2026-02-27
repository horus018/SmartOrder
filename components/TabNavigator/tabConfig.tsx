import React from "react";
import { Image, ImageSourcePropType } from "react-native";

const TABS_ICON_SIZE = 24;

export type TabName =
  | 'Home'
  | 'Orders'
  | 'Help'
  | 'Account'
  | 'Profile'
  | string;

export interface TabItem {
  name: TabName;
  title: string;
  icon: (props: { color: string }) => React.ReactElement;
}

const TabIconImage = ({
  source,
  size,
  color
}: {
  source: ImageSourcePropType;
  size: number;
  color: string;
}) => (
  <Image
    source={source}
    style={{
      width: size,
      height: size,
      tintColor: color,
      resizeMode: "contain"
    }}
  />
);

export const clientTabs: TabItem[] = [
  {
    name: 'Home',
    title: 'Home',
    icon: ({ color }) => (
      <TabIconImage
        source={require('../../assets/icon_home.png')}
        size={TABS_ICON_SIZE}
        color={color}
      />
    )
  },
  {
    name: 'Orders',
    title: 'Orders',
    icon: ({ color }) => (
      <TabIconImage
        source={require('../../assets/icon_orders.png')}
        size={TABS_ICON_SIZE}
        color={color}
      />
    )
  },
  {
    name: 'Help',
    title: 'Message',
    icon: ({ color }) => (
      <TabIconImage
        source={require('../../assets/icon_chat.png')}
        size={TABS_ICON_SIZE}
        color={color}
      />
    )
  },
  {
    name: 'Account',
    title: 'Account',
    icon: ({ color }) => (
      <TabIconImage
        source={require('../../assets/icon_card.png')}
        size={TABS_ICON_SIZE}
        color={color}
      />
    )
  },
  {
    name: 'Profile',
    title: 'Profile',
    icon: ({ color }) => (
      <TabIconImage
        source={require('../../assets/icon_profile.png')}
        size={TABS_ICON_SIZE}
        color={color}
      />
    )
  }
];

export const adminTabs: TabItem[] = [];
export const employeeTabs: TabItem[] = [];
