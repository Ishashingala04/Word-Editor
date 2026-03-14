import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from '../../styles';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const PageSizeModal = ({ pageSizeModalVisible, setPageSizeModalVisible, setPageSize }) => {

    const handleSelectPage = (widthMm, heightMm) => {
        // Convert mm to a scaled screen width proportion
        const aspectRatio = heightMm / widthMm;
        const scaledWidth = screenWidth * 0.9; // fit within 90% of screen width
        const scaledHeight = scaledWidth * aspectRatio;

        setPageSize({ width: scaledWidth, height: scaledHeight });
        setPageSizeModalVisible(false);
    };

    return (
        <Modal
            visible={pageSizeModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setPageSizeModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Page Size</Text>
                    <TouchableOpacity
                        style={styles.pageSizeOption}
                        onPress={() => handleSelectPage(210, 297)}
                    >
                        <Text style={styles.pageSizeText}>A4 (210×297 mm)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pageSizeOption}
                        onPress={() => handleSelectPage(148, 210)}
                    >
                        <Text style={styles.pageSizeText}>A5 (148×210 mm)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pageSizeOption}
                        onPress={() => setPageSizeModalVisible(false)}
                    >
                        <Text style={styles.pageSizeText}>Letter (8.5×11 in)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelpageButton}
                        onPress={() => setPageSizeModalVisible(false)}
                    >
                        <Text style={styles.cancelpagetext}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default PageSizeModal;