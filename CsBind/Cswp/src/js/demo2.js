var obj = require('./tool.js');
    var demo2 = {
    init: function() {
        this.bindEvent();
    },
    bindEvent: function() {
        //var demo1 = document.getElementsByClassName('demo1')[0];
        var demo2 = obj.getDom('demo2');
        demo2.onclick = this.changeStyle;
    },
    changeStyle: function() {
        this.style.width = '100px';
        this.style.height = '100px';
        this.style.background = 'green';
        console.log('2');
    }
}

module.exports = demo2;