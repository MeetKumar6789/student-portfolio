const http = require("http");
const path = require("path");
const { randomBytes, randomUUID } = require("crypto");
const { performance } = require("perf_hooks");

require("dotenv").config({
  path: path.join(__dirname, ".env")
});


const PORT = Number(process.env.PORT || 5000);

const BASE_URL =
  `http://localhost:${PORT}`;


// =====================================================
// HTTP REQUEST HELPER
// =====================================================

function request(endpoint, options = {}) {

  return new Promise((resolve, reject) => {

    const url =
      new URL(`${BASE_URL}${endpoint}`);

    const method = options.method || "GET";
    const requestOptions = {

      hostname: url.hostname,

      port: url.port,

      path: url.pathname + url.search,

      method,

      headers: {
        ...(options.headers || {})
      }

    };


    const start =
      performance.now();


    const req =
      http.request(
        requestOptions,
        (res) => {

          let body = "";

          res.on(
            "data",
            chunk => {
              body += chunk;
            }
          );


          res.on(
            "end",
            () => {

              const duration =
                performance.now() - start;


              let data;

              try {
                data = JSON.parse(body);
              } catch {
                data = body;
              }


              const response = {
                status: res.statusCode,
                headers: res.headers,
                duration,
                data
              };

              if (res.statusCode < 200 || res.statusCode >= 300) {
                reject(new Error(`${method} ${endpoint} returned ${res.statusCode}: ${JSON.stringify(data)}`));
                return;
              }

              resolve(response);

            }
          );

        }
      );


    req.on(
      "error",
      reject
    );


    if (options.body) {
      req.write(options.body);
    }


    req.end();

  });

}


// =====================================================
// MAIN BENCHMARK
// =====================================================

async function runBenchmark() {

  console.log(
    "\n================================================="
  );

  console.log(" OPTIMIZATION PHASE - IN-MEMORY CACHING BENCHMARK");

  console.log(
    "=================================================\n"
  );


  // -------------------------------------------------
  // STEP 1: LOGIN
  // -------------------------------------------------

  console.log(
    "[STEP 1] Logging in..."
  );


  const email = `cache-benchmark-${randomUUID()}@example.com`;
  const password = randomBytes(32).toString("hex");

  await request("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });


  const loginResponse =
    await request(
      "/login",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })

      }
    );


  if (!loginResponse.data.token) {
    throw new Error("Login response did not include an authentication token");
  }


  const token =
    loginResponse.data.token;


  console.log(
    "Login successful."
  );


  const authHeaders = {

    "Content-Type":
      "application/json",

    "Authorization":
      `Bearer ${token}`

  };


  // -------------------------------------------------
  // STEP 2: CLEAR CACHE
  // -------------------------------------------------

  console.log(
    "\n[STEP 2] Clearing cache..."
  );


  await request(
    "/tasks/cache/clear",
    {
      method: "DELETE",
      headers: authHeaders
    }
  );


  // -------------------------------------------------
  // STEP 3: UNCACHED READINGS
  // -------------------------------------------------

  console.log(
    "\n[STEP 3] Measuring UNCACHED requests..."
  );


  const uncachedTimes = [];


  for (
    let i = 1;
    i <= 3;
    i++
  ) {

    const result =
      await request(
        "/tasks?cache=false",
        {
          headers: authHeaders
        }
      );

    if (result.data.source !== "database") {
      throw new Error("Expected cache-bypass request to read from the database");
    }


    uncachedTimes.push(
      result.duration
    );


    console.log(
      `Uncached ${i}: ${result.duration.toFixed(2)} ms`
    );

  }


  // -------------------------------------------------
  // STEP 4: CACHE CLEAR
  // -------------------------------------------------

  await request(
    "/tasks/cache/clear",
    {
      method: "DELETE",
      headers: authHeaders
    }
  );


  // -------------------------------------------------
  // STEP 5: CACHE FIRST REQUEST
  // -------------------------------------------------

  console.log(
    "\n[STEP 4] Warming cache..."
  );


  const warmup =
    await request(
      "/tasks",
      {
        headers: authHeaders
      }
    );

  if (warmup.data.source !== "database") {
    throw new Error("Expected first request after clearing cache to read from the database");
  }


  console.log(
    `Warm-up request: ${warmup.duration.toFixed(2)} ms`
  );


  // -------------------------------------------------
  // STEP 6: CACHED READINGS
  // -------------------------------------------------

  console.log(
    "\n[STEP 5] Measuring CACHED requests..."
  );


  const cachedTimes = [];


  for (
    let i = 1;
    i <= 3;
    i++
  ) {

    const result =
      await request(
        "/tasks",
        {
          headers: authHeaders
        }
      );

    if (result.data.source !== "cache") {
      throw new Error("Expected warmed task request to be served from cache");
    }


    cachedTimes.push(
      result.duration
    );


    console.log(
      `Cached ${i}: ${result.duration.toFixed(2)} ms`
    );

  }


  // -------------------------------------------------
  // STEP 7: CALCULATE AVERAGES
  // -------------------------------------------------

  const uncachedAverage =
    uncachedTimes.reduce(
      (sum, time) =>
        sum + time,
      0
    ) / uncachedTimes.length;


  const cachedAverage =
    cachedTimes.reduce(
      (sum, time) =>
        sum + time,
      0
    ) / cachedTimes.length;


  const improvement =
    (
      (
        uncachedAverage -
        cachedAverage
      ) /
      uncachedAverage
    ) * 100;


  // -------------------------------------------------
  // RESULTS
  // -------------------------------------------------

  console.log(
    "\n================================================="
  );

  console.log(
    "                 RESULTS"
  );

  console.log(
    "================================================="
  );


  console.log(
    "\nUncached readings:"
  );

  uncachedTimes.forEach(
    (time, index) => {

      console.log(
        `${index + 1}. ${time.toFixed(2)} ms`
      );

    }
  );


  console.log(
    `Average uncached: ${uncachedAverage.toFixed(2)} ms`
  );


  console.log(
    "\nCached readings:"
  );

  cachedTimes.forEach(
    (time, index) => {

      console.log(
        `${index + 1}. ${time.toFixed(2)} ms`
      );

    }
  );


  console.log(
    `Average cached: ${cachedAverage.toFixed(2)} ms`
  );


  console.log(
    `\nPerformance improvement: ${improvement.toFixed(2)}%`
  );


  // -------------------------------------------------
  // CACHE STATISTICS
  // -------------------------------------------------

  console.log(
    "\n================================================="
  );

  console.log(
    "              CACHE STATISTICS"
  );

  console.log(
    "================================================="
  );


  const stats =
    await request(
      "/tasks/cache/stats",
      {
        headers: authHeaders
      }
    );


  console.log(
    JSON.stringify(
      stats.data,
      null,
      2
    )
  );


  console.log(
    "\nBenchmark completed successfully."
  );

}


runBenchmark()
  .catch(
    error => {

      console.error(
        "\nBenchmark error:",
        error.message
      );

      process.exit(1);

    }
  );