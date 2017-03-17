require('normalize.css')
require('highlight.js/styles/atom-one-dark.css')
require('./app.less')

document.addEventListener("DOMContentLoaded", function (event) {
  // 列表页 分页
  if (pageConfig && pageConfig.pageIndex && pageConfig.pageSize) {
    const r = new XMLHttpRequest()
    r.open('GET', '/posts/pagination', true)
    r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) {
        return
      }
      const res = JSON.parse(r.responseText)
      const totalPage = Math.ceil(res.total / pageConfig.pageSize)
      // 如果手动输入 url 并且大于 totalPage 的话
      if (pageConfig.pageIndex > totalPage && totalPage > 1) {
        window.location.href = '/posts/page/' + totalPage
      } else if (totalPage === 1) {
        return
      }

      // 准备分页 dom
      let htmlStr = ''
      // prev
      if (pageConfig.pageIndex > 1) {
        htmlStr += `<a class="page-num prev" href="/posts/page/${pageConfig.pageIndex - 1}" title="上一页"></a>`
      }
      for (let i = 1; i < totalPage + 1; i++) {
        if (i === pageConfig.pageIndex) {
          htmlStr += `<span class="page-num current">${i}</span>`
        } else {
          htmlStr += `<a class="page-num" href="/posts/page/${i}">${i}</a>`
        }
      }
      // next
      if (pageConfig.pageIndex < totalPage) {
        htmlStr += `<a class="page-num next" href="/posts/page/${pageConfig.pageIndex + 1}" title="下一页"></a>`
      }

      const paginationBox = document.createElement('div')
      paginationBox.classList.add('pagination')
      paginationBox.innerHTML = htmlStr
      document.getElementsByClassName('main-inner')[0].appendChild(paginationBox)
    };
    r.send()
  }

  // 滚动 显示隐藏导航栏
  let lastScrollPosition = 0
  window.addEventListener('scroll', debounce(function (e) {
    const sp = window.scrollY
    const headerDom = document.getElementById('header')
    if (sp > lastScrollPosition) {
      // downscroll code
      headerDom.classList.add('hide')
    } else {
      // upscroll code
      headerDom.classList.remove('hide')
    }
    lastScrollPosition = sp
  }, 100))
})

function debounce(func, wait, immediate) {
  var timeout
  return function () {
    var context = this,
      args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
