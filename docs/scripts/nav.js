function scrollToNavItem() {
    var path = window.location.href.split('/').pop().replace(/\.html/, '');
    document.querySelectorAll('nav a').forEach(function(link) {
      var href = link.attributes.href.value.replace(/\.html/, '');
      if (path === href) {
        link.scrollIntoView({block: 'center'});
        return;
      }
    })
  }

  scrollToNavItem();
