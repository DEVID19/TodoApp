import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TaskModal({ visible, onClose, onSubmit, editTask, loading }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editTask, visible]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          className="flex-1 bg-black/40"
          activeOpacity={1}
          onPress={onClose}
        />
        <View className="bg-white rounded-t-3xl px-6 pt-5 pb-10">
          {/* Handle bar */}
          <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-5" />

          {/* Title row */}
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-xl font-bold text-gray-900">
              {editTask ? "Edit Task" : "New Task"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle-outline" size={26} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Task Title Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-base bg-gray-50"
              placeholder="What needs to be done?"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-base bg-gray-50"
              placeholder="Add a note..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${
              title.trim() ? "bg-indigo-600" : "bg-indigo-300"
            }`}
            onPress={handleSubmit}
            disabled={!title.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {editTask ? "Update Task" : "Add Task"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
