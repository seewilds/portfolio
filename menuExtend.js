function menuExtend(){
    const mainNav = document.querySelector('nav');
    mainNav.style.display='inline-block';
    console.log(mainNav);

    const menuNav = document.querySelector('#menu');
    menuNav.style.display='none';
}

function menuCollapse(){
    const mainNav = document.querySelector('nav');
    mainNav.style.display='none';
    console.log(mainNav);

    const menuNav = document.querySelector('#menu');
    menuNav.style.display='inline-block';
}