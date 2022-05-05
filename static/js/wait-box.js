
; (function ($) {
    
    var waitBox = function (show) {

        if (show) {
            $('.waitBox-progress-bar').css('width', 0 + '%').attr('aria-valuenow', 0);
            $('#waitBox').modal({
                keyboard: false,
                backdrop: 'static'
            });

            $(".waitBox-progress-bar").animate({
                width: "100%"
            }, 1000);

        } else {
            $('#waitBox').modal('hide');
        }
    };

    window.waitBox = waitBox;
    
})($);