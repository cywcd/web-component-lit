let sidebarVisible = true;

// 侧导航展开、收起
function toggleSidebar() {
  const sidebar = document.getElementById('yc-demo-sidebar');
  const toggleIcon = document.getElementById('yc-demo-toggle-icon');

  sidebarVisible = !sidebarVisible;
  sidebar.style.width = sidebarVisible ? '200px' : '80px';
  sidebar.style.overflow = sidebarVisible ? 'visible' : 'hidden';
  toggleIcon.src = sidebarVisible
    ? './dev/static/img/collapsed.svg'
    : './dev/static/img/expand.svg';
}

// 解析 URL 参数
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// 切换导航页面
function changePage(e) {
  const target = e.currentTarget;
  const url = target.getAttribute('data-url');
  
  // 更新 iframe 的 src
  const iframe = document.getElementById('components-demo-iframe');
  iframe.src = url;

  // 更新 URL 参数
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('components', url.split('/').pop().split('.')[0]); // 从 URL 中提取组件名
  window.history.pushState({}, '', newUrl);
}

// 获取导航菜单列表
function getNavMenuList() {
  const menuListEls = document.querySelectorAll('.yc-demo-menu-list-item');
  let menuListData = [];
  if (menuListEls?.length) {
    menuListEls.forEach((el) => {
      const linkUrl = el.getAttribute('data-url');
      const title = el.getAttribute('title');
      const menuItem = {
        linkUrl,
        title
      };
      menuListData.push(menuItem);
    });
  }
  return menuListData;
}

// 初始化页面
function init() {
  const componentName = getUrlParameter('components');
  const iframe = document.getElementById('components-demo-iframe');
  if (componentName) {
    iframe.src = `./dev/demo/${componentName}.html`;
  } else {
    const menuList = getNavMenuList();
    let menuFirstMenu;
    if (menuList.length) {
      menuFirstMenu = menuList[0];
      iframe.src = menuFirstMenu.linkUrl;
    }
  }
}

// 在页面加载时初始化
window.onload = init;