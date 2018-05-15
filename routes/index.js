var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var router = express.Router();

const uploadFilePath = `${path.resolve(__dirname, '../public/uploads/' )}/`;

/* GET home page. */

router.get('/index',function(req, res, next){
  res.render('index', {title: '文件上传'});
});

router.post("/saveuploadfiles", function (req, res) {
    var tableName = 'articles';
    var data = eval(req.body);
    // var jData = JSON.parse(data.jData);
    // var wData = JSON.parse(data.wData);
    console.error(data);
});


router.post('/fileUpload', function (req, res) {
    var form = null;
    form = new formidable.IncomingForm();
    form.keepExtensions = false;		//隐藏后缀
    form.multiples = true;				//多文件上传
    form.uploadDir = uploadFilePath;

    uploadFileFun(form, req, res, fs);
});

//上传
function uploadFileFun(form, req, res, fs) {
    form.parse(req, function (error, fields, files) {
        var filename = '';
        var gUpload = uploadFilePath,
            fList = files.file;
        fileS = null,
            resultPath = [];
        if (fList.constructor === Array) {
            for (var i = 0; i < fList.length; i++) {
                fileS = fList[i];
                filename = uploadOper(fs, gUpload, fileS, resultPath);
            }
        } else {	//单文件上传
            fileS = fList;
            filename = uploadOper(fs, gUpload, fileS, resultPath);
        }

         //console.log("files:"+JSON.stringify(files.file));

        res.setHeader('Content-Type', 'text/html');		//很重要，不然ie会弹出保存对话框
        //返回结果
        var fileNamePath = path.resolve(__dirname, uploadFilePath + filename);
        res.json({fileAttr:files.file,filename: filename, resultPath: resultPath[0], fileNamePath: fileNamePath});
    });
}

function uploadOper(fs, gUpload, fileS, resultPath) {
    var fileTypeName = fileS.name.substring(fileS.name.lastIndexOf('.') + 1)
        , catDir = gUpload + fileTypeName + '/'
        , catDetailDir = catDir + new Date().format('yyyyMMdd') + '/'
        , secondDir = '/' + new Date().format('yyyyMMdd') + '/'
        , fileName = new Date().getTime() + parseInt(Math.random() * 10000000) + '.' + fileTypeName
        , uploadPath = catDetailDir + fileName;//如果需要目录 catDetailDir+fileName
    // console.log(uploadPath);
    resultPath.push(uploadPath.replace('public/', ''));

    if (fileS.name.lastIndexOf('.') > -1) {	//只能传有后缀的文件，前台上传做个限制（后台暂时没找到方法）
        if (!fs.existsSync(catDir)) {	//2级目录不存在
            fs.mkdirSync(catDir);
        }

        if (!fs.existsSync(catDetailDir)) {	//3级目录不存在
            fs.mkdirSync(catDetailDir);
        }
        fs.renameSync(fileS.path, uploadPath);
    }
    // console.log(fileTypeName + secondDir + fileName);
    return fileTypeName + secondDir + fileName;
}

//时间格式化
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports = router;
