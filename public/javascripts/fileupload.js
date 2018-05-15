
function setupload(uploadname, fileinput, pathinput, readpath, isCheck, fileSizeInput, fileNameInput, fileExtNameInput) {
    $(document).off("change", "#" + uploadname);
    $(document).on("change", "#" + uploadname, function () {
        if (checkFile(this, isCheck)) {	//这里限制为图片类型，可以取消限制
            $.ajaxFileUpload({
                url: '/fileUpload', //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: uploadname, //文件上传域的ID
                dataType: 'TEXT', //返回值类型 一般设置为json
                success: function (data) { //服务器成功响应处理函数
                    var obj = JSON.parse(data);

                    if (fileinput != "") {
                        $("#" + fileinput).val(obj.filename);
                    }
                    if (pathinput != "") {
                        $("#" + pathinput).text(obj.resultPath);
                    }
                    if (readpath != "") {
                        $("#" + readpath).text(obj.fileNamePath);
                    }
                    if (fileSizeInput != "") {
                        if ($("#" + fileSizeInput)) {
                            $("#" + fileSizeInput).val(obj.fileAttr.size);
                        }
                    }
                    if (fileNameInput != "") {
                        if ($("#" + fileNameInput)) {
                            var fileName = obj.fileAttr.name;
                            var baseName = fileName.substring(0, fileName.indexOf('.'));
                            $("#" + fileNameInput).val(baseName);
                        }
                    }
                    if (fileExtNameInput != "") {
                        if ($("#" + fileExtNameInput)) {
                            var fileName = obj.fileAttr.name;
                            var pos = fileName.indexOf('.') + 1;
                            var extName = fileName.substring(pos);
                            $("#" + fileExtNameInput).val(extName);
                            // $("#" + fileExtNameInput).find("option[text='jpg']").attr("selected", true);

                            // var fileNamePath = path.resolve(__dirname,obj.resultPath);
                            // $("#" + fileExtNameInput).val(obj.resultPath);

                        }
                    }
                },
                error: function (data, status, e) {

                }
            });
        }
    });
}


setupload("artcover1", "articles_cover1", "articlescover1", "", true, "", "", "");
// setupload("artcover2", "articles_cover2", "articlescover2", "", true, "", "", "");

function checkFile(upfile, isCheck) {
    var filePath = upfile.value || upfile.name;
    // console.log("filePath:"+filePath);
    //检查文件格式
    var imgFormat = filePath.substr(filePath.lastIndexOf('.')).toLowerCase();
    //Check extension to image types.
    if (isCheck) {
        var imgFNumb = '.gif,.jpg,.png,.jpeg,.ico,'.indexOf(imgFormat + ',');
        if (imgFNumb <= -1) {
            alert("文件类型不对(现在支持的图片文件类型有：gif,jpg,png,jpeg,ico)");
            return false;
        }
    }
    return true;
}

function getRootPath() {
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPaht = curWwwPath.substring(0, pos);
    if (pos === 5) localhostPaht = curWwwPath;
    if (localhostPaht.indexOf("file") != -1) {
        return ".";
    }
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}

