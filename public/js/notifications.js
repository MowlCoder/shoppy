const notifications = document.querySelectorAll('.notification-block');

notifications.forEach(n => {
    const timeline = n.childNodes[1];
    
    timeline.style.marginLeft = '-100%';
    
    setTimeout(() => {
        n.style.opacity = 0;
    }, 4500);
    
    setTimeout(() => {
       n.style.display = 'none'; 
    }, 5200);
});