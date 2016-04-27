/*global define: false */

define(['app/print', 'app/helpers', 'app/widget-checkbox', 'app/widget-select', 'app/widget-input', 'app/search-result'], function (print, helper, wCheckbox, wSelect, wInput, sResult) {
    'use strict';

    var searchformData,
        createForm,
        createHeader,
        createRow,
        removeCalendar,
        insertFilterRow,
        insertCheckboxes,
        initForm,
        insertDeleteButton,
        updateDeleteButton;

    createRow = function () {
        var frag = document.createDocumentFragment(),
            div;

        div = document.createElement('div');
        frag.appendChild(div);
        div.className = 'search__col';

        div = document.createElement('div');
        frag.appendChild(div);
        div.className = 'search__col';

        div = document.createElement('div');
        frag.appendChild(div);
        div.className = 'search__col';

        div = document.createElement('div');
        frag.appendChild(div);
        div.className = 'search__col';

        div = document.createElement('div');
        div.appendChild(frag);
        div.className = 'search__row';

        return div;
    };

    createHeader = function (text) {
        var div = document.createElement('div');
        div.className = 'search__header';
        div.textContent = text;
        return div;
    };

    createForm = function () {
        var frag = document.createDocumentFragment(),
            button,
            div;

        div = document.createElement('div');
        frag.appendChild(div);
        div.className = 'search__filter';
        div.appendChild(createHeader('Advanced search'));
        div.appendChild(insertFilterRow());

        div = document.createElement('div');
        frag.appendChild(div);
        div.className = 'search__add-row search--border';
        button = document.createElement('button');
        div.appendChild(button);
        button.id = 'addRow';
        button.className = 'button button--add';
        button.textContent = 'Add row';

        div = document.createElement('div');
        frag.appendChild(div);
        div.className = 'search__columns search--border';
        div.appendChild(createHeader('Columns'));
        div.appendChild(insertCheckboxes());

        div = document.createElement('div');
        frag.appendChild(div);
        div.className = 'search__submit';

        button = document.createElement('button');
        div.appendChild(button);
        button.className = 'button button--accent';
        button.textContent = 'Update';

        button = document.createElement('button');
        div.appendChild(button);
        button.className = 'button button--cancel button--minimum-padding';
        button.textContent = 'Cancel';

        document.getElementById('search').appendChild(frag);
    };

    insertFilterRow = function () {
        var row = createRow(),
            cols = row.querySelectorAll('.search__col'),
            firstSelect,
            secondSelect;

        firstSelect = wSelect.createSelect(
            searchformData.selects.filter(function (select) {
                return select.name === 'main-filter';
            })[0]
        );
        cols[0].appendChild(firstSelect);
        firstSelect.classList.add('w-select--wide');

        secondSelect = wSelect.createSelect(
            searchformData.selects.filter(function (select) {
                return select.name === 'date-posted';
            })[0]
        );
        secondSelect.classList.add('w-select--wide');
        wSelect.disableSelect(secondSelect);

        row.querySelectorAll('.search__col')[1].appendChild(secondSelect);

        helper.forEach(firstSelect.querySelectorAll('li'), function (li, index) {
            li.addEventListener('click', function () {
                removeCalendar(row);
                // create select2
                var secondSelect,
                    input,
                    formObj,
                    button;

                cols[1].innerHTML = '';
                cols[2].innerHTML = '';
                cols[3].innerHTML = '';

                secondSelect = wSelect.createSelect(
                    searchformData.selects.filter(function (select) {
                        return select.name === li.getAttribute('data-value');
                    })[0]
                );
                cols[1].appendChild(secondSelect);
                secondSelect.classList.add('w-select--wide');

                button = insertDeleteButton(row);

                // create select3
                if (li.getAttribute('data-value') === 'date-registered') {
                    input = wInput.createInput(
                        searchformData.inputs.filter(function (input) {
                            return input.name === 'calendar';
                        })[0]
                    );
                    cols[2].appendChild(input);
                    input.classList.add('w-input--wide');

                    // attach change to update the deleteButton
                    cols[3].appendChild(button);
                    formObj = input.querySelector('input');
                    formObj.addEventListener('change', function () {
                        updateDeleteButton(input, button);
                    });
                    formObj.addEventListener('input', function () {
                        updateDeleteButton(input, button);
                    });

                } else if (li.getAttribute('data-value') === 'group-post') {

                    // attach change to update the deleteButton
                    cols[2].appendChild(button);
                    helper.forEach(secondSelect.querySelectorAll('li'), function (li) {
                        li.addEventListener('click', function () {
                            updateDeleteButton(secondSelect, button);
                        });
                    });
                    if (secondSelect.querySelector('.w-select__dropdown-menu')) {
                        helper.forEach(secondSelect.querySelectorAll('.w-select__dropdown-menu-item'), function (span) {
                            span.addEventListener('click', function () {
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
        div.className = 'search__column search__column--account';
        checklist = wCheckbox.create(
            searchformData.checkboxes.groups.filter(function (group) {
                return group.name === 'Account';
            })[0].check
        );
        div.appendChild(checklist);

        div = document.createElement('div');
        div.className = 'search__column search__column--user';
        checklist = wCheckbox.create(
            searchformData.checkboxes.groups.filter(function (group) {
                return group.name === 'User';
            })[0].check
        );
        div.appendChild(checklist);
        frag.appendChild(div);

        return frag;
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
        /*
            - push selected items in Array
        */
        if (css.contains('w-input')) {
            value.push(obj.querySelector('input').value);
        } else if (css.contains('w-select')) {
            helper.forEach(obj.querySelectorAll('.w-select__item-multiple--active'), function (item) {
                value.push(item.getAttribute('data-value'));
            });
        }
        /*
            - show/hide button--remove-row when value is changed
        */
        if (value.join('') !== '') {
            button.classList.remove('hidden');
        } else {
            button.classList.add('hidden');
        }
    };

    insertDeleteButton = function (row) {
        var button = document.createElement('button');
        button.className = 'button button--remove-row hidden';
        button.addEventListener('click', function () {
            removeCalendar(row);

            row.parentElement.removeChild(row);
        });
        return button;
    };

    initForm = function () {
        helper.getJSON('js/data/searchform.min.json').then(function (response) {
            searchformData = response;

            createForm();

            document.getElementById('addRow').addEventListener('click', function () {
                document.querySelector('.search__filter').appendChild(insertFilterRow());
            });

        }, function (error) {
            console.error("Failed!", error);
        });

        sResult.initResult();
    };

    return {
        initForm: initForm,
        updateDeleteButton: updateDeleteButton
    };

});
