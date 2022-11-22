import { Volume } from "/data/Volume.js"

class SideBar extends HTMLElement
{
    constructor()
    {
        super();
        const Shadow = this.attachShadow({mode: "open"});
        Shadow.innerHTML = `
        <div class="SideBar">
            <div class="SideBar-Block" id="Menu">
                <ul class="demo-vertical">
                    <li><a href="/index.html">主页</a></li>
                    <li><a href="/catalogue.html">目录</a></li>
                    <li><a href="/details.html">情报</a></li>
                    <li><a href="javascript:void(0)" onclick="Setting.Open()">设置</a></li>
                </ul>
            </div>
            <div class="SideBar-Block" id="Index">
                <div class="Index-Volume"></div>
                <div class="Index-List">
                    <ul class="demo-vertical">
                    </ul>
                </div>
            </div>
            <div class="SideBar-Block visible-sm visible-md visible-lg">
                <ul class="demo-vertical">
                    <li><a href="javascript:void(0)" onclick="BackToTop()">返回顶部</a></li>
                </ul>
            </div>
        </div>
        <style>
            .SideBar {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }

            .SideBar-Block {
                padding: 0;
                overflow: auto;
                border: 1px solid var(--theme-border-color-light);
                border-radius: 16px;
                background-color: var(--theme-background-color-alpha);
            }

            .demo-vertical {
                margin: 0;
                padding: 0;
                background-color: transparent;
                list-style-type: none;
            }

            .demo-vertical a {
                display: block;
                padding: 8px 16px;
                color: var(--theme-text-color);
                white-space: nowrap;
                text-decoration: none;
            }

            .demo-vertical a:hover:not(.active) {
                background-color: rgb(170, 170, 170);
                color:white;
            }

            .demo-vertical a.active {
                background-color: var(--theme-block-color);
                color:white;
            }

            /* 主页二维码 */
            #QRCode-Site {
                width: 100%;
                padding: 32px;
            }

            /* ---------------------------------------------------------------- */

            /* 正文侧边目录 */
            #Index {
                display: none;
                flex-direction: column;
                flex: 1;
            }

            #Index a {
                padding: 7px 16px;
                font-size: 14px;
            }

            .Index-Volume {
                margin: 0 16px 8px 16px;
                padding: 10px 0;
                border-bottom: 1px solid var(--theme-border-color);
                font-weight: bolder;
            }

            .Index-List {
                overscroll-behavior: contain;
                overflow-x: hidden;
                overflow-y: scroll;
            }

            .Index-List::-webkit-scrollbar {
                width: 5px;
            }

            .Index-List::-webkit-scrollbar-track {
                border-radius: 3px;
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
            }

            .Index-List::-webkit-scrollbar-thumb {
                border-radius: 3px;
                -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, .3);
            }

            .Index-Action {
                overflow: hidden;
                padding: 8px 16px;
                border: 0px;
                white-space: nowrap;
            }
        </style>
        `;
    }

    static get observedAttributes() {
        return ["check", "type"];
    }

    set check(name) {
        var Menu = this.shadowRoot.querySelector("#Menu");
        var list = Menu.getElementsByTagName("a");
        for (let i = 0; i < list.length; i++) {
            list[i].className = "";
            if (list[i].innerHTML == name) {
                list[i].className = "active";
            }
        }
    }

    set type(name) {
        if (name == "volume") {
            this.AddVolume();
        }
    }

    //添加侧边目录
    AddVolume() {
        var sideBar = this.shadowRoot.querySelector(".SideBar");
        var Index = this.shadowRoot.querySelector("#Index");
    
        var novel = "";//小说名
        var vol = 0;//卷序号
        var order = 0;//章序号
        var index = "";//章文件名

        //获取小说名与章文件名
        var inf = document.querySelector("inf");
        novel = inf.getAttribute("novel");
        index = inf.getAttribute("index");

        //计算卷序号与章序号
        while ((order = Volume[novel][vol].Index.indexOf(index)) == -1) vol++;
        
        //为目录添加卷标题
        var list = Index.getElementsByTagName("ul")[0];
        this.shadowRoot.querySelector(".Index-Volume").innerHTML = Volume[novel][vol].Name;

        //添加章节
        let base_li = document.createElement("li");
        base_li.appendChild(document.createElement("a"));
        for (let i = 0; i < Volume[novel][vol].Index.length; i++) {
            let li = base_li.cloneNode(true);
            let a = li.firstChild;
            if (i == order) {
                a.className = "active";
            }
            a.href = "novel_" + Volume[novel][vol].Index[i] + ".html";
            a.innerHTML = Volume[novel][vol].Chapter[i];
            list.appendChild(li);
        }
    
        //高度初始化
        var header = document.querySelector("mb-header").Body();
        let header_height = PxToNumber(getComputedStyle(header).height);
        IndexEvent();
    
        //目录滑动到当前章节处
        list.getElementsByTagName("li")[Math.max(0, order - 1)].scrollIntoView();
    
        //根据浏览器滚动动态调整
        window.addEventListener("scroll", ()=>{IndexEvent()});
        window.addEventListener("resize", ()=>{IndexEvent()});
    
        function IndexEvent() {
            if (window.innerWidth < 768) {
                Index.style.display = "none";
                sideBar.style.height = "auto";
            }
            else {
                Index.style.display = "flex";
                let offset = window.pageYOffset - header_height;
                if (offset > 0) offset = 0;
                sideBar.style.height = window.innerHeight + offset - 64 + "px";
            }
        }
    }

    //设置滑动
    SetSlide(state) {
        var header = document.querySelector("mb-header");
        var sidebar = document.querySelector("mb-sidebar");
        
        switch(state) {
            case true: { 
                window.addEventListener("scroll", function () {
                    let mainHeight = header.scrollHeight;
                    if (window.innerWidth < 768 || window.pageYOffset < mainHeight) {
                        sidebar.style.position = "static";
                    }
                    else {
                        sidebar.style.position = "sticky";
                        sidebar.style.top = 32 + "px";
                    }
                });
                break;
            }
            case false: {
                document.removeEventListener("scroll");
                sidebar.style.position = "sticky";
                sidebar.style.top = "0px";
                break;
            }
        }
    }

    /** 生命周期 -- 当元素被添加到文档的时候调用 */
    connectedCallback() {
        this.check = this.getAttribute("check");
        this.type = this.getAttribute("type");
    }

    /** 生命周期 -- 当元素从文档删除的时候调用 */
    disconnectedCallback(){}

    /** 生命周期 -- 当元素被移动到新文档的时候调用 */
    adoptedCallback(){}

    /** 生命周期 -- 当元素属性添加、删除、修改的时候调用 */
    attributeChangedCallback(name, oldVal, newVal) {}
}

customElements.define("mb-sidebar", SideBar);