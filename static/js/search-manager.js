$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {

        },

        searchWordButtonClick: function () {
            var word = $(elements.inputWord).val();

            if (word === undefined || word === "" || word === null) {
                return;
            }

            window.waitBox(true);
            $.post("search", { word: word, csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val() }).done(function (result) {
                window.waitBox(false)
                if (result.success) {
                    $(".word-content > tbody").empty();
                    var html = ""
                    result.words.forEach(element => {
                        html = html + "<tr><td><strong>"
                            + element.ottoman + "</strong></td><td><strong>"
                            + element.turkish + "</strong></td><td style='width: 60%;'>" + element.content + "</td></tr >"
                    });
                    $(".word-content > tbody").html(html);
                } else {
                    toastr.error(result.message);
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
        btnSearchWord: "#btnSearchWord",
        inputWord: "#inputword"
    };

    var eventMetaData = [
        { selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {} },
        { selector: elements.btnSearchWord, container: document, event: "click", handler: handlers.searchWordButtonClick, data: {} },
    ];

    $(function () {
        for (var it in eventMetaData) {
            var item = eventMetaData[it];
            $(item.container).on(item.event, item.selector, item.data, item.handler);
        }
    });

});