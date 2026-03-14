import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import styles from '../../styles';

const FontSizeModal = ({ fontSizeModalVisible, setFontSizeModalVisible, customFontSize, setCustomFontSize, changeFontSize }) => {
    return (
        <Modal
            visible={fontSizeModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setFontSizeModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Font Size</Text>
                    <TextInput
                        style={styles.fontSizeInput}
                        keyboardType="numeric"
                        value={customFontSize}
                        onChangeText={setCustomFontSize}
                        autoFocus={true}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setFontSizeModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={changeFontSize}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FontSizeModal;