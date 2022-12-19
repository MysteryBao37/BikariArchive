class CommentArea extends HTMLElement
{
    constructor()
    {
        super();
        const Shadow = this.attachShadow({mode: "open"});
        Shadow.innerHTML = `
        <div class="CommentArea">
            <div class="title">
                <h2>评论</h2>
                <span id="Count">0</span>
            </div>
            <hr>
            <div class="InputArea">
                <img class="Comment-Icon" src="/image/anonymous.webp"/>
                <textarea class="Comment-Input"></textarea>
                <button class="Comment-Send">发布</button>
            </div>
            <div class="OutputArea">
            </div>
        </div>
        <style>
            .title {
                display: flex;
                align-items: flex-end;
                gap: 8px;
            }

            .title h2 {
                margin: 16px 0 0 0;
            }

            #Count {
                color: rgb(128, 128, 128);
            }

            .InputArea {
                display: flex;
                gap: 16px;
                padding: 8px 0;
            }

            .Comment-Icon {
                width: 40px;
                height: 40px;
                padding: 5px 0;
                border-radius: 50%;
            }

            .Comment-Input {
                flex: 1;
                height: 36px;
                padding: 6px;
                border-radius: 6px;
                font-size: 14px;
                font-family: "Microsoft YaHei UI";
                resize: none;
                outline: none;
                transition: all .2s;
            }

            .Comment-Input:focus {
                height: 50px;
            }

            .Comment-Send {
                width: 5em;
                border: 0;
                border-radius: 6px;
                background-color: var(--theme-block-color);
                font-size: 16px;
                font-weight: bolder;
                color: white;
                cursor: pointer;
            }

            .Comment-Send:hover {
                background-color: var(--theme-block-color-dark);
            }
        </style>
        `;
    }

    static get observedAttributes() {
        return [];
    }

    //获取本体
    Body() {
        return this.shadowRoot.querySelector(".CommentArea");
    }

    //添加评论
    AddComment() {
        var Icon = this.shadowRoot.querySelector(".Comment-Icon");
        var TextArea = this.shadowRoot.querySelector(".Comment-Input");
        var text = TextArea.value.replace('\n','<br>');
        if (text === "") {
            alert("你的评论为空！");
            return;
        }
        TextArea.value = "";

        var Comment = document.createElement("mb-comment");
        Comment.SetIcon(Icon.src);
        Comment.SetText(text);
        Comment.SetDate(new Date());

        var OutputArea = this.shadowRoot.querySelector(".OutputArea");
        OutputArea.insertBefore(Comment, OutputArea.childNodes[0]);

        this.AddCount(1);
    }

    //计数
    AddCount(num) {
        var Count = this.shadowRoot.querySelector("#Count");
        Count.innerHTML = Number(Count.innerHTML) + num;
    }

    /** 生命周期 -- 当元素被添加到文档的时候调用 */
    connectedCallback() {
        var Button = this.shadowRoot.querySelector(".Comment-Send");
        Button.addEventListener("click",()=>{this.AddComment()});
    }

    /** 生命周期 -- 当元素从文档删除的时候调用 */
    disconnectedCallback(){}

    /** 生命周期 -- 当元素被移动到新文档的时候调用 */
    adoptedCallback(){}

    /** 生命周期 -- 当元素属性添加、删除、修改的时候调用 */
    attributeChangedCallback(name, oldVal, newVal) {}
}

class Comment extends HTMLElement
{
    constructor()
    {
        super();
        const Shadow = this.attachShadow({mode: "open"});
        Shadow.innerHTML = `
        <div class="Comment">
            <img class="Comment-Icon"/>
            <div class="Comment-Content">
                <span class="Comment-Nickname">匿名用户</span>
                <p class="Comment-Text"></p>
                <div class="ExtraArea">
                    <span class="Comment-Date"></span>
                    <span class="Comment-Delete">删除</span>
                </div>
            </div>
        </div>
        <style>
        .Comment {
            display: flex;
            gap: 16px;
            padding: 16px 0 0 0;
        }

        .Comment-Icon {
            width: 40px;
            height: 40px;
            padding: 5px 0;
            border-radius: 50%;
        }

        .Comment-Content {
            flex: 1;
            border-bottom: 1px solid var(--theme-border-color-light);
        }

        .Comment-Nickname {
            font-size: 14px;
            color: rgb(96, 96, 96);
        }

        .Comment-Text {
            margin: 0;
            padding: 6px 0 12px;
            font-size: 16px;
        }

        .ExtraArea {
            display: flex;
            padding: 0 0 6px;
            font-size: 14px;
            color: var(--theme-border-color);
        }

        .Comment-Date {
            display: inline-block;
            margin: 0 21px 0 0;
        }
        
        .Comment-Delete {
            cursor: pointer;
        }
        </style>
        `;
    }

    static get observedAttributes() {
        return [];
    }

    SetIcon(src) {
        var Icon = this.shadowRoot.querySelector(".Comment-Icon");
        Icon.src = src;
    }

    SetText(text) {
        var Text = this.shadowRoot.querySelector(".Comment-Text");
        Text.innerHTML = text;
    }

    SetDate(date) {
        var Date = this.shadowRoot.querySelector(".Comment-Date");

        var gekka = "";
        var Y = date.getFullYear();
        var M = date.getMonth() + 1;
        var D = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();

        gekka += Y + "-";
        gekka += (M < 10 ? "0" : "") + M + "-";
        gekka += (D < 10 ? "0" : "") + D + " ";
        gekka += (h < 10 ? "0" : "") + h + ":";
        gekka += (m < 10 ? "0" : "") + m + ":";
        gekka += (s < 10 ? "0" : "") + s;

        Date.innerHTML = gekka;
    }

    /** 生命周期 -- 当元素被添加到文档的时候调用 */
    connectedCallback() {
        var Delete = this.shadowRoot.querySelector(".Comment-Delete");
        Delete.addEventListener("click", ()=>{
            var CommentArea = document.querySelector("mb-comment-area");
            CommentArea.AddCount(-1);
            this.remove();
        })
    }

    /** 生命周期 -- 当元素从文档删除的时候调用 */
    disconnectedCallback(){}

    /** 生命周期 -- 当元素被移动到新文档的时候调用 */
    adoptedCallback(){}

    /** 生命周期 -- 当元素属性添加、删除、修改的时候调用 */
    attributeChangedCallback(name, oldVal, newVal) {}
}

customElements.define("mb-comment-area", CommentArea);
customElements.define("mb-comment", Comment);