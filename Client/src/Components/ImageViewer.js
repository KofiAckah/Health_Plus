import React from "react";
import { View, Modal, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ImageViewer = ({ visible, imageUrl, onClose }) => (
  <Modal visible={visible} transparent={true} animationType="fade">
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <FontAwesomeIcon icon={faTimes} size={28} color="#fff" />
      </TouchableOpacity>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.97)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "98%",
    height: "85%",
    borderRadius: 12,
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
    padding: 10,
  },
});

export default ImageViewer;
