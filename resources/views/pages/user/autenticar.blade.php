<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Painel Autenticação</title>
    <link rel="stylesheet" href="{{ asset('vendor/adminlte/dist/css/adminlte.min.css') }}">
    <link rel="stylesheet" href="{{ asset('vendor/adminlte/plugins/fontawesome-free/css/all.min.css') }}">
</head>

<body class="hold-transition login-page">
    <div class="login-box">
        <div class="login-logo">
            <a href="#"><b>Testar</b> o Usuário</a>
        </div>
        <div class="card">
            <div class="card-body login-card-body">
                <p class="login-box-msg">Teste suas credênciais </p>
                <div id="errors" class="alert alert-danger" style="display:none;"></div>
                <form id="register-form">
                    @csrf
                    <div class="input-group mb-3">
                        <input type="email" name="email" class="form-control" placeholder="Email">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-envelope"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <input type="password" name="password" class="form-control" placeholder="Password">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-lock"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <button type="button" id="login-button" class="btn btn-primary btn-block">Login</button>
                    </div>

                    <div class="row py-2 ">
                        <a href="{{ url('/login') }}">Logar no sistema</a> &nbsp; | &nbsp;
                        <a href="{{ url('/registrar') }}">Quero me cadastrar</a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- AdminLTE JS -->
    <script src="{{ asset('vendor/jquery/jquery.min.js') }}"></script>
    <script src="{{ asset('vendor/adminlte/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('vendor/adminlte/dist/js/adminlte.min.js') }}"></script>

    <script>
        $(document).ready(function() {
            $('#login-button').on('click', function(e) {
                e.preventDefault();

                let formData = {
                    email: $('input[name=email]').val(),
                    password: $('input[name=password]').val(),
                    _token: $('input[name=_token]').val()
                };

                $.ajax({
                    type: 'POST',
                    url: "{{ url('/api/v1/autenticar') }}",
                    data: formData,
                    success: function(response) {
                        $('#errors').hide();
                        alert(response.message);
                    },
                    error: function(response) {
                        let errorList = response.responseJSON.message;
                        $('#errors').html(errorList).show();
                    }
                });
            });
        });
    </script>
</body>

</html>
