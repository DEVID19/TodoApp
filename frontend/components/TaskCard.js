import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <View className="bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm flex-row items-start">
      {/* Checkbox */}
      <TouchableOpacity
        onPress={() => onToggle(task)}
        className="mt-0.5 mr-3"
      >
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            task.isCompleted
              ? "bg-indigo-600 border-indigo-600"
              : "border-gray-300"
          }`}
        >
          {task.isCompleted && (
            <Ionicons name="checkmark" size={14} color="white" />
          )}
        </View>
      </TouchableOpacity>

      {/* Content */}
      <View className="flex-1">
        <Text
          className={`text-base font-medium ${
            task.isCompleted ? "text-gray-400 line-through" : "text-gray-900"
          }`}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
      </View>

      {/* Actions */}
      <View className="flex-row items-center ml-2 gap-x-2">
        <TouchableOpacity
          onPress={() => onEdit(task)}
          className="p-1"
        >
          <Ionicons name="pencil-outline" size={18} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(task._id)}
          className="p-1"
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
