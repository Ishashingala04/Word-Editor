import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import styles from '../../styles';

const ZoomModal = ({ zoomModalVisible, setZoomModalVisible, customZoom, setCustomZoom, setZoom }) => {
    return (
        <Modal
            visible={zoomModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setZoomModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Set Zoom (%)</Text>
                    <TextInput
                        style={styles.fontSizeInput}
                        keyboardType="numeric"
                        placeholder="Zoom (e.g. 100)"
                        value={customZoom}
                        onChangeText={setCustomZoom}
                        autoFocus={true}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setZoomModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={() => {
                                let z = parseInt(customZoom) || 100;
                                if (z < 10) z = 10;
                                if (z > 500) z = 500;
                                setZoom(z / 100);
                                setZoomModalVisible(false);
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

export default ZoomModal;