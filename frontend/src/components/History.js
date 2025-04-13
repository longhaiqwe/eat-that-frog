import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';

// 获取 API 基础 URL
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? (process.env.REACT_APP_API_URL || 'http://localhost:5001')
  : '';

// 日期格式化函数，处理无效日期
const formatDate = (dateString) => {
  if (!dateString) return '未知日期';
  
  try {
    const date = new Date(dateString);
    // 检查日期是否有效
    if (isNaN(date.getTime())) return '未知日期';
    
    return date.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '未知日期';
  }
};

const History = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/tasks/history`);
        
        // 确保响应数据是数组
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.error('Expected array but got:', typeof response.data);
          setTasks([]);
          setError('服务器返回了意外的数据格式');
        }
      } catch (err) {
        setError('加载历史记录时出错，请稍后再试');
        console.error('Error fetching history:', err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="container">
        <h2 className="section-title">任务历史记录</h2>
        
        {error && <div className="error">{error}</div>}
        
        {!tasks || tasks.length === 0 ? (
          <div className="no-history">
            <p>暂无历史记录。</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`task-item ${task.completed ? 'completed' : 'pending'}`}
              >
                <div className="task-content">{task.content}</div>
                <div className="task-meta">
                  <div className="task-date">
                    创建于: {formatDate(task.created_at)}
                  </div>
                  {task.completed && (
                    <div className="task-completed-date">
                      完成于: {formatDate(task.completed_at)}
                    </div>
                  )}
                  <div className="task-status">
                    状态: {task.completed ? '已完成' : '未完成'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
