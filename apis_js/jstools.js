module.exports = {
    textTruncate: function(str, length) {
        if (length == null) {
            length = 20;
        }
        if (str.length > length) {
            return str.substring(0, length);
        } else {
            return str;
        }
    },
    runCmd: function(command) {
        require('node-run-cmd').run(command);
    },
    sort: function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    },
        sortByNumber: function(a, b) {
        var nameA = a.ip;
        var nameB = b.ip;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    },
       sortByIp: function(a, b){
        const num1 = Number(a.ip.split(".").map((num) => (`000${num}`).slice(-3) ).join(""));
        const num2 = Number(b.ip.split(".").map((num) => (`000${num}`).slice(-3) ).join(""));
        return num1-num2;
}
}