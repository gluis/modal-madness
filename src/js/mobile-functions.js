const mobileFunctions = {
  isMobile: () => {
    // return $(window).width() < 768;
    return window.innerWidth < 768;
  }
}


module.exports = mobileFunctions;
