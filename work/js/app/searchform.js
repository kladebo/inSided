/*global define: false */

define(['app/print', 'app/helpers', 'app/widget-checkbox', 'app/widget-select', 'app/searchresult', 'app/widget-input'], function (print, helper, wCheckbox, wSelect, result, wInput) {
    'use strict';

    var searchformData,
        createRow,
        removeCalendar,
        insertFilterRow,
        insertCheckboxes,
        initForm,
        insertDeleteButton;

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

    removeCalendar = function (row) {
        var calendar = row.querySelector('div.calendar');
        if (calendar) {
            calendar = document.getElementById(calendar.id + '_calendar');
            calendar.parentElement.removeChild(calendar);
        }
    };

    insertFilterRow = function () {
        var parent = document.getElementById('selectfilters'),
            row = parent.insertBefore(createRow(), parent.children[parent.children.length - 1]),
            firstSelect,
            secondSelect;

        firstSelect = wSelect.createSelect(
            searchformData.selects.filter(function (select) {
                return select.name === 'type';
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
                //print(li.textContent + ' - ' + index);
                removeCalendar(row);
                // create select2
                var secondCel = row.querySelectorAll('div.col')[1],
                    thirdCel = row.querySelectorAll('div.col')[2],
                    fourthCel = row.querySelectorAll('div.col')[3],
                    secondSelect,
                    input;

                secondCel.innerHTML = '';
                thirdCel.innerHTML = '';
                fourthCel.innerHTML = '';

                secondSelect = wSelect.createSelect(
                    searchformData.selects.filter(function (select) {
                        return select.name === li.getAttribute('data-value');
                    })[0]
                );
                secondCel.appendChild(secondSelect);

                // create select3
                if (li.getAttribute('data-value') === 'date-registered') {
                    input = wInput.createInput(
                        searchformData.inputs.filter(function (input) {
                            return input.name === 'calendar';
                        })[0]
                    );
                    thirdCel.appendChild(input);
                    fourthCel.appendChild(insertDeleteButton(row));
                } else if (li.getAttribute('data-value') === 'group-post') {
                    thirdCel.appendChild(insertDeleteButton(row));
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
        print(frag);
    };

    insertDeleteButton = function (row) {
        var button = document.createElement('button');
        button.className = 'remove-row';
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

        result.initResult();

        document.getElementById('addRow').addEventListener('click', function () {
            insertFilterRow();
        });
    };

    return {
        initForm: initForm
    };

});
