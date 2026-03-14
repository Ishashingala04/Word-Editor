import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import styles from '../../styles';

const ReplaceModal = ({ replaceModalVisible, setReplaceModalVisible, replaceFindText, setReplaceFindText, replaceWithText, setReplaceWithText, handleReplace }) => {
    return (
        <Modal
            visible={replaceModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setReplaceModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Replace Text</Text>
                    <TextInput
                        style={styles.fontSizeInput}
                        placeholder="Find what..."
                        value={replaceFindText}
                        onChangeText={setReplaceFindText}
                    />
                    <TextInput
                        style={[styles.fontSizeInput, { marginTop: 10 }]}
                        placeholder="Replace with..."
                        value={replaceWithText}
                        onChangeText={setReplaceWithText}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setReplaceModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={handleReplace}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Replace</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ReplaceModal;