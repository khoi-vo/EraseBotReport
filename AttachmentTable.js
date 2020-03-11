$( document ).ready(function()
{

    $('#attachmentPage').hide()
    $('#feedbackTable').find('a[href^="#"]').each(function(idx,val){
        if ($(val).attr('data-attachment')) {
            $(val).on('click', function(e) {
                e.preventDefault();
                //var position = $($(this).attr("href")).offset().top;
                $("body, html").animate({
                    scrollTop: 2000
                } /* speed */ );
                let elem = $(this)
                data = JSON.parse(elem.attr('data-attachment').replace(/'/g, '"')) // Array of array
                let table = $('#attachmentTable tbody')
                table.html('');
                for(var i = 0; i < data.length; i++) {
                    let rowstr = '<tr>'
                    for(var j = 0; j < data[i].length; j++) {    
                        rowstr += '<td>' + data[i][j] + '</td>'
                    }
                    rowstr += '</tr>'
                    $(rowstr).appendTo(table)
                }
                //$('#feedbackPage').hide()
                $('#attachmentPage h6').text("Feedback ID: "+$(val).text()) 
                getPagination('#attachmentTable')
                $('#attachmentPage').show()
            })
        }
    })
})