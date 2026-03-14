import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import styles from "../../styles";

const InsertTableModal = ({
    visible,
    setVisible,
    onInsertTable,
}) => {
    const [rows, setRows] = useState("2");
    const [cols, setCols] = useState("2");

    const handleInsert = () => {
        const r = parseInt(rows);
        const c = parseInt(cols);
        if (r > 0 && c > 0 && r <= 20 && c <= 20) {
            onInsertTable(r, c);
            setVisible(false);
        } else {
            alert("Please enter valid row/column (1–20).");
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { width: "80%" }]}>
                    <Text style={styles.modalTitle}>Insert Table</Text>

                    <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Rows:</Text>
                        <TextInput
                            style={styles.modalInput}
                            keyboardType="numeric"
                            value={rows}
                            onChangeText={setRows}
                            placeholder="e.g. 3"
                        />
                    </View>

                    <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Columns:</Text>
                        <TextInput
                            style={styles.modalInput}
                            keyboardType="numeric"
                            value={cols}
                            onChangeText={setCols}
                            placeholder="e.g. 4"
                        />
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={styles.modalBtnText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalBtn, { backgroundColor: "#4caf50" }]}
                            onPress={handleInsert}
                        >
                            <Text style={styles.modalBtnText}>Insert</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default InsertTableModal;
