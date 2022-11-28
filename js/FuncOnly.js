const storage = {
    "input-layout": "LayoutStyle",
    "input-theme": "Theme",
    "input-fontfamily": "FontFamily",
    "input-fontsize": "FontSize"
}

//返回顶部
function BackToTop() {
    document.querySelector("mb-header").scrollIntoView({
        behavior: "smooth"
    });
}

//主题颜色
function SetTheme(index) {
    if (index === null) index = "0";
    localStorage.setItem("Theme", index);
	
    let theme;
    switch (index.toString()) {
        /* 山吹 */ case "0": theme = "Yamabuki"; break
        /* 初空 */ case "1": theme = "Hatsusora"; break;
        /* 若竹 */ case "2": theme = "Wakatake"; break;
        /* 早樱 */ case "3": theme = "Hayasakura"; break;
    }
    document.documentElement.setAttribute("theme", theme);

    let QRCode = document.getElementById("QRCode-Site");
    if (QRCode !== null) {
        //获取主题对应的文本色-高亮
        let QRColor = getComputedStyle(document.documentElement).getPropertyValue("--theme-text-color-light");
        
        //修改二维码颜色
        ChangeImageColor("image/QRCode_Site.png", QRColor, (imageURL)=> {
            QRCode.src = imageURL;
        });
    }
}

//改变图片颜色
function ChangeImageColor(url, color, callback) {
	let img = new Image();
    img.src = url;

    let [newR, newG, newB, newA] = RGBSelector(color);

    img.onload = function() {
    	let width = img.width;
        let height = img.height;
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        let imageData = ctx.getImageData(0, 0, width, height);
        let data = imageData.data;
        
        for (let i = 0; i < data.length; ) {
			let r = data[i++],
         		g = data[i++],
                b = data[i++],
                a = data[i++];
            if (a != 0) {
            	data[i - 4] = newR;
               	data[i - 3] = newG;
                data[i - 2] = newB;
                if (typeof newA !== "undefined") {
                    data[i - 1] = newA;
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        let imageURL = canvas.toDataURL();
        callback && callback(imageURL);
    }
}

//输入rgb字符串，返回数组
function RGBSelector(str) {
    var arr = str.slice(4, str.length - 1).split(",");
    return arr.map((item)=>{
        return Number(item);
    });
}

//输入px字符串，返回数字
function PxToNumber(px) {
    return Number(px.substring(0, px.length - 2));
}

/* ---------------------------------------------------------------- */
//设置
var Setting = new Object;

//打开设置
Setting.Open = function() {
    //添加阴影层
    var mask = document.createElement("div");
    mask.className = "modal-mask";
    mask.onclick = function() {
        Setting.Close();
    };
    document.body.appendChild(mask);

    //添加主体
    var setting = document.createElement("div");
    setting.className = "modal-setting modal-box";
    document.body.appendChild(setting);

    //加载设置页面
    $(".modal-setting").load(document.location.origin.toString() + "/template/Setting.html", function(){
        HobAndClick("input-layout", "Nakami.SetLayout");
        HobAndClick("input-theme", "SetTheme");
        HobAndClick("input-fontfamily", "Reader.SetFontFamily");
        HobAndClick("input-fontsize", "Reader.SetFontSize");

        function HobAndClick(id, func) {
            var input = document.querySelector("#" + id).children;
            for (let i = 0; i < input.length; i++) {
                let hob = document.createElement("span");
                hob.className = "hob";
                input.item(i).appendChild(hob);
                input.item(i).addEventListener("click", ()=>{
                    //改变样式
                    for (let j = 0; j < input.length; j++) {
                        input.item(j).className = "";
                    }
                    input.item(i).className = "active";
                    //执行对应函数
                    eval(func + "(" + i + ")");
                });
            }
            //高亮修正
            for (let i = 0; i < input.length; i++) {
                input.item(i).className = "";
            }
            input.item(Number(localStorage.getItem(storage[id]))).className = "active";
        }
        //关闭按钮
        $(".setting-close").on("click", function() {
            Setting.Close();
        });

        //设置项初始化
        Setting.Init();
    });

    //不知道为什么但要加载一下
    getComputedStyle(setting).transition;

    //触发css动画
    setting.style.top = "50%";
    setting.style.opacity = 1;
    mask.style.opacity = 0.5;
}

//初始化
Setting.Init = function() {
    //页面布局
    Nakami.Init();

    //主题颜色
    SetTheme(localStorage.getItem("Theme"));

    //快捷键
    ShortCut.Init();

    //字体选择
    Reader.SetFontFamily(localStorage.getItem("FontFamily"));

    //字体大小
    Reader.SetFontSize(localStorage.getItem("FontSize"));
}

//关闭设置
Setting.Close = function() {
    let setting = $(".modal-setting")[0];
    let mask = $(".modal-mask")[0];

    //触发css动画
    setting.style.top = "20%";
    setting.style.opacity = 0;
    mask.style.opacity = 0;

    let duration = getComputedStyle(setting).transitionDuration;
    duration = duration.slice(0, duration.length - 1);
    setTimeout(function() {
        setting.remove();
        mask.remove();
    }, duration * 1000);
}

/* ---------------------------------------------------------------- */
//内容
var Nakami = new Object;

//初始化
Nakami.Init = function() {
    this.SetLayout(localStorage.getItem("LayoutStyle"));
    window.addEventListener("resize", ()=>{
        Nakami.LayoutChange();
    });
}

//页面布局
Nakami.SetLayout = function(index) {
    if (index === null) index = "0";
    localStorage.setItem("LayoutStyle", index);

    //获取侧边栏、主要内容
    var nakami = document.querySelector(".Nakami");
    var sideBar = document.querySelector("mb-sidebar");
    var mainContent = document.querySelector(".MainContent");

    let widthList = [
        getComputedStyle(sideBar).width,
        getComputedStyle(mainContent).maxWidth,
        getComputedStyle(mainContent).minWidth
    ].map((item)=>{
        return Number(item.substring(0, item.length - 2));
    });

    //获取页面最大、最小宽度
    const max_width = 32 * 3 + widthList[0] + widthList[1];
    const min_width = 32 * 3 + widthList[0] + widthList[2];

    //响应浏览器尺寸的调整，改变对齐方式
    //内部定义，用于获取局部变量
    Nakami.LayoutChange = function() {
        //超小屏时，布局不生效
        if (document.body.clientWidth < 768) {
            sideBar.style.order = 0;
            mainContent.style.order = 1;
            return;
        }
        
        //根据index选择样式
        switch(index.toString()) {
            /* 居中 */case "0":;
            /* 靠左 */case "1": {
                sideBar.style.order = 0;
                mainContent.style.order = 1;
                break;
            }
            /* 靠右 */case "2": {
                sideBar.style.order = 1;
                mainContent.style.order = 0;
                break;
            }
        }

        switch(index.toString()) {
            /* 居中 */case "0": {
                if (document.body.clientWidth > min_width) {
                    nakami.style.justifyContent = "center";
                }
                else {
                    nakami.style.justifyContent = "left";
                }
                break;
            }
            /* 靠左 */case "1": {
                nakami.style.justifyContent = "left";
                break;
            }
            /* 靠右 */case "2": {
                if (document.body.clientWidth > max_width) {
                    nakami.style.justifyContent = "right";
                }
                else {
                    nakami.style.justifyContent = "left";
                }
                break;
            }
        }
    };
    
    //根据index改变页面布局
    this.LayoutChange();
}

/* ---------------------------------------------------------------- */
//快捷键
var ShortCut = new Object;

ShortCut.Init = function() {
    let shortcut = $(".input-shortcut");
    let count = shortcut.length;
    for (let i = 0; i < count; i++) {
        //获取id
        let id = shortcut[i].getAttribute("id");

        //读取本地变量，若不存在则进行初始化
        let keyStr = localStorage.getItem(id);
        if (keyStr === null) {
            localStorage.setItem(id, this.strToKey(shortcut[i].value));
        }
        else {
            shortcut[i].value = this.keyToStr(keyStr);
        }


        //输入逻辑
        shortcut[i].addEventListener("keypress", (event) => {
            shortcut[i].value = "";
        });
        shortcut[i].addEventListener("keyup", (event) => {
            shortcut[i].value = this.keyToStr(event.key);
            localStorage.setItem(id, event.key);
        });
    }
}

ShortCut.keyToStr = function(key) {
    let str = key;
    switch (str) {
        case "Control": str = "Ctrl"; break;
        case " ": str = "SpaceBar"; break;
        case "ArrowLeft": str = "←"; break;
        case "ArrowUp": str = "↑"; break;
        case "ArrowRight": str = "→"; break;
        case "ArrowDown": str = "↓"; break;
        default:
            if (str >= "a" && str <= "z") {
                str = str.toUpperCase();
            }
    }
    return str;
}

ShortCut.strToKey = function(str) {
    let key = str;
    switch (key) {
        case "Ctrl": key = "Control"; break;
        case "←": key = "ArrowLeft"; break;
        case "↑": key = "ArrowUp"; break;
        case "→": key = "ArrowRight"; break;
        case "↓": key = "ArrowDown"; break;
        default:
            if (key >= "A" && key <= "Z") {
                key = key.toLowerCase();
            }
    }
    return key;
}

/* ---------------------------------------------------------------- */
//阅读器
var Reader = new Object;

//字体选择
Reader.SetFontFamily = function(index) {
    if (index === null) index = "0";
    localStorage.setItem("FontFamily", index);

    //寻找正文
    let novel = document.getElementsByClassName("Novel-Text")[0];
    if (typeof novel !== "undefined") {
        //根据index选择样式
        let family;
        switch(index.toString()) {
            case "0": family = "inherit"; break;
            case "1": family = "宋体"; break;
            case "2": family = "楷体"; break;
        }

        //修改字体
        let lines = novel.getElementsByTagName("p");

        let count = lines.length;
        for (let i = 0; i < count; i++) {
            lines[i].style.fontFamily = family;
        }
    }
}

//字体大小
Reader.SetFontSize = function(index) {
    if (index === null) index = "0";
    localStorage.setItem("FontSize", index);

    //寻找正文
    let novel = document.getElementsByClassName("Novel-Text")[0];
    if (typeof novel !== "undefined") {
        //根据index选择样式
        let size, indent;
        switch(index.toString()) {
            case "0":
                size = 16;
                indent = 32;
                break;
            case "1":
                size = 18;
                indent = 36;
                break;
            case "2":
                size = 22;
                indent = 44;
                break;
        }

        //修改字体
        let lines = novel.getElementsByTagName("p");

        let count = lines.length;
        for (let i = 0; i < count; i++) {
            lines[i].style.fontSize = size + "px";
            lines[i].style.textIndent = indent + "px";
        }
    }
}

/* ---------------------------------------------------------------- */
//Cookie
var Cookie = new Object;

//设置cookie
Cookie.Set = function(name, value, daysToLive) {
    var cookie;
    cookie = name + "=" + encodeURIComponent(value);
    cookie += "; max-age=" + (daysToLive*60*60*24);
    cookie += "; path=/";
    document.cookie = cookie;
}

//读取cookie
Cookie.Get = function(name) {
    var cookies = document.cookie;
    var list = cookies.split("; "); // 解析出名/值对列表
    for(var i = 0; i < list.length; i++) {
        var arr = list[i].split("="); // 解析出名和值
        if(arr[0] == name)
        return decodeURIComponent(arr[1]); // 对cookie值解码
    }
    return "";
}