class SliderInstance {
  constructor(wrapperEl, params) {
    this.wrapperEl = wrapperEl;
    this.initData(params);
    this.addEventListenerSlide();
  }

  initData(params) {
    this.spaceBefore = params.spaceBefore;
    this.nextEl = this.wrapperEl.querySelector(params.navigation && params.navigation.nextEl ? params.navigation.nextEl : '.bola-slider-button__next');
    this.prevEl = this.wrapperEl.querySelector(params.navigation && params.navigation.prevEl ? params.navigation.prevEl : '.bola-slider-button__prev');
    this.sliderContainer = this.wrapperEl.querySelector(".bola-slider-container");
    this.slideItems = this.wrapperEl.querySelectorAll(".bola-slide");

    this.firstSlideShowIndex = 0;
    this.lastSlideShowIndex = params.slidesPerView - 1;

    this.sliderWrapperWidth = this.wrapperEl?.offsetWidth ? this.wrapperEl.offsetWidth : 0;
    this.slideWidth = this.slideItems[0].offsetWidth ? this.slideItems[0].offsetWidth : 0;
    this.totalSlides = this.slideItems.length;

    this.slidesPerView = params.slidesPerView;
    this.slidesPerGroup = params.slidesPerGroup;
    this.noLoop = params.noLoop;
  }

  addEventListenerSlide() {
    if (this.nextEl) {
      this.nextEl.addEventListener("click", this.handleNext.bind(this));
    }
    if (this.prevEl) {
      this.prevEl.addEventListener("click", this.handlePrevious.bind(this));
    }
    // if (this.sliderContainer) {
    //   this.sliderContainer.addEventListener("drag", (e) => e.preventDefault());
    //   this.sliderContainer.addEventListener("touchstart", this.handleTouchStart.bind(this));
    //   this.sliderContainer.addEventListener("touchend", this.handleTouchEnd.bind(this));
    //   this.sliderContainer.addEventListener("touchmove", this.handleTouchMove.bind(this));
    // }
  }

  handleNext() {
    // if (!this.nextEl.classList.contains("enabled")) {
    //   return;
    // }

    this.slide(true);
  }

  handlePrevious() {
    // if (!this.prevEl.classList.contains("enabled")) {
    //   return;
    // }
    this.slide(false);
  }

  slide(isNext = true) {
    const gapWidth = parseInt(window.getComputedStyle(this.sliderContainer).columnGap);

    const newFirstSlideShowIndex = this.firstSlideShowIndex + this.slidesPerGroup * (isNext ? 1 : -1);
    const lastSlideShowIndex = this.lastSlideShowIndex + this.slidesPerGroup * (isNext ? 1 : -1);

    if (lastSlideShowIndex !== this.slideItems.length + 1) {
      if (this.slideItems[newFirstSlideShowIndex]) {
        const targetRect = this.slideItems[newFirstSlideShowIndex].getBoundingClientRect();
        const containerRect = this.sliderContainer.getBoundingClientRect();
        let scrollOffset = targetRect.left - containerRect.left;

        this.sliderContainer.style.transform = `translateX(${scrollOffset * -1}px)`;
        this.firstSlideShowIndex = newFirstSlideShowIndex;
        this.lastSlideShowIndex = lastSlideShowIndex;
      }
    }

    this.prevEl.classList[this.firstSlideShowIndex === 0 ? 'remove' : 'add']('enabled');
    this.nextEl.classList[this.lastSlideShowIndex === this.slideItems.length - 1 ? 'remove' : 'add']('enabled');
  }
}

class Slider {
  constructor() {
    let _len = arguments.length;
    let args = {};
    for (let i = 0; i < _len; i++) {
      args[i] = arguments[i];
    }

    let sliderWrapper = args[0];
    let params = args[1];

    if (!params) params = {};

    if (sliderWrapper) {
      document.querySelectorAll(sliderWrapper).forEach((wrapperEl) => {
        new SliderInstance(wrapperEl, params);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let slider = new Slider('.bola-slider-wrapper', {
    spaceBetween: 30,

    navigation: {
      nextEl: ".bola-slider-button__next",
      prevEl: ".bola-slider-button__prev"
    },
    slidesPerView: 2,
    slidesPerGroup: 1,
    noLoop: true
  })
})
