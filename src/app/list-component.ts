import {
  findSpecialParent,
  baseComponent,
  siblingsIndex,
  setSelectedClass
} from './base';
export class ListComponent implements baseComponent {
  public id = {
    value: 2
  };
  public name = {
    value: "列表"
  };
  public pic = {
    value: "../assets/menu.png"
  };
  public data = [{
      '标题': '我们需要什么样的文学观?',
      '小标题': "21天系统化教你上手带团队",
      '图标': "http://placehold.it/60x70",
      '原价': 20,
      '现价': 20,
      '链接': ""
    },
    /*{
      '标题': '日剧里的吃',
      '小标题': "解答购房困惑，助你财富逆袭",
      '图标': "http://placehold.it/30x30",
      '原价': 20,
      '现价': 20
    },
    {
      '标题': '你是因为听了周杰伦的哪首歌',
      '小标题': "科学瘦八斤，高效不反弹",
      '图标': "http://placehold.it/30x30",
      '原价': 20,
      '现价': 20
    }*/
  ]
  public timestamp = {
    value: 0
  }; //唯一标识符
  public defaultData = {
    '标题': '请填写标题',
    '小标题': "请填写小标题",
    '图标': "http://placehold.it/60x70",
    '原价': 20,
    '现价': 20,
    '链接': ""
  }
  public className = {
    value: "list-component"
  };
  public button = {
    prev: "上移",
    next: "下移"
  }
  public maxChildrenNum = {
    value: 3
  };
  public constructor(time) {
    this.timestamp = {
      value: time
    }
  };
  public getInstance() {
    let time = new Date().getTime();
    return new ListComponent(time);
  }
  public render(isselect, selectDataIndex) {
    const data = this.data;
    let html = "";
    if (isselect) {
      html = `<section class='${this.className.value} selected'  data-unique='${this.timestamp.value}'><ul>`;
    } else {
      html = `<section class='${this.className.value}'  data-unique='${this.timestamp.value}'><ul>`;
    }
    data.forEach((value, index) => {
      let pic = value["图标"] || "../assets/nobody.png";
      if (index == selectDataIndex) {
        html += `<li class="item selected" data-target>`
      } else {
        html += `<li class="item" data-target>`
      }
      html += ` 
        <div class='left'>
          <span class="pic" style='background-image:url(${pic})'></span>
        </div>
        <div class='right'>
          <p class="title">${value['标题']}</p>
          <p class="sub-title">${value['小标题']}</p>
          <p class="price">
            <span class="original-price">${value['原价']}元</span>
            <span class="discount-price">${value['现价']}元</span>
          </p>
        </div>
       </li>`
    })
    html += `</ul></section>`
    return html;
  }
  public preview() {
    const data = this.data;
    let html = `<section class='${this.className.value}'><ul>`;
    data.forEach((value, index) => {
      let pic = value["图标"] || "../assets/nobody.png";
      html += ` 
       <li class="item">
        <div class='left'>
         <a href='${value['链接']}'>
          <span class="pic" style='background-image:url(${pic})'></span>
         </a>
        </div>
        <div class='right'>
          <p class="title">${value['标题']}</p>
          <p class="sub-title">${value['小标题']}</p>
          <p class="price">
            <span class="original-price">${value['原价']}元</span>
            <span class="discount-price">${value['现价']}元</span>
          </p>
        </div>
       </li>`
    })
    html += `</ul></section>`
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
    }, true)

    //内容拖拽
    window["Sortable"].create(node.childNodes.item(0), {
      scroll: false,
      onUpdate: (event: any) => {
        let data = this.data;
        let temp = data[event.oldIndex];
        data[event.oldIndex] = data[event.newIndex];
        data[event.newIndex] = temp;
        //触发一下点击事件，更新选中的位置,这里不延迟的话会出现搞不清楚的状况，节点会选择错误
        setTimeout(function () {
          event.item.click();
        }, 100);
      },
      animation: 200
    });

  }
  public setData() {}
}
