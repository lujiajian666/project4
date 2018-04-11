//import { findSpecialParent } from './app.component'
export const MenuComponent = {
  id: 1,
  name: "菜单",
  pic: "../assets/menu.png",
  className: "menu-component",
  timestamp:1,  //唯一标识符
  data: [{
      title: "喜马拉雅",
      pic: "../assets/nobody.png",
      url: "",
    },
    {
      title: "精品课程",
      pic: "",
      url: "",
    },
    {
      title: "签到有礼",
      pic: "",
      url: "",
    },
    {
      title: "饮食专区",
      pic: "",
      url: "",
    },
    {
      title: "会员登录",
      pic: "",
      url: "",
    },
  ],
  render(index) {
    const data = this.data;
    this.timestamp=new Date().getTime();
    let html = `<section class='${this.className}' data-id='${index}' data-unique='${this.timestamp}'>`;
    data.forEach((value, index) => {
      html += ` 
              <div class="item" data-target>
                <img class="pic" src='${value.pic}'>
                <p class="word">
                  <a href='${value.url}'>${value.title}</a>
                </p>
              </div>
              `
    })
    html += "</section>"
    return html;
  },
  bindFunc(){
    const node=document.querySelector(`[data-unique='${this.timestamp}']`);
    node.addEventListener("click",_=>{
      let ev = event || window.event;
      let target = ev.target;
      const parent=findSpecialParent("data-target",target);
      const index=siblingsIndex(parent);
      document.getElementById("container-phone-screen").setAttribute("data-index",index.toString());
    })
  }
}
export const findSpecialParent = (attribute, child) => {
  let parent = child.parentNode;
  if (parent && parent.hasAttribute) {
    if (parent.hasAttribute(attribute)) {
      return parent;
    } else {
      findSpecialParent(attribute, parent)
    }
  } else {
    return;
  }
}
export const siblingsIndex=(elm)=>{
  const p = elm.parentNode.children;
  for(var i =0;i<p.length;i++) {
      if(p[i] == elm){
         return i;
      }
  }
  return 0;
}
