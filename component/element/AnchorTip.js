class AnchorTip extends HTMLElement
{
    constructor()
    {
        super();
        const Shadow = this.attachShadow({mode: "open"});
        Shadow.innerHTML = `
        <a class="AnchorTip">
            <slot></slot>
        </a>
        <style>
            .AnchorTip {
                display: inline-block;
                cursor: pointer;
                text-decoration: none;
                color: var(--theme-link-color);
            }
        </style>
        `;
    }

    static get observedAttributes() {
        return ["href"];
    }

    //显示悬停信息
    ShowHoverTip(event) {
        var Tip = document.createElement("div");
        Tip.className = "Popups";
        Tip.style.cssText = `
            position: absolute;
            width: 320px;
            opacity: 0;
            padding: 16px;
            border-left: 8px solid var(--theme-block-color);
            background-color: var(--theme-background-color);
            filter: drop-shadow(0px 0px 6px rgba(0,0,0,0.20));
            cursor: pointer;
            transition: all .2s;
        `;

        var Text = document.createElement("a");
        Text.style.cssText = `
            color: var(--theme-font-color);
            font-size: 14px;
        `;
        Tip.appendChild(Text);

        //根据链接获取对应内容
        $.get(this.getAttribute("href"), (gekka) => {
            var temp = document.createElement("div");
            temp.innerHTML = gekka;
            Text.innerHTML = temp.querySelector(".Detail-Block").querySelector("p").innerHTML;
        })

        //获取横纵坐标
        var left = getLeft(this);
        var top = getTop(this) + this.offsetHeight;
        Tip.style.top = top + 20 + "px";
        if (left + 320 + 24 > window.innerWidth) {
            Tip.style.left = left - 320 + 16 + this.offsetWidth + "px";
        }
        else {
            Tip.style.left = left - 24 + "px";
        }

        //页面跳转
        Tip.addEventListener("click", () => {
            window.location.href = this.getAttribute("href");
        });

        //向页面添加元素
        document.body.appendChild(Tip);

        //不知道为什么但要加载一下
        getComputedStyle(Tip).transition;

        //触发css动画
        Tip.style.opacity = 1;
        Tip.style.top = top + 4 + "px";

        //获取元素的纵坐标
        function getTop(e)
        {
            var offset = e.offsetTop;
            if(e.offsetParent != null) offset += getTop(e.offsetParent);
            return offset;
        }

        //获取元素的横坐标
        function getLeft(e)
        {
            var offset = e.offsetLeft;
            if(e.offsetParent != null) offset += getLeft(e.offsetParent);
            return offset;
        }
    }

    //隐藏悬停信息
    HideHoverTip(event) {
        var Tip = document.querySelector(".Popups");
        if (Tip === null) return;

        var top = getTop(this) + this.offsetHeight;

        //触发css动画
        Tip.style.opacity = 0;
        Tip.style.top = top + 20 + "px";

        var timer = 0;
        timer = setTimeout(() => {
            Tip.remove();
        }, 200);

        //获取元素的纵坐标
        function getTop(e)
        {
            var offset = e.offsetTop;
            if(e.offsetParent != null) offset += getTop(e.offsetParent);
            return offset;
        }
    }

    /** 生命周期 -- 当元素被添加到文档的时候调用 */
    connectedCallback() {
        var a = this.shadowRoot.querySelector(".AnchorTip");

        a.setAttribute("href", this.getAttribute("href"));

        //添加悬停逻辑
        var timer = 0;
        this.addEventListener("mouseover", (event)=>{
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.ShowHoverTip(event);
            }, 500);
        })
        this.addEventListener("mouseleave", (event)=>{
            clearTimeout(timer);
            this.HideHoverTip(event);
        })
    }

    /** 生命周期 -- 当元素从文档删除的时候调用 */
    disconnectedCallback(){}

    /** 生命周期 -- 当元素被移动到新文档的时候调用 */
    adoptedCallback(){}

    /** 生命周期 -- 当元素属性添加、删除、修改的时候调用 */
    attributeChangedCallback(name, oldVal, newVal) {}
}

customElements.define("mb-a-tip", AnchorTip);