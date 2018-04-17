import {
  findSpecialParent,
  baseComponent,
  siblingsIndex,
  setSelectedClass
} from './base';
export class MenuComponent implements baseComponent {
  public id = {
    value:1
  };
  public maxChildrenNum={
    value:5
  };
  public name = {
    value: "菜单"
  };
  public pic = {
    value:"../assets/menu.png"
  };
  public className= {
    value:"menu-component"
  };
  public timestamp= {
    value:0
  }; //唯一标识符
  public data: any = [{
      '组件名称': "喜马拉雅",
      '图片': "../assets/nobody.png",
      '链接': "#",
    },
  ];
  public defaultData={
    '组件名称': "新增内容",
    '图片': "../assets/nobody.png",
    '链接': "#",
  };
  public constructor(time) {
    this.timestamp = { value:time }
  };
  public render(index,selectDataIndex) {
    const data = this.data;
    let html = `<section class='${this.className.value} '  data-unique='${this.timestamp.value}'><ul>`;
    data.forEach((value, index) => {
      let pic = value["图片"] || "../assets/nobody.png";
      if(index == selectDataIndex){
         html += `<li class="item selected" data-target>`
      } else{
         html += `<li class="item" data-target>`
      }
      html += ` 
                <span class="pic" style='background-image:url(${pic})'></span>
                <p class="word">
                  <a href='javascript:;'>${value["组件名称"]}</a>
                </p>
              </li>
              `
    })
    html += `</ul></section>`
    return html;
  };
  public preview(index){
    const data = this.data;
    let html = `<section class='${this.className.value}'>`;
    data.forEach((value) => {
      let pic = value["图片"] || "../assets/nobody.png";
      html += `<div class="item">`
      html += ` 
                <span class="pic" style='background-image:url(${pic})'></span>
                <p class="word">
                  <a href='${value["链接"]}'>${value["组件名称"]}</a>
                </p>
               </div>
              `
      })
    html += `</section>`
    return html;
  }
  public bindFunc() {
    const node = document.querySelector(`[data-unique='${this.timestamp.value}']`);
    //data-target层次的冒泡阶段监听(class=item)
    node.addEventListener("click", _ => {
      let ev = event || window.event;
      let target = ev.target;
      const parent = findSpecialParent("data-target", target);
      if (parent) {
        const componentBox = findSpecialParent("data-index", parent);
        setSelectedClass("selected", parent, componentBox); //设置选中样式
        const index = siblingsIndex(parent);
        document.getElementById("container-phone-screen").setAttribute("data-index", index.toString()); //记住选中的是组件data里面的第几条   
      }
    })
    //data-unique层次的捕获阶段事件监听(class=menu-component)
    node.addEventListener("click", _ => {
      //每次捕获到这里把data-index改为-1，如果data-target层次没被触发，就确定点中的是data-unique层次，不是data-target层次
      let ev = event || window.event;
      let target = ev.target;
      const componentBox = findSpecialParent("data-index", target);
      setSelectedClass("selected", target, componentBox); //设置选中样式
      document.getElementById("container-phone-screen").setAttribute("data-index", "-1");
    },true)
    
    //内容拖拽
    window["Sortable"].create(node.childNodes.item(0),{
      onUpdate: (event: any) => {
        let data= this.data;
        let temp=data[event.oldIndex];
        data[event.oldIndex]=data[event.newIndex];
        data[event.newIndex]=temp;
        //触发一下点击事件，更新选中的位置,这里不延迟的话会出现搞不清楚的状况，节点会选择错误
        setTimeout(function(){
          event.item.click();
        },100)
      },animation: 200
    });
  };
  public setData(value) {
    this.data = value;
  };
  public getInstance() {
    let time = new Date().getTime();
    return new MenuComponent(time);
  }
  
}

