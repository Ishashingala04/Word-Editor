import React from 'react';
import { View, Text, TextInput, ScrollView, Animated } from 'react-native';
import styles from '../styles';

const DocumentArea = ({
    content,
    setContent,
    isBold,
    fontSize,
    zoom,
    margins,
    pageSize,
    showRuler,
    rulerWidth,
    setRulerWidth,
    draggingMargin,
    setDraggingMargin,
    panResponderLeft,
    panResponderRight,
    textInputRef,
    selection,
    setSelection,
    saveToHistory,
    tables,
    setTables,
}) => {
    console.log("tables", tables);

    const handleCellChange = (tableId, rowIndex, colIndex, text) => {
        setTables(prev =>
            prev.map(t =>
                t.id === tableId
                    ? {
                        ...t,
                        data: t.data.map((r, i) =>
                            i === rowIndex
                                ? r.map((c, j) => (j === colIndex ? text : c))
                                : r
                        ),
                    }
                    : t
            )
        );
        saveToHistory(); // Save state after cell change
    };

    return (
        <>
            {showRuler && (
                <View
                    style={styles.rulerContainer}
                    onLayout={e => setRulerWidth(e.nativeEvent.layout.width)}
                >
                    <View style={styles.rulerScale}>
                        {Array.from({ length: 13 }).map((_, i) => (
                            <View key={i} style={styles.rulerMarkContainer}>
                                <View style={styles.rulerMark} />
                                <Text style={styles.rulerLabel}>{i}</Text>
                            </View>
                        ))}
                    </View>
                    <Animated.View
                        style={[styles.marginMarker, { left: (margins.left / rulerWidth) * rulerWidth || 0 }]}
                        {...panResponderLeft.panHandlers}
                    >
                        <View style={styles.markerHandle} />
                    </Animated.View>
                    <Animated.View
                        style={[styles.marginMarker, { left: rulerWidth - (margins.right / rulerWidth) * rulerWidth - 10 || rulerWidth - 10 }]}
                        {...panResponderRight.panHandlers}
                    >
                        <View style={styles.markerHandle} />
                    </Animated.View>
                </View>
            )}
            <ScrollView
                style={[styles.documentContainer, {
                    // marginTop: margins.top,
                    // marginBottom: margins.bottom,
                    // marginLeft: margins.left,
                    // marginRight: margins.right,
                }]}
                contentContainerStyle={{ alignItems: 'center' }}
            >
                <View
                    style={{
                        width: pageSize.width,
                        minHeight: pageSize.height,
                        backgroundColor: '#fff',
                        // padding: 3,
                    }}
                >
                    <TextInput
                        ref={textInputRef}
                        style={[styles.documentArea, isBold && styles.boldText, { fontSize: fontSize * zoom }]}
                        multiline
                        placeholder="Start typing your document..."
                        placeholderTextColor="#888"
                        value={content}
                        onChangeText={(text) => {
                            setContent(text);
                            saveToHistory();
                        }}
                        selection={selection}
                        onSelectionChange={e => setSelection(e.nativeEvent.selection)}
                    />

                    {tables.map((table) => (
                        <View key={table.id} style={styles.tableContainer}>
                            {table.data.map((row, rowIndex) => (
                                <View key={rowIndex} style={styles.tableRow}>
                                    {row.map((cell, colIndex) => (
                                        <TextInput
                                            key={colIndex}
                                            style={styles.tableCell}
                                            value={cell}
                                            onChangeText={(text) =>
                                                handleCellChange(table.id, rowIndex, colIndex, text)
                                            }
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>
                    ))}

                </View>
            </ScrollView>
        </>
    );
};

export default DocumentArea;