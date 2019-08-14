webpackHotUpdate("main",{

/***/ "./src/js/modal-madness.js":
/*!*********************************!*\
  !*** ./src/js/modal-madness.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mobileFunctions = __webpack_require__(/*! ./mobile-functions.js */ "./src/js/mobile-functions.js");

var MM = {
  modalLinks: [],
  // Node list
  simpleLinks: [],
  // Array
  collectModals: function collectModals() {
    MM.modalLinks = document.querySelectorAll(".modal-link");
  },
  getAdjacentLinks: function getAdjacentLinks(currentLinkSrc) {
    var prevLink, nextLink, currentIndex;
    currentIndex = MM.simpleLinks.findIndex(function (l) {
      return l.href === currentLinkSrc;
    });
    prevLink = currentIndex - 1 > -1 ? MM.simpleLinks[currentIndex - 1] : false;
    nextLink = currentIndex + 1 < MM.simpleLinks.length ? MM.simpleLinks[currentIndex + 1] : false;
    MM.populateAdjacentLinks(prevLink, nextLink);
  },
  modalMadness: function modalMadness() {
    MM.collectModals();
    MM.modalLinks.forEach(function (link) {
      var modalLink = {
        'href': link.href,
        'title': link.getAttribute("data-title")
      };
      MM.simpleLinks.push(modalLink);
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var title = modalLink.title;
        var href = modalLink.href;
        MM.populateModal(href, title);
      }, false);
    }); // document.addEventListener('click', e => {
    //   if (e.target.parentNode.classList.contains('modal-link')) {
    //     e.preventDefault();
    //     const a = e.target.parentNode;
    //     const title = a.getAttribute("data-title");
    //     const href = a.href;
    //     MM.populateModal(href, title);
    //   }
    // }, false);
    // window.simpleLinks = MM.simpleLinks;
  },
  // adjustImageSizes: () => {
  //   if (!mobileFunctions.isMobile()) {
  //     const images = document.querySelectorAll('.slide-background img')
  //     if (images.length > 0) {
  //       images.forEach(i => {
  //         const imageHeight = i.height;
  //         const imageWidth = i.width;
  //         const windowHeight = window.innerHeight;
  //         if (imageHeight > windowHeight * .75) {
  //           const targetHeight = windowHeight * .75;
  //           const targetWidth = (targetHeight/imageHeight) * imageWidth;
  //           i.style.height = targetHeight + "px";
  //           i.style.width = targetWidth + "px";
  //         }
  //       });
  //     }
  //   }
  // },
  adjustModalHeight: function adjustModalHeight(modalImage) {
    if (!mobileFunctions.isMobile()) {
      var windowHeight = window.innerHeight;
      var modalImageHeight = modalImage.height;
      var modalImageWidth = modalImage.width;
      var modalContent = document.querySelector("#modal-content");
      var modalContentHeight = modalContent.offsetHeight;
      var modalPrev = document.querySelector("#modal-prev");
      var modalNext = document.querySelector("#modal-next");

      if (modalContentHeight > windowHeight) {
        var targetHeight = windowHeight * .8;
        var targetWidth = targetHeight / modalImageHeight * modalImageWidth;
        modalImage.style.height = "auto";
        modalImage.style.width = "auto";
        modalImage.style.height = targetHeight + "px";
        modalImage.style.width = targetWidth + "px";
        modalPrev.style.top = targetHeight / 2 + "px";
        modalNext.style.top = targetHeight / 2 + "px";
      } else {
        modalImage.style.height = "auto";
        modalImage.style.width = "auto";
        modalPrev.style.top = modalContentHeight / 2 + "px";
        modalNext.style.top = modalContentHeight / 2 + "px";
      }

      modalPrev.style.left = '16px';
      modalNext.style.right = '16px';
      console.log('about to getAdjacent');
      MM.getAdjacentLinks(modalImage.src);
    } else {
      var _modalPrev = document.querySelector("#modal-prev");

      var _modalNext = document.querySelector("#modal-next");

      _modalPrev.style.top = '-100px';
      _modalNext.style.top = '-100px';
      modalImage.style.width = "100%"; // MM.getAdjacentLinks(modalImage.src);
    }
  },
  handlePopulateModal: function handlePopulateModal(evt, src, title) {
    evt.preventDefault();
    MM.populateModal(src, title);
  },
  populateModal: function populateModal(imageSrc, titleText) {
    MM.clearModal();
    var modalWindow = document.querySelector('#modal-window');
    var modalImage = document.querySelector('#modal-image');
    var modalText = document.querySelector('#modal-text');
    modalWindow.classList.add('active');
    modalImage.src = imageSrc;
    modalImage.alt = titleText;
    modalText.innerHTML = titleText;
    modalImage.addEventListener("load", function (e) {
      e.preventDefault();
      MM.adjustModalHeight(modalImage);
    });
  },
  populateAdjacentLinks: function populateAdjacentLinks(prevLink, nextLink) {
    var modalPrev = document.querySelector("#modal-prev");
    var modalNext = document.querySelector("#modal-next");

    if (prevLink) {
      var prevLinkSrc = prevLink.href;
      var prevLinkTitle = prevLink.title;
      modalPrev.addEventListener("click", function (e) {
        e.preventDefault(); // console.log('pop modal in prev link')

        MM.populateModal(prevLinkSrc, prevLinkTitle);
      }, false);
    } else {
      modalPrev.style.top = "-100px";
    }

    if (nextLink) {
      var nextLinkSrc = nextLink.href;
      var nextLinkTitle = nextLink.title;
      modalNext.addEventListener("click", function (e) {
        e.preventDefault(); // console.log('pop modal in next link')

        MM.populateModal(nextLinkSrc, nextLinkTitle);
      }, false);
    } else {
      modalNext.style.top = "-100px";
    }
  },
  clearModal: function clearModal() {
    var modalImage = document.querySelector('#modal-image');
    var modalText = document.querySelector('#modal-text'); // const prevLink = document.querySelector("#modal-prev");
    // const nextLink = document.querySelector("#modal-next");

    modalImage.alt = "";
    modalImage.src = "";
    modalText.innerHTML = "";
    modalImage.style = "";
  },
  closeModal: function closeModal() {
    var modalWindow = document.querySelector("#modal-window");
    var modalClose = document.querySelector("#modal-close");

    if (modalClose) {
      modalClose.addEventListener("click", function (e) {
        e.preventDefault();
        modalWindow.classList.remove("active");
        MM.clearModal();
      });
    }
  },
  modalInit: function modalInit() {
    MM.modalMadness();
    MM.closeModal();
  } // ensure popup images shrink if window does
  // watchResize: () => {
  //   window.addEventListener('resize', () => {
  //     MM.adjustImageSizes();
  //   })
  // }
  // END POPUPS & GALLERIES

};
module.exports = MM;

/***/ })

})
//# sourceMappingURL=main.990f520eb90c3181ed58.hot-update.js.map