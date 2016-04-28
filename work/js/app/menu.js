/*global define: false, require:false */

define(['app/print', 'app/helpers'], function (print, helper) {
    'use strict';

    var menuData,
        initMenu,
        createMenu;

    createMenu = function () {
        var frag = document.createDocumentFragment(),
            div,
            mainmenu,
            mainitem,
            submenu,
            subitem,
            span,
            link;

        div = document.createElement('div');
        frag.appendChild(div);
        div.className = 'w-menu';


        mainmenu = document.createElement('ul');
        div.appendChild(mainmenu);
        mainmenu.className = 'w-menu__main-menu';

        helper.forEach(menuData.menuItems, function (item) {
            var icon;
            mainitem = document.createElement('li');
            mainmenu.appendChild(mainitem);
            mainitem.className = 'w-menu__main-item';
            icon = document.createElement('div');
            icon.className = 'w-menu__icon';
            icon.classList.add('w-menu__' + item.icon);


            if (item.menuItems) {
                span = document.createElement('span');
                mainitem.appendChild(span);
                span.appendChild(icon);
                span.className = 'w-menu__sub-header w-menu__sub-header--active';
                span.appendChild(document.createTextNode(item.text));

                submenu = document.createElement('ul');
                mainitem.appendChild(submenu);
                submenu.className = 'w-menu__sub-menu';

                helper.forEach(item.menuItems, function (sub) {
                    subitem = document.createElement('li');
                    submenu.appendChild(subitem);
                    subitem.className = 'w-menu__sub-item';

                    link = document.createElement('a');
                    subitem.appendChild(link);
                    link.href = '#' + sub.link;
                    link.className = 'w-menu__sub-link';
                    link.textContent = sub.text;
                    if (sub.active && sub.active === 1) {
                        link.classList.add('w-menu__sub-link--active');
                    }
                });
            } else {
                link = document.createElement('a');
                mainitem.appendChild(link);
                link.href = '#' + item.link;
                link.className = 'w-menu__main-link';
                link.appendChild(icon);
                link.appendChild(document.createTextNode(item.text));
            }
        });
        document.getElementById('nav').appendChild(frag);
    };

    initMenu = function () {
        helper.getJSON('js/data/menu.min.json').then(function (response) {

            menuData = response;

            createMenu();

        }, function (error) {
            console.error("Failed!", error);
        });
    };

    return {
        initMenu: initMenu
    };
});
