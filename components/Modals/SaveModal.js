import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import styles from '../../styles';

const SaveModal = ({ saveModalVisible, setSaveModalVisible, saveFileName, setSaveFileName, saveFile }) => {
    return (
        <Modal
            visible={saveModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setSaveModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Save As</Text>
                    <TextInput
                        style={styles.fontSizeInput}
                        placeholder="Enter file name"
                        value={saveFileName}
                        onChangeText={setSaveFileName}
                        autoFocus={true}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setSaveModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={() => {
                                if (!saveFileName.trim()) {
                                    Alert.alert('Please enter a file name.');
                                    return;
                                }
                                saveFile(false); // false = not autosave
                            }}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default SaveModal;