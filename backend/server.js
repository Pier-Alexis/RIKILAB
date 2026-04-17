const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FILE = "orders.json";
const ADMIN_TOKEN = "rikilab";

if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
}

function readOrders() {
    try {
        return JSON.parse(fs.readFileSync(FILE));
    } catch {
        return [];
    }
}

function saveOrders(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/* TEST */
app.get("/", (req, res) => {
    res.send("Backend OK");
});

/* CREATE ORDER */
app.post("/order", (req, res) => {
    const order = req.body;

    if (!order || !order.product) {
        return res.status(400).json({ error: "Invalid order" });
    }

    const data = readOrders();
    data.push(order);
    saveOrders(data);

    res.json({ success: true });
});

/* GET ORDERS (ADMIN ONLY) */
app.get("/orders", (req, res) => {
    const token = req.headers.authorization;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ error: "Forbidden" });
    }

    res.json(readOrders());
});

/* DELETE ORDER */
app.delete("/order/:id", (req, res) => {
    const token = req.headers.authorization;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const id = parseInt(req.params.id);
    const data = readOrders();

    if (id < 0 || id >= data.length) {
        return res.status(404).json({ error: "Not found" });
    }

    data.splice(id, 1);
    saveOrders(data);

    res.json({ success: true });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});