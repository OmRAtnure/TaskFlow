import  { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function TaskInput({ onAddTask, editingTask }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.title);
      setPriority(editingTask.priority);
    }
  }, [editingTask]);

  const handleSubmit = () => {
    if (text.trim()) {
      onAddTask(text.trim(), priority);
      setText("");
      setPriority("Medium");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter new task"
        value={text}
        onChangeText={setText}
        placeholderTextColor="#888"
        style={styles.input}
      />

      <View style={styles.row}>
        <Picker
          selectedValue={priority}
          style={styles.picker}
          dropdownIconColor="#000"
          onValueChange={(itemValue) => setPriority(itemValue)}
        >
          <Picker.Item label="🔴 High" value="High" />
          <Picker.Item label="🟡 Medium" value="Medium" />
          <Picker.Item label="🟢 Low" value="Low" />
        </Picker>

        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addText}>{editingTask ? "Update" : "Add"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 6,
    color: "#000",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  picker: {
    flex: 1,
    height: 57,
    color: "black",
  },
  addButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
  },
  addText: {
    color: "#fff",

    fontWeight: "bold",
  },
});
