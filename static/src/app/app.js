require('normalize.css')
require('highlight.js/styles/atom-one-dark.css')
require('./app.less')
const $ = require('jquery')

$(function () {
  // 列表页 分页
  if (pageConfig && pageConfig.pageIndex) {
    $.ajax({
      method: 'get',
      url: '/posts/pagination',
      success: function (res) {
        if (res) {
          const totalPage = Math.ceil(res.total / res.pageSize)
          // 如果手动输入 url 并且大于 totalPage 的话
          if (pageConfig.pageIndex > totalPage && totalPage > 1) {
            window.location.href = '/posts/page/' + totalPage
          } else if (totalPage === 1) {
            return
          }


          let pagination = '<div class="pagination">'
          // prev
          if (pageConfig.pageIndex > 1) {
            pagination += `<a class="page-num prev" href="/posts/page/${pageConfig.pageIndex - 1}" title="上一页"></a>`
          }
          for (let i = 1; i < totalPage + 1; i++) {
            if (i === pageConfig.pageIndex) {
              pagination += `<span class="page-num current">${i}</span>`
            } else {
              pagination += `<a class="page-num" href="/posts/page/${i}">${i}</a>`
            }
          }
          // next
          if (pageConfig.pageIndex < totalPage) {
            pagination += `<a class="page-num next" href="/posts/page/${pageConfig.pageIndex + 1}" title="下一页"></a>`
          }
          pagination += '</div>'
          $('.main-inner').append(pagination)
        }
      }
    })
  }

  // 滚动 显示隐藏导航栏
  let lastScrollTop = 0
  $(window).scroll(debounce(function (event) {
    let st = $(this).scrollTop()
    if (st > lastScrollTop) {
      // downscroll code
      $('#header').addClass('hide')
    } else {
      // upscroll code
      $('#header').removeClass('hide')
    }
    lastScrollTop = st
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
