/*global define: false */

define(['app/print'], function (print) {
    'use strict';

    function Button() {}

    Button.prototype.init = function (obj) {
        this.selected = obj.selected;
        this.index = obj.index;
        this.text = obj.text;
        this.li = document.createElement('li');
    };

    Button.prototype.createButton = function () {
        var button;
        this.filterGroup.appendChild(this.li);
        this.li.innerHTML = this.text;
        this.li.className = 'widget-filter-item';
        if (this.selected) {
            this.li.classList.add('active');
        }
        button = this;
        this.li.addEventListener('click', function () {
            button.select.updateGui(button.index);
        });
    };
//klaas
    return Button;
});
