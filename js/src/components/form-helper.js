window.formHelper = (function ($) {

    /**
    * Custom file upload setup
    */

    var fileUpload = function() {

        var file = {
            input: $('.file-input'),
            validExt: ['pdf', 'doc', 'docx', 'jpeg', 'png', 'gif'],
            validSize: 2097152,
            defaultMsg: 'No file chosen',
            extErrMsg: 'Please upload one of the following file types: ',
            sizeErrMsg: 'Please upload a file under '
        }

        /** 
        * Helper functions
        */

        var convertToMB = function(bytes) {
            return (bytes/1048576).toFixed(0);
        };

        var trimText = function(text) {
            return (text.length > 30) ? text.substring(0, 30) + '...' : text;
        };

        /**
        * File upload validation
        */

        var showErrMsg = function(customErrMsg) {
            file.self.addClass('error');
            $('<label class="file-input-error-msg error" for="' + file.inputId +'">' + customErrMsg + '</label>').insertAfter(file.self);
        };

        var validateUpload = function(ext, size) {

            var isValidExt = false,
                isValidSize = false,
                customErrMsg = '';

            //validate file extension
            for (var i = 0; i < file.validExt.length; i++) {
                if(ext === file.validExt[i]) {
                    isValidExt = true;
                    break;
                }
            }

            //validate file size
            if(size <= file.validSize) {
                isValidSize = true;
            } 

            //valid extension and size
            if(isValidExt && isValidSize) {
                file.pathTarget.text(trimText(file.name));
            } 

            //file extension error handling
            if(isValidExt === false) {
                customErrMsg = file.extErrMsg + file.validExt.join(', ');
                showErrMsg(customErrMsg);
            }

            //file size error handling
            if(isValidSize === false) {
                customErrMsg = file.sizeErrMsg + convertToMB(file.validSize) + 'MB';
                showErrMsg(customErrMsg);
            }

        };

        /**
        * Focus states for accessiblity
        */

        file.input.focusin(function() { 
            file.self = $(this);
            file.uploadBtn = file.self.prevAll('.file-input-upload-btn');
            file.uploadBtn.addClass('focus');
        });

        file.input.focusout(function() { 
            file.uploadBtn.removeClass('focus');
        });

        /**
        * Get file upload data
        */

        file.input.on('change', function() {
            file.self = $(this);
            file.path = file.self.val();
            file.inputId = file.self.attr('id');
            file.name = file.path.replace(/^.*[\\\/]/, '');
            file.ext = file.path.split('.').pop().toLowerCase();
            file.pathTarget = file.self.nextAll('.file-input-fake-path');

            if(file.path) {

                //check for file size if file API is supported (IE10+)
                if(window.File && window.FileReader && window.FileList && window.Blob) {
                    file.size = this.files[0].size;
                } else {
                    file.size = 0;
                }

                //clear previous inputs and errors
                file.pathTarget.text(file.defaultMsg);
                file.self.val('').removeClass('error');
                $('.file-input-error-msg').remove();

                //validate new input
                validateUpload(file.ext, file.size);
            } 

        });
    };
 
    return {
        fileUpload: fileUpload
    };

})(jQuery); 