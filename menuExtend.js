function menuExtend(){
    const mainNav = document.querySelector('nav');
    const menuNav = document.querySelector('#menu');
    var mq = window.matchMedia( "(max-width: 700px)" );
    if(mq.matches){
        mainNav.style.display='inline-block';
        menuNav.style.display='none';
    }else{
        mainNav.style.display='inline-block';
        menuNav.style.display='none';
    }
    
}

function menuCollapse(){
    const mainNav = document.querySelector('nav');
    const menuNav = document.querySelector('#menu');
    var mq = window.matchMedia( "(max-width: 700px)" );
    if(mq.matches){
        mainNav.style.display='none';
        menuNav.style.display='inline-block';
    }
    
}

function resizeTest(){
    var mq = window.matchMedia( "(max-width: 700px)" );
    const mainNav = document.querySelector('nav');
    const menuNav = document.querySelector('#menu');
    if(mq.matches){
        mainNav.style.display='none';
        menuNav.style.display='inline-block';
    }else{
        mainNav.style.display='inline-block';
        menuNav.style.display='none';
    }
}

window.onresize = resizeTest;