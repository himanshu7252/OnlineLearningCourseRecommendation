import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface TabIconProps {
  name: string;
  focused: boolean;
  color: string;
  size?: number;
}

export const TabIcon: React.FC<TabIconProps> = ({ name, focused, color, size = 24 }) => {
  switch (name) {
    case 'HomeTab':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={focused ? color + '22' : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <Path d="M9 22V12h6v10" />
        </Svg>
      );
    case 'ExploreTab':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="11" cy="11" r="8" />
          <Path d="m21 21-4.3-4.3" />
        </Svg>
      );
    case 'MyLearningTab':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={focused ? color : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <Path d="M6 6h10M6 10h10" />
        </Svg>
      );
    case 'RecommendationsTab':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={focused ? color : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </Svg>
      );
    case 'ProfileTab':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={focused ? color + '22' : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <Circle cx="12" cy="7" r="4" />
        </Svg>
      );
    default:
      return null;
  }
};

export default TabIcon;
