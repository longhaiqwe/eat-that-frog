from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os

app = Flask(__name__)

# 配置CORS，允许Netlify的请求
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "https://eat-frog.netlify.app"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True
    }
})

# 添加CORS头部的中间件
@app.after_request
def add_cors_headers(response):
    # 允许特定的域名，但不重复添加
    if 'Access-Control-Allow-Origin' not in response.headers:
        origin = request.headers.get('Origin')
        if origin in ['http://localhost:3000', 'https://eat-frog.netlify.app']:
            response.headers.add('Access-Control-Allow-Origin', origin)
        else:
            response.headers.add('Access-Control-Allow-Origin', '*')
    
    # 只在没有这些头部时添加
    if 'Access-Control-Allow-Headers' not in response.headers:
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept')
    if 'Access-Control-Allow-Methods' not in response.headers:
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    if 'Access-Control-Allow-Credentials' not in response.headers:
        response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# 处理OPTIONS请求
@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def options_handler(path):
    response = make_response()
    # 允许特定的域名
    origin = request.headers.get('Origin')
    if origin in ['http://localhost:3000', 'https://eat-frog.netlify.app']:
        response.headers.add('Access-Control-Allow-Origin', origin)
    else:
        response.headers.add('Access-Control-Allow-Origin', '*')
    
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# 配置数据库
db_path = os.environ.get('DATABASE_URL', 'sqlite:///frogs.db')
# 修复Heroku PostgreSQL URL问题
if db_path.startswith("postgres://"):
    db_path = db_path.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 获取上海时间（UTC+8）
def get_shanghai_time():
    return datetime.utcnow() + timedelta(hours=8)

# 定义任务模型
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=get_shanghai_time)
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
    task.completed_at = get_shanghai_time()
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

# 启动应用
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
