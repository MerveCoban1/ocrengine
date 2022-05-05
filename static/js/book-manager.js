$(function ($) {

    var handlers = {
        ready: function () {
            handlers.init();
        },

        init: function () {

        },
        changeBookItemHandlers: function () {
            var bookid = $(elements.selectBookItem).val();
            $("#fileupload").data("bookid", bookid);
        },


        deleteBookButtonClick: function () {
            var bookid = $(this).data("id");
            var data = {
                bookid: bookid,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            }
            if (confirm("Kitabı silmek istediğinizden emin misiniz ?")) {
                waitBox(true);
                $.post("/user/delete_book", data).done(function (result) {
                    waitBox(false);
                    if (result.success) {
                        toastr.info("Kitap silinmiştir.");
                        location.href = "";
                    } else {
                        toastr.error(result.message);
                    }
                });
            }
        },
        uploadBookItemButtonClick: function (event) {
            var bookId = $(this).data('id');
            $("#uploadBookItemForm #bookId").val(bookId);
            //$("#uploadBookItemForm").modal("show");
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
        btnDeleteBook: ".btn-delete",
        btnUploadBookItem: ".btn-upload-book-item",
    };

    var eventMetaData = [
        {selector: undefined, container: document, event: "ready", handler: handlers.ready, data: {}},
        {
            selector: elements.selectBookItem,
            container: document,
            event: "change",
            handler: handlers.changeBookItemHandlers,
            data: {}
        },
        {
            selector: elements.btnDeleteBook,
            container: document,
            event: "click",
            handler: handlers.deleteBookButtonClick,
            data: {}
        },
        {
            selector: elements.btnUploadBookItem,
            container: document,
            event: "click",
            handler: handlers.uploadBookItemButtonClick,
            data: {}
        },
    ];

    $(function () {
        for (var it in eventMetaData) {
            var item = eventMetaData[it];
            $(item.container).on(item.event, item.selector, item.data, item.handler);
        }
    });

});