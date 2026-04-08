import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import {
  fetchTasks,
  addTask,
  updateTask,
  removeTask,
} from "../services/taskService";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // all | active | completed

  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const handleAddTask = async (title, description) => {
    try {
      setModalLoading(true);
      const newTask = await addTask(title, description);
      setTasks((prev) => [newTask, ...prev]);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add task");
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateTask = async (title, description) => {
    try {
      setModalLoading(true);
      const updated = await updateTask(editTask._id, { title, description });
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );
      setEditTask(null);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updated = await updateTask(task._id, {
        isCompleted: !task.isCompleted,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleDeleteTask = (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await removeTask(id);
            setTasks((prev) => prev.filter((t) => t._id !== id));
          } catch (error) {
            Alert.alert("Error", "Failed to delete task");
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutUser();
          } catch (_) {}
          logout();
        },
      },
    ]);
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditTask(null);
    setModalVisible(false);
  };

  // Filter tasks by search + active filter tab
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (activeFilter === "active") return matchesSearch && !task.isCompleted;
    if (activeFilter === "completed") return matchesSearch && task.isCompleted;
    return matchesSearch;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      onPress={() => setActiveFilter(value)}
      className={`px-4 py-1.5 rounded-full ${
        activeFilter === value ? "bg-indigo-600" : "bg-gray-100"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          activeFilter === value ? "text-white" : "text-gray-600"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 pt-4 pb-2 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-1">
          <View>
            <Text className="text-2xl font-bold text-gray-900">My Tasks</Text>
            <Text className="text-sm text-gray-500">
              Hello, {user?.name?.split(" ")[0]}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        {totalCount > 0 && (
          <View className="mt-3">
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs text-gray-500">Progress</Text>
              <Text className="text-xs text-gray-500">
                {completedCount}/{totalCount} done
              </Text>
            </View>
            <View className="h-1.5 bg-gray-200 rounded-full">
              <View
                className="h-1.5 bg-indigo-600 rounded-full"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </View>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View className="px-5 pt-4 pb-2">
        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-gray-900 text-base"
            placeholder="Search tasks..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-5 gap-x-2 mb-3">
        <FilterButton label="All" value="all" />
        <FilterButton label="Active" value="active" />
        <FilterButton label="Completed" value="completed" />
      </View>

      {/* Task List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4F46E5"]}
              tintColor="#4F46E5"
            />
          }
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={handleToggleComplete}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Ionicons name="clipboard-outline" size={56} color="#D1D5DB" />
              <Text className="text-gray-400 text-base mt-3">
                {searchQuery
                  ? "No tasks match your search"
                  : "No tasks yet. Add one!"}
              </Text>
            </View>
          }
        />
      )}

      {/*  Add Task */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
        onPress={() => {
          setEditTask(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Task Modal */}
      <TaskModal
        visible={modalVisible}
        onClose={closeModal}
        onSubmit={editTask ? handleUpdateTask : handleAddTask}
        editTask={editTask}
        loading={modalLoading}
      />
    </SafeAreaView>
  );
}
