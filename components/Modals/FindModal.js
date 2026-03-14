import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import styles from '../../styles';

const FindModal = ({ findModalVisible, setFindModalVisible, findText, setFindText, handleFind }) => {
    return (
        <Modal
            visible={findModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setFindModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Find Text</Text>
                    <TextInput
                        style={styles.fontSizeInput}
                        placeholder="Enter text to find"
                        value={findText}
                        onChangeText={setFindText}
                        autoFocus={true}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setFindModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={handleFind}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Find</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FindModal;