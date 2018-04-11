import {
  findSpecialParent,
  baseComponent,
  siblingsIndex
} from './base';
export class MenuComponent implements baseComponent{
  public id: number = 1;
  public name: string = "菜单";
  public pic:string ="../assets/menu.png";
  public className:string =  "menu-component";
  public timestamp:number;  //唯一标识符
  public data:any = [{
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
  ];
  public constructor(time){
    this.timestamp=time
  };
  public render(index) {
    const data = this.data;
    let html = `<section class='${this.className}' data-id='${index}' data-unique='${this.timestamp}'>`;
    //console.log(html);
    data.forEach((value, index) => {
      let pic=value.pic || "../assets/nobody.png"
      html += ` 
              <div class="item" data-target>
                <span class="pic" style='background-image:url(${pic})'></span>
                <p class="word">
                  <a href='${value.url}'>${value.title}</a>
                </p>
              </div>
              `
    })
    html += "</section>"
    return html;
  };
  public bindFunc(){
    const node=document.querySelector(`[data-unique='${this.timestamp}']`);
    node.addEventListener("click",_=>{
      let ev = event || window.event;
      let target = ev.target;
      const parent=findSpecialParent("data-target",target);
      const index=siblingsIndex(parent);
      document.getElementById("container-phone-screen").setAttribute("data-index",index.toString());
    })
  };
  public setData(value){
    this.data = value;
  };
  public  getInstance(){
    let time=new Date().getTime();
    return new MenuComponent(time);
  }
  
}

