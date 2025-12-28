import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add scroll animations to elements with data-animate attribute
    const animateElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animation = entry.target.getAttribute('data-animate');
            const delay = entry.target.getAttribute('data-delay') || '0';
            
            const element = entry.target as HTMLElement;
            element.style.animationDelay = `${delay}ms`;
            element.classList.add('animate-fade-in');
            
            if (animation) {
              element.classList.add(animation);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    animateElements.forEach((el) => observer.observe(el));

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};
