import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Dimensions, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getProfileInfo } from '../services/authServices';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.72;

const Overlay = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  z-index: 100;
`;

const DrawerContainer = styled(Animated.View)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${DRAWER_WIDTH}px;
  background: #fff;
  border-top-right-radius: 40px;
  border-bottom-right-radius: 40px;
  z-index: 101;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 10;
`;

const ProfileSection = styled.View`
  padding-top: 40px;
  padding-left: 28px;
  padding-bottom: 30px;
  flex-direction: row;
  align-items: center;
`;

const Avatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #eee;
`;

const ProfileText = styled.View`
  margin-left: 14px;
`;

const Name = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: #000;
`;

const Email = styled.Text`
  font-size: 13px;
  color: #6E6E6E;
  font-weight: 400;
  margin-top: 2px;
`;

const MenuSection = styled.View`
  flex: 1;
  padding-left: 28px;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 48px;
  margin-bottom: 8px;
  min-height: 44px;
`;

const MenuLabel = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: #3A3A3A;
  margin-left: 10px;
`;

const defaultAvatar = require('../../assets/images/UserIcon.png');

const Drawer = ({ visible, onClose, onNavigate }) => {
  const [profile, setProfile] = useState({ name: '', email: '', image: null });
  const [animValue] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      fetchProfile();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  const fetchProfile = async () => {
    try {
      const res = await getProfileInfo();
      const data = res?.data?.[0] || {};
      setProfile({
        name: data.name || 'Doctor',
        email: data.email || '',
        image: data.image || null,
      });
    } catch {
      setProfile({ name: 'Doctor', email: '', image: null });
    }
  };

  const drawerTranslate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });
  const overlayOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      {visible && (
        <Overlay style={{ opacity: overlayOpacity }} onTouchEnd={onClose} />
      )}
      <DrawerContainer style={{ transform: [{ translateX: drawerTranslate }] }}>
        <ProfileSection>
          <Avatar source={profile.image ? { uri: profile.image } : defaultAvatar} />
          <ProfileText>
            <Name>{profile.name}</Name>
            <Email>{profile.email}</Email>
          </ProfileText>
        </ProfileSection>
        <MenuSection>
          <MenuItem onPress={() => onNavigate('home')} activeOpacity={0.7}>
            <Ionicons name="home-outline" size={20} color="#3A3A3A" />
            <MenuLabel>Homepage</MenuLabel>
          </MenuItem>
          <MenuItem onPress={() => onNavigate('inpatients')} activeOpacity={0.7}>
            <MaterialCommunityIcons name="bed-outline" size={20} color="#3A3A3A" />
            <MenuLabel>In-Patient List</MenuLabel>
          </MenuItem>
          <MenuItem onPress={() => onNavigate('profile')} activeOpacity={0.7}>
            <Ionicons name="person-outline" size={20} color="#3A3A3A" />
            <MenuLabel>My profile</MenuLabel>
          </MenuItem>
        </MenuSection>
        <View style={{ flex: 1 }} />
      </DrawerContainer>
    </>
  );
};

export default Drawer; 