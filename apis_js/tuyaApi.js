module.exports = {
    init: async function() {
        await init().then(data => onOffButtonInit(data));
        $('#tuyaDevices').fadeIn();
    }
}

const fs = require('fs');
const CloudTuya = require('../apis_js/tuya/cloudtuya');
const Light = require('../apis_js/tuya/light');
const img_on = '<img src=' + "./assets/on.png" + '></img>'
const img_off = '<img src=' + "./assets/off.png" + '></img>'
const img_switch = '<img src=' + "./assets/light_switch.png" + '></img>';
let apiKeys = require('../credentials/tuyaKeys.json');
let deviceData = require('../savedata/tuyaDevices.json');
const api = new CloudTuya({
    userName: apiKeys.userName,
    password: apiKeys.password,
    bizType: apiKeys.bizType,
    countryCode: apiKeys.countryCode,
    region: apiKeys.region,
});
const {
    textTruncate,
    sort
} = require("./jstools.js");

function toggleSwitch(deviceId, tokens, api, state) {
    var table = document.getElementById("tuyaDevices");
    var thisSwitch = new Light({
        api: api,
        deviceId: deviceId
    });
    if (state == true) {
        thisSwitch.turnOn();
        for (var i = 0, row; row = table.rows[i]; i++) {
            row.cells[2].innerHTML = img_on;
            state = "false";
        }
    } else {
        thisSwitch.turnOff();
        for (var i = 0, row; row = table.rows[i]; i++) {
            row.cells[2].innerHTML = img_off;
            state = "true";
        }
    }
}

function onOffButtonInit(data) {
    data[0].forEach(element => createElement(element, data[1], data[2]))
    document.getElementById("tuyaOnAll").addEventListener("click", e => {
        data[0].forEach(element => toggleSwitch(element.id, data[1], data[2], true));
    });
    document.getElementById("tuyaOffAll").addEventListener("click", e => {
        data[0].forEach(element => toggleSwitch(element.id, data[1], data[2], false));
    });
}

function createElement(device, token, api) {
    var state = JSON.stringify(device.data.state)
    var table = document.getElementById("tuyaDevices");
    var tr = document.createElement("tr");
    //var icon = document.createElement("td");
    var name = document.createElement("td");
    var status = document.createElement("td");

    //tr.appendChild(icon);
    tr.appendChild(name);
    tr.appendChild(status);
    table.appendChild(tr);

    //icon.innerHTML = img_switch;
    name.appendChild(document.createTextNode(textTruncate(device.name)));
    status.appendChild(document.createTextNode(state));
    if (state === "true") {
        status.innerHTML = img_on;
    } else {
        status.innerHTML = img_off;
    }

    tr.addEventListener('click', function() {
        var thisSwitch = new Light({
            api: api,
            deviceId: device.id
        });
        if (state === "true") {
            thisSwitch.turnOff();
            status.innerHTML = img_off;
            state = "false";
        } else {
            thisSwitch.turnOn();
            status.innerHTML = img_on;
            state = "true"
        }
    });
}

async function init() {
    const tokens = await api.login();
    let devices = await api.find();
    devices.sort(function(a, b) {
        sort(a, b);
    });
    return [devices, tokens, api];
}