const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FILE = "orders.json";
const ADMIN_TOKEN = "rikilab-admin-123"; // change ça plus tard

if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
}

function readOrders() {
    return JSON.parse(fs.readFileSync(FILE));
}

function saveOrders(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// TEST
app.get("/", (req, res) => {
    res.send("Backend OK");
});

// CREATE ORDER
app.post("/order", (req, res) => {
    const order = req.body;

    if (!order || typeof order !== "object" || !order.product) {
        return res.status(400).json({ error: "Invalid order" });
    }

    const data = readOrders();

    const newOrder = {
        id: Date.now(),
        ...order
    };

    data.push(newOrder);
    saveOrders(data);

    res.json({ success: true, order: newOrder });
});

// GET ORDERS (admin only)
app.get("/orders", (req, res) => {
    const token = req.headers.authorization;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const data = readOrders();

    const cleaned = data.filter(o => o && o.product);

    res.json(cleaned);
});

// DELETE ORDER (admin only)
app.delete("/order/:id", (req, res) => {
    const token = req.headers.authorization;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const id = parseInt(req.params.id);
    let data = readOrders();

    data = data.filter(o => o.id !== id);

    saveOrders(data);

    res.json({ success: true });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

app.get("/orders", (req, res) => {
    console.log("TOKEN RECEIVED:", req.headers.authorization);

    const token = req.headers.authorization;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const data = readOrders();
    console.log("ORDERS:", data);

    res.json(data);
});

data.forEach(o => {
    if (!o || !o.product) return;

    div.innerHTML += `
        <div class="order">
            <b>${o.product}</b> - ${o.price}$<br>
            CPU: ${o.cpu || "-"} | RAM: ${o.ram || "-"} | SSD: ${o.ssd || "-"}
            <br>
            <button onclick="del(${o.id})">Supprimer</button>
        </div>
    `;
});