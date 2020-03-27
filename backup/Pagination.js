function getPagination(table) {
    var lastPage = 1;
    var parent = $(table).parent()
    //$('select', parent)
    //    .on('change', function(evt) {
        //$('.paginationprev').html('');						// reset pagination

        lastPage = 1;
        $('.pagination', parent)
            .find('li')
            .slice(1, -1)
            .remove();
        var trnum = 0; // reset tr counter
        var maxRows = 15//parseInt($(this).val()); // get Max Rows from select option

        /*if (maxRows == 5000) {
            $('.pagination', parent).hide();
        } else {
            $('.pagination', parent).show();
        }*/

        var totalRows = $(table + ' tbody tr').length; // numbers of rows
        $(table + ' tr:gt(0)').each(function(index,val) {
            
            // each TR in  table and not the header
            trnum++; // Start Counter
            if (trnum > maxRows) {
            // if tr number gt maxRows

            $(this).hide(); // fade it out
            }
            if (trnum <= maxRows) {
            $(this).show();
            } // else fade in Important in case if it ..
        }); //  was fade out to fade it in
        if (totalRows > maxRows) {
            // if tr total rows gt max rows option
            var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
            //	numbers of pages
            for (var i = 1; i <= pagenum; ) {
            // for each page append pagination li
            $('.pagination li[name="prev"]', parent)
                .before(
                '<li class="page-item" data-page="' +
                    i +
                    '">\
                                    <a class="page-link">' +
                    i++ +
                    '<span class="sr-only">(current)</span></a>\
                                    </li>'
                )
                .show();
            } // end for i
            $('.pagination', parent).show()
        } // end if row count > max rows
        else {
            $('.pagination', parent).hide()
        }
        $('.pagination [data-page="1"]', parent).addClass('active'); // add active class to the first li
        $('.pagination li', parent).on('click', function(evt) {
            // on click each page
            evt.stopImmediatePropagation();
            evt.preventDefault();
            var pageNum = $(this).attr('data-page'); // get it's number

            var maxRows = 15 //parseInt($('select', parent).val()); // get Max Rows from select option

            if (pageNum == 'prev') {
            if (lastPage == 1) {
                return;
            }
            pageNum = --lastPage;
            }
            if (pageNum == 'next') {
            if (lastPage == $('.pagination li', parent).length - 2) {
                return;
            }
            pageNum = ++lastPage;
            }

            lastPage = pageNum;
            var trIndex = 0; // reset tr counter
            $('.pagination li', parent).removeClass('active'); // remove active class from all li
            $('.pagination [data-page="' + lastPage + '"]', parent).addClass('active'); // add active class to the clicked
            // $(this).addClass('active');					// add active class to the clicked
            limitPagging(parent);
            $(table + ' tr:gt(0)').each(function() {
            // each tr in table not the header
            trIndex++; // tr index counter
            // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
            if (
                trIndex > maxRows * pageNum ||
                trIndex <= maxRows * pageNum - maxRows
            ) {
                $(this).hide();
            } else {
                $(this).show();
            } //else fade in
            }); // end of for each tr in table
        }); // end of on click pagination list
        limitPagging(parent);
        //})
        //.val(5)
        //.change();

    // end of on select change

    // END OF PAGINATION
    }

function limitPagging(scope){
    // alert($('.pagination li').length)

    if($('.pagination li', scope).length > 7 ){
            if( $('.pagination li.active', scope).attr('data-page') <= 3 ){
            $('.pagination li:gt(5)', scope).hide();
            $('.pagination li:lt(5)', scope).show();
            $('.pagination [data-page="next"]', scope).show();
        }if ($('.pagination li.active', scope).attr('data-page') > 3){
            $('.pagination li:gt(0)', scope).hide();
            $('.pagination [data-page="next"]', scope).show();
            for( let i = ( parseInt($('.pagination li.active', scope).attr('data-page'))  -2 )  ; i <= ( parseInt($('.pagination li.active', scope).attr('data-page'))  + 2 ) ; i++ ){
                $('.pagination [data-page="'+i+'"]', scope).show();

            }

        }
    }
}

$( document ).ready(function() {
    getPagination('#feedbackTable');
    //getPagination('#attachmentTable')
    //getPagination('.table-class');
    //getPagination('table');

    /*					PAGINATION 
    - on change max rows select options fade out all rows gt option value mx = 5
    - append pagination list as per numbers of rows / max rows option (20row/5= 4pages )
    - each pagination li on click -> fade out all tr gt max rows * li num and (5*pagenum 2 = 10 rows)
    - fade out all tr lt max rows * li num - max rows ((5*pagenum 2 = 10) - 5)
    - fade in all tr between (maxRows*PageNum) and (maxRows*pageNum)- MaxRows 
    */
		 

    
    $(function() {
    // Just to append id number for each row
        $('#feedbackTable tr:eq(0)').prepend('<th> ID </th>');

        var id = 0;

        $('#feedbackTable tr:gt(0)').each(function() {
            id++;
            $(this).prepend('<td>' + id + '</td>');
        });
    });
});
