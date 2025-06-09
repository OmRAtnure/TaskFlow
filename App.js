import { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import TaskInput from "./components/TaskInput";
import TaskItem from "./components/TaskItem";
import Header from "./components/Header";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState("Daily");
  const [filterType, setFilterType] = useState("Incomplete");
  const [editingTask, setEditingTask] = useState(null);
  const [isReady,setIsReady]= useState(false);

  useEffect(() => {
    const init = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Notifications won't work without permission."
        );
      }
      // console.log("task loading initiated");
      loadTasks();
    };
    init();
  }, []);

  useEffect(() => {
    if(isReady){
      // console.log("Task saving initited");
      saveTasks();
    }
  }, [tasks,isReady]);

  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem("TASKS");
      if (data) {
        const loadedTasks = JSON.parse(data).map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt), 
        }));
        // console.log(loadedTasks);
        setTasks(loadedTasks);
        // console.log("task loaded");
      }
    } catch (err) {
      console.log("Failed to load tasks:", err);
    }
    finally{
      setIsReady(true);
        }
  };

  const saveTasks = async () => {
    try {
      const serializableTasks = tasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
      }));
      // console.log(serializableTasks);
      await AsyncStorage.setItem("TASKS", JSON.stringify(serializableTasks));
      console.log("task saved");
    } catch (err) {
      console.log("Failed to save tasks:", err);
    }
  };

  const addTask = async (text, priority) => {
    if (!text.trim()) {
      Alert.alert("Validation", "Task name cannot be empty.");
      return;
    }

    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? { ...task, title: text, priority } : task
      );
      setTasks(updatedTasks);
      setEditingTask(null);
      return;
    }

    let newTask = {
      id: Date.now().toString(),
      title: text,
      isCompleted: false,
      priority,
      frequency: viewMode,
      createdAt: new Date(),
      notificationId: null,
    };

    const notificationId = await scheduleNotification(newTask.title);

    newTask = { ...newTask, notificationId };

    setTasks((prev) => [newTask, ...prev]);
  };

  const scheduleNotification = async (title) => {
    const triggerDate = new Date(Date.now() + 60 * 1000); // 60 seconds 

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Reminder",
        body: title,
      },
      trigger: triggerDate,
    });

    return id;
  };

  const cancelNotification = async (id) => {
    await Notifications.cancelScheduledNotificationAsync(id);
  };

  const toggleComplete = async (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const updated = { ...task, isCompleted: !task.isCompleted };
          if (updated.isCompleted && updated.notificationId) {
            cancelNotification(updated.notificationId);
            updated.notificationId = null;
          }
          return updated;
        }
        return task;
      })
    );
  };

  const deleteTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task?.notificationId) await cancelNotification(task.notificationId);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks
    .filter(
      (task) =>
        task.frequency === viewMode &&
        (filterType === "Completed" ? task.isCompleted : !task.isCompleted)
    )
    .sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const startEditing = (task) => {
    setEditingTask(task);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />

          <Header
            viewMode={viewMode}
            setViewMode={setViewMode}
            filterType={filterType}
            setFilterType={setFilterType}
          />

          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggleComplete={toggleComplete}
                onDelete={deleteTask}
                onEdit={startEditing}
              />
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
          />

          {/* Fixed TaskInput at bottom */}
          <View style={styles.inputWrapper}>
            <TaskInput onAddTask={addTask} editingTask={editingTask} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
    paddingBottom: 30,
  },
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    zIndex: 1,
  },
});
