import { findSpecialParent } from './app.component'
export const MenuComponent = {
  id: 1,
  name: "菜单",
  pic: "../assets/menu.png",
  className:"menu-component",
  data: [{
      title: "喜马拉雅",
      pic:"../assets/nobody.png",
      url: "",
    },
    {
      title: "精品课程",
      pic:"",      
      url: "",
    },
    {
      title: "签到有礼",
      pic:"",      
      url: "",
    },
    {
      title: "饮食专区",
      pic:"",      
      url: "",
    },
    {
      title: "会员登录",
      pic:"",      
      url: "",
    },
  ],
  render(index) {
    const data = this.data;
    let html = `<section class='${this.className}' data-id='${index}' onclick='${this.findChild(event)}'>`;
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
  findChild(event){
    let target=event.target;
    //findSpecialParent("data-target");
  }
}
