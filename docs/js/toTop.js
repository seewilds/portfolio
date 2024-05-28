window.onscroll = function(){scrollCheck()};

function scrollCheck(){
    const toTopButton = document.querySelector('#topButton');
    if(document.body.scrollTop > 750 || document.documentElement.scrollTop > 750){
        toTopButton.style.display = 'block';
    }else{
        toTopButton.style.display ='none';
    }
}

function toTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

