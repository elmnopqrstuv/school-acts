let currentSlideIndex = 0;


const bioSlides = document.getElementById('bioSlides');

const paragraphs = bioSlides ? bioSlides.querySelectorAll('p') : [];
const dotContainer = document.getElementById('slideDots');


const typedTextSpan = document.querySelector(".multiple-text");
const textArray = ["BSIT Student", "Full Stack Dev", "UI/UX Designer"];
const typingDelay = 100;
const erasingDelay = 100;
const newTextDelay = 2000; 
let textArrayIndex = 0;
let charIndex = 0;

function showSlide(index) {
    if (paragraphs.length === 0) {
        console.error("No bio paragraphs found for sliding.");
        return;
    }

  
    if (index >= paragraphs.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = paragraphs.length - 1;
    } else {
        currentSlideIndex = index;
    }

    
    paragraphs.forEach((p, i) => {
        p.classList.remove('active');
        if (i === currentSlideIndex) {
            p.classList.add('active');
        }
    });

   
    if (dotContainer) {
        const dots = dotContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentSlideIndex) {
                dot.classList.add('active');
            }
        });
    }
}


function createDots() {
    if (!dotContainer || paragraphs.length === 0) return;

   
    dotContainer.innerHTML = ''; 

  
    paragraphs.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.setAttribute('data-index', index);
        
        dot.addEventListener('click', () => {
            showSlide(index);
        });

        dotContainer.appendChild(dot);
    });

  
    showSlide(currentSlideIndex);
}



function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!typedTextSpan.classList.contains("typing")) typedTextSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        typedTextSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!typedTextSpan.classList.contains("typing")) typedTextSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        typedTextSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    
    createDots();
    
    
    if (textArray.length) {
        setTimeout(type, newTextDelay + 250); 
    }
});
