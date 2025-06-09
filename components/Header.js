import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Header({
  viewMode,
  setViewMode,
  filterType,
  setFilterType,
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>TaskFlow</Text>
      <View style={styles.pickers}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={viewMode}
            style={styles.picker}
            onValueChange={setViewMode}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Daily" value="Daily" />
            <Picker.Item label="Weekly" value="Weekly" />
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={filterType}
            style={styles.picker}
            onValueChange={setFilterType}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Incomplete" value="Incomplete" />
            <Picker.Item label="Completed" value="Completed" />
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
},
title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pickers: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  picker: {
    width: "100%",
    // height: 40, 
    color: "black", 
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingHorizontal: 4,
    backgroundColor: "#fff",
    width: "48%", 
  },
});
