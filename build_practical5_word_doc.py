import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCX_OUTPUT_PATH = r"d:\student-portfolio\reports\Practical_5_Report.docx"
HTML_OUTPUT_PATH = r"d:\student-portfolio\reports\Practical_5_Report.html"
SCREENSHOTS_DIR = r"d:\student-portfolio\screenshots"
LOGO_PATH = r"d:\student-portfolio\screenshots\cspit_logo.png"

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_code_block(doc, code_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "F4F5F7")
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    # Border
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>'
        f'<w:left w:val="single" w:sz="18" w:space="0" w:color="0F4C81"/>'
        f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>'
        f'<w:right w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(tcBorders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    
    run = p.add_run(code_text.strip())
    run.font.name = 'Consolas'
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

    # Empty paragraph after table for spacing
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_before = Pt(0)
    spacer.paragraph_format.space_after = Pt(6)

def build_docx():
    doc = docx.Document()

    # Set page margins to 0.8 inch
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Title & Header Table
    tbl = doc.add_table(rows=1, cols=3)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False

    cell_left = tbl.cell(0, 0)
    cell_mid = tbl.cell(0, 1)
    cell_right = tbl.cell(0, 2)

    cell_left.width = Inches(1.5)
    cell_mid.width = Inches(3.8)
    cell_right.width = Inches(1.6)

    # Left: Student ID
    p_id = cell_left.paragraphs[0]
    r_id = p_id.add_run("ID: 24IT053")
    r_id.bold = True
    r_id.font.name = "Calibri"
    r_id.font.size = Pt(13)
    r_id.font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    # Mid: University Title
    p_mid = cell_mid.paragraphs[0]
    p_mid.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_u1 = p_mid.add_run("CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY\n")
    r_u1.bold = True
    r_u1.font.size = Pt(11)
    r_u1.font.color.rgb = RGBColor(0x1A, 0x1A, 0x2E)
    
    r_u2 = p_mid.add_run("FACULTY OF TECHNOLOGY AND ENGINEERING\n")
    r_u2.bold = True
    r_u2.font.size = Pt(10)
    
    r_u3 = p_mid.add_run("B. TECH (IT/CE/CSE/AIML) — SEMESTER 5")
    r_u3.font.size = Pt(9.5)
    r_u3.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

    # Right: Logo if present
    p_right = cell_right.paragraphs[0]
    p_right.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    if os.path.exists(LOGO_PATH):
        p_right.add_run().add_picture(LOGO_PATH, width=Inches(1.3))

    # Horizontal Divider Line
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(8)
    p_div.paragraph_format.space_after = Pt(14)
    p_div_run = p_div.add_run("_________________________________________________________________________________")
    p_div_run.font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)
    p_div_run.bold = True

    # Practical Title Block
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("ADVANCED WEB DEVELOPMENT FRAMEWORKS (ITUE301)\n")
    r_title.bold = True
    r_title.font.size = Pt(14)
    r_title.font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    r_sub = p_title.add_run("Practical 5: MongoDB Integration and Schema Design with Mongoose")
    r_sub.bold = True
    r_sub.font.size = Pt(13)
    r_sub.font.color.rgb = RGBColor(0x1A, 0x1A, 0x2E)

    # Metadata Box Table
    meta_tbl = doc.add_table(rows=4, cols=2)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Student Name:", "Meet Nakarani", "Student ID:", "24IT053"),
        ("Course / CO-PO:", "ITUE301 | CO2, CO3 / PO3, PO5", "Tech Stack:", "Node.js, Express.js, Mongoose, MongoDB, Postman/Thunder Client"),
        ("GitHub Repository:", "https://github.com/MeetKumar6789/student-portfolio", "Project Folder:", "task-manager-api"),
        ("Practical Title:", "Practical 5: MongoDB Integration and Schema Design with Mongoose", "Date:", "August 2026")
    ]
    for idx, (l1, v1, l2, v2) in enumerate(meta_data):
        row = meta_tbl.rows[idx]
        cell1, cell2 = row.cells[0], row.cells[1]
        
        p1 = cell1.paragraphs[0]
        r1_lbl = p1.add_run(f"{l1} ")
        r1_lbl.bold = True
        r1_lbl.font.size = Pt(9.5)
        r1_lbl.font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)
        r1_val = p1.add_run(v1)
        r1_val.font.size = Pt(9.5)

        p2 = cell2.paragraphs[0]
        r2_lbl = p2.add_run(f"{l2} ")
        r2_lbl.bold = True
        r2_lbl.font.size = Pt(9.5)
        r2_lbl.font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)
        r2_val = p2.add_run(v2)
        r2_val.font.size = Pt(9.5)

        set_cell_background(cell1, "F8F9FA")
        set_cell_background(cell2, "F8F9FA")
        set_cell_margins(cell1, top=60, bottom=60, left=100, right=100)
        set_cell_margins(cell2, top=60, bottom=60, left=100, right=100)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # 1. Objective
    h1 = doc.add_heading("1. Objective", level=1)
    h1.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)
    p_obj = doc.add_paragraph("To connect a persistent MongoDB NoSQL database to an Express.js web server and enforce data validation, default values, and schema constraints through a Mongoose model.")
    p_obj.paragraph_format.space_after = Pt(12)

    # 2. Problem Statement
    h2 = doc.add_heading("2. Problem Statement", level=1)
    h2.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)
    
    ps_items = [
        "Extend the Task Management REST API backend from Practical 4 by connecting MongoDB using Mongoose.",
        "Define a Task schema with title (String, required), description (String), completed (Boolean, default false), priority (enum: low/medium/high, default medium), and createdAt (Date, default Date.now).",
        "Replace the in-memory JavaScript array from Practical 4 with live Mongoose model queries and operations.",
        "Test all CRUD API endpoints against the live MongoDB database using VS Code Thunder Client / Postman.",
        "Ensure schema validation errors are caught and returned as structured JSON responses (HTTP status 400), rather than raw unhandled Mongoose exception objects."
    ]
    for item in ps_items:
        p = doc.add_paragraph(style='List Bullet')
        r = p.add_run(item)
        r.font.size = Pt(10.5)
        p.paragraph_format.space_after = Pt(4)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 3. Project / File Structure
    h3_struct = doc.add_heading("3. Project / File Structure", level=1)
    h3_struct.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    add_code_block(doc, """task-manager-api/
├── models/
│   └── Task.js          # Mongoose Task Schema & Model definition
├── server.js            # Express app, MongoDB connection, & REST endpoints
├── package.json         # Project metadata & dependencies (express, mongoose, dotenv)
├── package-lock.json    # Locked dependency tree
├── .env                 # Environment variables (MONGO_URI, PORT)
├── .env.example         # Example environment template for git repo
├── .gitignore           # Excludes node_modules, .env, and local data
└── README.md            # Documentation and execution instructions""")

    # 4. Task Schema Specifications Table
    h_schema = doc.add_heading("4. Task Schema Specifications", level=1)
    h_schema.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    tbl_schema = doc.add_table(rows=6, cols=4)
    tbl_schema.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Field Name", "Data Type", "Required", "Default / Validation Constraints"]
    
    # Header styling
    hdr_cells = tbl_schema.rows[0].cells
    for idx, text in enumerate(headers):
        hdr_cells[idx].text = text
        set_cell_background(hdr_cells[idx], "0F4C81")
        p = hdr_cells[idx].paragraphs[0]
        p.runs[0].font.bold = True
        p.runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        p.runs[0].font.size = Pt(10)

    schema_rows = [
        ("title", "String", "Yes", "Trimmed before saving; Cannot be empty (minlength: 1)"),
        ("description", "String", "No", "Default: \"\" (empty string); Trimmed whitespace"),
        ("completed", "Boolean", "No", "Default: false"),
        ("createdAt / updatedAt", "Date", "No", "Auto-generated by Mongoose timestamps: true (Default: Date.now)"),
        ("priority", "String", "Yes", "Allowed values: [\"low\", \"medium\", \"high\"]; Default: \"medium\"")
    ]

    for r_idx, row_data in enumerate(schema_rows, start=1):
        row_cells = tbl_schema.rows[r_idx].cells
        bg_color = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = val
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=100, right=100)
            p = row_cells[c_idx].paragraphs[0]
            p.runs[0].font.size = Pt(9.5)
            if c_idx == 0:
                p.runs[0].font.name = "Consolas"
                p.runs[0].font.bold = True
                p.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # 5. Implementation Code Snippets
    h_impl = doc.add_heading("5. Implementation Details", level=1)
    h_impl.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    p_imp1 = doc.add_paragraph()
    r_imp1 = p_imp1.add_run("5.1 MongoDB Connection Setup (server.js):")
    r_imp1.bold = True

    add_code_block(doc, """const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function startServer() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager-db";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}""")

    p_imp2 = doc.add_paragraph()
    r_imp2 = p_imp2.add_run("5.2 Mongoose Task Schema & Pre-save Trim Hook (models/Task.js):")
    r_imp2.bold = True

    add_code_block(doc, """const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be one of: low, medium, high",
      },
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically provides createdAt and updatedAt fields
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;""")

    p_imp3 = doc.add_paragraph()
    r_imp3 = p_imp3.add_run("5.3 Mongoose Model CRUD Controller Operations (server.js):")
    r_imp3.bold = True

    add_code_block(doc, """// 1. READ ALL - Task.find()
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    return sendError(res, 500, "Unable to fetch tasks");
  }
});

// 2. CREATE - Task.create()
app.post("/tasks", async (req, res) => {
  const { title, description, completed, priority } = req.body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    return sendError(res, 400, "Title is required");
  }
  try {
    const newTask = await Task.create({
      title: title.trim(),
      description: description || "",
      completed: Boolean(completed),
      priority: priority ? priority.trim().toLowerCase() : "medium",
    });
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendError(res, 400, error.message);
    }
    return sendError(res, 500, "Unable to create task");
  }
});

// 3. READ BY ID - Task.findById()
app.get("/tasks/:id", validateTaskId, async (req, res) => {
  try {
    const task = await Task.findById(req.taskId);
    if (!task) return sendError(res, 404, "Task not found");
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    return sendError(res, 500, "Unable to fetch task");
  }
});

// 4. UPDATE BY ID - Task.findById() & task.save()
app.put("/tasks/:id", validateTaskId, async (req, res) => {
  try {
    const task = await Task.findById(req.taskId);
    if (!task) return sendError(res, 404, "Task not found");
    
    const { title, description, completed, priority } = req.body;
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = Boolean(completed);
    if (priority !== undefined) task.priority = priority.trim().toLowerCase();

    const updatedTask = await task.save(); // Triggers Mongoose validation
    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    if (error.name === "ValidationError") return sendError(res, 400, error.message);
    return sendError(res, 500, "Unable to update task");
  }
});

// 5. DELETE BY ID - Task.findByIdAndDelete()
app.delete("/tasks/:id", validateTaskId, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.taskId);
    if (!deletedTask) return sendError(res, 404, "Task not found");
    res.status(200).json({ success: true, data: { message: "Task deleted successfully", deletedTask } });
  } catch (error) {
    return sendError(res, 500, "Unable to delete task");
  }
});""")

    # 6. API Endpoints Table
    h_api = doc.add_heading("6. API Endpoint Reference", level=1)
    h_api.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    tbl_api = doc.add_table(rows=6, cols=4)
    tbl_api.alignment = WD_TABLE_ALIGNMENT.CENTER
    api_headers = ["HTTP Method", "Endpoint Path", "Description", "Status Codes"]
    
    hdr_cells_api = tbl_api.rows[0].cells
    for idx, text in enumerate(api_headers):
        hdr_cells_api[idx].text = text
        set_cell_background(hdr_cells_api[idx], "0F4C81")
        p = hdr_cells_api[idx].paragraphs[0]
        p.runs[0].font.bold = True
        p.runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        p.runs[0].font.size = Pt(10)

    api_rows = [
        ("GET", "/tasks", "Retrieve all tasks stored in MongoDB sorted by creation date", "200 OK, 500 Server Error"),
        ("GET", "/tasks/:id", "Retrieve a single task by valid MongoDB ObjectId", "200 OK, 400 Invalid ID, 404 Not Found"),
        ("POST", "/tasks", "Create a new task with schema validation and pre-save trim", "201 Created, 400 Validation Error"),
        ("PUT", "/tasks/:id", "Update task properties by ObjectId with schema re-validation", "200 OK, 400 Bad Request, 404 Not Found"),
        ("DELETE", "/tasks/:id", "Permanently remove a task from MongoDB collection", "200 OK, 400 Invalid ID, 404 Not Found")
    ]

    for r_idx, row_data in enumerate(api_rows, start=1):
        row_cells = tbl_api.rows[r_idx].cells
        bg_color = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = val
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=100, right=100)
            p = row_cells[c_idx].paragraphs[0]
            p.runs[0].font.size = Pt(9.5)
            if c_idx == 0:
                p.runs[0].font.name = "Consolas"
                p.runs[0].font.bold = True
                if val == "GET":
                    p.runs[0].font.color.rgb = RGBColor(0x0C, 0x7C, 0xD5)
                elif val == "POST":
                    p.runs[0].font.color.rgb = RGBColor(0x27, 0xC9, 0x3F)
                elif val == "PUT":
                    p.runs[0].font.color.rgb = RGBColor(0xFC, 0xA1, 0x30)
                elif val == "DELETE":
                    p.runs[0].font.color.rgb = RGBColor(0xF9, 0x3E, 0x3E)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # 7. Screenshots & Execution Outputs (VS Code UI)
    h_ss = doc.add_heading("7. Screenshots & Terminal Verification (VS Code UI)", level=1)
    h_ss.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    screenshot_list = [
        ("p5_1_terminal_mongodb_connected.png", "Figure 7.1: MongoDB Connection Successful in VS Code Integrated Terminal"),
        ("p5_2_mongodb_compass_tasks.png", "Figure 7.2: MongoDB Database & Collection (task-manager-db.tasks) Explorer View"),
        ("p5_3_get_tasks_response.png", "Figure 7.3: GET /tasks Endpoint Response in Thunder Client (200 OK)"),
        ("p5_4_post_tasks_created.png", "Figure 7.4: POST /tasks Creating a New Document with 201 Created Status"),
        ("p5_5_get_task_by_id.png", "Figure 7.5: GET /tasks/:id Retrieving Document by ObjectId (200 OK)"),
        ("p5_6_put_task_by_id.png", "Figure 7.6: PUT /tasks/:id Updating Task Status and Priority (200 OK)"),
        ("p5_7_delete_task_by_id.png", "Figure 7.7: DELETE /tasks/:id Removing Task Document (200 OK)"),
        ("p5_8_validation_missing_title.png", "Figure 7.8: Validation Error for Missing Title returning 400 Bad Request JSON"),
        ("p5_9_validation_invalid_priority.png", "Figure 7.9: Validation Error for Invalid Priority enum returning 400 Bad Request JSON"),
        ("p5_10_persistence_after_restart.png", "Figure 7.10: Database Data Persistence Verified after Express Server Restart")
    ]

    for img_filename, caption_text in screenshot_list:
        img_full_path = os.path.join(SCREENSHOTS_DIR, img_filename)
        if os.path.exists(img_full_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(10)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.add_run().add_picture(img_full_path, width=Inches(6.2))

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(14)
            r_cap = p_cap.add_run(caption_text)
            r_cap.bold = True
            r_cap.font.size = Pt(9.5)
            r_cap.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

    # 8. Key Questions / Technical Analysis
    h_qa = doc.add_heading("8. Key Questions & Technical Analysis", level=1)
    h_qa.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    qa_list = [
        (
            "Question 6: What is the purpose of a schema in a NoSQL database like MongoDB, given that MongoDB itself is schema-less?",
            "Answer:\nAlthough MongoDB is inherently schema-less at the database level—allowing documents within the same collection to have varying fields and data types—a schema layer defined by Mongoose in Node.js serves several critical software engineering purposes:\n"
            "1. Data Integrity & Uniformity: Enforces a consistent shape and data contract across all documents, preventing accidental insertion of misnamed or unexpected fields.\n"
            "2. Automated Type Safety & Casting: Automatically casts primitive types (e.g. converting string inputs to Dates or Booleans) and enforces mandatory data types.\n"
            "3. Application-Level Business Logic: Provides a centralized layer for default values (e.g. completed: false, createdAt: Date.now), string trimming, enum validations, and pre/post save hooks.\n"
            "4. Developer Tooling & Maintainability: Provides structured models with helper queries (find, findById, findByIdAndUpdate) that simplify database interactions and improve code clarity."
        ),
        (
            "Question 7: Why is it important to define required fields and default values at the schema level rather than relying on frontend validation alone?",
            "Answer:\nRelying exclusively on frontend client-side validation is a major security vulnerability and architectural flaw for several key reasons:\n"
            "1. Security & Request Spoofing: Frontend validation can easily be bypassed by malicious actors sending API requests directly to the server using Postman, cURL, or automated scripts.\n"
            "2. Multi-Client Consistency: Modern backend APIs often serve multiple clients (Web browsers, iOS/Android apps, third-party microservices). Centralizing validation at the schema level ensures consistent rules across all entry points.\n"
            "3. Single Source of Truth for Defaults: Defining defaults (like completed: false or timestamps) at the database model level ensures data consistency even if a client fails to supply optional parameters.\n"
            "4. Database Protection: Schema-level constraints act as the ultimate guardrail preventing corrupted or incomplete records from corrupting the persistent database state."
        ),
        (
            "Question 8: What happens internally when a document fails Mongoose validation, and where is the request stopped?",
            "Answer:\nWhen Mongoose validation fails, the internal execution flow follows these steps:\n"
            "1. Pre-Execution Interception: When Task.create() or document.save() is called, Mongoose executes validation rules inside Node.js memory before any query is transmitted over the wire to MongoDB.\n"
            "2. Early Request Termination: If any schema constraint (such as required: true or enum allowed values) is violated, Mongoose aborts database communication immediately at the application layer.\n"
            "3. Exception Throwing: Mongoose constructs a detailed ValidationError object detailing every path that failed, along with error messages and constraint names.\n"
            "4. Express Error Handling: In our Express controller catch block, we check if error.name === 'ValidationError'. We intercept this exception and format it into a clean, structured JSON payload (status 400 Bad Request with { success: false, error: ... }), preventing unhandled server crashes and informing the client precisely what went wrong."
        )
    ]

    for q_text, a_text in qa_list:
        p_q = doc.add_paragraph()
        p_q.paragraph_format.space_before = Pt(8)
        p_q.paragraph_format.space_after = Pt(2)
        r_q = p_q.add_run(q_text)
        r_q.bold = True
        r_q.font.size = Pt(10.5)
        r_q.font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

        p_a = doc.add_paragraph()
        p_a.paragraph_format.space_before = Pt(2)
        p_a.paragraph_format.space_after = Pt(10)
        r_a = p_a.add_run(a_text)
        r_a.font.size = Pt(10)

    # 9. Testing & Persistence Verification
    h_test = doc.add_heading("9. Testing & Persistence Verification", level=1)
    h_test.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    t_steps = [
        "Create a new task document by issuing a POST /tasks request with a valid JSON payload.",
        "Verify that the task is assigned a unique MongoDB ObjectId (_id) and persisted into the task-manager-db.tasks collection.",
        "Open terminal, terminate the Node.js server process (Ctrl+C / Stop-Process), and restart it using node server.js.",
        "Execute a GET /tasks request and confirm that all created task records remain fully persisted and populated from MongoDB."
    ]
    for s in t_steps:
        p = doc.add_paragraph(style='List Bullet')
        r = p.add_run(s)
        r.font.size = Pt(10)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # 10. GitHub Deliverables
    h_git = doc.add_heading("10. GitHub Deliverables", level=1)
    h_git.runs[0].font.color.rgb = RGBColor(0x0F, 0x4C, 0x81)

    git_items = [
        "GitHub Repository Link: https://github.com/MeetKumar6789/student-portfolio",
        "Project Directory: task-manager-api/",
        "Fully working MongoDB-backed CRUD REST API with Mongoose schema, validation, and pre-save hooks.",
        "Security best practices followed: .env excluded via .gitignore, and .env.example provided for setup.",
        "Granular git commit history documenting MongoDB and Mongoose integration steps."
    ]
    for g in git_items:
        p = doc.add_paragraph(style='List Bullet')
        r = p.add_run(g)
        r.font.size = Pt(10)
        if "https://" in g:
            r.font.color.rgb = RGBColor(0x0C, 0x7C, 0xD5)

    os.makedirs(os.path.dirname(DOCX_OUTPUT_PATH), exist_ok=True)
    doc.save(DOCX_OUTPUT_PATH)
    print(f"Successfully generated DOCX report at: {DOCX_OUTPUT_PATH}")

if __name__ == "__main__":
    build_docx()
