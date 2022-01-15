const sectionOne = document.querySelector('.sectionOne');
const faders = document.querySelectorAll('.fade-in');

const options = {
    root: null, //default is viewport
    threshold: 0, // bewteen 0 and 1 - if at 1 100% if item has to be on the page
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
        //console.log(entry);
        //observer.unobserve(entry.target); // stop observing once seen, even after scroll up
    });
}, options);

faders.forEach(fader=>{
    observer.observe(fader);
})

//observer.observe(sections);