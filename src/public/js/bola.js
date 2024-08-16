class SliderInstance {
  constructor(wrapperEl, params) {
    this.wrapperEl = wrapperEl;
    this.initData(params);
    this.addEventListenerSlide();
  }

  initData(params) {
    this.spaceBefore = params.spaceBefore;
    this.nextEl = this.wrapperEl.querySelector(`:scope > ${params.navigation && params.navigation.nextEl ? params.navigation.nextEl : '.bola-slider-button__next'}`);
    this.prevEl = this.wrapperEl.querySelector(`:scope > ${params.navigation && params.navigation.prevEl ? params.navigation.prevEl : '.bola-slider-button__prev'}`);
    this.sliderContainer = this.wrapperEl.querySelector(":scope > .bola-slider-container");
    this.slideItems = this.sliderContainer.querySelectorAll(":scope > .bola-slide");

    this.firstSlideShowIndex = 0;
    this.lastSlideShowIndex = params.slidesPerView - 1;

    this.slidesPerView = params.slidesPerView;
    this.slidesPerGroup = params.slidesPerGroup;
    this.effect = this.wrapperEl.dataset.effect ? this.wrapperEl.dataset.effect : "default";
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
    if (!this.nextEl.classList.contains("enabled")) {
      return;
    }

    this.handleButton(true);
  }

  handlePrevious() {
    if (!this.prevEl.classList.contains("enabled")) {
      return;
    }

    this.handleButton(false);
  }

  handleButton (isNext = true) {
    switch (this.effect) {
      case "fade":
        this.fade(isNext);
        break;
      default:
        this.slide(isNext);
        break;
    }
  }

  slide(isNext = true) {
    const newFirstSlideShowIndex = this.firstSlideShowIndex + this.slidesPerGroup * (isNext ? 1 : -1);
    const lastSlideShowIndex = this.lastSlideShowIndex + this.slidesPerGroup * (isNext ? 1 : -1);

    // if (lastSlideShowIndex !== this.slideItems.length + 1) {
    if (this.slideItems[newFirstSlideShowIndex]) {
      const targetRect = this.slideItems[newFirstSlideShowIndex].getBoundingClientRect();
      const containerRect = this.sliderContainer.getBoundingClientRect();
      let scrollOffset = targetRect.left - containerRect.left;

      this.sliderContainer.style.transform = `translateX(${scrollOffset * -1}px)`;
      this.firstSlideShowIndex = newFirstSlideShowIndex;
      this.lastSlideShowIndex = lastSlideShowIndex;
    }
    // }

    this.prevEl.classList[this.firstSlideShowIndex === 0 ? 'remove' : 'add']('enabled');
    this.nextEl.classList[this.lastSlideShowIndex === this.slideItems.length - 1 ? 'remove' : 'add']('enabled');
  }

  fade(isNext = true) {
    let newFirstSlideShowIndex;
    if (isNext) {
      newFirstSlideShowIndex = this.firstSlideShowIndex + 1;
    } else {
      newFirstSlideShowIndex = this.firstSlideShowIndex - 1;
    }

    if (this.slideItems[newFirstSlideShowIndex]) {
      this.slideItems[this.firstSlideShowIndex]?.classList.remove('is-active');
      this.slideItems[newFirstSlideShowIndex]?.classList.add('is-active');
      this.firstSlideShowIndex = newFirstSlideShowIndex;


      this.prevEl.classList[this.firstSlideShowIndex === 0 ? 'remove' : 'add']('enabled');
      this.nextEl.classList[this.firstSlideShowIndex === this.slideItems.length - 1 ? 'remove' : 'add']('enabled');
    }
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
