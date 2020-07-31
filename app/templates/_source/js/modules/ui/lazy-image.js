const loadComplete = ({ target }) => {
  target.dataset.lazy = 'loaded';
  target.removeEventListener('load', loadComplete);
};

const loadImage = imgElement => {
  imgElement.addEventListener('load', loadComplete);
  if ('srcset' in HTMLImageElement.prototype === false) {
    imgElement.src = imgElement.dataset.src;
  } else {
    imgElement.srcset = imgElement.dataset.srcset;
  }
};

export default imgElement => {
  // no IntersectionObserver? Too bad, load images anyway.
  // loading="lazy" support? Nice, browser will handle lazy loading for us.
  if (
    'IntersectionObserver' in window === false ||
    'loading' in HTMLImageElement.prototype
  ) {
    loadImage(imgElement);
    return;
  }

  // init intersectionObserver
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // load image
        loadImage(imgElement);
        // stop observing
        observer.disconnect();
      }
    },
    {
      rootMargin: '-10% -10% -10% -10%',
    }
  );

  observer.observe(imgElement);
};
