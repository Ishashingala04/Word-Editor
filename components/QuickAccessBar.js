import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';

const QuickAccessBar = ({ showQuickAccess, quickAccess }) => {
  if (!showQuickAccess) return null;

  return (
    <View style={styles.quickAccessBar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickAccessContent}
      >
        {quickAccess
          .filter(item => ['Font', 'Align', 'Bold'].includes(item.name))
          .map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickCircle}
              onPress={item.action}
            >
              {item.icon ? (
                <Icon name={item.icon} size={15} color="black" />
              ) : (
                <Text style={styles.quickValue}>{item.value}</Text>
              )}
              <Text style={styles.quickName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default QuickAccessBar;