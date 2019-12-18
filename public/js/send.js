function send() {
    // alert("正在发送");
    var receiver = $('#receiver').val();
    var topic = $('#topic').val();
    var context = $('#context').val();

    var data = {
        "receiver": receiver,
        "topic": topic,
        "context":context
    };
    // alert(data.receiver);

    $.ajax({
        url: '/sendMailno',
        type: 'POST',
        data: data,
        success: function (data, status) {
            if (status == 'success') {
                alert("发送成功！");
            }
        },
        error: function (data, status, e) {
            if (status == 'error') {
                alert("发送信息有误，请重新输入");
                location.href = '/send';
            }
        }
    });

}