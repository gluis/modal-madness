(function (window) {
  'use strict'

  function modalMadness() {

    const mobileFunctions = require('./mobile-functions.js')

    const MM = {}

    let modalLinks = [] // Node list
    let simpleLinks = [] // Array
    let prevLink = ''
    let nextLink = ''
    let currentModalImage = ''
    let touchListening = false
    let touchDirection = 0
    let touchVerticalScroll = false


    const adjustModalHeight = () => {

      if (!mobileFunctions.isMobile()) {
        const windowHeight = window.innerHeight
        const windowWidth = window.innerWidth

        const modalImageHeight = currentModalImage.height
        const modalImageWidth = currentModalImage.width

        const modalContent = document.querySelector("#modal-content")
        const modalContentHeight = modalContent.offsetHeight
        const modalPrev = document.querySelector("#modal-prev")
        const modalNext = document.querySelector("#modal-next")

        currentModalImage.style.height = (modalImageHeight * .9) + "px"
        // MM.currentModalImage.style.width = (modalImageWidth * .8) + "px"


        if (modalContentHeight > windowHeight) {
          const targetHeight = windowHeight * .8
          const targetWidth = (targetHeight / modalImageHeight) * modalImageWidth

          currentModalImage.style.height = targetHeight + "px"
          currentModalImage.style.width = targetWidth + "px"

          modalPrev.style.top = targetHeight / 2 + "px"
          modalNext.style.top = targetHeight / 2 + "px"
        } else if (modalImageWidth > windowWidth) {
          const targetWidth = windowWidth * .8
          const targetHeight = (targetWidth / modalImageWidth) * modalImageHeight

          currentModalImage.style.height = targetHeight + "px"
          currentModalImage.style.width = targetWidth + "px"

          modalPrev.style.top = targetHeight / 2 + "px"
          modalNext.style.top = targetHeight / 2 + "px"

        } else {
          modalPrev.style.top = modalContentHeight / 2 + "px"
          modalNext.style.top = modalContentHeight / 2 + "px"
        }
        modalPrev.style.left = '16px'
        modalNext.style.right = '16px'
      } else {
        const modalPrev = document.querySelector("#modal-prev")
        const modalNext = document.querySelector("#modal-next")
        modalPrev.style.top = '-100px'
        modalNext.style.top = '-100px'
        currentModalImage.style.width = "100%"
      }

    }

    const adjustModalImageSize = () => {
      if (!mobileFunctions.isMobile()) {
        // console.log('adjusting modal image?')
        // implement

      }

      //   const images = document.querySelectorAll('.slide-background img')

      //   if (images.length > 0) {
      //     images.forEach(i => {
      //       const imageHeight = i.height
      //       const imageWidth = i.width

      //       const windowHeight = window.innerHeight
      //       if (imageHeight > windowHeight * .75) {
      //         const targetHeight = windowHeight * .75
      //         const targetWidth = (targetHeight/imageHeight) * imageWidth
      //         i.style.height = targetHeight + "px"
      //         i.style.width = targetWidth + "px"
      //       }
      //     })
      //   }
      // }
    }

    const afterModalLoaded = () => {
      event.preventDefault()
      adjustModalHeight()
      getAdjacentLinks()
      if (!touchListening) {
        touchSetup()
      }
    }

    const cleanUp = () => {
      const modalWindow = document.querySelector("#modal-window")
      modalWindow.classList.remove("active")
      clearModal()
      currentModalImage = ''
      prevLink = ''
      nextLink = ''
      touchListening = false
    }

    const clearModal = () => {
      const modalText = document.querySelector('#modal-text')
      const modalPrev = document.querySelector("#modal-prev")
      const modalNext = document.querySelector("#modal-next")

      modalNext.removeEventListener("click", handlePopulateModal)
      modalPrev.removeEventListener("click", handlePopulateModal)

      currentModalImage.alt = ""
      currentModalImage.src = ""
      currentModalImage.style = ""

      modalText.innerHTML = ""
    }

    const closeModal = () => {
      const modalClose = document.querySelector("#modal-close")
      if (modalClose) {
        modalClose.addEventListener("click", e => {
          e.preventDefault()
          cleanUp()
        })
      }
    }

    const collectModals = () => {
      modalLinks = document.querySelectorAll(".modal-link")
    }

    const getAdjacentLinks = () => {
      let currentIndex
      currentIndex = simpleLinks.findIndex(l => {
        return l.href === currentModalImage.src
      })
      prevLink = (currentIndex - 1) > -1 ? simpleLinks[currentIndex - 1] : false
      nextLink = (currentIndex + 1) < simpleLinks.length ? simpleLinks[currentIndex + 1] : false

      populateAdjacentLinks()
    }

    const handlePopulateModal = () => {
      event.preventDefault()
      if (event.target.id === 'modal-prev') {
        populateModal(prevLink.href, prevLink.title)
      } else {
        populateModal(nextLink.href, nextLink.title)
      }
    }

    const modalMadness = () => {
      collectModals()
      modalLinks.forEach(link => {
        const modalLink = {
          'href': link.href,
          'title': link.getAttribute("data-title")
        }
        simpleLinks.push(modalLink)

        link.addEventListener('click', e => {
          e.preventDefault()
          const title = modalLink.title
          const href = modalLink.href
          populateModal(href, title)
        }, true)
      })
      watchResize()
    }

    const populateAdjacentLinks = () => {
      const modalPrev = document.querySelector("#modal-prev")
      const modalNext = document.querySelector("#modal-next")
      if (prevLink) {
        modalPrev.addEventListener("click", handlePopulateModal, true)
      } else {
        modalPrev.style.top = "-100px"
      }
      if (nextLink) {
        modalNext.addEventListener("click", handlePopulateModal, true)
      } else {
        modalNext.style.top = "-100px"
      }
      currentModalImage.removeEventListener("load", afterModalLoaded)
    }

    const populateModal = (imageSrc, titleText) => {
      if (currentModalImage) {
        clearModal()
      }
      const modalWindow = document.querySelector('#modal-window')
      currentModalImage = document.querySelector('#modal-image')
      const modalText = document.querySelector('#modal-text')

      modalWindow.classList.add('active')

      currentModalImage.src = imageSrc
      currentModalImage.alt = titleText

      modalText.innerHTML = titleText
      fadeIn(currentModalImage)

      currentModalImage.addEventListener("load", afterModalLoaded, true)
    }

    // TOUCH ADDITIONS
    // event library that detects up/down && left/right swipes
    // version of https://stackoverflow.com/a/53413919
    const detectTouch = () => {
      const newEvent = (evt, name) => {
        let ce = document.createEvent('CustomEvent')
        ce.initCustomEvent(name, true, true, evt.target)
        evt.target.dispatchEvent(ce);
        ce = null
        return false
      }
      const debug = false // set to false to turn off logging
      let active = false
      const min_swipe_len = 20
      const tolerance = 0.3
      let start = {
        x: 0,
        y: 0,
        px: 0,
        py: 0
      }
      let end = {
        x: 0,
        y: 0,
        px: 0,
        py: 0
      }
      const touch = {
        touchstart: e => {
          active = true;
          let t = e.targetTouches[0]
          start = {
            x: t.screenX,
            y: t.screenY,
            px: t.pageX,
            py: t.pageY
          }
          end = start
          // debug && console.log("start", start)
        },
        touchmove: e => {
          if (e.touches.length > 1) {
            active = false
            // debug && console.log("multiple gestures detected")
            return
          }
          let t = e.targetTouches[0]
          end = {
            x: t.screenX,
            y: t.screenY,
            px: t.pageX,
            py: t.pageY
          }
          // debug && console.log("move", end, start)
        },
        touchend: e => {
          if (!active) {
            return
          }
          debug && console.log("end", end, start)
          let dx = Math.abs(end.x - start.y)
          let dy = Math.abs(end.y - start.y)

          if (Math.max(dx, dy) < min_swipe_len) {
            // debug && console.log("gesture too small, ignoring")
            return
          }
          if (dy > dx && dx / dy < tolerance && Math.abs(start.py - end.py) > min_swipe_len) {
            // newEvent(e, (end.y - start.y < 0 ? 'up' : 'down')) // comment out to ignore these actions
            e.cancelable && e.preventDefault() // uncomment to pass
          } else if (dx > dy && dy / dx < tolerance && Math.abs(start.px - end.px) > min_swipe_len) {
            newEvent(e, (end.x - start.x < 0 ? 'right' : 'left')) // comment out to ignore these actions
            // e.cancelable && e.preventDefault() // uncomment to pass
          } else {
            // debug && console.log('ignore diagonal or scrolled content')
          }
          active = false
        },
        touchcancel: e => {
          // debug && console.log('cancel gesture')
        }
      }
      for (let evt in touch) {
        window.document.addEventListener(evt, touch[evt], false)
      }
    }

    const touchHandleSwipeLeft = () => {
      if (prevLink) {
        populateModal(prevLink.href, prevLink.title)
      }
    }

    const touchHandleSwipeRight = () => {
      if (nextLink) {
        populateModal(nextLink.href, nextLink.title)
      }
    }

    const touchSetup = () => {
      detectTouch();
      touchListening = true
      currentModalImage.addEventListener('left', touchHandleSwipeLeft, false)
      currentModalImage.addEventListener('right', touchHandleSwipeRight, false)
    }

    // END TOUCH ADDITIONS

    // ANIMATION
    const fadeIn = (element) => {
      element.style.opacity = 0
      let start = Date.now()
      let fadeUp = setInterval(() => {
        let milliseconds = Date.now() - start
        if (milliseconds >= 1000 || element.style.opacity > 1) {
          clearInterval(fadeUp)
          return
        }
        element.style.opacity = parseFloat(element.style.opacity) + 0.01
      })
    }
    // END ANIMATION

    // ensure popup images shrink if window does
    const watchResize = () => {
      window.addEventListener('resize', () => {
        if (currentModalImage) {
          adjustModalImageSize()
        }
      })
    }


    MM.init = () => {
      modalMadness()
      closeModal()
    }

    return MM

  } // function modalMadness

  if (typeof (window.modalMadness) === 'undefined') {
    window.modalMadness = modalMadness() // assign & call function if undef
  }

})(window)

// module.exports = window
