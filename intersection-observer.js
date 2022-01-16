const faders = document.querySelectorAll('.fade-in');

const options = {
    root: null, //default is viewport
    threshold: .25, // bewteen 0 and 1 - if at 1 100% if item has to be on the page
    rootMargin: "-50px" //pixels percentage
};

const observer = new IntersectionObserver((entries, options)=>{
    entries.forEach(entry=>{
        if(!entry.isIntersecting){
            entry.target.classList.remove('appear');
            entry.target.classList.add('disappear');
        }else{
            entry.target.classList.remove('disappear');
            entry.target.classList.add('appear');
        }
    });
}, options);

faders.forEach(fader=>{
    observer.observe(fader);
})