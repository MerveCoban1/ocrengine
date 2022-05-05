
$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {

            console.log("app.js is loading...")
            alert(13);
            $(".datetimepicker").datetimepicker({
                format: 'DD.MM.YYYY'
            });
        },
        translateButtonClick: function () {

        },

        uploadFileButtonClick: function () {

            $('.loader').show();
            $("#results").html('');

            var form_data = new FormData($('#upload-file')[0]);
            $.ajax({
                type: 'POST',
                url: '/upload',
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                async: false,
                success: function (data) {
                    $('.loader').hide();

                    $.each(data.predictions, function (i, item) {
                        console.log(item);
                        label = item["label"];
                        prob = item["probability"].toFixed(2);
                        percent = prob * 100;

                        $("#results").append('<label>' + percent + '% ' + label + '</label><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width:' + percent + '%"></div></div>');
                    });
                },
            });
        },

        predictButtonClick: function () {
            var word = $.trim($('#InputTxt').val());
            word = word.replace(/"/g, '&quot;');

            $.ajax({
                type: "POST",
                url: "/predict/",
                data: word,
                success: function (data) {
                    console.log(data.success);
                    $("#InputHiddenTxt").val(data["predictions"]["lastRecordID"]);
                    $("#modalPredictionBody").html('"' + word + '" kelimesinin Türkçesi: <strong>' + data["predictions"]["kok"] + '</strong><br><input type="text" class="form-control" id="InputUserSuggestion"><small id="help" class="form-text text-muted">Tahmin edilen kök yanlış ise lütfen doğrusunu girerek "Gönder" buttonuna basınız</small>');
                    jQuery("#modalPredictionResult").modal('show');
                    $("#Output").val(data["predictions"]["kok"])
                    $('#dvResult').html('<div class="alert alert-info">"' + word + '" kelimesinin türkçesi: <strong>' + data["predictions"]["kok"] + '</strong></div>');
                }
            });
        }
    };

    var elements = {
        messages: {
            // operationFail: window.getMessage("res-operation-fail"),
            // warning: window.getMessage("res-warning"),
            // pleaseWait: window.getMessage("res-please-wait"),
            // deleteConfirm: window.getMessage("res-delete-confirm"),
            // clearBasketComfirm: window.getMessage("res-clearbasket-confirm"),
            // basketSubmitComfirm: window.getMessage("res-basketsubmit-confirm"),
            // success: window.getMessage("res-success"),
            // removebasketitem: window.getMessage("res-removebasketitem"),
            // errormsg: window.getMessage("res_errormsg"),
            // pleaseinputemptyfield: window.getMessage("res-pleaseinputemptyfield")
        },
        btnTranslate: "#btnTranslate",
        btnUploadFile: "#upload-file-btn",
        btnPredict: "#btnPredict"
    };

    var eventMetaData = [
        { selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {} },
        { selector: elements.btnTranslate, container: document, event: "click", handler: handlers.translateButtonClick, data: {} },
        { selector: elements.btnUploadFile, container: document, event: "click", handler: handlers.uploadFileButtonClick, data: {} },
        { selector: elements.btnPredict, container: document, event: "click", handler: handlers.predictButtonClick, data: {} }
    ];

    $(function () {
        for (var it in eventMetaData) {
            var item = eventMetaData[it];
            $(item.container).on(item.event, item.selector, item.data, item.handler);
        }
    });

});