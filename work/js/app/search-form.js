/*global define: false */

define(['app/print', 'app/helpers', 'app/widget-checkbox', 'app/widget-select', 'app/widget-input', 'app/search-result'], function (print, helper, wCheckbox, wSelect, wInput, sResult) {
    'use strict';

    var searchformData,
        createRow,
        removeCalendar,
        insertFilterRow,
        insertCheckboxes,
        initForm,
        insertDeleteButton,
        updateDeleteButton;

    createRow = function () {
        var div = document.createElement('div'),
            box1 = document.createElement('div'),
            box2 = document.createElement('div'),
            box3 = document.createElement('div'),
            box4 = document.createElement('div');

        div.className = 'row';
        div.appendChild(box1);
        box1.className = 'col';

        div.appendChild(box2);
        box2.className = 'col';

        div.appendChild(box3);
        box3.className = 'col';

        div.appendChild(box4);
        box4.className = 'col';

        return div;
    };

    insertFilterRow = function () {
        var parent = document.getElementById('selectfilters'),
            row = parent.insertBefore(createRow(), parent.children[parent.children.length - 1]),
            firstSelect,
            secondSelect;

        firstSelect = wSelect.createSelect(
            searchformData.selects.filter(function (select) {
                return select.name === 'main-filter';
            })[0]
        );
        row.querySelectorAll('div.col')[0].appendChild(firstSelect);

        secondSelect = wSelect.createSelect(
            searchformData.selects.filter(function (select) {
                return select.name === 'date-posted';
            })[0]
        );
        wSelect.disableSelect(secondSelect);
        //secondSelect.classList.add('disabled');

        row.querySelectorAll('div.col')[1].appendChild(secondSelect);

        helper.forEach(firstSelect.querySelectorAll('li'), function (li, index) {
            li.addEventListener('click', function () {
                removeCalendar(row);
                // create select2
                var secondCel = row.querySelectorAll('div.col')[1],
                    thirdCel = row.querySelectorAll('div.col')[2],
                    fourthCel = row.querySelectorAll('div.col')[3],
                    secondSelect,
                    input,
                    formObj,
                    button;

                secondCel.innerHTML = '';
                thirdCel.innerHTML = '';
                fourthCel.innerHTML = '';

                secondSelect = wSelect.createSelect(
                    searchformData.selects.filter(function (select) {
                        return select.name === li.getAttribute('data-value');
                    })[0]
                );
                secondCel.appendChild(secondSelect);

                button = insertDeleteButton(row);

                // create select3
                if (li.getAttribute('data-value') === 'date-registered') {
                    input = wInput.createInput(
                        searchformData.inputs.filter(function (input) {
                            return input.name === 'calendar';
                        })[0]
                    );
                    thirdCel.appendChild(input);

                    // attach change to update the deleteButton
                    fourthCel.appendChild(button);
                    formObj = input.querySelector('input');
                    formObj.addEventListener('change', function () {
                        updateDeleteButton(input, button);
                    });
                    formObj.addEventListener('input', function () {
                        updateDeleteButton(input, button);
                    });

                } else if (li.getAttribute('data-value') === 'group-post') {

                    // attach change to update the deleteButton
                    thirdCel.appendChild(button);
                    helper.forEach(secondSelect.querySelectorAll('li'), function (li) {
                        li.addEventListener('click', function () {
                            updateDeleteButton(secondSelect, button);
                        });
                    });
                    if (secondSelect.querySelector('.multiple-menu')) {
                        helper.forEach(secondSelect.querySelectorAll('.multiple-menu span'), function (span) {
                            span.addEventListener('click', function () {
                                //print('klaasss');
                                updateDeleteButton(secondSelect, button);
                            }, true);
                        });
                    }

                }
            });
        });
        return row;
    };

    insertCheckboxes = function () {
        var frag = document.createDocumentFragment(),
            div = document.createElement('div'),
            checklist;

        frag.appendChild(div);
        div.className = 'column account';
        checklist = wCheckbox.create(
            searchformData.checkboxes.groups.filter(function (group) {
                return group.name === 'Account';
            })[0].check
        );
        div.appendChild(checklist);

        div = document.createElement('div');
        div.className = 'column user';
        checklist = wCheckbox.create(
            searchformData.checkboxes.groups.filter(function (group) {
                return group.name === 'User';
            })[0].check
        );
        div.appendChild(checklist);
        frag.appendChild(div);

        document.querySelector('div#checkboxes').appendChild(frag);
    };

    removeCalendar = function (row) {
        var calendar = row.querySelector('div.calendar');
        if (calendar) {
            calendar = document.getElementById(calendar.id + '_calendar');
            calendar.parentElement.removeChild(calendar);
        }
    };

    updateDeleteButton = function (obj, button) {
        var value = [],
            css = obj.classList;
        if (css.contains('w-input')) {
            value.push(obj.querySelector('input').value);
        } else if (css.contains('w-select')) {
            helper.forEach(obj.querySelectorAll('li.active'), function (item) {
                value.push(item.getAttribute('data-value'));
            });
        }
        print('"' + value.join('') + '"');
        if (value.join('') !== '') {
            button.classList.remove('hidden');
        } else {
            button.classList.add('hidden');
        }
    };

    insertDeleteButton = function (row) {
        var button = document.createElement('button');
        button.className = 'remove-row hidden';
        button.addEventListener('click', function () {
            removeCalendar(row);

            row.parentElement.removeChild(row);
        });
        return button;
    };

    initForm = function () {
        helper.getJSON('js/data/searchform.min.json').then(function (response) {
            searchformData = response;

            // row with first box
            insertFilterRow();

            // generate checkboxes
            insertCheckboxes();

        }, function (error) {
            console.error("Failed!", error);
        });

        sResult.initResult();

        document.getElementById('addRow').addEventListener('click', function () {
            insertFilterRow();
        });
    };

    return {
        initForm: initForm,
        updateDeleteButton: updateDeleteButton
    };

});
