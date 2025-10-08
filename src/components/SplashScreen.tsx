import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const SplashScreen = () => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 50,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -50,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateX]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fishContainer, { transform: [{ translateX }] }]}>
        <View style={styles.fishBody} />
        <View style={styles.fishEye} />
        <View style={styles.fishTail} />
        <View style={styles.fishFin} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008080', // Teal background
  },
  fishContainer: {
    width: 120,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fishBody: {
    width: 100,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4169E1', // Royal Blue
    position: 'absolute',
  },
  fishEye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'black',
    position: 'absolute',
    left: 25,
    top: 25,
  },
  fishTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 30,
    borderTopWidth: 20,
    borderBottomWidth: 20,
    borderLeftColor: '#4169E1', // Royal Blue
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    position: 'absolute',
    right: -15,
  },
  fishFin: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderBottomWidth: 20,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomColor: '#4682B4', // Steel Blue
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    top: 10,
    transform: [{ rotate: '5deg' }],
  },
});

export default SplashScreen;
