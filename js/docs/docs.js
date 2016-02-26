(function(document) {
    var $h1 = document.querySelectorAll('h1.cd-title');
    var $h2 = document.querySelectorAll('h2.cd-title');
    var $pageNav = document.querySelector('.cd-page-nav');
    var i;

    if ($pageNav && $h1.length && $h2.length > 1) {
        $pageNav.className += ' cd-page-nav--show';

        for (var i = 0; i < $h2.length; i ++) {
            $h2[i].id = $h2[i].innerText.toLowerCase().replace(/ /g, '-');

            $pageNav.children[1].innerHTML += '<li><a href="#' + $h2[i].id + '">' + $h2[i].innerText + '</a></li>';
        }

        $('.cd-page-nav').insertAfter('h1:first');
    }
}(document));
