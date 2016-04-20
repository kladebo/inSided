/*global define: false, require:false */

define(['app/print', 'app/helpers'], function (print, helper) {
    'use strict';

    var createInput = function (item) {
        var div = document.createElement('div'),
            input = document.createElement('input'),
            id = document.getElementsByName('w-input').length;

        div.className = 'w-input';
        div.setAttribute('name', 'w-input');
        div.appendChild(input);

        input.type = 'text';
        input.setAttribute('autocomplete', 'off');
        input.addEventListener('focus', function () {
            div.classList.add('focus');
        });
        input.addEventListener('blur', function () {
            div.classList.remove('focus');
        });

        //input.id = id;
        if (item.type === 'calendar') {
            div.id = 'calendar' + id;
            div.classList.add('calendar');
            require(['epoch'], function (epoch) {
                var date,
                    calendar = new epoch.Epoch('calendar' + id, 'popup', input, false);
                date = new Date();
                //input.value = date.dateFormat('d-M-Y');
                input.setAttribute('placeholder', item.title);
//                helper.forEach(calendar.calendar.querySelectorAll('.wkhead'), function (item) {
//                    item.style.display = 'none';
//                });

                window.addEventListener('resize', function () {
                    calendar.updatePos(input);
                });
            });
        }

        return div;
    };

    return {
        createInput: createInput
    };

});
