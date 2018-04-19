import {
  findSpecialParent,
  baseComponent,
  siblingsIndex,
  setSelectedClass
} from './base';
export class AdvertisementComponent implements baseComponent {
  public id = {
    value: 3
  };
  public prevSelectDataIndex = {
    value: 0
  }
  public pic = {
    value: "../assets/menu.png"
  };
  public name = {
    value: "广告"
  };
  public data = [{
    '图标': "http://placehold.it/319x90",
    '链接': ""
  }, {
    '图标': "http://placehold.it/319x91",
    '链接': ""
  }, {
    '图标': "http://placehold.it/319x92",
    '链接': ""
  }];
  public timestamp = {
    value: 0
  };
  public defaultData = {
    '图标': "http://placehold.it/319x90",
    '链接': ""
  }
  public className = {
    value: "advertisement-component"
  };
  public button = {
    prev: "左移",
    next: "右移"
  }
  public maxChildrenNum = {
    value: 3
  };
  constructor(time) {
    this.timestamp.value = time
  };
  public render(isselected: any, selectDataIndex: any) {
    const data = this.data;
    let html = "";
    if (isselected) {
      html = `<section class='${this.className.value} selected'  data-unique='${this.timestamp.value}'> 
              <i class="anticon anticon-right-circle-o turn-right"></i>
              <i class="anticon anticon-left-circle-o turn-left"></i>
              <ul class="carousel"  style='margin-left:${-this.prevSelectDataIndex.value*319+'px'}' >`;
    } else {
      html = `<section class='${this.className.value}'  data-unique='${this.timestamp.value}'>
              <i class="anticon anticon-right-circle-o turn-right"></i>
              <i class="anticon anticon-left-circle-o turn-left"></i>
              <ul class="carousel" style='margin-left:${-this.prevSelectDataIndex.value*319+'px'}' data-position='${selectDataIndex}'>`;

    }
    if (selectDataIndex) {
      this.prevSelectDataIndex.value = selectDataIndex;
    }
    data.forEach((value, index) => {
      let pic = value["图标"] || "../assets/nobody.png";
      if (index == selectDataIndex) {
        html += `<li class="item selected" data-target>`
      } else {
        html += `<li class="item" data-target>`
      }
      html += `<img src="${value['图标']}"></li>`
    })
    html += `</ul></section>`
    return html;
  }
  public preview() {
    const data = this.data;
    let html = "";
    html = `<section class='${this.className.value}'  data-unique='${this.timestamp.value}'>
            <div class="overlay"></div>  
            <ul class="carousel">`;

    data.forEach((value, index) => {
      let pic = value["图标"] || "../assets/nobody.png";
      html += `<li class="item"><a href='${value['链接']}'><img src="${value['图标']}"></a></li>`
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
    //根据data-position设置margin-left
    const target = document.querySelector(`[data-unique='${this.timestamp.value}'] [data-position]`);
    if (target) {
      const position = target.getAttribute("data-position");
      target['style'].marginLeft = `${-319*parseInt(position)+'px'}`
    }
    //看上一个，下一个
    const prevButton = document.querySelector(`[data-unique='${this.timestamp.value}'] .turn-left`)
    const nextButton = document.querySelector(`[data-unique='${this.timestamp.value}'] .turn-right`)
    const ul = document.querySelector(`[data-unique='${this.timestamp.value}'] ul`)
    const margin = ul["style"].marginLeft.replace("px", "") - 0;
    if (margin > -319) {
      prevButton["style"].display = "none";
      nextButton["style"].display = "block";
    } else if (margin <= -638) {
      nextButton["style"].display = "none";
      prevButton["style"].display = "block";
    } else {
      nextButton["style"].display = "block";
      prevButton["style"].display = "block";
    }
    prevButton.addEventListener('click', event => {
      const ev = event || window.event;
      ev.preventDefault();
      const margin = ul["style"].marginLeft.replace("px", "") - 0;
      const m = margin - 0 + 319;
      ul["style"].marginLeft = m + "px";
      if (m > -319) {
        prevButton["style"].display = "none";
        nextButton["style"].display = "block";
      } else if (m < -638) {
        nextButton["style"].display = "none";
        prevButton["style"].display = "block";
      } else {
        nextButton["style"].display = "block";
        prevButton["style"].display = "block";
      }
    })
    nextButton.addEventListener('click', event => {
      const ev = event || window.event;
      //ev.stopPropagation();
      ev.preventDefault();
      const margin = ul["style"].marginLeft.replace("px", "") - 0;
      const m = margin - 319;
      ul["style"].marginLeft = m + "px";
      if (m > -319) {
        prevButton["style"].display = "none";
        nextButton["style"].display = "block";
      } else if (m <= -638) {
        nextButton["style"].display = "none";
        prevButton["style"].display = "block";
      } else {
        nextButton["style"].display = "block";
        prevButton["style"].display = "block";
      }
    })
  }
  public hasPreviewAction() {
    return true;
  }
  public previewAction() {
    const $ = window["$"];
    const timestamp = this.timestamp.value;
    const ul = document.querySelector(`#previewHtml [data-unique='${timestamp}'] ul`);
    let startX;
    let timer = setInterval(_ => {
      $(ul).animate({
        marginLeft: "-319px"
      }, 1800, _ => {
        $(ul).css("margin-left", 0);
        $(">li:first", ul).appendTo(ul);
      })
    }, 3000)
    /*手机滑动函数*/
    $(ul).on("touchstart", function (e) {
      // 判断默认行为是否可以被禁用
      if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
          e.preventDefault();
        }
      }
      startX = e.originalEvent.changedTouches[0].pageX
    })
    $(ul).on("touchend", function (e) {
      // 判断默认行为是否可以被禁用
      if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
          e.preventDefault();
        }
      }
      let moveEndX = e.originalEvent.changedTouches[0].pageX;
      let X = moveEndX - startX;
      //左滑
      if (X > 0) {
        alert('左滑');
      }
      //右滑
      else if (X < 0) {
        alert('右滑');
      } 
    })
    /*电脑滑动函数*/ 
    $(ul).on("mousedown",function(e){
      let ev = e || window.event;
      startX = e.clientX;
    })
    $(ul).on("mouseup",function(e){
      let ev = e || window.event;
      let endX = ev.clientX;
      let X    = endX-startX;
      if(X>50){
        alert("向右滑动")
      }else if(X<-50){
        alert("向左滑动")
      }
    })
    /*let turnRight=()=>{
      setTimeout(_ => {
        this.move(ul, 0, -319, 1000, function(){
          ul.appendChild(liList[0]);
          ul["style"].marginLeft = "0px";
          turnRight();
        });
      }, 500)
    }
    turnRight();*/
  }
  public buttonShow() {
    const prevButton = document.querySelector(`[data-unique='${this.timestamp.value}'] .turn-left`)
    const nextButton = document.querySelector(`[data-unique='${this.timestamp.value}'] .turn-right`)
    const ul = document.querySelector(`[data-unique='${this.timestamp.value}'] ul`)
    const margin = ul["style"].marginLeft.replace("px", "") - 0;
    const m = margin - 319;
    if (m > -319) {
      prevButton["style"].display = "none";
      nextButton["style"].display = "block";
    } else if (m < -638) {
      nextButton["style"].display = "none";
      prevButton["style"].display = "block";
    } else {
      nextButton["style"].display = "block";
      prevButton["style"].display = "block";
    }
  }
  public setData(value: any) {;
  }
  public getInstance() {
    let time = new Date().getTime();
    return new AdvertisementComponent(time);
  }
  /*
  public move(node, from, to, allTime, callBack) {
    const pxPerTenMS = (to - from) / allTime * 5;
    let marginLeft = node["style"].marginLeft.replace("px", "") - 0;
    let leftTime = allTime;
    go();

    function go() {
      setTimeout(_ => {
        marginLeft += pxPerTenMS;
        node["style"].marginLeft = marginLeft + "px";
        leftTime -= 5;
        if (leftTime > 0) {
          go();
        } else {
          callBack();
        }
      }, 5)
    }
  }
  */
}
