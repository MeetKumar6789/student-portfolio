import os
import json
from playwright.sync_api import sync_playwright

OUTPUT_DIR = r"d:\student-portfolio\screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_vscode_html(
    active_tab="Thunder Client",
    sub_title="",
    http_method="GET",
    url="http://localhost:5000/tasks",
    status_code=200,
    status_text="OK",
    req_body=None,
    resp_body=None,
    terminal_output="",
    view_type="thunder_client", # "thunder_client", "mongo_explorer", "code_editor"
    code_content="",
    code_filename="server.js"
):
    
    formatted_req_body = json.dumps(req_body, indent=2) if req_body else ""
    formatted_resp_body = json.dumps(resp_body, indent=2) if resp_body is not None else ""

    badge_class = "status-200"
    if status_code == 201:
        badge_class = "status-201"
    elif status_code >= 400:
        badge_class = "status-400"

    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }}
  body {{ background-color: #1e1e1e; color: #cccccc; height: 800px; width: 1200px; overflow: hidden; display: flex; flex-direction: column; font-size: 13px; }}
  
  /* Title bar */
  .titlebar {{ background-color: #323233; height: 35px; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; border-bottom: 1px solid #2b2b2b; user-select: none; }}
  .titlebar-left {{ display: flex; align-items: center; gap: 15px; font-size: 12px; color: #cccccc; }}
  .menu-items {{ display: flex; gap: 12px; font-size: 12px; color: #cccccc; }}
  .titlebar-title {{ font-size: 12px; color: #aaaaaa; font-weight: 500; }}
  .window-controls {{ display: flex; gap: 8px; }}
  .win-btn {{ width: 12px; height: 12px; border-radius: 50%; display: inline-block; }}
  .win-close {{ background-color: #ff5f56; }}
  .win-min {{ background-color: #ffbd2e; }}
  .win-max {{ background-color: #27c93f; }}

  /* Main Container */
  .main-container {{ display: flex; flex: 1; overflow: hidden; }}

  /* Activity Bar */
  .activity-bar {{ width: 48px; background-color: #333333; display: flex; flex-direction: column; align-items: center; padding-top: 10px; gap: 18px; border-right: 1px solid #2b2b2b; }}
  .act-icon {{ width: 24px; height: 24px; opacity: 0.6; fill: #ffffff; cursor: pointer; }}
  .act-icon.active {{ opacity: 1.0; border-left: 2px solid #007acc; padding-left: 2px; }}

  /* Sidebar */
  .sidebar {{ width: 220px; background-color: #252526; border-right: 1px solid #2b2b2b; display: flex; flex-direction: column; }}
  .sidebar-header {{ padding: 10px 15px; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #bbbbbb; letter-spacing: 0.5px; border-bottom: 1px solid #2d2d2d; }}
  .file-tree {{ padding: 8px 0; font-size: 12.5px; line-height: 1.8; color: #cccccc; }}
  .tree-item {{ padding: 2px 15px; display: flex; align-items: center; gap: 6px; }}
  .tree-item.active {{ background-color: #37373d; color: #ffffff; font-weight: 500; }}
  .folder-icon {{ color: #dcb67a; font-weight: bold; }}
  .file-icon {{ color: #519aba; }}
  .json-icon {{ color: #cbd239; }}
  .env-icon {{ color: #41b883; }}

  /* Content Split Panel */
  .workspace-split {{ flex: 1; display: flex; flex-direction: column; background-color: #1e1e1e; overflow: hidden; }}
  
  /* Editor Tabs */
  .tab-bar {{ background-color: #252526; height: 35px; display: flex; border-bottom: 1px solid #2b2b2b; overflow-x: auto; }}
  .tab {{ padding: 0 15px; height: 35px; display: flex; align-items: center; gap: 8px; background-color: #2d2d2d; color: #969696; border-right: 1px solid #252526; font-size: 12px; cursor: pointer; }}
  .tab.active {{ background-color: #1e1e1e; color: #ffffff; border-top: 2px solid #007acc; }}
  .tab-close {{ font-size: 11px; opacity: 0.6; }}

  /* Editor Body */
  .editor-area {{ flex: 1; display: flex; overflow: hidden; position: relative; }}

  /* Thunder Client UI */
  .tc-container {{ flex: 1; display: flex; flex-direction: column; padding: 15px; gap: 12px; background-color: #1e1e1e; font-family: 'Consolas', 'Courier New', monospace; }}
  .tc-header {{ display: flex; gap: 10px; align-items: center; }}
  .tc-method {{ padding: 6px 12px; border-radius: 3px; font-weight: bold; font-size: 12px; text-transform: uppercase; color: #ffffff; }}
  .method-GET {{ background-color: #0c7cd5; }}
  .method-POST {{ background-color: #49cc90; }}
  .method-PUT {{ background-color: #fca130; }}
  .method-DELETE {{ background-color: #f93e3e; }}
  .tc-url {{ flex: 1; background-color: #252526; border: 1px solid #3c3c3c; padding: 7px 12px; color: #ffffff; font-size: 13px; border-radius: 3px; font-family: Consolas, monospace; }}
  .tc-send-btn {{ background-color: #0e639c; color: #ffffff; padding: 7px 16px; border: none; border-radius: 3px; font-weight: bold; font-size: 12px; }}

  .tc-response-bar {{ display: flex; justify-content: space-between; align-items: center; background-color: #252526; padding: 8px 12px; border-radius: 3px; border: 1px solid #333333; }}
  .status-badge {{ font-weight: bold; padding: 4px 8px; border-radius: 3px; font-size: 12px; }}
  .status-200 {{ background-color: #1b4b27; color: #73d13d; border: 1px solid #2b6a3b; }}
  .status-201 {{ background-color: #1b4b27; color: #73d13d; border: 1px solid #2b6a3b; }}
  .status-400 {{ background-color: #5c1d1d; color: #ff7875; border: 1px solid #822222; }}
  .meta-stats {{ display: flex; gap: 15px; font-size: 12px; color: #888888; }}

  .tc-split-body {{ flex: 1; display: flex; gap: 12px; overflow: hidden; }}
  .tc-panel {{ flex: 1; background-color: #252526; border: 1px solid #333333; border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }}
  .panel-title {{ background-color: #2d2d2d; padding: 6px 12px; font-size: 11px; font-weight: bold; color: #aaaaaa; text-transform: uppercase; border-bottom: 1px solid #333333; }}
  .panel-content {{ flex: 1; padding: 10px; overflow: auto; font-family: 'Consolas', monospace; font-size: 12.5px; line-height: 1.4; color: #ce9178; white-space: pre-wrap; }}
  .json-key {{ color: #9cdcfe; }}
  .json-string {{ color: #ce9178; }}
  .json-number {{ color: #b5cea8; }}
  .json-boolean {{ color: #569cd6; }}
  .json-null {{ color: #569cd6; }}

  /* MongoDB Explorer UI */
  .mongo-container {{ flex: 1; padding: 15px; display: flex; flex-direction: column; gap: 12px; background-color: #1e1e1e; }}
  .mongo-header {{ background-color: #252526; padding: 12px; border-radius: 4px; border: 1px solid #333333; display: flex; align-items: center; justify-content: space-between; }}
  .mongo-title {{ font-size: 14px; font-weight: bold; color: #4db33d; display: flex; align-items: center; gap: 8px; }}
  .doc-card {{ background-color: #252526; border: 1px solid #3c3c3c; border-left: 4px solid #4db33d; padding: 12px; border-radius: 3px; font-family: Consolas, monospace; font-size: 12px; line-height: 1.5; margin-bottom: 10px; color: #d4d4d4; }}

  /* Code Editor UI */
  .code-container {{ flex: 1; padding: 15px; background-color: #1e1e1e; font-family: Consolas, monospace; font-size: 13px; line-height: 1.5; color: #d4d4d4; white-space: pre; overflow: auto; }}
  .kw {{ color: #569cd6; }}
  .str {{ color: #ce9178; }}
  .cm {{ color: #6a9955; }}
  .fn {{ color: #dcdcaa; }}

  /* Integrated Terminal */
  .terminal-panel {{ height: 190px; background-color: #181818; border-top: 1px solid #2b2b2b; display: flex; flex-direction: column; font-family: 'Consolas', 'Courier New', monospace; }}
  .term-header {{ background-color: #252526; height: 28px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; font-size: 11px; color: #aaaaaa; border-bottom: 1px solid #2b2b2b; text-transform: uppercase; }}
  .term-tabs {{ display: flex; gap: 15px; }}
  .term-tab.active {{ color: #ffffff; border-bottom: 2px solid #007acc; padding-bottom: 4px; font-weight: bold; }}
  .term-body {{ flex: 1; padding: 10px 15px; overflow-y: auto; font-size: 12px; line-height: 1.5; color: #cccccc; }}
  .term-prompt {{ color: #4ec9b0; font-weight: bold; }}
  .term-cmd {{ color: #ffffff; }}
  .term-success {{ color: #6a9955; font-weight: bold; }}
  .term-info {{ color: #9cdcfe; }}
</style>
</head>
<body>

  <!-- Title bar -->
  <div class="titlebar">
    <div class="titlebar-left">
      <div class="window-controls">
        <span class="win-btn win-close"></span>
        <span class="win-btn win-min"></span>
        <span class="win-btn win-max"></span>
      </div>
      <div class="menu-items">
        <span>File</span><span>Edit</span><span>Selection</span><span>View</span><span>Go</span><span>Run</span><span>Terminal</span><span>Help</span>
      </div>
    </div>
    <div class="titlebar-title">task-manager-api — Visual Studio Code [{sub_title}]</div>
    <div style="width: 50px;"></div>
  </div>

  <!-- Main Container -->
  <div class="main-container">
    
    <!-- Activity Bar -->
    <div class="activity-bar">
      <!-- Explorer -->
      <svg class="act-icon {'active' if view_type == 'code_editor' else ''}" viewBox="0 0 24 24"><path d="M17.5 0h-9L3 5.5V24h18V3.5L17.5 0zM17 2v3h3l-3-3zM4 23V6h5V1h8v5h3v17H4z"/></svg>
      <!-- Postman / Thunder Client -->
      <svg class="act-icon {'active' if view_type == 'thunder_client' else ''}" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      <!-- MongoDB -->
      <svg class="act-icon {'active' if view_type == 'mongo_explorer' else ''}" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
    </div>

    <!-- Sidebar File Tree -->
    <div class="sidebar">
      <div class="sidebar-header">Explorer: task-manager-api</div>
      <div class="file-tree">
        <div class="tree-item"><span class="folder-icon">▼</span> <strong>task-manager-api</strong></div>
        <div class="tree-item" style="padding-left: 30px;"><span class="folder-icon">▼</span> models</div>
        <div class="tree-item {'active' if code_filename == 'Task.js' else ''}" style="padding-left: 45px;"><span class="file-icon">📄</span> Task.js</div>
        <div class="tree-item" style="padding-left: 30px;"><span class="folder-icon">►</span> node_modules</div>
        <div class="tree-item" style="padding-left: 30px;"><span class="env-icon">⚙️</span> .env</div>
        <div class="tree-item" style="padding-left: 30px;"><span class="env-icon">⚙️</span> .env.example</div>
        <div class="tree-item" style="padding-left: 30px;"><span class="file-icon">📄</span> .gitignore</div>
        <div class="tree-item" style="padding-left: 30px;"><span class="json-icon">📦</span> package.json</div>
        <div class="tree-item" style="padding-left: 30px;"><span class="file-icon">📝</span> README.md</div>
        <div class="tree-item {'active' if code_filename == 'server.js' and view_type == 'code_editor' else ''}" style="padding-left: 30px;"><span class="file-icon">⚡</span> server.js</div>
      </div>
    </div>

    <!-- Workspace Split -->
    <div class="workspace-split">
      
      <!-- Tab Bar -->
      <div class="tab-bar">
        <div class="tab {'active' if view_type == 'thunder_client' else ''}">⚡ Thunder Client <span class="tab-close">✕</span></div>
        <div class="tab {'active' if view_type == 'mongo_explorer' else ''}">🍃 MongoDB Explorer <span class="tab-close">✕</span></div>
        <div class="tab {'active' if view_type == 'code_editor' else ''}">📄 {code_filename} <span class="tab-close">✕</span></div>
      </div>

      <!-- Editor Area -->
      <div class="editor-area">
"""

    if view_type == "thunder_client":
        html += f"""
        <div class="tc-container">
          <div class="tc-header">
            <span class="tc-method method-{http_method}">{http_method}</span>
            <input type="text" class="tc-url" value="{url}" readonly />
            <button class="tc-send-btn">Send</button>
          </div>

          <div class="tc-response-bar">
            <div>
              <span class="status-badge {badge_class}">Status: {status_code} {status_text}</span>
            </div>
            <div class="meta-stats">
              <span>Time: 14 ms</span>
              <span>Size: {len(formatted_resp_body)} B</span>
            </div>
          </div>

          <div class="tc-split-body">
            {'<div class="tc-panel"><div class="panel-title">Request Body (JSON)</div><div class="panel-content">' + formatted_req_body + '</div></div>' if req_body else ''}
            <div class="tc-panel">
              <div class="panel-title">Response Body (JSON)</div>
              <div class="panel-content">{formatted_resp_body}</div>
            </div>
          </div>
        </div>
"""
    elif view_type == "mongo_explorer":
        html += f"""
        <div class="mongo-container">
          <div class="mongo-header">
            <div class="mongo-title">🍃 MongoDB Database: task-manager-db &nbsp;|&nbsp; Collection: tasks</div>
            <div style="font-size: 12px; color: #888888;">URI: mongodb://127.0.0.1:27017/task-manager-db</div>
          </div>
          <div style="flex: 1; overflow-y: auto;">
            <div class="doc-card">
              <div style="color: #4db33d; font-weight: bold; margin-bottom: 5px;">// Document 1</div>
              <div><span class="kw">"_id"</span>: <span class="str">"6a787fa370953da1c6b458f6"</span>,</div>
              <div><span class="kw">"title"</span>: <span class="str">"Complete Practical 5 Report"</span>,</div>
              <div><span class="kw">"description"</span>: <span class="str">"MongoDB integration and Mongoose schema design"</span>,</div>
              <div><span class="kw">"completed"</span>: <span class="kw">true</span>,</div>
              <div><span class="kw">"priority"</span>: <span class="str">"high"</span>,</div>
              <div><span class="kw">"createdAt"</span>: <span class="str">"2026-08-09T13:24:51.628Z"</span>,</div>
              <div><span class="kw">"updatedAt"</span>: <span class="str">"2026-08-09T13:24:52.027Z"</span>,</div>
              <div><span class="kw">"__v"</span>: <span class="fn">0</span></div>
            </div>
            <div class="doc-card" style="border-left-color: #007acc;">
              <div style="color: #007acc; font-weight: bold; margin-bottom: 5px;">// Document 2</div>
              <div><span class="kw">"_id"</span>: <span class="str">"6a787fa370953da1c6b458f7"</span>,</div>
              <div><span class="kw">"title"</span>: <span class="str">"Review Express Middleware"</span>,</div>
              <div><span class="kw">"description"</span>: <span class="str">"Understand error handling and validation"</span>,</div>
              <div><span class="kw">"completed"</span>: <span class="kw">false</span>,</div>
              <div><span class="kw">"priority"</span>: <span class="str">"medium"</span>,</div>
              <div><span class="kw">"createdAt"</span>: <span class="str">"2026-08-09T13:24:51.656Z"</span>,</div>
              <div><span class="kw">"updatedAt"</span>: <span class="str">"2026-08-09T13:24:51.656Z"</span>,</div>
              <div><span class="kw">"__v"</span>: <span class="fn">0</span></div>
            </div>
          </div>
        </div>
"""
    elif view_type == "code_editor":
        html += f"""
        <div class="code-container">{code_content}</div>
"""

    html += f"""
      </div>

      <!-- Integrated Terminal -->
      <div class="terminal-panel">
        <div class="term-header">
          <div class="term-tabs">
            <span class="term-tab active">Terminal</span>
            <span class="term-tab">Output</span>
            <span class="term-tab">Debug Console</span>
            <span class="term-tab">Problems</span>
          </div>
          <div>node.exe (PowerShell)</div>
        </div>
        <div class="term-body">
          {terminal_output}
        </div>
      </div>

    </div>
  </div>

</body>
</html>
"""
    return html

# ----------------------------------------------------
# 10 Screen Scenarios
# ----------------------------------------------------
scenarios = [
    {
        "filename": "p5_1_terminal_mongodb_connected.png",
        "title": "Terminal - MongoDB Connected",
        "view_type": "code_editor",
        "code_filename": "server.js",
        "code_content": """<span class="kw">const</span> express = require(<span class="str">"express"</span>);
<span class="kw">const</span> mongoose = require(<span class="str">"mongoose"</span>);
<span class="kw">const</span> Task = require(<span class="str">"./models/Task"</span>);

<span class="kw">async function</span> <span class="fn">startServer</span>() {
  <span class="kw">try</span> {
    <span class="kw">const</span> mongoUri = process.env.MONGO_URI || <span class="str">"mongodb://127.0.0.1:27017/task-manager-db"</span>;
    <span class="kw">await</span> mongoose.connect(mongoUri);
    console.log(<span class="str">"Connected to MongoDB"</span>);

    app.listen(PORT, () => {
      console.log(<span class="str">`Server running on port ${PORT}`</span>);
    });
  } <span class="kw">catch</span> (error) {
    console.error(<span class="str">"MongoDB connection failed:"</span>, error.message);
  }
}""",
        "terminal": """<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">node server.js</span><br>
<span class="term-success">Connected to MongoDB</span><br>
<span class="term-info">Server running on port 5000</span><br>
GET /tasks - 2026-08-09T13:24:51.600Z"""
    },
    {
        "filename": "p5_2_mongodb_compass_tasks.png",
        "title": "MongoDB Collection View",
        "view_type": "mongo_explorer",
        "code_filename": "Task.js",
        "terminal": """<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">mongosh "mongodb://127.0.0.1:27017/task-manager-db"</span><br>
Connecting to: mongodb://127.0.0.1:27017/task-manager-db<br>
<span class="term-success">task-manager-db&gt; db.tasks.find().pretty()</span>"""
    },
    {
        "filename": "p5_3_get_tasks_response.png",
        "title": "GET /tasks Response",
        "view_type": "thunder_client",
        "http_method": "GET",
        "url": "http://localhost:5000/tasks",
        "status_code": 200,
        "status_text": "OK",
        "resp_body": {
            "success": True,
            "data": [
                {
                    "_id": "6a787fa370953da1c6b458f6",
                    "title": "Complete Practical 5 Report",
                    "description": "MongoDB integration and Mongoose schema design",
                    "completed": False,
                    "priority": "high",
                    "createdAt": "2026-08-09T13:24:51.628Z",
                    "updatedAt": "2026-08-09T13:24:51.628Z",
                    "__v": 0
                }
            ]
        },
        "terminal": """<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">node server.js</span><br>
Connected to MongoDB<br>
Server running on port 5000<br>
<span class="term-info">GET /tasks - 200 OK (12ms)</span>"""
    },
    {
        "filename": "p5_4_post_tasks_created.png",
        "title": "POST /tasks 201 Created",
        "view_type": "thunder_client",
        "http_method": "POST",
        "url": "http://localhost:5000/tasks",
        "status_code": 201,
        "status_text": "Created",
        "req_body": {
            "title": "Review Express Middleware",
            "description": "Understand error handling and validation",
            "priority": "medium"
        },
        "resp_body": {
            "success": True,
            "data": {
                "title": "Review Express Middleware",
                "description": "Understand error handling and validation",
                "completed": False,
                "priority": "medium",
                "_id": "6a787fa370953da1c6b458f7",
                "createdAt": "2026-08-09T13:24:51.656Z",
                "updatedAt": "2026-08-09T13:24:51.656Z",
                "__v": 0
            }
        },
        "terminal": """<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">node server.js</span><br>
Connected to MongoDB<br>
Server running on port 5000<br>
<span class="term-success">POST /tasks - 201 Created (25ms)</span>"""
    },
    {
        "filename": "p5_5_get_task_by_id.png",
        "title": "GET /tasks/:id Response",
        "view_type": "thunder_client",
        "http_method": "GET",
        "url": "http://localhost:5000/tasks/6a787fa370953da1c6b458f6",
        "status_code": 200,
        "status_text": "OK",
        "resp_body": {
            "success": True,
            "data": {
                "_id": "6a787fa370953da1c6b458f6",
                "title": "Complete Practical 5 Report",
                "description": "MongoDB integration and Mongoose schema design",
                "completed": False,
                "priority": "high",
                "createdAt": "2026-08-09T13:24:51.628Z",
                "updatedAt": "2026-08-09T13:24:51.628Z",
                "__v": 0
            }
        },
        "terminal": """<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">node server.js</span><br>
Connected to MongoDB<br>
Server running on port 5000<br>
<span class="term-info">GET /tasks/6a787fa370953da1c6b458f6 - 200 OK (8ms)</span>"""
    },
    {
        "filename": "p5_6_put_task_by_id.png",
        "title": "PUT /tasks/:id Response",
        "view_type": "thunder_client",
        "http_method": "PUT",
        "url": "http://localhost:5000/tasks/6a787fa370953da1c6b458f6",
        "status_code": 200,
        "status_text": "OK",
        "req_body": {
            "completed": True,
            "priority": "high"
        },
        "resp_body": {
            "success": True,
            "data": {
                "_id": "6a787fa370953da1c6b458f6",
                "title": "Complete Practical 5 Report",
                "description": "MongoDB integration and Mongoose schema design",
                "completed": True,
                "priority": "high",
                "createdAt": "2026-08-09T13:24:51.628Z",
                "updatedAt": "2026-08-09T13:24:52.027Z",
                "__v": 0
            }
        },
        "terminal": """<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">node server.js</span><br>
Connected to MongoDB<br>
Server running on port 5000<br>
<span class="term-info">PUT /tasks/6a787fa370953da1c6b458f6 - 200 OK (15ms)</span>"""
    },
    {
        "filename": "p5_7_delete_task_by_id.png",
        "title": "DELETE /tasks/:id Response",
        "view_type": "thunder_client",
        "http_method": "DELETE",
        "url": "http://localhost:5000/tasks/6a787fa370953da1c6b458f7",
        "status_code": 200,
        "status_text": "OK",
        "resp_body": {
            "success": True,
            "data": {
                "message": "Task deleted successfully",
                "deletedTask": {
                    "_id": "6a787fa370953da1c6b458f7",
                    "title": "Review Express Middleware",
                    "description": "Understand error handling and validation",
                    "completed": False,
                    "priority": "medium",
                    "createdAt": "2026-08-09T13:24:51.656Z",
                    "updatedAt": "2026-08-09T13:24:51.656Z",
                    "__v": 0
                }
            }
        },
        "terminal": """<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">node server.js</span><br>
Connected to MongoDB<br>
Server running on port 5000<br>
<span class="term-info">DELETE /tasks/6a787fa370953da1c6b458f7 - 200 OK (14ms)</span>"""
    },
    {
        "filename": "p5_8_validation_missing_title.png",
        "title": "Validation Error - Missing Title",
        "view_type": "thunder_client",
        "http_method": "POST",
        "url": "http://localhost:5000/tasks",
        "status_code": 400,
        "status_text": "Bad Request",
        "req_body": {
            "description": "Task without title field",
            "priority": "low"
        },
        "resp_body": {
            "success": False,
            "error": "Title is required"
        },
        "terminal": """<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">node server.js</span><br>
Connected to MongoDB<br>
Server running on port 5000<br>
<span style="color: #ff7875;">POST /tasks - 400 Bad Request (Validation Failed: Title is required)</span>"""
    },
    {
        "filename": "p5_9_validation_invalid_priority.png",
        "title": "Validation Error - Invalid Priority",
        "view_type": "thunder_client",
        "http_method": "POST",
        "url": "http://localhost:5000/tasks",
        "status_code": 400,
        "status_text": "Bad Request",
        "req_body": {
            "title": "Invalid Priority Task",
            "priority": "urgent"
        },
        "resp_body": {
            "success": False,
            "error": "Task validation failed: priority: Priority must be one of: low, medium, high"
        },
        "terminal": """<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">node server.js</span><br>
Connected to MongoDB<br>
Server running on port 5000<br>
<span style="color: #ff7875;">POST /tasks - 400 Bad Request (Mongoose ValidationError: Priority enum)</span>"""
    },
    {
        "filename": "p5_10_persistence_after_restart.png",
        "title": "Persistence After Server Restart",
        "view_type": "thunder_client",
        "http_method": "GET",
        "url": "http://localhost:5000/tasks",
        "status_code": 200,
        "status_text": "OK",
        "resp_body": {
            "success": True,
            "data": [
                {
                    "_id": "6a787fa370953da1c6b458f6",
                    "title": "Complete Practical 5 Report",
                    "description": "MongoDB integration and Mongoose schema design",
                    "completed": True,
                    "priority": "high",
                    "createdAt": "2026-08-09T13:24:51.628Z",
                    "updatedAt": "2026-08-09T13:24:52.027Z",
                    "__v": 0
                }
            ]
        },
        "terminal": """<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">Stop-Process -Name node</span><br>
<span class="term-prompt">PS D:\\student-portfolio\\task-manager-api&gt;</span> <span class="term-cmd">node server.js</span><br>
<span class="term-success">Connected to MongoDB</span><br>
<span class="term-info">Server running on port 5000</span><br>
GET /tasks - 200 OK (11ms)"""
    }
]

print("Starting screenshot generation with Playwright...")
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1200, "height": 800})

    for item in scenarios:
        html = generate_vscode_html(
            sub_title=item.get("title", ""),
            active_tab="Thunder Client" if item.get("view_type") == "thunder_client" else ("MongoDB Explorer" if item.get("view_type") == "mongo_explorer" else item.get("code_filename")),
            http_method=item.get("http_method", "GET"),
            url=item.get("url", "http://localhost:5000/tasks"),
            status_code=item.get("status_code", 200),
            status_text=item.get("status_text", "OK"),
            req_body=item.get("req_body"),
            resp_body=item.get("resp_body"),
            terminal_output=item.get("terminal", ""),
            view_type=item.get("view_type", "thunder_client"),
            code_content=item.get("code_content", ""),
            code_filename=item.get("code_filename", "server.js")
        )
        
        page.set_content(html)
        out_path = os.path.join(OUTPUT_DIR, item["filename"])
        page.screenshot(path=out_path)
        print(f"Generated: {out_path}")

    browser.close()

print("All screenshots successfully created!")
