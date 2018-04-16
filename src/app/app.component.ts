import {
  Component,
  OnInit
} from '@angular/core';
import {
  MenuComponent
} from './menuComponent'
import {
  findSpecialParent,
  objToArr,
  constVar,
  setSelectedClass,
  siblingsIndex,
  clone
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
  _templateArr = [];

  template = [
    new MenuComponent(new Date().getTime())
  ];
  renderHtml = '';
  previewHtml = '';
  selectData; //当前选中的data
  selectIndex: number = -1;
  selectDataIndex: number //当前选中的组件里的data数组的第几条数据,根据这个获取selectData
  selectPosition = constVar.CHOOSE_NOTHING;

  myConstVar = constVar //给模板用的常量
  sortableOptions; //sortablejs参数
  buttonPrev = true; //是否显示上移按钮
  buttonNext = true; //是否显示下移按钮
  buttonDelete = true; //是否显示删除按钮
  buttonAdd = true; //是否显示添加按钮
  isAvailable = false;
  ngOnInit() {
    //给container-phone-screen绑定捕获阶段函数，给data-index设定没被点击，清空selected样式
    document.getElementById("container-phone").addEventListener("click", function () {
      document.getElementById("container-phone-screen").setAttribute("data-index", constVar.DATA_INDEX_OF_CHOOSE_NOTHING.toString())
      setSelectedClass("selected", null, document.getElementById("container-phone-screen"));
    }, true)
    //拖动参数
    this.sortableOptions = {
      onUpdate: (event: any) => {
        this.selectIndex = event.newIndex;
        this.defineButton();
      }
    };

  }


  //增加组件
  addComponent(id) {
    this.template.forEach((item, index) => {
      if (item.id == id) {
        this.templateArr.push(item.getInstance());
        this.selectIndex = this.templateArr.length - 1;
        this.selectPosition = constVar.CHOOSE_COMPONENT;
        document.getElementById("container-phone-screen")
          .setAttribute("data-index", constVar.DATA_INDEX_OF_CHOOSE_COMPONENT.toString());
        this.selectData = objToArr(this.templateArr[this.selectIndex]);
        this.templateArr = this.templateArr; //触发set重新渲染
      }
    });
    document.getElementById("container-phone-screen").scrollTo(0,document.body.scrollHeight)
    this.defineButton();
  }
  //上移
  positionUp() {
    if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
      if (this.selectIndex == 0) {
        return;
      } else {
        let temp = this.templateArr[this.selectIndex - 1];
        this.templateArr[this.selectIndex - 1] = this.templateArr[this.selectIndex];
        this.templateArr[this.selectIndex] = temp;
        this.selectIndex--;
        this.templateArr = this.templateArr //触发set
      }
    } else if (this.selectPosition == constVar.CHOOSE_CONTENT) {
      if (this.selectDataIndex == 0) {
        return;
      } else {
        let temp = this.templateArr[this.selectIndex]["data"][this.selectDataIndex - 1];
        this.templateArr[this.selectIndex]["data"][this.selectDataIndex - 1] = this.templateArr[this.selectIndex]["data"][this.selectDataIndex];
        this.templateArr[this.selectIndex]["data"][this.selectDataIndex] = temp;
        this.selectDataIndex--;
        this.renderComponent();
      }
    } else {
      return;
    }
    this.defineButton()
  }
  //下移
  positionDown() {
    if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
      if (this.selectIndex == this.templateArr.length - 1) {
        return;
      } else {
        let nextIndex = this.selectIndex - 0 + 1;
        let temp = this.templateArr[nextIndex];
        this.templateArr[nextIndex] = this.templateArr[this.selectIndex];
        this.templateArr[this.selectIndex] = temp;
        this.selectIndex++;
        this.templateArr = this.templateArr //触发set
      }
    } else if (this.selectPosition == constVar.CHOOSE_CONTENT) {
      if (this.selectDataIndex == this.templateArr[this.selectIndex]["data"].length - 1) {
        return;
      } else {
        let nextIndex = this.selectDataIndex - 0 + 1;
        let temp = this.templateArr[this.selectIndex]["data"][nextIndex];
        this.templateArr[this.selectIndex]["data"][nextIndex] = this.templateArr[this.selectIndex]["data"][this.selectDataIndex];
        this.templateArr[this.selectIndex]["data"][this.selectDataIndex] = temp;
        this.selectDataIndex++;
        this.renderComponent();
      }
    } else {
      return;
    }
    this.defineButton()
  }
  //删除
  delete() {
    if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
      //删除组件
      this.templateArr.splice(this.selectIndex, 1);
      if (this.selectIndex - 1 >= 0) {
        this.selectIndex--;
      } else {
        this.selectIndex = 0;
        if(this.templateArr.length == 0){
          this.selectPosition = constVar.CHOOSE_NOTHING;
        }
      }
      this.templateArr = this.templateArr //触发
    } else if (this.selectPosition == constVar.CHOOSE_CONTENT) {
      //删除组件内容
      // console.log("选中第"+this.selectIndex+"个组件")
      this.templateArr[this.selectIndex]["data"].splice(this.selectDataIndex, 1);
      if (this.selectDataIndex == 0 && this.templateArr[this.selectIndex]["data"].length) {
        this.selectDataIndex = 0;
      } else if(this.selectDataIndex == 0 && !this.templateArr[this.selectIndex]["data"].length){
        this.selectDataIndex = 0;
        this.selectPosition = constVar.CHOOSE_COMPONENT;
        this.selectData = [];
      } else {
        this.selectDataIndex--;
      }
      this.renderComponent();
    }
    this.defineButton()
  }
  //添加
  add() {
    const useTemplate = this.templateArr[this.selectIndex];
    const addData = clone(useTemplate["defaultData"]);
    const maxChildrenNum = useTemplate["maxChildrenNum"]["value"];
    if (useTemplate["data"].length < maxChildrenNum) {
      this.templateArr[this.selectIndex]["data"].push(addData);
      this.selectDataIndex = useTemplate["data"].length - 1;
      this.renderComponent();
    }
    //重新确定button显示
    this.defineButton()
  }
  //组件数组处理
  handleData(event) {
    const target = event.target;
    //确定selectIndex，知道选中哪个组件
    const parent = findSpecialParent("data-unique", target);
    if (parent) {
      this.selectIndex = siblingsIndex(parent);
    }
    //把该组件的data转为数组，方便输出

    this.selectDataIndex = event.currentTarget.getAttribute("data-index");
    if (this.selectDataIndex == constVar.DATA_INDEX_OF_CHOOSE_NOTHING) { //没选中东西
      this.selectPosition = constVar.CHOOSE_NOTHING;
    } else if (this.selectDataIndex == constVar.DATA_INDEX_OF_CHOOSE_COMPONENT) { //选中的是组件本身
      this.selectData = objToArr(this.templateArr[this.selectIndex]);
      this.selectPosition = constVar.CHOOSE_COMPONENT;
    } else { //选中组件内容
      this.selectData = objToArr(this.templateArr[this.selectIndex]['data'][this.selectDataIndex]);
      this.selectPosition = constVar.CHOOSE_CONTENT;
    }
    if (this.selectPosition == constVar.CHOOSE_CONTENT) {
      console.log("选中第" + this.selectIndex + "个组件的第" + this.selectDataIndex + "项")
    } else if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
      console.log("选中第" + this.selectIndex + "个组件")
    } else {
      console.log("没选中")
    }
    this.defineButton();
  }
  //重新渲染某个组件的函数
  renderComponent() {
    console.log("重新渲染单个组件")
    const index = this.selectIndex;
    let newHtml;
    if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
      newHtml = this.templateArr[index].render(index);
    } else if (this.selectPosition == constVar.CHOOSE_CONTENT) {
      newHtml = this.templateArr[index].render(index, this.selectDataIndex);
    }
    //字符串转为node
    const node = document.createElement("div");
    node.innerHTML = newHtml;
    const newNode = node.childNodes.item(0);
    const dataUnique = newNode.attributes["data-unique"].nodeValue;
    //替换
    const oldChild = document.querySelector(`[data-unique='${dataUnique}']`);
    const parent = oldChild.parentNode;
    if (parent) {
      parent.replaceChild(newNode, oldChild);
    }
    //重新绑定函数
    this.templateArr[index].bindFunc(index);
    //重新绑定样式
    if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
      const dom = document.getElementById("container-phone-screen").querySelectorAll("section").item(this.selectIndex);
      dom.className = dom.className + " selected"
    }
  }
  //预览
  preview($event) {
    if (this.isAvailable == false) {
      this.isAvailable = true;
      $event.currentTarget.innerText="关闭";
      document.getElementById("preview").style.display="block";
      this.previewHtml = "";
      this.templateArr.forEach((item, index) => {
        this.previewHtml += item.preview(index);
      })
      document.getElementById("previewHtml").innerHTML=this.previewHtml;
    } else {
      document.getElementById("preview").style.display="none";
      document.getElementById("previewHtml").innerHTML=this.previewHtml;
      this.previewHtml = "";
      this.isAvailable = false;
      $event.currentTarget.innerText="预览";
    }

  }

  //tempateArr自动渲染
  get templateArr() {
    return this._templateArr;
  }
  set templateArr(change) {
    console.log("重新渲染所有组件")
    this._templateArr = change;
    this.renderHtml = "";
    //渲染模板
    this._templateArr.forEach((item, index) => {
      if (this.selectIndex == index && this.selectPosition == constVar.CHOOSE_CONTENT) {
        this.renderHtml += item.render(index, this.selectDataIndex);
      } else {
        this.renderHtml += item.render(index);
      }
    })
    document.getElementById("container-phone-screen").innerHTML = this.renderHtml;
    //绑定函数
    this._templateArr.forEach((item, index) => {
      item.bindFunc();
    })
    //selected样式绑定
    if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
      const dom = document.getElementById("container-phone-screen")
        .querySelectorAll("section").item(this.selectIndex);
      if (dom) {
        dom.className = dom.className + " selected"
      }
    }
  }
  //判断按钮是否显示
  defineButton() {
    if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
      const value = this.selectIndex;
      const lenght = this.templateArr.length;
      //删除按钮
      if (value < 0) {
        this.buttonDelete = false;
      } else {
        this.buttonDelete = true;
      }
      //向前按钮
      if (value <= 0) {
        this.buttonPrev = false;
      } else {
        this.buttonPrev = true;
      }
      //向后按钮
      if (value < lenght - 1 && value >= 0) {
        this.buttonNext = true;
      } else {
        this.buttonNext = false;
      }
       //添加按钮
       if (this.templateArr[this.selectIndex]["data"].length < this.templateArr[this.selectIndex]["maxChildrenNum"].value) {
        this.buttonAdd = true;
      } else {
        this.buttonAdd = false;
      }
    } else if (this.selectPosition == constVar.CHOOSE_CONTENT) {
      const lenght = this.templateArr[this.selectIndex]["data"].length;
      const max = this.templateArr[this.selectIndex]["maxChildrenNum"].value;
      const value = this.selectDataIndex;
      //删除按钮
      if (value < 0) {
        this.buttonDelete = false;
      } else {
        this.buttonDelete = true;
      }
      //添加按钮
      if (lenght < max) {
        this.buttonAdd = true;
      } else {
        this.buttonAdd = false;
      }
      //向前按钮
      if (value <= 0) {
        this.buttonPrev = false;
      } else {
        this.buttonPrev = true;
      }
      //向后按钮
      if (value < lenght - 1 && value >= 0) {
        this.buttonNext = true;
      } else {
        this.buttonNext = false;
      }
    } else {
      this.buttonAdd = this.buttonDelete = this.buttonNext = this.buttonPrev = false;
    }
  }
}