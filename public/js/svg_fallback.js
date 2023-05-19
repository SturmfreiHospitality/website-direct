function imageError(e) {
  e.onerror = null;
  var alt = e.getAttribute('data-alt-src');
  if (alt) {
    e.src = alt;
    return true;
  }
  return false;
};