<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastrar | Novos Usuários</title>
    <link rel="stylesheet" href="{{ asset('vendor/adminlte/dist/css/adminlte.min.css') }}">
    <link rel="stylesheet" href="{{ asset('vendor/adminlte/plugins/fontawesome-free/css/all.min.css') }}">
</head>

<body class="hold-transition login-page">
    <div class="login-box">
        <div class="login-logo">
            <a href="#"><b>Novos</b> Usuários</a>
        </div>
        <div class="card">
            <div class="card-body login-card-body">
                <p class="login-box-msg">Cadastre-se para autenticar</p>
                <div id="errors" class="alert alert-danger" style="display:none;"></div>
                <form id="register-form">
                    @csrf
                    <div class="input-group mb-3">
                        <input type="text" name="name" class="form-control" placeholder="Nome">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-envelope"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <input type="email" name="email" class="form-control" placeholder="Email">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-envelope"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <input type="password" name="password" class="form-control" placeholder="Senha">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-lock"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <input type="password" name="password_confirmation" class="form-control"
                            placeholder="Confirme a Senha">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-lock"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <button type="button" id="register-button" class="btn btn-primary btn-block">Cadastrar</button>
                    </div>
                </form>
                <div class="row py-2">
                    <a href="{{ url('/autenticar') }}" class="text-center">Já sou membro, Testar Login</a>
                </div>
            </div>
        </div>
    </div>

    <!-- AdminLTE JS -->
    <script src="{{ asset('vendor/jquery/jquery.min.js') }}"></script>
    <script src="{{ asset('vendor/adminlte/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('vendor/adminlte/dist/js/adminlte.min.js') }}"></script>
    <script>
         $(document).ready(function(){
            $('#register-button').on('click', function(e) {
                e.preventDefault();

                let formData = {
                    name: $('input[name=name]').val(),
                    email: $('input[name=email]').val(),
                    password: $('input[name=password]').val(),
                    password_confirmation: $('input[name=password_confirmation]').val(),
                    _token: $('input[name=_token]').val()
                };

                $.ajax({
                    type: 'POST',
                    url: "{{ url('/api/v1/registrar') }}",
                    data: formData,
                    success: function(response) {
                        $('#errors').hide();
                        alert(response.message);
                        window.location.href = '/autenticar';
                    },
                    error: function(response) {
                        let errors = response.responseJSON.errors;
                        let errorList = '';
                        for (let error in errors) {
                            errorList += '<p>' + errors[error][0] + '</p>';
                        }
                        $('#errors').html(errorList).show();
                    }
                });
            });
        });
    </script>
</body>

</html>
