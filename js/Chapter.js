import { Volume } from "/data/Volume.js"

var novel = "";//小说名
var vol = 0;//卷序号
var order = 0;//章序号
var index = "";//章文件名
var title = "";//章节名

$(document).ready(function() {
    //获取小说名与章文件名
    var url = window.location.href;
    var params = new URLSearchParams(url.split("?")[1]);
    novel = params.get("novel");
    index = params.get("index");

    //计算卷序号与章序号
    while ((order = Volume[novel][vol].Index.indexOf(index)) == -1) vol++;

    //网页标题
    title = Volume[novel][vol].Chapter[order];
    document.title = title + "- 微光茶馆";

    //页眉解限
    var Header = document.querySelector("mb-header");
    Header.TopRelease();

    //侧边目录，侧边栏滑动
    var SideBar = document.querySelector("mb-sidebar");
    SideBar.type = "volume";
    SideBar.SetSlide(true);

    //正文标题
    document.getElementById("Title").innerHTML = title;
    //所属卷
    document.getElementById("Volume").innerHTML = "<" + Volume[novel][vol].Name + ">";
    //引入正文
    $(".Novel-Text").load("/text/" + Volume[novel][vol].Path + "/" + index + ".txt", function(){
        //字数统计
        document.getElementById("WordCount").innerHTML = "字数：" + WordCount();
        //设置项初始化
        Setting.Init();
    });

    var wrap_Left = document.querySelector(".Novel-WrapBox-Left");
    var wrap_Right = document.querySelector(".Novel-WrapBox-Right");
    var wrap_Bottom_Last = document.querySelector(".LastChapter-Bottom");
    var wrap_Bottom_Next = document.querySelector(".NextChapter-Bottom");
    
    //按钮可用与否
    if (order == 0 && vol == 0) {
        wrap_Left.style.visibility = "hidden";
        wrap_Bottom_Last.style.display = "none";
    }
    if (order == Volume[novel][vol].Index.length - 1 && vol + 1 == Volume[novel].length) {
        wrap_Right.style.visibility = "hidden";
        wrap_Bottom_Next.style.display = "none";
    }

    //按钮点击事件
    wrap_Left.addEventListener("click",()=>{ChapterWrap(0)});
    wrap_Right.addEventListener("click",()=>{ChapterWrap(1)});
    wrap_Bottom_Last.addEventListener("click",()=>{ChapterWrap(0)});
    wrap_Bottom_Next.addEventListener("click",()=>{ChapterWrap(1)});

    //键盘监听
    document.addEventListener("keydown", (event)=>{
        switch (event.key) {
            case localStorage.getItem("shortcut-LastChapter"):
                ChapterWrap(0);
                break;
            case localStorage.getItem("shortcut-NextChapter"):
                ChapterWrap(1);
                break;
        }
    });
});

function ChapterWrap(type)//章节跳转
{
    //获取下一章节的序号与卷号
    var gekka = order + (type == 0 ? -1 : 1);
    var nextvol = (()=>{
            if (gekka < 0) {
                gekka = Volume[novel][vol - 1].Index.length - 1;
                return vol - 1;
            }
            else if (gekka == Volume[novel][vol].Index.length) {
                gekka = 0;
                return vol + 1;
            }
            else return vol;
    })();

    window.location.href = "/reader.html?novel=" + novel + "&index=" + Volume[novel][nextvol].Index[gekka];
}

function WordCount()//字数统计
{
    var article = document.getElementsByClassName("Novel-Text")[0];

    var lines = article.getElementsByTagName("p");
    var ruby = article.getElementsByTagName("ruby");
    var br = article.getElementsByTagName("br");

    var count = 0;
    for (let i = 0; i < lines.length; i++) {
        count += lines[i].innerHTML.length;
    }

    count -= ruby.length * 42;
    count -= br.length * 6;
    return count;
}