// components/TaskItem.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TaskItem({ task, onToggleComplete, onDelete, onEdit }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#e74c3c"; 
      case "Medium":
        return "#f1c40f"; 
      case "Low":
        return "#2ecc71"; 
      default:
        return "#bdc3c7"; 
    }
  };

  return (
    <View
      style={[
        styles.itemContainer,
        { borderLeftColor: getPriorityColor(task.priority) },
      ]}
    >
      <TouchableOpacity
        onPress={() => onToggleComplete(task.id)}
        style={styles.checkbox}
      >
        <Text style={styles.checkboxText}>{task.isCompleted ? "☑" : "☐"}</Text>
      </TouchableOpacity>

      <Text style={[styles.taskText, task.isCompleted && styles.completedText]}>
        {task.title}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(task)}>
          <Text style={styles.icon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task.id)}>
          <Text style={styles.icon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 5,
    alignItems: "center",
    borderLeftWidth: 5,
    elevation: 2,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 18,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  actions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  icon: {
    fontSize: 16,
    marginLeft: 10,
  },
});
