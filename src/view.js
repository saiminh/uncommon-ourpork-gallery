let ticker, mouseMoveHandler, hasClonedElements = false;

const isMobile = ({ maxWidth = 639 } = {}) => {
  return (
    window.matchMedia("(pointer: coarse)").matches &&
    navigator.maxTouchPoints > 1 &&
    window.matchMedia(`(max-width: ${maxWidth}px)`).matches &&
    "ontouchstart" in document.documentElement
  )
}

function initPorkGalleryScroll(){
  const scrollingMap = document.querySelector('.uncommon-ourpork-gallery-content');
  const mapclasses = Array.from(scrollingMap.classList);
  // find out how many rows of images there are
  const rows = parseInt(mapclasses.find(x => x.includes('columns-')).replace('columns-',''));
  // find out how big the gap is between images
  // const gap = window.getComputedStyle(scrollingMap, null)["gap"];
  // const gapNoPx = parseInt(gap.replace('px',''));

  // clone the scrolling map 8 times
  if (!hasClonedElements) {
    scrollingMap.innerHTML = `<div class="uncommon-ourpork-gallery-content-inner">${scrollingMap.innerHTML}</div>`;
    for (let i = 0; i < 8; i++) {
      const clone = document.querySelector('.uncommon-ourpork-gallery-content-inner').cloneNode(true);
      scrollingMap.insertBefore(clone, document.querySelector('.uncommon-ourpork-gallery-content-inner'));
    }
    hasClonedElements = true;
  }
  const totalWidth = window.innerWidth * 4;
  // set up grid
  const allInners = document.querySelectorAll('.uncommon-ourpork-gallery-content-inner');
  allInners.forEach((inner, index) => {

    inner.style.display = 'grid';
    if ( window.innerWidth < 600 ) {
      inner.style.gridTemplateColumns = `repeat(${Math.floor(rows/2)}, 1fr)`;
    } else {
      inner.style.gridTemplateColumns = `repeat(${rows}, 1fr)`;
    }
    inner.style.gridAutoFlow = 'dense';
    inner.style.gridGap = 0;
    inner.style.width = `${totalWidth / 3}px`;
    inner.style.minHeight = `${window.innerHeight}px`;
    inner.style.float = 'left';

    inner.querySelectorAll('.wp-block-image').forEach((child, index) => {
      child.style.width = `80%`;
      child.style.margin = `10%`;
    })
    
    // This was to test the repeating
    // if (index === 4) {
    //   inner.style.backgroundColor = 'red';
    // }
  })
  //set dimensions
  scrollingMap.style.display = 'block';
  scrollingMap.style.width = `${ totalWidth }px`;
  scrollingMap.style.height = `${ allInners[0].offsetHeight * 3 }px`;
  scrollingMap.style.margin = `0`;
  scrollingMap.style.padding = `0`;
  scrollingMap.style.position = `relative`;
  scrollingMap.style.gap = 0;
  scrollingMap.style.left = `-${ totalWidth / 3 - (window.innerWidth - totalWidth / 3) / 2 }px`;
  scrollingMap.style.top = `-${ scrollingMap.offsetHeight / 2 - window.innerHeight / 2 }px`;

  const allImages = scrollingMap.querySelectorAll('figure.wp-block-image');

  let mouseDistanceFromCenter = {x : 0, y: 0};  
  let directions = {x: -1, y: 1}
  const maxSpeed = 5; // max speed of scrolling map in px per frame
  
  mouseMoveHandler = (e) => {
    mouseDistanceFromCenter.x = e.clientX - window.innerWidth / 2;
    mouseDistanceFromCenter.y = e.clientY - window.innerHeight / 2;
    directions.x = mouseDistanceFromCenter.x / (window.innerWidth / 2) * maxSpeed;
    directions.y = mouseDistanceFromCenter.y / (window.innerHeight / 2) * maxSpeed;
  }

  if (!isMobile()) {
    window.addEventListener('mousemove', mouseMoveHandler, false)
  }
  
  let offset = {x: 0, y: 0};
  
  const offsetMax = {
    x: totalWidth / 3 , 
    y: scrollingMap.offsetHeight / 3 
  };
  
  function isFullWidthOut() {
    return {
      x: offset.x >= offsetMax.x || offset.x <= -offsetMax.x,
      y: offset.y >= offsetMax.y || offset.y <= -offsetMax.y
    }
  }
  
  ticker = setInterval(() => {
    
    isFullWidthOut().x ? offset.x = 0 : null; 
    isFullWidthOut().y ? offset.y = 0 : null;

    offset.x = offset.x - directions.x;
    offset.y = offset.y - directions.y;
    
    scrollingMap.style.transform = `translate(${offset.x}px, ${offset.y}px)`;

    allImages.forEach((image, index) => {
      image.style.transform = `rotate(${directions.x}deg)`;
    })
    
  }, 1000 / 60) //ticker frequency
}


let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if ( !isMobile() ) {
      window.removeEventListener('mousemove', mouseMoveHandler, false);
      clearInterval(ticker);
      initPorkGalleryScroll();
    }
  }, 100)
})

window.addEventListener('load', () => {
  initPorkGalleryScroll();  
})

