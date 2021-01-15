$(document).ready(function(){

    // Multi-selection

    $('#checkbox').click(function(e){

        if(this.checked){
          $('.multi_action').fadeIn('slow')
          $('.checkboxes').each(function(){
             this.checked = true
          })
        }else{
           $('.multi_action').fadeOut('slow')
  
          $('.checkboxes').each(function(){
              this.checked = false
          })
        }
    })
  
  
  
  
    $('.multiOperationFORM').submit(function(e){
      e.preventDefault()
      let data = $(this).serialize()
      let action = $(this).attr('action')
      console.log(data)
  
      $.ajax({
        url: action,
        data: data,
        type: 'Post',
         cache: false,
        success: function(response){
            if(!response.error){
              $('.multi_action').fadeOut('slow')
              $('.checkboxes').each(function(){
                  this.checked = false
              })
              $('#checkbox').checked = false
            
              swal({  //sweetalert.js library
                title:  `Operation Success`,
                text: `Kudos! You've successfully performed operation on marked todos. `,
                icon: "success",    
                timer: 5500,
                closeOnClickOutside: false  
              });


              setInterval( ()=>{
                $('.table').load(location.href + ' .table' );
              }, 3000)
  
            }
        }
  
      })
    })







    // bootstrap switch shits
    $('.appStatus').bootstrapSwitch()
    $('.appComplete').bootstrapSwitch()



    // This shit sends an ajax request to todos's update url to update it's status
     $('.appStatus').on('switchChange.bootstrapSwitch', function(e, data){
         let status = data
         let slug = $(this).attr('id')
         $(this).attr('value', status)
         console.log(status, slug)
         
         $.ajax({
           url: `/admin/todos/status/${slug}?_method=PUT`,
           data: {status: status},
           type: 'Post',
           cache: false,
           success: (data=>{
             if(!data.error){
                 swal({  //sweetalert.js library
                       title:  `Status Changed to ${status}`,
                       text: `Kudos! You've successfully changed the status to ${status}. `,
                       icon: "success",    
                       timer: 5500,
                       closeOnClickOutside: false  
                 });

             }
           })
         })
     })



         // This shit sends an ajax request to todos's update url to update it's completion_status
         $('.appComplete').on('switchChange.bootstrapSwitch', function(e, data){
            let status = data
            let slug = $(this).attr('id')
            $(this).attr('value', status)
            console.log(status, slug)
            
            $.ajax({
              url: `/admin/todos/completion_status/${slug}?_method=PUT`,
              data: {completion_status: status},
              type: 'Post',
              cache: false,
              success: (data=>{
                if(!data.error){
                    swal({  //sweetalert.js library
                          title:  `Completion Status Changed to ${status}`,
                          text: `Kudos! You've successfully changed the completion_status to ${status}. `,
                          icon: "success",    
                          timer: 5500,
                          closeOnClickOutside: false  
                    });
   
                }
              })
            })
        })












    //  file uploads
    const inpFile = document.getElementById('inpFile');
    const previewContainer = document.getElementById('imagePreview');
    const previewImage = document.querySelector('.image-preview__image');
    const previewDefault = document.querySelector('.image-preview__default-text');
 
    inpFile.addEventListener('change',function(){
        const file = this.files[0];
    
        if(file){
            const reader = new FileReader();
            previewDefault.style.display = 'none';
            previewImage.style.display = 'block';
    
            reader.addEventListener('load',function(){
                previewImage.setAttribute('src',this.result);
                previewImage.style.width = '130px';
            });
            reader.readAsDataURL(file)
        }else{
            previewDefault.style.display = 'block';
            previewImage.style.display = 'none';
            previewImage.setAttribute('src',"");
        }
    })
    
    // triggering input file with a button
    $('#upload-btn').click(function(){
        $('#inpFile').click()
    })

    
    })