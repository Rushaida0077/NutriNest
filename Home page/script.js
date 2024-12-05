const wrapper= document.querySelector('.wrapper');
const signin= document.querySelector('.signin-link');
const signup= document.querySelector('.signup-link');
const signinPopup= document.querySelectorAll('.signin-popup');
const iconClose= document.querySelector('.icon-close');

signup.addEventListener('click',()=>
    {
        wrapper.classList.add('active');
    });
signin.addEventListener('click',()=>
        {
            wrapper.classList.remove('active');
        });
signinPopup.forEach(link => {
link.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});
});

iconClose.addEventListener('click',()=>{
            wrapper.classList.remove('active-popup');
        });
