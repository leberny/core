function initHome() {
    refreshMessageNumber();
    jeedom.object.all({
        error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function (objects) {
            var li = '';
            for (var i in objects) {
                if (objects[i].isVisible == 1) {
                    var icon = '';
                    if (isset(objects[i].display) && isset(objects[i].display.icon)) {
                        icon = objects[i].display.icon;
                    }
                    li += '<li></span><a href="#" class="link" data-page="equipment" data-title="' + icon.replace(/\"/g, "\'") + ' ' + objects[i].name.replace(/\"/g, "\'") + '" data-option="' + objects[i].id + '"><span>' + icon + '</span> ' + objects[i].name + '</a></li>';
                }
            }
            $('#ul_objectList').empty().append(li).listview("refresh");
        }
    });

    jeedom.view.all({
        error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function (views) {
            var li = '';
            for (var i in views) {
                li += '<li><a href="#" class="link" data-page="view" data-title="' + views[i].name + '" data-option="' + views[i].id + '">' + views[i].name + '</a></li>'
            }
            $('#ul_viewList').empty().append(li).listview("refresh");
        }
    });

    jeedom.plan.allHeader({
        error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function (planHeader) {
            var li = '';
            for (var i in planHeader) {
                if (deviceInfo.type != 'phone' || (deviceInfo.type == 'phone' && planHeader[i].configuration.enableOnMobile == "1")) {
                    li += '<li><a href="index.php?v=d&p=plan&plan_id=' + planHeader[i].id + '" data-ajax="false">' +init(planHeader[i].configuration['icon'])+ planHeader[i].name + '</a></li>'
                }
            }
            $('#ul_planList').empty().append(li).listview("refresh");
        }
    });


    if (plugins.length > 0) {
        var li = '';
        for (var i in plugins) {
            li += '<li><a href="#" class="link" data-page="' + plugins[i].mobile + '" data-plugin="' + plugins[i].id + '" data-title="' + plugins[i].name + '">' + plugins[i].name + '</a></li>'
        }
        $('#ul_pluginList').empty().append(li).listview("refresh");
    } else {
        $('#bt_listPlugin').hide();
    }

    $('#bt_logout').off().on('click', function () {
        $.ajax({// fonction permettant de faire de l'ajax
            type: "POST", // methode de transmission des données au fichier php
            url: "core/ajax/user.ajax.php", // url du fichier php
            data: {
                action: "logout",
            },
            dataType: 'json',
            error: function (request, status, error) {
                handleAjaxError(request, status, error, $('#div_alert'));
            },
            success: function (data) { // si l'appel a bien fonctionné
                if (data.state != 'ok') {
                    $('#div_alert').showAlert({message: data.result, level: 'danger'});
                    return;
                }
                initApplication();
            }
        });
    });

    $('#bt_showObjectList').off().on('click', function () {
        if ($('#ul_objectList').is(':visible')) {
            $('#ul_objectList').hide();
        } else {
            $('.jeedomListView').hide();
            $('#ul_objectList').show();
        }
    });

    $('#bt_showViewList').off().on('click', function () {
        if ($('#ul_viewList').is(':visible')) {
            $('#ul_viewList').hide();
        } else {
            $('.jeedomListView').hide();
            $('#ul_viewList').show();
        }
    });

    $('#bt_showPlanList').off().on('click', function () {
        if ($('#ul_planList').is(':visible')) {
            $('#ul_planList').hide();
        } else {
            $('.jeedomListView').hide();
            $('#ul_planList').show();
        }
    });
    
    $('#bt_listPlugin').off().on('click', function () {
        if ($('#ul_pluginList').is(':visible')) {
            $('#ul_pluginList').hide();
        } else {
            $('.jeedomListView').hide();
            $('#ul_pluginList').show();
        }
    });
    
    
    
}

