// JavaScript code for the portfolio section
  document.addEventListener('DOMContentLoaded', function() {
    // Animation on scroll
    const observerOptions = {
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('style') ? 
                        parseFloat(entry.target.getAttribute('style').replace('animation-delay: ', '').replace('s;', '')) : 0;
          
          setTimeout(() => {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
          }, delay * 1000);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.service-card').forEach(item => {
      observer.observe(item);
    });
    
    // Expand/collapse functionality
    document.querySelectorAll('.expand-toggle').forEach(button => {
      button.addEventListener('click', function() {
        const cardBody = this.closest('.card-body');
        cardBody.classList.toggle('expanded');
        
        const text = cardBody.classList.contains('expanded') ? 'Voir moins' : 'Découvrir plus';
        this.innerHTML = text + ' <i class="fas fa-chevron-' + (cardBody.classList.contains('expanded') ? 'up' : 'down') + '"></i>';
      });
    });

    // Hover effects
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.querySelector('.service-icon').style.transform = 'scale(1.1)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.querySelector('.service-icon').style.transform = 'scale(1)';
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.getElementById('show-more-btn');
    const hiddenItems = document.querySelectorAll('.hidden-item');
    let isShowingAll = false;
    
    showMoreBtn.addEventListener('click', function() {
      if (!isShowingAll) {
        // Show all hidden items
        hiddenItems.forEach(item => {
          item.style.display = 'block';
        });
        showMoreBtn.textContent = 'VOIR MOINS';
        isShowingAll = true;
      } else {
        // Hide items again
        hiddenItems.forEach(item => {
          item.style.display = 'none';
        });
        showMoreBtn.textContent = 'VOIR PLUS';
        isShowingAll = false;
        
        // Scroll back to portfolio section
        document.getElementById('portfolio').scrollIntoView({behavior: 'smooth'});
      }
    });
});

