import {
  Component
} from '@angular/core';
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
  template = [{
    id: 1,
    name: "部件1",
    data: [{
        title: "喜马拉雅"
      },
      {
        title: "精品课程"
      },
      {
        title: "签到有礼"
      },
      {
        title: "饮食专区"
      },
      {
        title: "会员登录"
      },
    ],
    render: this.componentOneRender
  }];
  _templateArr = [];
  renderHtml = '';
  selectIndex = 0;
  constructor(private fb: FormBuilder) {}
 
  addComponent(id) {
    this.template.forEach((item, index) => {
      if (item.id == id) {
        const temp = this.templateArr;
        temp.push(item);
        this.templateArr = temp;
      }
    });
  }
  positionUp() {
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
  }
  //tempateArr自动渲染
  get templateArr() {
    return this._templateArr;
  }
  set templateArr(change) {
    this._templateArr = change;
    this.renderHtml = "";
    this._templateArr.forEach((item, index) => {
      item.render(this, index);
    })
  }
  //查找指定属性的父元素函数
  findSpecialParent(attribute, child) {
    const parent = child.parentNode;
    //console.log(parent);
    if (parent) {
      if (parent.hasAttribute(attribute)) {
       // console.log("find!",parent)
        return parent.getAttribute(attribute);
      } else {
        this.findSpecialParent(attribute, parent)
      }
    }else{
      return null;
    }

  }
  //组件数组处理
  handleData(event) {
    const target = event.target;
   // console.log(target.parentNode)
    const dataId=this.findSpecialParent("data-id",target); //data-id就是他在templateArr数组中的index
    this.selectIndex=dataId;
    console.log(this.templateArr)
  }
  //componentOne组件函数
  componentOneRender(_self, index) {
    const data = _self.templateArr[index]['data'];
    let html = `<section class='component-one' data-id='${index}' >`;
    data.forEach((value, index) => {
      html += ` 
      <div class="item">
       <span class="pic"></span>
       <p class="word">${value.title}</p>
      </div>`
    })
    html += `</section>`;
    _self.renderHtml += html;
    document.getElementById("container-phone-screen").innerHTML = _self.renderHtml;
  }
}
