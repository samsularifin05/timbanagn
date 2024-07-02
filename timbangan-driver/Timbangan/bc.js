var express = require("express");
var settingJson = require("./setting.json");
var app = express();
var http = require("http").Server(app);

// var COM = settingJson.com;
// var url = settingJson.ip;
app.use(express.static("public"));

const SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort(settingJson.com, {
    baudRate: settingJson.baudRate || 9600,
    dataBits: settingJson.dataBits || 8,
    parity: settingJson.parity || "none",
    stopBits: settingJson.stopBits || 1
});
const parser = port.pipe(new Readline({ delimiter: "\r\n" }));
parser.on("data", (temp) => {
    io.sockets.emit("temp", {
        temp: temp,
        url: settingJson.url
    });
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
});
var server = http
    .listen(4000, "0.0.0.0", () => {
        console.log("Listening to requests on port 4000...");
        console.log("===============================================");
        console.log("Timbangan anda sedang terkoneksi ke server");
        console.log("Tekan CTRL + C untuk memutus koneksi");
        console.log("===============================================");
    })
    .on("error", () => {
        console.log("MASUK SINI");
    });
var io = require("socket.io")(server);
io.on("connection", (socket) => {
    console.log("Mengirim Data Dari Timbangan ke Server");
});
