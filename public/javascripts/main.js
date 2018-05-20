const NebPay = require("nebpay");
const nebPay = new NebPay();
var serialNumber;
var intervalQuery;
const callbackUrl = NebPay.config.mainnetUrl;
const contract = "n1jh7Peq1WVHN3A3EKdQc4V7q9WeBpTMVfk";
//const callbackUrl = NebPay.config.testnetUrl;
//const contract = "n1iMbG2YqyX9ZBnv5AzowZryL3fYadm3Qoq";

$('#bookName').focus();

$('#newAlbum').on('click', () => {

    $('#formLoader').css("display", "block");
    $('#form').css("display", "none");

    var to = contract;
    var value = 0;
    var callFunction = "createBook";
    var callArgs = [];

    var bookName = $("#bookName").val();
    if (bookName != "") {
        callArgs.push(bookName);
        callArgs = JSON.stringify(callArgs);
    } else {
        callArgs = null
    }

    serialNumber = nebPay.call(to, value, callFunction, callArgs, {
        qrcode: {
            showQRCode: false
        },
        callback: callbackUrl,
        listener: newAlbumListener
    });
    intervalQuery = setInterval(function() {
        newAlbumIntervalQuery();
    }, 10000);

});

function newAlbumListener(resp) {
    if (typeof resp === "object") {
        var txhash = resp.txhash
    } else {
        $('#formLoader').css("display", "none");
        $('#form').css("display", "block");
        var error = resp
    }
};

function newAlbumIntervalQuery() {
    nebPay.queryPayInfo(serialNumber, {
            callback: callbackUrl
        })
        .then(function(resp) {
            var respObject = JSON.parse(resp)
            if (respObject.code === 0) {
                clearInterval(intervalQuery)
                window.location.href = '/book/' + respObject.data.from;
            }
        })
        .catch(function(err) {
            console.log("err", JSON.stringify(err));
        });
};

function loadBook() {

    var to = contract;
    var value = 0;
    var callFunction = "getBook";
    var callArgs = [];

    if (address != "") {
        callArgs.push(address);
        callArgs = JSON.stringify(callArgs);
    } else {
        callArgs = null
    }

    serialNumber = nebPay.simulateCall(to, value, callFunction, callArgs, {
        qrcode: {
            showQRCode: false
        },
        listener: loadBookListener
    });

};

function loadBookListener(resp) {

    if (resp.execute_err == "") {

        var result = JSON.parse(resp.result);

        $("#loaderStatus").css("display", "none");
        $("#gallery").css("display", "block");
        $("#bookName").html(result.name);
        $("#bookAddress").html(address);

        var photos = result.photos;

        if (photos.length) {
            $(".gallery").html("");
            photos.forEach(function(element) {
                $(".gallery").append("<img src='" + element.image + "' alt='" + element.description + "' data-hash='" + element.hash + "' data-time='" + element.time + "' width='100%' height='auto' class='gallery-img' onclick='openImg(this)' />");
            });
        }

    } else {
        setTimeout(function() {
            loadBook()
        }, 5000);
    }

};

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function(event) {
        if (event.loaded < 51200) {
            $('#error').css("display", "none");
            $("#base64").val(reader.result)
            $("#uploadPhoto").css("display", "block");
            $('.swingimage').css("display", "block");
            $(".inside img").attr("src", reader.result);

        } else {
            $('#error').css("display", "block");
            $('#error').html("Photo size incorrect. 50kb max.");
        }
    }
    reader.readAsDataURL(file);
}

$('#uploadPhoto').on('click', () => {

    $('.swingimage').css("display", "none");
    $('#error').html("");
    $('#error').css("display", "none");
    $('#uploadLoader').css("display", "block");
    $('.base').css("display", "none");
    $("#uploadPhoto").css("display", "none");

    var to = contract;
    var value = 0;
    var callFunction = "savePhoto";
    var callArgs = [];

    var description = $("#description").val();
    var photo = $("#base64").val();

    callArgs.push(photo);
    callArgs.push(description);
    callArgs = JSON.stringify(callArgs);

    serialNumber = nebPay.call(to, value, callFunction, callArgs, {
        qrcode: {
            showQRCode: false
        },
        callback: callbackUrl,
        listener: uploadPhotoListener
    });
    intervalQuery = setInterval(function() {
        uploadPhotoIntervalQuery();
    }, 10000);

});

function uploadPhotoListener(resp) {
    if (typeof resp === "object") {
        var txhash = resp.txhash
    } else {
        $('#uploadLoader').css("display", "none");
        $('.base').css("display", "block");
        $('#error').css("display", "block");
        $('#error').html(resp);
    }
};

function uploadPhotoIntervalQuery() {
    nebPay.queryPayInfo(serialNumber, {
            callback: callbackUrl
        })
        .then(function(resp) {
            var respObject = JSON.parse(resp)
            if (respObject.code === 0) {
                clearInterval(intervalQuery);
                $('#uploadLoader').css("display", "none");
                $('#ok').css("display", "block");
                $('#go').attr("href", "/book/" + respObject.data.from)
            }
        })
        .catch(function(err) {
            $('#uploadLoader').css("display", "none");
            $('.base').css("display", "block");
            $('#error').css("display", "block");
            $('#error').html(JSON.stringify(err));
        });
};

function openImg(elem) {
    var img = $(elem).attr("src");
    var desc = $(elem).attr("alt");
    var hash = $(elem).attr("data-hash");
    var time = $(elem).attr("data-time");

    $("#myModal").css("display", "block");
    $("#img01").attr("src", img);
    $("#caption #desc").html(desc);
    $("#caption #hash").html("Nebulas transaction hash: " + hash);
    $("#caption #time").html("Timestamp: " + time);
};

var span = document.getElementsByClassName("close")[0];
if (span) {
    span.onclick = function() {
        $("#myModal").css("display", "none");
    }
}

$("#howCreate").on('click', () => {
    alert("To Address: " + contract + "\nFunction: createBook\nArguments: ['YOUR BOOK NAME']")
});

$("#howGetAlbum").on('click', () => {
    alert("To Address: " + contract + "\nFunction: getBook\nArguments: ['YOUR ADDRESS WALLET']")
});

$("#howUpload").on('click', () => {
    alert("To Address: " + contract + "\nFunction: savePhoto\nArguments: ['BASE64 STRING', 'PHOTO DESCRIPTION']")
});