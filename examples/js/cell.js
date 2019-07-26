
var generateData = function (amount) {
    var result = [];
    var data =
    {
        coin: "100",
        game_group: "GameGroup",
        game_name: "XPTO2",
        game_version: "25",
        machine: "20485861",
        vlt: "0"
    };
    for (var i = 0; i < amount; i += 1) {
        data.id = (i + 1).toString();
        result.push(Object.assign({}, data));
    }
    return result;
};

function createHeaders(keys) {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {
        result.push({
        'id' : keys[i],
            'name': keys[i],
            'prompt': keys[i],
            'width': 65,
            'align': 'center',
            'padding': 0
        });
    }
    return result;
}



var headers = createHeaders(["id", "coin", "game_group", "game_name", "game_version", "machine", "vlt"]);

var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: 'landscape' });
doc.table(1, 1, generateData(100), headers, { autoSize: true });