$(document).ready(function() {
    //页眉解限
    var Header = document.querySelector("mb-header");
    Header.TopRelease();
    
    //侧边栏滑动
    var SideBar = document.querySelector("mb-sidebar");
    SideBar.SetSlide(true);
    
    //设置项初始化
    Setting.Init();

    //添加评论区
    var MainContent = document.querySelector(".MainContent");
    MainContent.appendChild(document.createElement("mb-comment-area"));
})