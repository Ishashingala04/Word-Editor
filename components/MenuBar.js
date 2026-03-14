import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';

const MenuBar = ({ activeMenu, setActiveMenu, handleUndo, handleRedo, showQuickAccess, setShowQuickAccess }) => {
  const getIconName = (label) => {
    switch (label) {
      case 'File': return 'folder';
      case 'Edit': return 'edit';
      case 'View': return 'view-module';
      case 'Preview': return 'crop-original';
      case 'Table': return 'table-chart';
      case 'Tools': return 'build';
      default: return 'help-outline';
    }
  };

  return (
    <View style={styles.menuBar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.leftScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {['File', 'Edit', 'View', 'Format'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActiveMenu(activeMenu === item ? null : item)}
            style={[styles.menuItem, { paddingHorizontal: 8 }, activeMenu === item && styles.activeMenuItem]}
          >
            <Icon name={getIconName(item)} size={20} color="#000" />
            <Text style={styles.menuText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.centerControls}>
        <TouchableOpacity style={styles.roundButton} onPress={handleUndo}>
          <Icon name="undo" size={20} color="#444" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowQuickAccess(!showQuickAccess)}
          style={styles.qButton}
        >
          <Text style={styles.qText}>Q</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundButton} onPress={handleRedo}>
          <Icon name="redo" size={20} color="#444" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rightScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {['View', 'Table', 'Tools'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActiveMenu(activeMenu === item ? null : item)}
            style={[styles.menuItem, { paddingHorizontal: 4 }, activeMenu === item && styles.activeMenuItem]}
          >
            <Icon name={getIconName(item)} size={20} color="#000" />
            <Text style={styles.menuText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MenuBar;