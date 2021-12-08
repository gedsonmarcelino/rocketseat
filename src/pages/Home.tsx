import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Header } from '../components/Header';
import { Task, TasksList } from '../components/TasksList';
import { TodoInput } from '../components/TodoInput';

export function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleAddTask(newTaskTitle: string) {
    const existsTask = tasks.find(item => item.title === newTaskTitle)

    if (existsTask) {
      Alert.alert(
        'Task já cadastrada',
        'Você não pode cadastrar uma task com o mesmo nome.',
        [
          {
            text: 'Ok'
          }
        ]
      )
      return;
    }

    const newTask = {
      id: Math.floor(Math.random() * (10000 - 1) + 1),
      title: newTaskTitle,
      done: false
    } as Task

    setTasks([
      ...tasks,
      newTask
    ])
  }

  function handleToggleTaskDone(id: number) {
    const tasksChanged = tasks.map(item => item.id === id ? { ...item, done: !item.done } : item)
    setTasks(tasksChanged)
  }

  function handleRemoveTask(id: number) {
    const newTasks = tasks.filter(item => item.id !== id)
    setTasks(newTasks)
  }

  function handleEditTask(id: number, newTitle: string) {
    const newTasks = tasks.map(item => item.id === id ? { ...item, title: newTitle } : item)
    setTasks(newTasks)
  }

  return (
    <View style={styles.container}>
      <Header tasksCounter={tasks.length} />

      <TodoInput addTask={handleAddTask} />

      <TasksList
        tasks={tasks}
        toggleTaskDone={handleToggleTaskDone}
        removeTask={handleRemoveTask}
        editTask={handleEditTask}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB'
  }
})