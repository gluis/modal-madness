const mobileFunctions = require('./mobile-functions.js');

const MM = {

      modalLinks: [], // Node list
      simpleLinks: [], // Array
      prevLink: '',
      nextLink: '',
      currentModalImage: '',
      initialX: null,
      touchListening: false,
      touchDirection: 0,


      adjustModalHeight: () => {

        if (!mobileFunctions.isMobile()) {
          const windowHeight = window.innerHeight;
          const windowWidth = window.innerWidth;

          const modalImageHeight = MM.currentModalImage.height;
          const modalImageWidth = MM.currentModalImage.width;

          const modalContent = document.querySelector("#modal-content");
          const modalContentHeight = modalContent.offsetHeight;
          const modalPrev = document.querySelector("#modal-prev");
          const modalNext = document.querySelector("#modal-next");

          MM.currentModalImage.style.height = (modalImageHeight * .9) + "px";
          // MM.currentModalImage.style.width = (modalImageWidth * .8) + "px";


          if (modalContentHeight > windowHeight) {
            const targetHeight = windowHeight * .8;
            const targetWidth = (targetHeight/modalImageHeight) * modalImageWidth;

            MM.currentModalImage.style.height = targetHeight + "px";
            MM.currentModalImage.style.width = targetWidth + "px";

            modalPrev.style.top = targetHeight/2 + "px";
            modalNext.style.top = targetHeight/2 + "px";
          } else if (modalImageWidth > windowWidth) {
            const targetWidth = windowWidth * .8;
            const targetHeight = (targetWidth/modalImageWidth) * modalImageHeight;

            MM.currentModalImage.style.height = targetHeight + "px";
            MM.currentModalImage.style.width = targetWidth + "px";

            modalPrev.style.top = targetHeight/2 + "px";
            modalNext.style.top = targetHeight/2 + "px";

          } else {            
            modalPrev.style.top = modalContentHeight/2 + "px";
            modalNext.style.top = modalContentHeight/2 + "px";
          } 
          modalPrev.style.left = '16px';      
          modalNext.style.right = '16px';      
        } else {
          const modalPrev = document.querySelector("#modal-prev");
          const modalNext = document.querySelector("#modal-next");
          modalPrev.style.top = '-100px';
          modalNext.style.top = '-100px';
          MM.currentModalImage.style.width = "100%";
        }

      },

      adjustModalImageSize: () => {
        if (!mobileFunctions.isMobile()) {
          console.log('adjusting modal image?')
          // implement

        }

        //   const images = document.querySelectorAll('.slide-background img')

        //   if (images.length > 0) {
        //     images.forEach(i => {
        //       const imageHeight = i.height;
        //       const imageWidth = i.width;

        //       const windowHeight = window.innerHeight;
        //       if (imageHeight > windowHeight * .75) {
        //         const targetHeight = windowHeight * .75;
        //         const targetWidth = (targetHeight/imageHeight) * imageWidth;
        //         i.style.height = targetHeight + "px";
        //         i.style.width = targetWidth + "px";
        //       }
        //     });
        //   }
        // }
      },

      afterModalLoaded: () => {
        event.preventDefault()
        MM.adjustModalHeight()
        MM.getAdjacentLinks()
        if (!MM.touchListening) {
          MM.touchSetup()
        }
      },

      cleanUp: () => {
        const modalWindow = document.querySelector("#modal-window");
        modalWindow.classList.remove("active");
        MM.clearModal();
        MM.currentModalImage = '';
        MM.prevLink = '';
        MM.nextLink = '';
        MM.initialX = null;
        MM.touchListening = false;
        MM.touchDirection = 0;
      },

      clearModal: () => {
        const modalText = document.querySelector('#modal-text');
        const modalPrev = document.querySelector("#modal-prev");
        const modalNext = document.querySelector("#modal-next");

        modalNext.removeEventListener("click", MM.handlePopulateModal);
        modalPrev.removeEventListener("click", MM.handlePopulateModal);

        MM.currentModalImage.alt = "";
        MM.currentModalImage.src = "";
        MM.currentModalImage.style = "";

        modalText.innerHTML = "";
      },

      closeModal: () => {
        const modalClose = document.querySelector("#modal-close");
        if (modalClose) {
          modalClose.addEventListener("click", e => {
            e.preventDefault();
            MM.cleanUp();
          });
        }
      },

      collectModals: () => {
        MM.modalLinks = document.querySelectorAll(".modal-link");
      },

      getAdjacentLinks: () => {
        let currentIndex;
        currentIndex = MM.simpleLinks.findIndex(l => { return l.href === MM.currentModalImage.src });
        MM.prevLink = (currentIndex - 1) > -1 ? MM.simpleLinks[currentIndex - 1] : false;
        MM.nextLink = (currentIndex + 1) < MM.simpleLinks.length ? MM.simpleLinks[currentIndex + 1] : false;

        MM.populateAdjacentLinks();
      },

      handlePopulateModal: () => {
        event.preventDefault();
        if (event.target.id === 'modal-prev') {
          MM.populateModal(MM.prevLink.href, MM.prevLink.title);
        } else {
          MM.populateModal(MM.nextLink.href, MM.nextLink.title);
        }
      },

      modalMadness: () => {
        MM.collectModals();
        MM.modalLinks.forEach(link => {
          const modalLink = {'href': link.href, 'title': link.getAttribute("data-title")};
          MM.simpleLinks.push(modalLink);
          
          link.addEventListener('click', e => {
            e.preventDefault()
            const title = modalLink.title
            const href = modalLink.href;
            MM.populateModal(href, title);
          }, true );
        });
        MM.watchResize();
      },

      populateAdjacentLinks: () => {
        const modalPrev = document.querySelector("#modal-prev");
        const modalNext = document.querySelector("#modal-next");
        if (MM.prevLink) {
          modalPrev.addEventListener("click", MM.handlePopulateModal, true);
        } else {
          modalPrev.style.top = "-100px";
        }
        if (MM.nextLink) {
          modalNext.addEventListener("click", MM.handlePopulateModal, true);
        } else {
          modalNext.style.top = "-100px";
        }
        MM.currentModalImage.removeEventListener("load", MM.afterModalLoaded)
      },
      
      populateModal: (imageSrc, titleText) => {
        MM.clearModal();
        const modalWindow = document.querySelector('#modal-window');
        MM.currentModalImage = document.querySelector('#modal-image');
        const modalText = document.querySelector('#modal-text');

        modalWindow.classList.add('active');

        MM.currentModalImage.src = imageSrc;
        MM.currentModalImage.alt = titleText;

        modalText.innerHTML = titleText;
        MM.fadeIn(MM.currentModalImage);

        MM.currentModalImage.addEventListener("load", MM.afterModalLoaded, true);
      },

      // TOUCH ADDITIONS
      touchHandleCancel: () => {
        event.preventDefault()
      },

      touchHandleEnd: () => {
        event.preventDefault()

        if (MM.touchDirection > 0) {
          MM.touchHandleSwipeRight();          
        } else if (MM.touchDirection < 0) {
          MM.touchHandleSwipeLeft();
        } 
      },
      
      touchHandleMove: () => {
        event.preventDefault()
        if (MM.initialX === null) {
          return
        }
        let currentX = event.touches[0].clientX;
        let diffX = MM.initialX - currentX;

        if (diffX > 0) {
          MM.touchDirection = 1
        } else if (diffX < 0) {
          MM.touchDirection = -1
        } else if (diffX === 0) {
          return;
        }
      },

      touchHandleStart: () => {
        event.preventDefault()
        MM.initialX = event.touches[0].clientX;        
      },

      touchHandleSwipeLeft: () => {
        if (MM.prevLink) {
          MM.populateModal(MM.prevLink.href, MM.prevLink.title);
        }
      },

      touchHandleSwipeRight: () => {
        if (MM.nextLink) {
          MM.populateModal(MM.nextLink.href, MM.nextLink.title);
        }
      },

      touchSetup: () => {
        MM.currentModalImage.addEventListener('touchstart', MM.touchHandleStart, false)
        MM.currentModalImage.addEventListener('touchmove', MM.touchHandleMove, false)
        MM.currentModalImage.addEventListener('touchcancel', MM.touchHandleCancel, false)
        MM.currentModalImage.addEventListener('touchend', MM.touchHandleEnd, false)
        MM.touchListening = true;
      },

      // END TOUCH ADDITIONS

      // ANIMATION
      fadeIn: (element) => {
        element.style.opacity = 0;
        let start = Date.now();
        let fadeUp = setInterval(() => {
          let milliseconds = Date.now() - start
          if (milliseconds >= 2000 || element.style.opacity > 1) {
            clearInterval(fadeUp);
            return;
          } 
          element.style.opacity = parseFloat(element.style.opacity) + 0.01;
        })
      },
      // END ANIMATION

      // ensure popup images shrink if window does
      watchResize: () => {
        window.addEventListener('resize', () => {
          if (MM.currentModalImage) {
            MM.adjustModalImageSize();
          }
        })
      },

      modalInit: () => {
        MM.modalMadness();
        MM.closeModal();
      }


}


module.exports = MM;
