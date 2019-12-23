$(document).ready(function(){//as soon as the document is fully laaded, the DOM is ready to be used
    let image_id = $('#btn-delete').data('user-id')
    let user_id = $('#userInfo').data('userid')
    
    if(image_id == user_id){
        $('#btn-delete').removeAttr('disabled')
    }

    $('#comment').keyup(function(){
        let $this = $(this)

        if($this.val().length > 0){
            $('#btn-submit-comment').removeAttr('disabled')
        }else{
            $('#btn-submit-comment').attr('disabled', 'disabled');
        }
    })
    
    $('#btn-like').click(function(event){
        event.preventDefault();

    let imgId = $(this).data('id');
    // alert('imgId =' + imgId);
        $.post('/image/' + imgId + '/like').done(function(data){
            $('.likes-count').text(data.likes);
        });
    });

    $('#btn-delete').click(function(event){
        event.preventDefault();
    
        let $this = $(this);

        let remove = false;
        $('#myModal').modal('show');

        $('#btn-modal-yes').click(function(){
            remove = true;
            if(remove){
                let imgId = $this.data('id');
        
                $.ajax({
                    'url':'/image/' + imgId,
                    'type': 'DELETE'
                }).done(function(data){
                    if(data){
                        $this.removeClass('btn-danger').addClass('btn-success');
                        $this.append('d <i class ="fa fa-check"></i>');
                        setTimeout(function(){
                            location.href = '/logged';
                        },2000);
                    }
                });
            }
        });
    });
    
    $('#comment-form').hide();
    $('#post-comment').click(function(){
        $('#comment-form').slideToggle();
    });

    $('#btn-createAccount').click(function(event){
        event.preventDefault();

        $('#createAccountModal').modal('show');
    })

    $('#createAccountForm').submit(function(event){
        event.preventDefault()

        let data = $(this).serialize();

        $.ajax({
            'url':'/signup',
            'type':'post',
            'data': data,
            success: function(result){
            console.log(result)
            if(result === 'OK'){
                $("#firstname-help-block").text('')
                $("#lastname-help-block").text('')
                $("#email-help-block").text('')
                $("#password-help-block").text('')
                $("#confirmpassword-help-block").text('');

                $('#createAccountForm').before('<p class="alert alert-success">Account Created Successfuly!<span class="close" data-dismiss="alert">&times;</span></p>');
            }else if(result === 'User Already Exists'){
                $('#createAccountForm').siblings('.alert').remove()
                $('#createAccountForm').before('<p class="alert alert-danger">' + result + '<span class="close" data-dismiss="alert">&times;</span></p>');
            }else{
                for(val in result){
                    if(result[val].param == 'firstname'){
                        $("#email-help-block").text('')
                        $("#firstname-help-block").append('<li>' + result[val].msg + '</li>');
                    }
                    if(result[val].param == 'lastname'){
                        $("#email-help-block").text('')
                        $("#lastname-help-block").append('<li>' + result[val].msg + '</li>');
                    }
                    if(result[val].param == 'email'){
                        $("#email-help-block").text('')
                        $("#email-help-block").append('<li>' + result[val].msg + '</li>');
                    }
                    if(result[val].param == 'password'){
                        $("#email-help-block").text()
                        $("#password-help-block").append('<li>' + result[val].msg + '</li>');
                    }
                    if(result[val].param == 'confirmpassword'){
                        $("#email-help-block").text()
                        $("#confirmpassword-help-block").append('<li>' + result[val].msg + '</li>');
                    }
                }
            }
            }
        });
    });
});