import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// 组件
import Home from './components/Home';
import History from './components/History';
import Header from './components/Header';
import Footer from './components/Footer';

// 获取API URL，使用相对路径以便 Netlify 代理
// 在本地开发时使用环境变量，在生产环境使用环境变量或默认值
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? (process.env.REACT_APP_API_URL || 'http://localhost:5001')
  : (process.env.REACT_APP_API_URL || '');

console.log('当前 API 基础 URL:', API_BASE_URL);
console.log('当前环境:', process.env.NODE_ENV);

// 配置 axios 默认设置
axios.defaults.timeout = 15000; // 15秒超时
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = false; // 不发送凭证

// 添加请求拦截器，处理请求错误
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    console.log(`发送请求到: ${config.url}`);
    
    // 确保使用正确的URL格式
    if (!config.url.startsWith('http') && !config.url.startsWith('/api/')) {
      // 如果 URL 不以 http 或 /api/ 开头，则添加 /api/ 前缀
      config.url = `/api/${config.url}`;
    }
    
    // 如果有 API_BASE_URL 并且使用相对路径，则添加完整的请求 URL
    if (API_BASE_URL && !config.url.startsWith('http') && !config.url.startsWith('/')) {
      config.url = `${API_BASE_URL}/${config.url}`;
    } else if (API_BASE_URL && config.url.startsWith('/api/')) {
      // 如果 URL 以 /api/ 开头并且有 API_BASE_URL，则替换 URL
      config.url = `${API_BASE_URL}${config.url.substring(4)}`;
    }
    
    // 在生产环境下添加完整的请求 URL
    if (process.env.NODE_ENV === 'production') {
      try {
        const fullUrl = config.url.startsWith('http') 
          ? config.url 
          : new URL(config.url, window.location.origin).href;
        console.log(`完整请求 URL: ${fullUrl}`);
      } catch (e) {
        console.log(`无法解析 URL: ${config.url}`);
      }
    }
    
    console.log(`最终请求 URL: ${config.url}`);
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.error('请求配置错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器，统一处理响应错误
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    console.log(`收到响应:`, response.status, typeof response.data === 'object' ? response.data : '非 JSON 响应数据');
    return response;
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      // 服务器返回了错误状态码
      console.error(`服务器响应错误: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('没有收到响应:', error.request);
    } else {
      // 在设置请求时触发了错误
      console.error('请求错误:', error.message);
    }
    return Promise.reject(error);
  }
);

function App() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 页面加载时获取任务
    fetchTodayTask();
  }, []);

  const fetchTodayTask = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`api/task/today`);
      
      // 检查响应数据是否为 JSON
      if (typeof response.data === 'object') {
        setTask(response.data);
        setError(null);
      } else {
        console.error('服务器返回了非 JSON 响应数据');
        setTask(null);
        setError('服务器返回了非预期的响应数据格式');
      }
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
      const response = await axios.post(`api/task`, { content });
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
    if (!taskId) {
      console.error('Cannot update task: taskId is undefined');
      setError('更新任务失败：taskId 未定义');
      return false;
    }
    
    try {
      setLoading(true);
      const response = await axios.put(`api/task/${taskId}`, { content });
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
    if (!taskId) {
      console.error('Cannot complete task: taskId is undefined');
      setError('完成任务失败：taskId 未定义');
      return false;
    }
    
    try {
      setLoading(true);
      await axios.put(`api/task/${taskId}/complete`);
      setTask(null);
      setError(null);
      return true;
    } catch (err) {
      setError('完成任务时出错，请稍后再试');
      console.error('Error completing task:', err);
      return false;
    } finally {
      setLoading(false);
      // 刷新任务列表
      fetchTodayTask();
    }
  };

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
