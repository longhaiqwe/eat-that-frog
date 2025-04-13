import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// 组件
import Home from './components/Home';
import History from './components/History';
import Header from './components/Header';
import Footer from './components/Footer';

// 获取API URL，先使用环境变量，如果没有则使用默认值
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function App() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodayTask = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/task/today`);
      setTask(response.data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // 没有任务，这不是错误
        setTask(null);
        setError(null);
      } else {
        setError('加载任务时出错，请稍后再试');
        console.error('Error fetching task:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (content) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/task`, { content });
      setTask(response.data);
      setError(null);
      return true;
    } catch (err) {
      setError('创建任务时出错，请稍后再试');
      console.error('Error creating task:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, content) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/api/task/${taskId}`, { content });
      setTask(response.data);
      setError(null);
      return true;
    } catch (err) {
      setError('更新任务时出错，请稍后再试');
      console.error('Error updating task:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/api/task/${taskId}/complete`);
      setTask(null);
      setError(null);
      return true;
    } catch (err) {
      setError('标记任务完成时出错，请稍后再试');
      console.error('Error completing task:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayTask();
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <Home 
                task={task} 
                loading={loading} 
                error={error} 
                createTask={createTask} 
                updateTask={updateTask}
                completeTask={completeTask} 
                refreshTask={fetchTodayTask}
              />
            } />
            <Route path="/history" element={<History apiBaseUrl={API_BASE_URL} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
