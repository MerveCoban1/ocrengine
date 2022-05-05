$(function () {
    $(".btn-upload-images").click(function () {
        $("#fileupload").click();
    });

    $('#fileupload').bind('fileuploadsubmit', function (e, data) {
        // The example input, doesn't have to be part of the upload form:

        var formData = $("form").serializeArray()
        data.formData = {
            "bookid": $("#fileupload").data("bookid"),
            "csrfmiddlewaretoken": $("input[name=csrfmiddlewaretoken]").val()
        }

    });

    $("#fileupload").fileupload({
        dataType: 'json',
        sequentialUploads: true,  /* 1. SEND THE FILES ONE BY ONE */
        start: function (e) {  /* 2. WHEN THE UPLOADING PROCESS STARTS, SHOW THE MODAL */
            $("#modal-progress").modal("show");
        },
        stop: function (e) {  /* 3. WHEN THE UPLOADING PROCESS FINALIZE, HIDE THE MODAL */
            $("#modal-progress").modal("hide");
        },
        progressall: function (e, data) {  /* 4. UPDATE THE PROGRESS BAR */
            var progress = parseInt(data.loaded / data.total * 100, 10);
            var strProgress = progress + "%";
            $(".progress-bar").css({ "width": strProgress });
            $(".progress-bar").text(strProgress);
        },
        done: function (e, data) {
            if (data.result.is_valid) {
                $("#gallery tbody").prepend(

                    "<tr><td>" + data.result.page_number + "</td ><td>" + data.result.name + "</td><td><a href='" + data.result.url + "'><i class='fa fa-eye' aria-hidden='true'></i></a></td></tr>"
                )
            }
        }
    });
})
