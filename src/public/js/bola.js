class Bola {
  constructor(sliderQuery, configs) {
    this.sliderElement = document.querySelector(`${sliderQuery}`);
    this.configs = configs;
    this.initSlider();
  }

  initSlider() {
    this.loadElement();

    this.sliderNavs = this.sliderElement.querySelectorAll(":scope >.slider-nav");
    this.sliderIndicatorsWrapper = this.sliderElement.querySelector(":scope >.slider-indicators");
    this.sliderIndicators = this.sliderIndicatorsWrapper ? this.sliderIndicatorsWrapper.querySelectorAll('.slider-indicator') : [];

    this.isNoPlay = this.sliderElement.classList.contains("slider-nav-nodelay");
    this.autoPlay = this.sliderElement.classList.contains("slider-nav-autoplay");
    this.autoPause = this.sliderElement.classList.contains("slider-nav-autopause");
    this.isVerticalMode = this.sliderElement.classList.contains("slide-mode-vertical");

    this.effect = this.configs.effect ? this.configs.effect : 'slide';
    this.ratio = this.configs.ratio ? parseFloat(this.configs.ratio) : 1;
    this.timeout = this.configs.timeout ? this.configs.timeout : 2500;
    this.isResize = this.configs.isResize ? this.configs.isResize : false;
    this.slidesPerGroup = this.configs.slidesPerGroup ? this.configs.slidesPerGroup : 1;
    this.slidesPerView = this.configs.slidesPerView ? this.configs.slidesPerView : 1;
    if (this.effect === "fade") {
      this.slidesPerGroup = 1;
      this.slidesPerView = 1;
    }


    this.startSlideItemIndex = 0;
    this.endSlideItemIndex = this.startSlideItemIndex + this.slidesPerView;

    this.activeSlideIndex = 0;

    if (this.configs.isResize) this.resize();

    if (this.effect === "fade" && this.slides.length > 0) {
      this.slides[0].classList.add("is-active");
    }

    this.sliderNavs.forEach(navElement => {
      let next = navElement.classList.contains("slider-nav-next");
      navElement.addEventListener("click", () => this.slide(next), {passive: true});
    })

    this.sliderIndicators.forEach(indicatorElement => {
      indicatorElement.addEventListener("click", this.slideToByIndicator.bind(this));
    })

    if (this.autoPlay) {
      this.handleAutoPlay(this.sliderElement, this.autoPause);
    }
    if (["slider-nav-autohide", "slider-nav-animation"].some(className => this.sliderElement.classList.contains(className))) {
      const threshold = this.sliderElement.getAttribute("data-slider-nav-animation-threshold") ? this.sliderElement.getAttribute("data-slider-nav-animation-threshold") : 0.3;
      this.setVisibleSlides(threshold);
    }

    this.sliderElement.addEventListener("maximize:swiffy-slider:slide", () => {
      this.handleIndicators();
    })
  }

  setVisibleSlides(threshold = 0.3) {
    let observer = new IntersectionObserver(slides => {
      slides.forEach(slide => {
        slide.isIntersecting ? slide.target.classList.add("slide-visible") : slide.target.classList.remove("slide-visible");
      });
      this.sliderElement.querySelector(".slider-container>*:first-child").classList.contains("slide-visible") ? this.sliderElement.classList.add("slider-item-first-visible") : this.sliderElement.classList.remove("slider-item-first-visible");
      this.sliderElement.querySelector(".slider-container>*:last-child").classList.contains("slide-visible") ? this.sliderElement.classList.add("slider-item-last-visible") : this.sliderElement.classList.remove("slider-item-last-visible");
    }, {
      root: this.sliderElement.querySelector(".slider-container"),
      threshold: threshold
    });
    for (let slide of this.sliderElement.querySelectorAll(".slider-container>*"))
      observer.observe(slide);
  }

  slide(next = true) {
    this.loadElement();

    const slidesCount = this.slides.length;
    const oldStartSlideItemIndex = this.startSlideItemIndex;
    const oldEndSlideItemIndex = this.endSlideItemIndex;
    console.log('this.slidesPerGroup: ', this.slidesPerGroup)
    let newStartSlideItem = next
      ? (oldStartSlideItemIndex + this.slidesPerGroup) % slidesCount
      : (oldStartSlideItemIndex - this.slidesPerGroup + slidesCount) % slidesCount;

    let newEndSlideItem = next
      ? (oldEndSlideItemIndex + this.slidesPerGroup) % slidesCount
      : (oldEndSlideItemIndex - this.slidesPerGroup + slidesCount) % slidesCount;


    if (this.effect !== "fade") {
      this.slideToVer2(newStartSlideItem);
    }

    console.log('newStartSlideItem: ', newStartSlideItem)
    console.log('newEndSlideItem: ', newEndSlideItem)
    this.updateActiveSlide(newStartSlideItem, newEndSlideItem)

    this.startSlideItemIndex = newStartSlideItem;
    this.endSlideItemIndex = newEndSlideItem;
  }

  slideToByIndicator(event) {
    const indicator = event.target;
    const oldActiveSlideIndex = this.activeSlideIndex;
    const indicatorIndex = Array.from(this.sliderIndicators).indexOf(indicator);
    const indicatorCount = this.sliderIndicators.length;
    const slideCount = this.slides.length;

    const newActiveSlideIndex = Math.floor((slideCount / indicatorCount) * indicatorIndex);

    this.updateSlide(newActiveSlideIndex, oldActiveSlideIndex);
  }

  slideToVer2(numberStep) {
    const gap = parseInt(window.getComputedStyle(this.container)[this.isVerticalMode ? 'rowGap' : 'columnGap']) || 0;
    const scrollStep = (this.isVerticalMode ? this.slides[0].offsetHeight : this.slides[0].offsetWidth) + gap;

    const scrollOptions = {
      behavior: this.isNoPlay ? "auto" : "smooth",
      [this.isVerticalMode ? 'top' : 'left']: scrollStep * numberStep
    };

    this.container.scroll(scrollOptions);
  }

  updateSlide(newStartSlideItem, newEndSlideItem) {
    if (this.effect === "fade") {
      this.updateActiveSlide(newStartSlideItem, newEndSlideItem);
    } else {
      this.slideToVer2(newStartSlideItem);
    }

    // this.dispatchEventSlide(oldIndex);
  }

  slideTo(slideIndex) {
    this.loadElement();

    const gap = parseInt(window.getComputedStyle(this.container)[this.isVerticalMode ? 'rowGap' : 'columnGap']) || 0;
    const scrollStep = (this.isVerticalMode ? this.slides[0].offsetHeight : this.slides[0].offsetWidth) + gap;

    const scrollOptions = {
      behavior: this.isNoPlay ? "auto" : "smooth",
      [this.isVerticalMode ? 'top' : 'left']: scrollStep * slideIndex
    };

    this.container.scroll(scrollOptions);

    this.updateActiveSlide(slideIndex);
  }

  handleIndicators() {
    if (!this.sliderElement) return;
    this.loadElement();

    this.sliderIndicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", this.activeSlideIndex === index);
    });
  }

  handleAutoPlay() {
    let autoplayTimer = setInterval(() => this.slide(true), this.timeout);
    const autoPlayer = () => this.handleAutoPlay(this.sliderElement);
    if (this.autoPause) {
      ["mouseover", "touchstart"].forEach(function (event) {
        this.sliderElement.addEventListener(event, function () {
          window.clearTimeout(autoplayTimer);
        }, {once: true, passive: true});
      });
      ["mouseout", "touchend"].forEach(function (event) {
        this.sliderElement.addEventListener(event, function () {
          autoPlayer();
        }, {once: true, passive: true});
      });
    }
    return autoplayTimer;
  }

  resize() {
    const width = this.sliderElement.offsetWidth;
    const height = width * this.ratio;
    this.sliderElement.style.height = height + 'px';
  }

  loadElement() {
    this.container = this.sliderElement.querySelector(":scope >.slider-container");
    this.slides = this.container.querySelectorAll(":scope >.slide-item");
  }

  updateActiveSlide(newStartSlideItem, newEndSlideItem) {
    this.slides.forEach((slide, index) => {
      if (index >= newStartSlideItem && index <= newEndSlideItem) {
        slide.classList.add('is-active');
      } else {
        slide.classList.remove('is-active');
      }
    })
  }

  dispatchEventSlide(oldActiveSlideIndex) {
    this.sliderElement.dispatchEvent(
      new CustomEvent(`maximize:swiffy-slider:slide`, {
        bubbles: true,
        detail: {
          oldActiveSlideIndex: oldActiveSlideIndex,
          newActiveSlideIndex: this.activeSlideIndex
        },
      }),
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let slider = new Bola('.bola-slider-wrapper', {
    effect: 'slide',
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    slidesPerView: 4,
    slidesPerGroup: 4,
    breakpoints: {
      768: {
        slidesPerView: 6,
        slidesPerGroup: 5
      },
    },
  })
})

