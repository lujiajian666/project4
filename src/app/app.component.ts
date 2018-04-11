import {
  Component
} from '@angular/core';
import {
  MenuComponent
} from './menuComponent'
import {
  findSpecialParent,
  objToArr
} from './base';
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
     new MenuComponent(new Date().getTime())
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
        this.templateArr.push(item.getInstance());
        this.templateArr=this.templateArr;//触发set重新渲染
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
    //渲染模板
    this._templateArr.forEach((item, index) => {
      this.renderHtml += item.render(index);
    })
    document.getElementById("container-phone-screen").innerHTML = this.renderHtml;
    //绑定函数
    this._templateArr.forEach((item, index) => {
      item.bindFunc();
    })
  }
  

  
  //组件数组处理
  handleData(event) {
    const target = event.target;
    //确定selectIndex，知道选中哪个组件
    const parent=findSpecialParent("data-id", target);
    this.selectIndex=parseInt(parent.getAttribute("data-id"));
    //findSpecialParent("data-id",target,this.selectIndex);
    //把该组件的data转为数组，方便输出
    this.selectDataIndex=event.currentTarget.getAttribute("data-index");
    this.selectData=objToArr(this.templateArr[this.selectIndex]['data'][this.selectDataIndex]);
    //console.error(this.selectData)
    console.log("选中第" + this.selectIndex + "个组件的第"+this.selectDataIndex+"项")
  }
  //重新渲染某个组件的函数
  renderComponent() {
    console.log("renderCall")
    const index = this.selectIndex;
    const newHtml = this.templateArr[index].render(index);
    //console.log(newHtml)
    //字符串转为node
    const node = document.createElement("div");
    node.innerHTML = newHtml;
    const newNode = node.childNodes.item(0);
    //替换
    const oldChild = document.querySelector(`[data-id='${index}']`);
    const parent = oldChild.parentNode;
    if (parent) {
      parent.replaceChild(newNode, oldChild);
    }
    //重新绑定函数
    this.templateArr[index].bindFunc(index);
  }
 
}
