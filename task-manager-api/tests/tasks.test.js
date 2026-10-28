const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-only-secret-for-practical-12";

const app = require("../server");
const Task = require("../models/Task");
const User = require("../models/User");
const cache = require("../utils/cache");

async function listen() {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  return server;
}

test("GET /tasks rejects requests without authentication", async () => {
  const server = await listen();

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/tasks`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.deepEqual(body, {
      success: false,
      error: "Authorization token required",
    });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("GET /tasks returns tasks for an authenticated request", async () => {
  const originalFindById = User.findById;
  const originalTaskFind = Task.find;
  const tasks = [
    {
      _id: "task-1",
      title: "Complete CI practical",
      description: "",
      completed: false,
      priority: "high",
    },
  ];
  const server = await listen();

  User.findById = () => ({
    select: async () => ({ _id: "user-1", email: "student@example.com" }),
  });
  Task.find = () => ({
    sort: async () => tasks,
  });
  cache.del("all_tasks");

  try {
    const token = jwt.sign(
      { id: "user-1", email: "student@example.com" },
      process.env.JWT_SECRET
    );
    const response = await fetch(`http://127.0.0.1:${server.address().port}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      success: true,
      source: "database",
      data: tasks,
    });
  } finally {
    User.findById = originalFindById;
    Task.find = originalTaskFind;
    cache.del("all_tasks");
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
