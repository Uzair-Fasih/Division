// import { hello } from './importable.js'
import { WebComponent } from './webcomponent.js'

let baseURL = '',
    divisionsToProcess = 0,
    divisionsProcessed = 0,
    divisions

const fragment = division => {
  let url

  if (division.getAttribute('url-to-use'))
    url = division.getAttribute('url-to-use').replace(/[a-zA-Z]+\.(html)/g, '')
  else
    url = baseURL

  url += division.getAttribute('data-to-include').replace(/(\.\/){1}/g, '')
  division.removeAttribute('data-to-include')

  let localTest = /^(?:file):/,
      xmlhttp = new XMLHttpRequest(),
      status = 0;

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4) {
      status = xmlhttp.status
    }
    if (localTest.test(location.href) && xmlhttp.responseText) {
      status = 200
    }
    if (xmlhttp.readyState == 4 && status == 200) {
      let source = xmlhttp.responseText
      let context = { urlToUse: url.replace(/[a-zA-Z]+\.(html)/g, '') }
      var template = Handlebars.compile(source)
      division.htmlContent = template(context)
      divisionsProcessed++
      if (divisionsToProcess === divisionsProcessed) {
        getDivisions()
      }
    } else {
      division.htmlContent = '<p style="color: red">This Division couldn\'t load properly.</p>'
    }
  }

  try {
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  } catch (err) {}
}

const getDivisions = () => {
  divisionsToProcess = 0
  divisionsProcessed = 0
  divisions = document.querySelectorAll('div-ision[data-to-include]')
  divisionsToProcess = divisions.length
  if (divisionsToProcess === 0) {
    return
  }
  divisions.forEach(division => {
    fragment(division)
  })
}

window.onload = () => {
  window.customElements.define('div-ision', WebComponent)
  baseURL = String(window.location.href).replace(/[a-zA-Z]+\.(html)/g, '')
  getDivisions()
}
