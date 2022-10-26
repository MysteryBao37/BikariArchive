class Tab extends HTMLElement
{
    constructor()
    {
        super();
        const Shadow = this.attachShadow({mode: "open"});
        Shadow.innerHTML = `
            <div class="tab-item-list">
            </div>
            <div class="tab-content-area">
            </div>
            <style>
                * {
                    font-size: 14px;
                }

                .tab-item-list {
                    display: flex;
                    align-items: flex-end;
                    overflow-x: auto;
                    overflow-y: visible;
                    height: auto;
                }

                .tab-item {
                    display: block;
                    height: 18px;
                    margin: 0 0 5px 0;
                    padding: 0 12px;
                    white-space: nowrap;
                }

                .tab-item:first-child {
                    border-left: 1px solid rgba(0,0,0,0);
                }

                .tab-item:last-child {
                    border-right: 1px solid rgba(0,0,0,0);
                }

                .tab-item:is(.active) {
                    margin: 0 0 -1px 0;
                    padding: 3px 12px 6px;
                    border: 1px solid var(--theme-border-color-light);
                    border-top: 4px solid var(--theme-block-color);
                    background-color: var(--theme-background-color);
                }

                .tab-item:not(.active) {
                    color: rgb(128,128,128);
                    cursor: pointer;
                }

                .tab-item:not(.active) + .tab-item:not(.active) {
                    border-left: 1px solid var(--theme-border-color-light);
                }

                .tab-content-area {
                    min-height: 64px;
                    padding: 8px 16px;
                    border: 1px solid var(--theme-border-color-light);
                    background-color: var(--theme-background-color);
                }
            </style>
        `;

        this.itemList = [];
        this.check = 0;
    }

    static get observedAttributes() {
        return ["item", "check"];
    }

    /** 生命周期 -- 当元素被添加到文档的时候调用 */
    connectedCallback() {
        //获取元素属性
        this.itemList =  (this.getAttribute("item") !== null) ?
            this.getAttribute("item").split(",") :
                ["标签名"];
        this.check = this.getAttribute("check") | 0;

        //获取标签列表和内容框
        var tab_itemlist = this.shadowRoot.querySelector(".tab-item-list");
        var tab_content = this.shadowRoot.querySelector(".tab-content-area");

        //创建基标签
        var base_item = document.createElement("div");
        base_item.className = "tab-item";

        //创建基内容槽
        var base_slot = document.createElement("slot");
        base_slot.style.display = "none";

        //循环添加各标签
        for (let i = 0; i < this.itemList.length; i++) {
            let item = base_item.cloneNode(true);
            item.innerHTML = this.itemList[i];

            let content = base_slot.cloneNode(true);
            if (this.itemList.length > 1) {
                content.name = this.itemList[i];
            }

            //初始选中显示
            if (i == this.check) {
                item.className += " active";
                content.style.display = "block";
            }

            //标签切换事件
            item.addEventListener("click", () => {
                for (let i = 0; i < tab_itemlist.children.length; i++) {
                    tab_itemlist.children[i].className = "tab-item";
                    tab_content.children[i].style.display = "none";
                }
                item.className = "tab-item active";
                content.style.display = "block";
            })

            tab_itemlist.appendChild(item);
            tab_content.appendChild(content);
        }
    }

    /** 生命周期 -- 当元素从文档删除的时候调用 */
    disconnectedCallback(){}

    /** 生命周期 -- 当元素被移动到新文档的时候调用 */
    adoptedCallback(){}

    /** 生命周期 -- 当元素属性添加、删除、修改的时候调用 */
    attributeChangedCallback(name, oldVal, newVal) {}
}

class Content extends HTMLElement
{
    constructor()
    {
        super();
        const Shadow = this.attachShadow({mode: "open"});
        Shadow.innerHTML = `
            <div class="tab-content"></div>
        `;
    }

    static get observedAttributes() {
        return ["item"];
    }

    /** 生命周期 -- 当元素被添加到文档的时候调用 */
    connectedCallback() {
        var div = this.shadowRoot.querySelector(".tab-content");
        div.slot = this.getAttribute("item");
        div.innerHTML = this.innerHTML;

        this.parentNode.appendChild(div);
        this.remove();
    }

    /** 生命周期 -- 当元素从文档删除的时候调用 */
    disconnectedCallback(){}

    /** 生命周期 -- 当元素被移动到新文档的时候调用 */
    adoptedCallback(){}

    /** 生命周期 -- 当元素属性添加、删除、修改的时候调用 */
    attributeChangedCallback(name, oldVal, newVal) {}
}

customElements.define("mb-tab", Tab);
customElements.define("mb-tab-content", Content);