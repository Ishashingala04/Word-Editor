import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles';

const AlignmentModal = ({ alignmentModalVisible, setAlignmentModalVisible, toggleAlignment }) => {
    return (
        <Modal
            transparent={true}
            visible={alignmentModalVisible}
            onRequestClose={() => setAlignmentModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.alignmentModalContainer}>
                    <Text style={styles.modalTitle}>Text Alignment</Text>
                    <TouchableOpacity
                        style={styles.alignmentOption}
                        onPress={() => toggleAlignment('left')}
                    >
                        <Icon name="format-align-left" size={20} color="#333" />
                        <Text style={styles.alignmentText}>Left</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.alignmentOption}
                        onPress={() => toggleAlignment('center')}
                    >
                        <Icon name="format-align-center" size={20} color="#333" />
                        <Text style={styles.alignmentText}>Center</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.alignmentOption}
                        onPress={() => toggleAlignment('right')}
                    >
                        <Icon name="format-align-right" size={20} color="#333" />
                        <Text style={styles.alignmentText}>Right</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AlignmentModal;