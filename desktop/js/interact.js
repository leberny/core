
/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */


 if (getUrlVars('saveSuccessFull') == 1) {
    $('#div_alert').showAlert({message: '{{Sauvegarde effectuée avec succès}}', level: 'success'});
}

if (getUrlVars('removeSuccessFull') == 1) {
    $('#div_alert').showAlert({message: '{{Suppression effectuée avec succès}}', level: 'success'});
}


$("#div_listInteract").resizable({
  handles: "all",
  grid: [1, 10000],
  stop: function () {
    $('.interactListContainer').packery();
     var value = {options: {interactMenuSize: $("#div_listInteract").width()}};
        jeedom.user.saveProfils({
          profils: value,
          global: false,
          error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function () {
        }
    });
}
});

if(!isset(userProfils.interactMenuSize) || userProfils.interactMenuSize > 0){
  $("#div_listInteract").width( userProfils.interactMenuSize);
}

if((!isset(userProfils.doNotAutoHideMenu) || userProfils.doNotAutoHideMenu != 1) && !jQuery.support.touch){
    $('#div_listInteract').hide();
    $('#bt_displayInteractList').on('mouseenter',function(){
     var timer = setTimeout(function(){
        $('#div_listInteract').show();
        $('#bt_displayInteractList').find('i').hide();
        $('.interactListContainer').packery();
    }, 100);
     $(this).data('timerMouseleave', timer)
 }).on("mouseleave", function(){
  clearTimeout($(this).data('timerMouseleave'));
});

 $('#div_listInteract').on('mouseleave',function(){
   var timer = setTimeout(function(){
    $('#div_listInteract').hide();
    $('#bt_displayInteractList').find('i').show();
    $('.interactListContainer').packery();
}, 300);
   $(this).data('timerMouseleave', timer);
}).on("mouseenter", function(){
  clearTimeout($(this).data('timerMouseleave'));
});
}

setTimeout(function(){
  $('.interactListContainer').packery();
},100);

$("#div_listInteract").trigger('resize');

$('.interactListContainer').packery();

$('#bt_interactThumbnailDisplay').on('click', function () {
  $('#div_conf').hide();
  $('#interactThumbnailDisplay').show();
  $('.li_interact').removeClass('active');
  $('.interactListContainer').packery();
});

$('.interactDisplayCard').on('click', function () {
  $('#div_tree').jstree('deselect_all');
  $('#div_tree').jstree('select_node', 'interact' + $(this).attr('data-interact_id'));
});

$('#div_tree').on('select_node.jstree', function (node, selected) {
  if (selected.node.a_attr.class == 'li_interact') {
    $.hideAlert();
    $(".li_interact").removeClass('active');
    $(this).addClass('active');
    $('#interactThumbnailDisplay').hide();
    displayInteract(selected.node.a_attr['data-interact_id']);
}
});

$("#div_tree").jstree({
  "plugins": ["search"]
});
$('#in_treeSearch').keyup(function () {
  $('#div_tree').jstree(true).search($('#in_treeSearcxh').val());
});

$('.interactDisplayCard').on('click',function(){
    displayInteract($(this).attr('data-interact_id'));
});


function displayInteract(_id){
    $('#div_conf').show();
    $('#interactThumbnailDisplay').hide();
    $('.li_interact').removeClass('active');
    $('.li_interact[data-interact_id='+_id+']').addClass('active');
    jeedom.interact.get({
        id: _id,
        success: function (data) {
            $('.interactAttr').value('');
            $(".interactAttr[data-l1key=link_type]").off();
            $('.interact').setValues(data, '.interactAttr');
            changeLinkType(data);
            $(".interactAttr[data-l1key=link_type]").on('change', function () {
                changeLinkType({link_type: $(this).value()});
            });
        }
    });
}

$('#bt_duplicate').on('click', function () {
    bootbox.prompt("Nom ?", function (result) {
        if (result !== null) {
            var interact = $('.interact').getValues('.interactAttr')[0];
            interact.name = result;
            interact.id = '';
            jeedom.interact.save({
                interact: interact,
                error: function (error) {
                    $('#div_alert').showAlert({message: error.message, level: 'danger'});
                },
                success: function (data) {
                    window.location.replace('index.php?v=d&p=interact&id=' + data.id + '&saveSuccessFull=1');
                }
            });
        }
    });
});

if (is_numeric(getUrlVars('id'))) {
    if ($('.li_interact[data-interact_id=' + getUrlVars('id') + ']').length != 0) {
        $('.li_interact[data-interact_id=' + getUrlVars('id') + ']').click();
    }
}

$('.displayInteracQuery').on('click', function () {
    $('#md_modal').dialog({title: "{{Liste des interactions}}"});
    $('#md_modal').load('index.php?v=d&modal=interact.query.display&interactDef_id=' + $('.interactAttr[data-l1key=id]').value()).dialog('open');
});

$('#bt_testInteract,#bt_testInteract2').on('click', function () {
    $('#md_modal').dialog({title: "{{Tester les interactions}}"});
    $('#md_modal').load('index.php?v=d&modal=interact.test').dialog('open');
});

$('body').delegate('.listEquipementInfo', 'click', function () {
    jeedom.cmd.getSelectModal({}, function (result) {
        $('.interactAttr[data-l1key=link_id]').atCaret('insert',result.human);
    });
});

jwerty.key('ctrl+s', function (e) {
    e.preventDefault();
    $("#bt_saveInteract").click();
});

$("#bt_saveInteract").on('click', function () {
    jeedom.interact.save({
        interact: $('.interact').getValues('.interactAttr')[0],
        error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function (data) {
            window.location.replace('index.php?v=d&p=interact&id=' + data.id + '&saveSuccessFull=1');
        }
    });
});


$("#bt_regenerateInteract,#bt_regenerateInteract2").on('click', function () {
    bootbox.confirm('{{Etes-vous sûr de vouloir regénerer toutes les intérations (cela peut être très long) ?}}', function (result) {
     if (result) {
        jeedom.interact.regenerateInteract({
            interact: {query: result},
            error: function (error) {
                $('#div_alert').showAlert({message: error.message, level: 'danger'});
            },
            success: function (data) {
             $('#div_alert').showAlert({message: '{{Toutes les intérations ont été regénerées}}', level: 'success'});
         }
     });
    }
});
});

$("#bt_addInteract,#bt_addInteract2").on('click', function () {
    bootbox.prompt("Demande ?", function (result) {
        if (result !== null) {
            jeedom.interact.save({
                interact: {query: result},
                error: function (error) {
                    $('#div_alert').showAlert({message: error.message, level: 'danger'});
                },
                success: function (data) {
                    window.location.replace('index.php?v=d&p=interact&id=' + data.id + '&saveSuccessFull=1');
                }
            });
        }
    });
});

$("#bt_removeInteract").on('click', function () {
    if ($('.li_interact.active').attr('data-interact_id') != undefined) {
        $.hideAlert();
        bootbox.confirm('{{Etes-vous sûr de vouloir supprimer l\'intéraction}} <span style="font-weight: bold ;">' + $('.li_interact.active a').text() + '</span> ?', function (result) {
            if (result) {
                jeedom.interact.remove({
                    id: $('.li_interact.active').attr('data-interact_id'),
                    error: function (error) {
                        $('#div_alert').showAlert({message: error.message, level: 'danger'});
                    },
                    success: function () {
                        window.location.replace('index.php?v=d&p=interact&removeSuccessFull=1');
                    }
                });
            }
        });
    } else {
        $('#div_alert').showAlert({message: '{{Veuillez d\'abord sélectionner un objet}}', level: 'danger'});
    }
});

function changeLinkType(_options) {
    $('#linkOption').empty();
    $('.interactAttr[data-l1key=reply]').closest('.form-group').show();
    $('#div_filtre').show();
    $('.interactAttr[data-l1key=options][data-l2key=convertBinary]').closest('.form-group').show();
    $('.interactAttr[data-l1key=options][data-l2key=synonymes]').closest('.form-group').show();
    if (_options.link_type == 'whatDoYouKnow') {
        $('.interactAttr[data-l1key=options][data-l2key=convertBinary]').closest('.form-group').hide();
        $('.interactAttr[data-l1key=options][data-l2key=synonymes]').closest('.form-group').hide();
        $('.interactAttr[data-l1key=reply]').closest('.form-group').hide();
        $('#div_filtre').hide();
    }
    if (_options.link_type == 'cmd') {
        var options = '<div class="form-group">';
        options += '<label class="col-sm-3 control-label">{{Commande}}</label>';
        options += '<div class="col-sm-8">';
        options += '<input class="interactAttr form-control input-sm" data-l1key="link_id"/>';
        options += '</div>';
        options += '<div class="col-sm-1">';
        options += '<a class="btn btn-default cursor listEquipementInfo input-sm"><i class="fa fa-list-alt "></i></a></td>';
        options += '</div>';
        options += '</div>';
        $('#linkOption').empty().append(options);
    }
    if (_options.link_type == 'scenario') {
        jeedom.scenario.all({
            error: function (error) {
                $('#div_alert').showAlert({message: error.message, level: 'danger'});
            },
            success: function (scenarios) {
                var options = '<div class="form-group">';
                options += '<label class="col-sm-3 control-label">{{Scénario}}</label>';
                options += '<div class="col-sm-9">';
                options += '<select class="interactAttr form-control input-sm" data-l1key="link_id" style="margin-top : 5px;">';
                for (var i in scenarios) {
                    options += '<option value="' + scenarios[i].id + '">' + scenarios[i].humanName + '</option>';
                }
                options += '</select>';
                options += '</div>';
                options += '</div>';
                options += '<div class="form-group">';
                options += '<label class="col-sm-3 control-label">{{Action}}</label>';
                options += '<div class="col-sm-9">';
                options += '<select class="interactAttr form-control input-sm" data-l1key="options" data-l2key="scenario_action">';
                options += '<option value="start">{{Start}}</option>';
                options += '<option value="stop">{{Stop}}</option>';
                options += '<option value="activate">{{Activer}}</option>';
                options += '<option value="deactivate">{{Désactiver}}</option>';
                options += '</select>';
                options += '</div>';
                options += '</div>';
                $('#linkOption').empty().append(options);
                $('.interactAttr[data-l1key=options][data-l2key=convertBinary]').closest('.form-group').hide();
                $('#div_filtre').hide();
                delete _options.link_type;
                $('.interact').setValues(_options, '.interactAttr');
            }
        });
}
delete _options.link_type;
$('.interact').setValues(_options, '.interactAttr');
}