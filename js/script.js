jQuery(document).ready(function(){
    var articles = $('.articles');
    var input = $('input');
    var button = $('button');
    var toSearch = '';
    var searchUrl = 'https://en.wikipedia.org/w/api.php';

    var ajaxArticleData = function () {
        $.ajax({
            url: searchUrl,
            dataType: 'jsonp',
            data: {
                //main parameters
                action: 'query',
                format: 'json',

                generator: 'search',
                    //parameters for generator
                    gsrsearch: toSearch,
                    gsrnamespace: 0,
                    gsrlimit: 10,

                prop: 'extracts|pageimages',
                    //parameters for extracts
                    exchars: 200,
                    exlimit: 'max',
                    explaintext: true,
                    exintro: true,

                    //parameters for pageimages
                    piprop: 'thumbnail',
                    pilimit: 'max',
                    pithumbsize: 150
            },
            success: function (json) {
                var pages = json.query.pages;
                $.map(pages, function (page) {
                    var pageElement = $('<li>');
	                   //get the article title
                    pageElement.append($('<h2>').append($('<a>').attr('href', 'http://en.wikipedia.org/wiki/' + page.title).text(page.title)));

				//get the article image (if exists)
                    if (page.thumbnail) pageElement.append($('<img>').attr('width', 150).attr('src', page.thumbnail.source));
                     //get the article text
                    pageElement.append($('<p>').text(page.extract)); 




                    pageElement.append($('<hr>'));

                    articles.append(pageElement);
                });
            }
        });
    };

    input.autocomplete({
    autoFocus: true,
	 source: function (request, response) {
            $.ajax({
                url: searchUrl,
                dataType: 'jsonp',
                data: {
                    'action': "opensearch",
                    'format': "json",
                    'search': request.term
                },
                success: function (data, ui) {
                    response(data[1]);
                }
            });
        }
    });
	
    button.click(function () {
        articles.empty();
        toSearch = input.val();
        ajaxArticleData();
    });
	
	
	$('#search').keydown(function(event){
    if(event.keyCode == 13) { 
	      if($("#search").val().length==0) {
          event.preventDefault();
      ajaxArticleData();;
    }
}
});

});
