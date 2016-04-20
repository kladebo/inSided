/*global define: false */

define(['app/print'], function (print) {
    'use strict';

    function Option() {}

    Option.prototype.init = function (obj) {
        this.selected = obj.selected;
        this.index = obj.index;
        this.text = obj.text;
        this.li = document.createElement('li');
        if (this.selected === true) {
            this.select.activeNodes.push(this.index);
        }
    };

    Option.prototype.createOption = function () {
        var option;

        this.select.widgetDropDown.appendChild(this.li);

        this.li.innerHTML = this.text;
        this.li.className = 'widget-dropdown-item' + (this.selected ? ' active' : '');
        this.li.role = 'option';

        // Each time the user clicks on a option element
        option = this;
        this.li.addEventListener('click', function (e) {
            // cancles the bubbling so widgetDropDownwont hide
            if (!option.select.hideMultipleOnChildClick && option.select.isMultiple) {

                e.cancelBubble = true;
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            }

            option.select.updateGui(option.index);
        });

        // Or hovers with the mouse...
        this.li.addEventListener('mouseover', function () {
            option.select.highlightIdx = option.index;
            option.select.highlightUpdate();
        });
    };

    return Option;
});
