const fs = require("fs");
const http = require("http");
const path = require("path");

// absolute path to data.json (VERY IMPORTANT for Render)
const dataFilePath = path.join(__dirname, "data.json");

const server = http.createServer((req, res) => {

    // ROOT ROUTE
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("API is running on Render 🚀 Use /data");
    }

    // GET DATA
    else if (req.url === "/data" && req.method === "GET") {
        fs.readFile(dataFilePath, "utf-8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to read data" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(data);
            }
        });
    }

    // POST DATA
    else if (req.url === "/data" && req.method === "POST") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            fs.readFile(dataFilePath, "utf-8", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Failed to read data" }));
                } else {
                    const existingData = JSON.parse(data);
                    const newData = JSON.parse(body);

                    existingData.push(newData);

                    fs.writeFile(
                        dataFilePath,
                        JSON.stringify(existingData, null, 2),
                        err => {
                            if (err) {
                                res.writeHead(500, { "Content-Type": "application/json" });
                                res.end(JSON.stringify({ error: "Failed to write data" }));
                            } else {
                                res.writeHead(201, { "Content-Type": "application/json" });
                                res.end(JSON.stringify(newData));
                            }
                        }
                    );
                }
            });
        });
    }

    // 404
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
