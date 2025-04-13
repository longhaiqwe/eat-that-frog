from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
# 配置CORS，允许所有域名访问API
CORS(app, resources={r"/api/*": {"origins": "*"}})

# 配置数据库
db_path = os.environ.get('DATABASE_URL', 'sqlite:///frogs.db')
# 修复Heroku PostgreSQL URL问题
if db_path.startswith("postgres://"):
    db_path = db_path.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 定义任务模型
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'completed': self.completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

# 创建数据库表
with app.app_context():
    db.create_all()

# 路由：获取当天的任务
@app.route('/api/task/today', methods=['GET'])
def get_today_task():
    # 获取最近创建的未完成任务
    task = Task.query.filter_by(completed=False).order_by(Task.created_at.desc()).first()
    
    if task:
        return jsonify(task.to_dict()), 200
    else:
        return jsonify({"message": "No task found"}), 404

# 路由：创建新任务
@app.route('/api/task', methods=['POST'])
def create_task():
    data = request.get_json()
    
    if not data or 'content' not in data:
        return jsonify({"error": "Task content is required"}), 400
    
    new_task = Task(content=data['content'])
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify(new_task.to_dict()), 201

# 路由：更新任务内容
@app.route('/api/task/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    
    if not data or 'content' not in data:
        return jsonify({"error": "Task content is required"}), 400
    
    task.content = data['content']
    db.session.commit()
    
    return jsonify(task.to_dict()), 200

# 路由：标记任务完成
@app.route('/api/task/<int:task_id>/complete', methods=['PUT'])
def complete_task(task_id):
    task = Task.query.get_or_404(task_id)
    
    task.completed = True
    task.completed_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify(task.to_dict()), 200

# 路由：获取历史任务
@app.route('/api/tasks/history', methods=['GET'])
def get_task_history():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks]), 200

# 首页路由，用于健康检查
@app.route('/')
def index():
    return jsonify({"status": "ok", "message": "Eat That Frog API is running"})

if __name__ == '__main__':
    # 使用环境变量中的端口，如果没有则使用5001
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=False, host='0.0.0.0', port=port)
