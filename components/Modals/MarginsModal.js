import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import styles from '../../styles';

const MarginsModal = ({ marginsModalVisible, setMarginsModalVisible, customMargins, setCustomMargins, setMargins }) => {
    return (
        <Modal
            visible={marginsModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setMarginsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Set Margins (px)</Text>
                    <TextInput
                        style={styles.fontSizeInput}
                        keyboardType="numeric"
                        placeholder="Top"
                        value={customMargins.top}
                        onChangeText={v => setCustomMargins({ ...customMargins, top: v })}
                    />
                    <TextInput
                        style={styles.fontSizeInput}
                        keyboardType="numeric"
                        placeholder="Bottom"
                        value={customMargins.bottom}
                        onChangeText={v => setCustomMargins({ ...customMargins, bottom: v })}
                    />
                    <TextInput
                        style={styles.fontSizeInput}
                        keyboardType="numeric"
                        placeholder="Left"
                        value={customMargins.left}
                        onChangeText={v => setCustomMargins({ ...customMargins, left: v })}
                    />
                    <TextInput
                        style={styles.fontSizeInput}
                        keyboardType="numeric"
                        placeholder="Right"
                        value={customMargins.right}
                        onChangeText={v => setCustomMargins({ ...customMargins, right: v })}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setMarginsModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={() => {
                                setMargins({
                                    top: parseInt(customMargins.top) || 0,
                                    bottom: parseInt(customMargins.bottom) || 0,
                                    left: parseInt(customMargins.left) || 0,
                                    right: parseInt(customMargins.right) || 0,
                                });
                                setMarginsModalVisible(false);
                            }}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default MarginsModal;