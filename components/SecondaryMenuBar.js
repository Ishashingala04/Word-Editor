import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';

const SecondaryMenuBar = ({ activeMenu, setActiveMenu, menuItems, handleMenuAction }) => {
  if (!activeMenu) return null;

  return (
    <View style={styles.secondaryBar}>
      <TouchableOpacity
        style={styles.titleButton}
        onPress={() => setActiveMenu(null)}
      >
        <Text style={styles.titleText}>{activeMenu}</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.secondaryContent}>
        {menuItems[activeMenu].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.secondaryItem}
            onPress={() => handleMenuAction(activeMenu, item.name)}
          >
            <Icon name={item.icon} size={20} color="#444" />
            <Text style={styles.secondaryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => setActiveMenu(null)}
      >
        <Text style={styles.cancelText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SecondaryMenuBar;