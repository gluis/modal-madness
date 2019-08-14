const mobileFunctions = require('./mobile-functions.js');

const MM = {

      modalLinks: [], // Node list
      simpleLinks: [], // Array

      collectModals: () => {
        MM.modalLinks = document.querySelectorAll(".modal-link");
      },

      getAdjacentLinks: (currentLinkSrc) => {
        let prevLink, nextLink, currentIndex;
        currentIndex = MM.simpleLinks.findIndex(l => { return l.href === currentLinkSrc });
        prevLink = (currentIndex - 1) > -1 ? MM.simpleLinks[currentIndex - 1] : false;
        nextLink = (currentIndex + 1) < MM.simpleLinks.length ? MM.simpleLinks[currentIndex + 1] : false;

        MM.populateAdjacentLinks(prevLink, nextLink);
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
          }, {once: true});
        });
        // document.addEventListener('click', e => {
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

      adjustModalHeight: (modalImage) => {
        if (!mobileFunctions.isMobile()) {
          const windowHeight = window.innerHeight;
          const modalImageHeight = modalImage.height;
          const modalImageWidth = modalImage.width;
          const modalContent = document.querySelector("#modal-content");
          const modalContentHeight = modalContent.offsetHeight;
          const modalPrev = document.querySelector("#modal-prev");
          const modalNext = document.querySelector("#modal-next");

          if (modalContentHeight > windowHeight) {
            const targetHeight = windowHeight * .8;
            const targetWidth = (targetHeight/modalImageHeight) * modalImageWidth;

            modalImage.style.height = "auto";
            modalImage.style.width = "auto";

            modalImage.style.height = targetHeight + "px";
            modalImage.style.width = targetWidth + "px";

            modalPrev.style.top = targetHeight/2 + "px";
            modalNext.style.top = targetHeight/2 + "px";
          } else {            
            modalImage.style.height = "auto";
            modalImage.style.width = "auto";
            modalPrev.style.top = modalContentHeight/2 + "px";
            modalNext.style.top = modalContentHeight/2 + "px";
          } 
          modalPrev.style.left = '16px';      
          modalNext.style.right = '16px';      

          MM.getAdjacentLinks(modalImage.src);

        } else {
          const modalPrev = document.querySelector("#modal-prev");
          const modalNext = document.querySelector("#modal-next");
          modalPrev.style.top = '-100px';
          modalNext.style.top = '-100px';
          modalImage.style.width = "100%";
          MM.getAdjacentLinks(modalImage.src);
        }
      },

      handlePopulateModal: (evt, src, title) => {
        evt.preventDefault();
        MM.populateModal(src, title);
      },

      populateModal: (imageSrc, titleText) => {
        console.log('populateModal');
        MM.clearModal();
        const modalWindow = document.querySelector('#modal-window');
        const modalImage = document.querySelector('#modal-image');
        const modalText = document.querySelector('#modal-text');

        modalWindow.classList.add('active');
        modalImage.src = imageSrc;
        modalImage.alt = titleText;
        modalText.innerHTML = titleText;
          console.log('about to adjustModalHeight');
          MM.adjustModalHeight(modalImage);

        modalImage.addEventListener("load", (e) => {
          e.preventDefault();
          // console.log('about to adjustModalHeight');
          // MM.adjustModalHeight(modalImage);
        }, {once: true });
      },

      populateAdjacentLinks: (prevLink, nextLink) => {
            console.log('inside populateAdjacentLinks')

        const modalPrev = document.querySelector("#modal-prev");
        const modalNext = document.querySelector("#modal-next");
        if (prevLink) {
          const prevLinkSrc = prevLink.href;
          const prevLinkTitle = prevLink.title;
          modalPrev.addEventListener("click", e => {
            e.preventDefault();
            MM.populateModal(prevLinkSrc, prevLinkTitle);
          }, {once: true});
        } else {
          modalPrev.style.top = "-100px";
        }
        if (nextLink) {
          const nextLinkSrc = nextLink.href;
          const nextLinkTitle = nextLink.title;
          modalNext.addEventListener("click", e => {
            e.preventDefault();
            // console.log('pop modal in next link')
            MM.populateModal(nextLinkSrc, nextLinkTitle);
          }, {once: true});
        } else {
          modalNext.style.top = "-100px";
        }
      },

      clearModal: () => {
        const modalImage = document.querySelector('#modal-image');
        const modalText = document.querySelector('#modal-text');
        // const prevLink = document.querySelector("#modal-prev");
        // const nextLink = document.querySelector("#modal-next");
        modalImage.alt = "";
        modalImage.src = "";
        modalText.innerHTML = "";
        modalImage.style = "";
      },

      closeModal: () => {
        const modalWindow = document.querySelector("#modal-window");
        const modalClose = document.querySelector("#modal-close");
        if (modalClose) {
          modalClose.addEventListener("click", e => {
            e.preventDefault();
            modalWindow.classList.remove("active");
            MM.clearModal();
          });
        }
      },

      modalInit: () => {
        MM.modalMadness();
        MM.closeModal();
      },


      // ensure popup images shrink if window does
      // watchResize: () => {
      //   window.addEventListener('resize', () => {
      //     MM.adjustImageSizes();
      //   })
      // }
    // END POPUPS & GALLERIES
}


module.exports = MM;
