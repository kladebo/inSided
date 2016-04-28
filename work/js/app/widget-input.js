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
            div.classList.add('w-input--focus');
        });
        input.addEventListener('blur', function () {
            div.classList.remove('w-input--focus');
        });

        // attach calendar
        if (item.type === 'calendar') {
            div.id = 'calendar' + id;
            div.classList.add('calendar');
            require(['epoch'], function (epoch) {
                var calendar = new epoch.Epoch('calendar' + id, 'popup', input, false);
                input.setAttribute('placeholder', item.title);

                // special listener for deleteButton
                helper.forEach(calendar.calendar.querySelectorAll('table.calcells td'), function (cell) {
                    cell.addEventListener('click', function () {
                        var event = new UIEvent('change', {
                            "view": window,
                            "bubbles": true,
                            "cancelable": true
                        });
                        input.dispatchEvent(event);
                    }, true);
                });

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
