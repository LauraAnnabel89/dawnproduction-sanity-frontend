/**
 * Takes a parallax element and returns whether the element
 * is in view based on the cached position of the element,
 * current scroll position and the window height.
 * @param {object} element
 * @return {boolean} isInView
 */
export default function isElementInView (element, windowWidth, windowHeight, scrollX, scrollY) {
  const top = element.attributes.top - scrollY
  const bottom = element.attributes.bottom - scrollY

  const left = element.attributes.left - scrollX
  const right = element.attributes.right - scrollX


  const topInView = top >= 0 && top <= windowHeight
  const bottomInView = bottom >= 0 && bottom <= windowHeight
  const coveringH = top <= 0 && bottom >= windowHeight

  const leftInView = left >= 0 && left <= windowWidth
  const rightInView = right >= 0 && right <= windowWidth
  const coveringW = left <= 0 && right >= windowWidth

  const isInView = 
    topInView || bottomInView || coveringH ||
    leftInView || rightInView || coveringW

  return isInView
}
