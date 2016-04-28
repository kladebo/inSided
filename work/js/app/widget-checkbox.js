/*global define: false */

define(['app/print', 'app/helpers'], function (print, helper) {
    'use strict';

    var createCheckBox = function (item) {
        var div = document.createElement('div'),
            input = document.createElement('input'),
            label = document.createElement('label'),
            //span = document.createElement('span'),
            pre = 'check_' + item.id;

        div.className = 'w-checkbox';
        div.appendChild(label);
        label.appendChild(input);
        label.className = 'w-checkbox__label';
        label.appendChild(document.createTextNode(item.text));
        //label.setAttribute('for', pre);
        
        //input.id = pre;
        input.type = 'checkbox';
        item.className = 'w-checkbox__checkbox';
        if(item.checked){
            input.checked = true;
        }
        return div;
    };

    return {
        create: function (items) {
            var frag = document.createDocumentFragment();
            helper.forEach(items, function (item) {
                frag.appendChild(createCheckBox(item));
            });
            return frag;
        },
        createCheckBox: createCheckBox
    };

});
