function login() {

    var username = $('#username').val();
    var password = $('#password').val();
    var data = {
        "username": username,
        "password": password
    };

    $.ajax({
        url: '/login',
        type: 'POST',
        data: data,
        success: function (data, status) {
            if (status == 'success') {
                location.href = 'index';
            }
        },
        error: function (data, status, e) {
            if (status == 'error') {
                alert("用户名或密码错误");
                location.href = '/';
            }
        }
    });

}