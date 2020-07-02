//Save these commans as functions in a file with modules and set up event handles linked to buttons on a config page to write preferences to a file and then at start require that file and reference those variablers and if none just run defaults 
//   runCmd("./savedata/WakeMeOnLan.exe /scan");
//     runCmd("./savedata/WakeMeOnLan.exe /scomma ./savedata/woldevices.csv");

//Waleed integerate net adapter and broadcast and ip range options eventually
//https://www.nirsoft.net/utils/wake_on_lan.html

const {
    runCmd,
    textTruncate
} = require("../apis_js/jstools.js");
module.exports = {
    init: async function() {
        await init().then($('#pcDevices').fadeIn());

    }
}
class wolDevice {
    constructor(name, ip, mac) {
        this.name = name;
        this.ip = ip;
        this.mac = mac;
    }
}

function getWolDevices(array) {
    var wolDevices = [];
    for (i in array) {
        var ip = array[i].split(",")[0];
        var mac = array[i].split(",")[2];
        var name = array[i].split(",")[1] || "N/A"
        var mac = array[i].split(",")[2];
        if (!ip == "") {
            wolDevices.push(new wolDevice(name, ip, mac));
        }
    }
    return wolDevices;
}

async function scanNetwork(){
    runCmd("../savedata/WakeMeOnLan.exe /scan");
}

async function saveToCSV(path){
    runCmd("../savedata/WakeMeOnLan.exe /scomma ./savedata/woldevices.csv");
}

async function wakeUpAll(){
     runCmd("../savedata/WakeMeOnLan.exe /wakeupall");
     alert("powered on");
}

function onOffButtonInit() {
    document.getElementById("pcOnAll").addEventListener("click", e => {
        wakeUpAll();
    });
    document.getElementById("pcOffAll").addEventListener("click", e => {

    });
}

async function init() {
    var fs = require('fs');
    var array = await fs.readFileSync('./savedata/woldevices.csv').toString().split("\n");
    //    gotta wait here make this async or when u clean it up youll get a weird valye from the file 
    //yeah make seperate method for file load use then or await when u call it from this method or pass it into this method
    array.shift();
    var devices = getWolDevices(array);
    devices.sort((a, b) => {
        const num1 = Number(a.ip.split(".").map((num) => (`000${num}`).slice(-3)).join(""));
        const num2 = Number(b.ip.split(".").map((num) => (`000${num}`).slice(-3)).join(""));
        return num1 - num2;
    });

    for (i in devices) {
        var wDevice = devices[i];
        //if device has no name lets assume for now its not relevant to the pc wol pane
        if (wDevice.name == "N/A") {
            continue;
        }
        var table = document.getElementById("pcDevices");
        var tr = document.createElement("tr");
        var pc_name = document.createElement("td");
        var pc_ip = document.createElement("td");

        tr.appendChild(pc_name);
        tr.appendChild(pc_ip);
        table.appendChild(tr);

        pc_name.appendChild(document.createTextNode(textTruncate(wDevice.name, 12)));
        pc_ip.appendChild(document.createTextNode(wDevice.ip));

    }
    onOffButtonInit();

}