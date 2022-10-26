class Header extends HTMLElement
{
    constructor()
    {
        super();
        const Shadow = this.attachShadow({mode: "open"});
        Shadow.innerHTML = `
        <div class="Header">
            <div id="BikariTitle">微光茶馆</div>
        </div>
        <style>
            .Header {
                position: sticky;
                top: 0;
                min-width: calc(var(--size-width-min) + 192px + 96px);
                width: 100%;
                height: 64px;
                background-color: var(--theme-block-color);
                filter: drop-shadow(0px 0px 8px rgba(0,0,0,0.16));
                z-index: 255;
            }

            @media (max-width: 767px) {
                .Header {
                    min-width: var(--size-width-min-mobile);
                    width: 100vw;
                }
            }
            
            #BikariTitle {
                float: left;
                position: absolute;
                left: 50%;
                min-width: 320px;
                width: 40%;
                transform: translate(-50%, 0);
                padding: 16px 0 16px 0;
                background-color: var(--theme-block-color-light);
                text-align: center;
                line-height: 32px;
                font-family: "腾祥沁圆简";
                font-size: 32px;
                clip-path: polygon(
                    0 1em,
                    3em 0,
                    calc(100% - 3em) 0,
                    100% 1em,
                    100% calc(100% - 1em),
                    calc(100% - 3em) 100%,
                    3em 100%,
                    0 calc(100% - 1em)
                );
            }
        </style>
        `;
    }

    static get observedAttributes() {
        return [];
    }

    //获取本体
    Body() {
        return this.shadowRoot.querySelector(".Header");
    }

    //从顶部解限
    TopRelease() {
        this.Body().style.position = "static";
    }

    /** 生命周期 -- 当元素被添加到文档的时候调用 */
    connectedCallback() {}

    /** 生命周期 -- 当元素从文档删除的时候调用 */
    disconnectedCallback(){}

    /** 生命周期 -- 当元素被移动到新文档的时候调用 */
    adoptedCallback(){}

    /** 生命周期 -- 当元素属性添加、删除、修改的时候调用 */
    attributeChangedCallback(name, oldVal, newVal) {}
}

customElements.define("mb-header", Header);