import React, { useState } from 'react';
import './Home.css';

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

const Home = ({ task, loading, error, createTask, updateTask, completeTask, refreshTask }) => {
  const [newTaskContent, setNewTaskContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskContent, setEditTaskContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;
    
    const success = await createTask(newTaskContent);
    if (success) {
      setNewTaskContent('');
      setIsCreating(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTaskContent.trim() || !task) return;
    
    const success = await updateTask(task.id, editTaskContent);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleEditStart = () => {
    if (task) {
      setEditTaskContent(task.content);
      setIsEditing(true);
    }
  };

  const handleComplete = async () => {
    if (task && task.id) {
      await completeTask(task.id);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {error && <div className="error">{error}</div>}
      
      <div className="container task-container">
        <h2 className="section-title">今日重要事项</h2>
        
        {task ? (
          isEditing ? (
            <form className="task-form" onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="editTaskContent">修改今天的重要任务：</label>
                <textarea
                  id="editTaskContent"
                  className="form-control"
                  value={editTaskContent}
                  onChange={(e) => setEditTaskContent(e.target.value)}
                  placeholder="修改你今天最重要的任务..."
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">保存修改</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  取消
                </button>
              </div>
            </form>
          ) : (
            <div className="current-task">
              <p className="task-content">{task.content}</p>
              <p className="task-date">创建于: {formatDate(task.created_at)}</p>
              <div className="task-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={handleComplete}
                >
                  完成任务
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleEditStart}
                >
                  修改任务
                </button>
              </div>
            </div>
          )
        ) : isCreating ? (
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="taskContent">你今天最重要的任务是什么？</label>
              <textarea
                id="taskContent"
                className="form-control"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                placeholder="输入你今天最重要的任务..."
                rows="3"
                required
              ></textarea>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">保存任务</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setIsCreating(false)}
              >
                取消
              </button>
            </div>
          </form>
        ) : (
          <div className="no-task">
            <p>你还没有设置今天的重要任务。</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsCreating(true)}
            >
              设置今日任务
            </button>
          </div>
        )}
      </div>
      
      <div className="container info-container">
        <h3>关于"吃掉那只青蛙"</h3>
        <p>
          这个应用基于 Brian Tracy 的"吃掉那只青蛙"理念，即每天早上先完成最困难但最重要的任务。
        </p>
        <p>
          如果你必须吃掉两只青蛙，先吃掉最大的那只。
        </p>
        <p>
          每天只设置一个最重要的任务，帮助你专注于真正重要的事情。
        </p>
      </div>
    </div>
  );
};

export default Home;
