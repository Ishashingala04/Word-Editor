import React, { useState, useRef } from 'react';
import { SafeAreaView, Animated, Dimensions, Platform, PermissionsAndroid, Alert, PanResponder, Text } from 'react-native';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import RNFS from 'react-native-fs';
import Clipboard from '@react-native-clipboard/clipboard';
import RNPrint from 'react-native-print';
import MenuBar from './components/MenuBar';
import QuickAccessBar from './components/QuickAccessBar';
import SecondaryMenuBar from './components/SecondaryMenuBar';
import DocumentArea from './components/DocumentArea';
import FontSizeModal from './components/Modals/FontSizeModal';
import SaveModal from './components/Modals/SaveModal';
import AlignmentModal from './components/Modals/AlignmentModal';
import FindModal from './components/Modals/FindModal';
import ReplaceModal from './components/Modals/ReplaceModal';
import PageSizeModal from './components/Modals/PageSizeModal';
import MarginsModal from './components/Modals/MarginsModal';
import ZoomModal from './components/Modals/ZoomModal';
import InsertTableModal from './components/Modals/InsertTableModal';

import styles from './styles';

const App = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const screenWidth = Dimensions.get('window').width;
  const [showQuickAccess, setShowQuickAccess] = useState(true);
  const [quickAccess, setQuickAccess] = useState([
    { name: 'Font', value: '16', icon: 'text-fields', action: () => setFontSizeModalVisible(true) },
    { name: 'Align', value: 'L', icon: 'format-align-left', action: () => setAlignmentModalVisible(true) },
    { name: 'Bold', value: 'B', icon: 'format-bold', action: () => toggleBold() },
  ]);
  const [content, setContent] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [alignment, setAlignment] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
  const [customFontSize, setCustomFontSize] = useState('');
  const [alignmentModalVisible, setAlignmentModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saveFileName, setSaveFileName] = useState('');
  const [currentFilePath, setCurrentFilePath] = useState(null);
  const [findModalVisible, setFindModalVisible] = useState(false);
  const [replaceModalVisible, setReplaceModalVisible] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceFindText, setReplaceFindText] = useState('');
  const [replaceWithText, setReplaceWithText] = useState('');
  const [pageSizeModalVisible, setPageSizeModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState({
    width: screenWidth * 0.9,
    height: screenWidth * 0.9 * (297 / 210),
  });
  const [marginsModalVisible, setMarginsModalVisible] = useState(false);
  const [margins, setMargins] = useState({ top: 10, bottom: 10, left: 16, right: 16 });
  const [customMargins, setCustomMargins] = useState({ top: '', bottom: '', left: '', right: '' });
  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [customZoom, setCustomZoom] = useState('');
  const [showRuler, setShowRuler] = useState(false);
  const [draggingMargin, setDraggingMargin] = useState(null);
  const [rulerWidth, setRulerWidth] = useState(0);
  const [history, setHistory] = useState([{ content: '', styles: {} }]);

  const [insertTableModalVisible, setInsertTableModalVisible] = useState(false);
  const [tables, setTables] = useState([]); // store inserted tables

  const [currentIndex, setCurrentIndex] = useState(0);
  const textInputRef = useRef(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    visible: false,
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTimeout(hideNotification, 3000);
  };

  const hideNotification = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    });
  };

  const panResponderLeft = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => setDraggingMargin('left'),
    onPanResponderMove: (_, gestureState) => {
      let newLeft = Math.max(0, Math.min(gestureState.moveX, rulerWidth - margins.right - 20));
      setMargins(m => ({ ...m, left: Math.round(newLeft) }));
    },
    onPanResponderRelease: () => setDraggingMargin(null),
  }), [rulerWidth, margins.right]);

  const panResponderRight = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => setDraggingMargin('right'),
    onPanResponderMove: (_, gestureState) => {
      let newRight = Math.max(0, Math.min(rulerWidth - gestureState.moveX, rulerWidth - margins.left - 20));
      setMargins(m => ({ ...m, right: Math.round(newRight) }));
    },
    onPanResponderRelease: () => setDraggingMargin(null),
  }), [rulerWidth, margins.left]);

  const menuItems = {
    File: [
      { name: 'New', icon: 'insert-drive-file' },
      { name: 'Open', icon: 'folder-open' },
      { name: 'Save', icon: 'save' },
      { name: 'Export', icon: 'file-download' },
      { name: 'Print', icon: 'print' },
    ],
    Edit: [
      { name: 'Cut', icon: 'content-cut' },
      { name: 'Copy', icon: 'content-copy' },
      { name: 'Paste', icon: 'content-paste' },
      { name: 'Find', icon: 'find-in-page' },
      { name: 'Replace', icon: 'find-replace' },
      { name: 'Select All', icon: 'select-all' },
    ],
    View: [
      { name: 'Page Size', icon: 'photo-size-select-large' },
      { name: 'Margins', icon: 'margin' },
      { name: 'Zoom', icon: 'zoom-in' },
      { name: 'Ruler', icon: 'straighten' },
    ],
    Insert: [
      { name: 'Table', icon: 'table-chart' },
      { name: 'Image', icon: 'insert-photo' },
      { name: 'Header', icon: 'format-header-1' },
      { name: 'Footer', icon: 'vertical-align-bottom' },
      { name: 'Page Break', icon: 'line-weight' },
    ],
    Table: [
      { name: 'Insert Table', icon: 'table-rows' },
      { name: 'Edit Table', icon: 'edit' },
      { name: 'Delete Table', icon: 'delete' },
      { name: 'Table Properties', icon: 'settings' },
    ],
    Tools: [
      { name: 'Spell Check', icon: 'spellcheck' },
      { name: 'Word Count', icon: 'format-list-numbered' },
      { name: 'Thesaurus', icon: 'menu-book' },
      { name: 'Language', icon: 'language' },
    ],
    Format: [
      { name: 'Font', icon: 'text-fields' },
      { name: 'Paragraph', icon: 'format-paragraph' },
      { name: 'Styles', icon: 'style' },
      { name: 'Bullets', icon: 'format-list-bulleted' },
      { name: 'Numbering', icon: 'format-list-numbered' },
    ],
  };

  const saveToHistory = () => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push({ content, styles: { isBold, alignment, fontSize } });
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      const prevState = history[currentIndex - 1];
      setContent(prevState.content || '');
      setIsBold(prevState.styles?.isBold || false);
      setAlignment(prevState.styles?.alignment || 'left');
      setFontSize(prevState.styles?.fontSize || 16);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      const nextState = history[currentIndex + 1];
      setContent(nextState.content || '');
      setIsBold(nextState.styles?.isBold || false);
      setAlignment(nextState.styles?.alignment || 'left');
      setFontSize(nextState.styles?.fontSize || 16);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const toggleBold = () => {
    saveToHistory();
    setIsBold(!isBold);
  };

  const toggleAlignment = (nextAlignment) => {
    saveToHistory();
    setAlignment(nextAlignment);
    const updatedQuickAccess = quickAccess.map(item =>
      item.name === 'Align' ? { ...item, value: nextAlignment.charAt(0).toUpperCase() } : item
    );
    setQuickAccess(updatedQuickAccess);
    setAlignmentModalVisible(false);
  };

  const changeFontSize = () => {
    const size = parseInt(customFontSize) || 16;
    if (size >= 8 && size <= 72) {
      saveToHistory();
      setFontSize(size);
      setFontSizeModalVisible(false);
      const updatedQuickAccess = quickAccess.map(item =>
        item.name === 'Font' ? { ...item, value: size.toString() } : item
      );
      setQuickAccess(updatedQuickAccess);
    }
  };

  const saveFile = async (isAutoSave = false) => {
    try {
      let filePath = currentFilePath;

      // If no file path (first time save), show modal unless autoSave=true
      if (!filePath) {
        if (isAutoSave) return; // ignore autosave without filename
        if (!saveFileName.trim()) {
          Alert.alert('Please enter a file name.');
          return;
        }

        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to save files.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission denied');
            return;
          }
          filePath = `${RNFS.DownloadDirectoryPath}/${saveFileName}.docx`;
        } else {
          filePath = `${RNFS.DocumentDirectoryPath}/${saveFileName}.docx`;
        }

        setCurrentFilePath(filePath); // remember file path for next time
      }

      //  Create and save document with tables
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [new TextRun({ text: content, bold: isBold })],
                alignment: alignment,
              }),
              ...tables.map(table => new Table({
                rows: table.data.map(row => new TableRow({
                  children: row.map(cell => new TableCell({
                    children: [new Paragraph({ children: [new TextRun(cell)] })],
                  })),
                })),
              })),
            ],
          },
        ],
      });

      const buffer = await Packer.toBase64String(doc);
      await RNFS.writeFile(filePath, buffer, 'base64');

      showNotification(
        filePath === currentFilePath
          ? 'File saved successfully!'
          : 'File saved as new document!',
        'success'
      );

      setSaveModalVisible(false);
      setSaveFileName('');
    } catch (err) {
      showNotification('Save failed: ' + (err.message || err), 'error');
    }
  };

  const exportFile = async () => {
    try {
      const doc = new Document({
        sections: [
          {
            children: [new Paragraph({ children: [new TextRun(content)], alignment: alignment })],
          },
        ],
      });
      const buffer = await Packer.toBase64String(doc);
      const fileName = `Export_${Date.now()}.docx`;
      const path = Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/${fileName}`
        : `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.writeFile(path, buffer, 'base64');
      showNotification("Export successful!", "success");
    } catch (err) {
      showNotification("Export failed: " + (err.message || err), "error");
    }
  };

  const printDocument = async () => {
    try {
      await RNPrint.print({
        html: `
          <html>
            <head>
              <meta charset="utf-8" />
              <style>
                body { font-size: ${fontSize}px; text-align: ${alignment}; ${isBold ? 'font-weight: bold;' : ''} }
              </style>
            </head>
            <body>${content.replace(/\n/g, '<br/>')}</body>
          </html>
        `,
      });
      showNotification("Print started!", "success");
    } catch (err) {
      showNotification("Print failed: " + (err.message || err), "error");
    }
  };

  const handleCut = () => {
    if (selection.start !== selection.end) {
      const selectedText = content.substring(selection.start, selection.end);
      Clipboard.setString(selectedText);
      const newText = content.slice(0, selection.start) + content.slice(selection.end);
      setContent(newText);
      setSelection({ start: selection.start, end: selection.start });
      saveToHistory();
    }
  };

  const handleCopy = () => {
    if (selection.start !== selection.end) {
      const selectedText = content.substring(selection.start, selection.end);
      Clipboard.setString(selectedText);
    }
  };

  const handlePaste = async () => {
    const clipboardContent = await Clipboard.getString();
    if (clipboardContent) {
      const newText = content.slice(0, selection.start) + clipboardContent + content.slice(selection.end);
      const cursorPos = selection.start + clipboardContent.length;
      setContent(newText);
      setSelection({ start: cursorPos, end: cursorPos });
      saveToHistory();
    }
  };

  const handleFind = () => {
    if (!findText.trim()) return;
    const startIndex = content.indexOf(findText);
    if (startIndex !== -1) {
      setSelection({ start: startIndex, end: startIndex + findText.length });
      textInputRef.current?.focus();
    } else {
      showNotification(`"${findText}" not found`, "error");
    }
    setFindModalVisible(false);
  };

  const handleReplace = () => {
    if (!replaceFindText.trim()) return;
    const regex = new RegExp(replaceFindText, 'g');
    if (!regex.test(content)) {
      showNotification(`"${replaceFindText}" not found`, "error");
      return;
    }
    const newContent = content.replace(regex, replaceWithText);
    setContent(newContent);
    saveToHistory();
    showNotification(`Replaced all "${replaceFindText}"`, "success");
    setReplaceModalVisible(false);
  };

  const handleMenuAction = (menu, action) => {
    switch (menu) {
      case 'File':
        switch (action) {
          case 'New':
            saveToHistory();
            setContent('');
            setCurrentFilePath(null);
            break;
          case 'Save':
            if (currentFilePath) {
              saveFile(true);
            } else {
              setSaveModalVisible(true);
            }
            break;
          case 'Export':
            exportFile();
            break;
          case 'Print':
            printDocument();
            break;
        }
        break;
      case 'Edit':
        switch (action) {
          case 'Cut':
            handleCut();
            break;
          case 'Copy':
            handleCopy();
            break;
          case 'Paste':
            handlePaste();
            break;
          case 'Select All':
            textInputRef.current?.focus();
            setSelection({ start: 0, end: content.length });
            break;
          case 'Find':
            setFindModalVisible(true);
            break;
          case 'Replace':
            setReplaceFindText('');
            setReplaceWithText('');
            setReplaceModalVisible(true);
            break;
        }
        break;
      case 'View':
        switch (action) {
          case 'Page Size':
            setPageSizeModalVisible(true);
            break;
          case 'Margins':
            setCustomMargins({
              top: margins.top.toString(),
              bottom: margins.bottom.toString(),
              left: margins.left.toString(),
              right: margins.right.toString(),
            });
            setMarginsModalVisible(true);
            setCustomMargins('');
            break;
          case 'Zoom':
            setCustomZoom((zoom * 100).toString());
            setZoomModalVisible(true);
            setCustomZoom('');
            break;
          case 'Ruler':
            setShowRuler(!showRuler);
            break;
        }
        break;
      case 'Table':
        switch (action) {
          case 'Insert Table':
            setInsertTableModalVisible(true);
            break;
          // case 'Edit Table':
          //   Alert.alert('Edit Table feature coming soon!');
          //   break;
          // case 'Delete Table':
          //   Alert.alert('Select a table to delete (coming soon)');
          //   break;
          // case 'Table Properties':
          //   Alert.alert('Table Properties will be added later');
          //   break;
        }
    }
    if (!quickAccess.some(item => item.name === action)) {
      const icon = menuItems[menu].find(item => item.name === action)?.icon || action.charAt(0);
      setQuickAccess([...quickAccess, {
        name: action,
        value: action.charAt(0),
        icon: icon,
        action: () => handleMenuAction(menu, action),
      }]);

    }
  };

  const handleInsertTable = (rows, cols) => {
    const newTable = {
      id: Date.now().toString(),
      data: Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => "")
      ),
    };
    setTables(prev => [...prev, newTable]);
    setInsertTableModalVisible(false);
    saveToHistory(); // Save the state after inserting a table
  };


  return (
    <SafeAreaView style={styles.container}>
      <MenuBar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        showQuickAccess={showQuickAccess}
        setShowQuickAccess={setShowQuickAccess}
      />
      <QuickAccessBar showQuickAccess={showQuickAccess} quickAccess={quickAccess} />
      <SecondaryMenuBar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        menuItems={menuItems}
        handleMenuAction={handleMenuAction}
      />
      <FontSizeModal
        fontSizeModalVisible={fontSizeModalVisible}
        setFontSizeModalVisible={setFontSizeModalVisible}
        customFontSize={customFontSize}
        setCustomFontSize={setCustomFontSize}
        changeFontSize={changeFontSize}
      />
      <SaveModal
        saveModalVisible={saveModalVisible}
        setSaveModalVisible={setSaveModalVisible}
        saveFileName={saveFileName}
        setSaveFileName={setSaveFileName}
        saveFile={async () => {
          if (!saveFileName.trim()) {
            Alert.alert('Please enter a file name.');
            return;
          }
          await saveFile(); // call App's saveFile function
        }}
      />
      <AlignmentModal
        alignmentModalVisible={alignmentModalVisible}
        setAlignmentModalVisible={setAlignmentModalVisible}
        toggleAlignment={toggleAlignment}
      />
      <FindModal
        findModalVisible={findModalVisible}
        setFindModalVisible={setFindModalVisible}
        findText={findText}
        setFindText={setFindText}
        handleFind={handleFind}
      />
      <ReplaceModal
        replaceModalVisible={replaceModalVisible}
        setReplaceModalVisible={setReplaceModalVisible}
        replaceFindText={replaceFindText}
        setReplaceFindText={setReplaceFindText}
        replaceWithText={replaceWithText}
        setReplaceWithText={setReplaceWithText}
        handleReplace={handleReplace}
      />
      <PageSizeModal
        pageSizeModalVisible={pageSizeModalVisible}
        setPageSizeModalVisible={setPageSizeModalVisible}
        setPageSize={setPageSize}
      />
      <MarginsModal
        marginsModalVisible={marginsModalVisible}
        setMarginsModalVisible={setMarginsModalVisible}
        customMargins={customMargins}
        setCustomMargins={setCustomMargins}
        setMargins={setMargins}
      />
      <ZoomModal
        zoomModalVisible={zoomModalVisible}
        setZoomModalVisible={setZoomModalVisible}
        customZoom={customZoom}
        setCustomZoom={setCustomZoom}
        setZoom={setZoom}
      />
      <DocumentArea
        content={content}
        setContent={setContent}
        isBold={isBold}
        fontSize={fontSize}
        zoom={zoom}
        margins={margins}
        pageSize={pageSize}
        showRuler={showRuler}
        rulerWidth={rulerWidth}
        setRulerWidth={setRulerWidth}
        draggingMargin={draggingMargin}
        setDraggingMargin={setDraggingMargin}
        panResponderLeft={panResponderLeft}
        panResponderRight={panResponderRight}
        textInputRef={textInputRef}
        selection={selection}
        setSelection={setSelection}
        saveToHistory={saveToHistory}
        tables={tables}
        setTables={setTables}
      />

      <InsertTableModal
        visible={insertTableModalVisible}
        setVisible={setInsertTableModalVisible}
        onInsertTable={handleInsertTable}
      />
      {notification.visible && (
        <Animated.View
          style={[
            styles.notification,
            {
              backgroundColor: notification.type === 'success' ? '#4CAF50' : '#F44336',
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              }],
            },
          ]}
        >
          <Text style={styles.notificationText}>{notification.message}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default App;