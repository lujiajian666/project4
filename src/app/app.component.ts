import {
  Component
} from '@angular/core';
import {
  MenuComponent
} from './menuComponent'

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  template = [
    MenuComponent,
  ];
  _templateArr = [];
  renderHtml = '';
  selectIndex = 0;
  selectDataIndex //当前选中的data的index,根据这个获取selectData
  selectData ; //当前选中的data
  constructor(private fb: FormBuilder) {}

  addComponent(id) {
    this.template.forEach((item, index) => {
      if (item.id == id) {
        const temp = this.templateArr;
        temp.push(clone(item));
        this.templateArr = temp;
      }
    });
  }
  /*positionUp() {
    if (this.selectIndex == 0) {
      return;
    } else {
      let temp = this.templateArr[this.selectIndex - 1];
      this.templateArr[this.selectIndex - 1] = this.templateArr[this.selectIndex];
      this.templateArr[this.selectIndex] = temp;
      this.selectIndex--;
    }
  }
  positionDown() {
    if (this.selectIndex == this.templateArr.length - 1) {
      return;
    } else {
      let temp = this.templateArr[this.selectIndex + 1];
      this.templateArr[this.selectIndex + 1] = this.templateArr[this.selectIndex];
      this.templateArr[this.selectIndex] = temp;
      this.selectIndex++;
    }
  }*/
  
  //tempateArr自动渲染
  get templateArr() {
    return this._templateArr;
  }
  set templateArr(change) {
    console.log("重新渲染")
    this._templateArr = change;
    this.renderHtml = "";
    this._templateArr.forEach((item, index) => {
      this.renderHtml += item.render(index);
    })
    document.getElementById("container-phone-screen").innerHTML = this.renderHtml;
  }
  

  
  //组件数组处理
  handleData(event) {
    const target = event.target;
    console.log(target);
    /*//确定selectIndex，知道选中哪个组件
    const parent=findSpecialParent("data-id", target);
    console.log(parent);
    this.selectIndex=parseInt(parent.getAttribute("data-id"));*/
    findSpecialParent("data-id",target,this.selectIndex);
    //把该组件的data转为数组，方便输出
    this.selectData=this.templateArr[this.selectIndex]['data'].map((item,index,array)=>{
        return item=objToArr(item);
    });

    console.log("选中第" + this.selectIndex + "个组件")
  }
  //重新渲染某个组件的函数
  renderComponent() {
    console.log("renderCall")
    const index = this.selectIndex;
    const newHtml = this.templateArr[index].render(this, index);
    //字符串转为node
    const node = document.createElement("div");
    node.innerHTML = newHtml;
    const newNode = node.childNodes.item(0);
    //console.log(newNode)
    const oldChild = document.querySelector(`[data-id='${index}']`);
    const parent = oldChild.parentNode;
    if (parent) {
      parent.replaceChild(newNode, oldChild);
    }
  }
 
}

//公共函数
export const findSpecialParent =(attribute, child,select)=>{
  let parent = child.parentNode;
  console.log(parent)
  if (parent && parent.hasAttribute) {
    if (parent.hasAttribute(attribute)) {
      select=parent.getAttribute(attribute);
      //return parent;
    } else {
      findSpecialParent(attribute, parent,select)
    }
  } else {
    return;
  }
}
//克隆函数
export const clone=(obj)=>{
  var o;
  if (typeof obj == "object") {
    if (obj === null) {
      o = null;
    } else {
      if (obj instanceof Array) {
        o = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(this.clone(obj[i]));
        }
      } else {
        o = {};
        for (var k in obj) {
          o[k] = this.clone(obj[k]);
        }
      }
    }
  } else {
    o = obj;
  }
  return o;
}
 //对象转数组
export const objToArr=(obj)=>{
  const arr=[];
  for(let i in obj){
    arr.push([i,obj[i]]);
  }
  return arr;
}