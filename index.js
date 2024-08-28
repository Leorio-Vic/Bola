class Slider {
  constructor() {
    let sliderWrapper;
    let params;
    let _len = arguments.length;
    if (_len > 0) this.sliderWrapper = arguments[0];
    let args = {};
    for (let  i = 0; i < _len; i++) {
      args[i] = arguments[i];
    }
    console.log('args[0]: ', args)
    if (_len === 1 && args[0].constructor && typeof args[0] === 'object') {
      params = args[0];
    } else {
      sliderWrapper = args[0];
      params = args[1];
      // [sliderWrapper, params] = args;
    }

    if (!params) params = {};

    if (sliderWrapper) {
      document.querySelectorAll(sliderWrapper).forEach((containerEl) => {
        new SliderInstance(containerEl, params);
      });
    }
  }
}

class SliderInstance extends HTMLElement {
  constructor(containerEl, params) {
    super();

    this.containerEl = containerEl;
    this.init(params);
  }

  init(params) {
    this.spaceBefore = params.spaceBefore;
    this.nextEl = this.containerEl.querySelector(params.navigation && params.navigation.nextEl ? params.navigation.nextEl : ':scope >.swiper-button-next');
    this.prevEl = this.containerEl.querySelector(params.navigation && params.navigation.prevEl ? params.navigation.prevEl : ':scope >.swiper-button-prev');
    this.slidesPerView = params.slidesPerView;
    this.slidesPerView = params.slidesPerView;
  }
}

let slider = new Slider('.bola-slider-wrapper', {
  spaceBetween: 30,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  slidesPerView: 3,
  slidesPerGroup: 2,
  breakpoints: {
    768: {
      slidesPerView: 6,
      slidesPerGroup: 5
    },
  },
})
