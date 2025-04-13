import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';

const History = ({ apiBaseUrl }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/api/tasks/history`);
        setTasks(response.data);
        setError(null);
      } catch (err) {
        setError('加载历史记录时出错，请稍后再试');
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [apiBaseUrl]);

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
        
        {tasks.length === 0 ? (
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
                    创建于: {new Date(task.created_at).toLocaleString()}
                  </div>
                  {task.completed && (
                    <div className="task-completed-date">
                      完成于: {new Date(task.completed_at).toLocaleString()}
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
