import { element } from 'protractor';
import { AdvertisementComponent } from './ad.component';
import { ListComponent } from './list.component';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  MenuComponent,
} from './menu.component'
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
import {
  HttpService
} from '../common/http.server'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
/**
 * data-index  记录当前选中的是第几个组件内容 -2 没选中任何东西 -1 选中了组件 0以上（数值参考base.ts
 *             里的constVar）选中了第几个组件内容
 * data-ul     鼠标右键菜单显示的ul专有，配合findSpecialParent用来确定选区
 * data-target 组件内的内容专有，配合findSpecialParent用来确定选区
 * data-unique 组件专有，其值由组件内部的timestamp确定，用来唯一标识组件
 * data-draggable-src 拖动时记录拖动源,sortable：sortable触发，template：左侧组件模板触发
 * previewAction函数为组件内预览时需要绑定的函数
 * data-drag-position 从组件模板处拖拽组件到页面配置中时，记录位置0开始
 */
export class AppComponent {
  _templateArr = [];

  template = [
    new MenuComponent(new Date().getTime()),
    new ListComponent(new Date().getTime()),
    new AdvertisementComponent(new Date().getTime())
  ];
  renderHtml = '';
  previewHtml = '';
  selectData; //当前选中的data
  selectIndex: number = -1;
  selectDataIndex: number //当前选中的组件里的data数组的第几条数据,根据这个获取selectData
  selectPosition = constVar.CHOOSE_NOTHING;
  dragTemplateId;
  myConstVar = constVar //给模板用的常量
  templateArrSortableOptions = {
    scroll: false,
    disabled: false,
    onStart : (event:any)=>{
      document.getElementById("container-phone-screen").setAttribute("data-draggable-src","sortable")
    },
    onUpdate: (event: any) => {
      this.selectIndex = event.newIndex;
      this.defineButton();
    }
  }; //sortablejs参数
  buttonPrev = true; //是否显示上移按钮
  buttonNext = true; //是否显示下移按钮
  buttonDelete = true; //是否显示删除按钮
  buttonAdd = true; //是否显示添加按钮
  isAvailable = false;
  fileList = [];

  constructor(private http: HttpService) {

  }
  ngOnInit() {
    //给container-phone-screen绑定捕获阶段函数，给data-index设定没被点击，清空selected样式
    const screen = document.getElementById("container-phone-screen");
    document.getElementById("container-phone").addEventListener("click", function () {
      //console.log(0)
      screen.setAttribute("data-index", constVar.DATA_INDEX_OF_CHOOSE_NOTHING.toString())
      setSelectedClass("selected", null, screen);
    }, true)

    /**绑定右键事件**/
    const myMenu = document.createElement("ul");
    //给ul委托左右移动，添加删除事件
    myMenu.addEventListener("click", event => {
      let action = event.target["getAttribute"]("id");
      if (action == "prev") {
        this.positionUp();
      } else if (action == "next") {
        this.positionDown();
      } else if (action == "delete") {
        this.delete();
      } else if (action == "add") {
        this.add(); 
      } else if(action == "chooseParent"){
        this.chooseParent();
      }else {
        return;
      }
      myMenu.style.display = "none";
    })
    myMenu.className = "myMenu";
    myMenu.setAttribute("data-ul", "myMenu");
    document.body.appendChild(myMenu);
    document.addEventListener("contextmenu", event => {
      event.preventDefault();
      event.target['click']();
      //根据选中位置生成右键菜单内容
      let menuContent = "";
      if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
        if (this.buttonPrev) {
          menuContent += `<li id='prev'>上移</li>`;
        }
        if (this.buttonNext) {
          menuContent += `<li id='next'>下移</li>`;
        }
        if (this.buttonAdd) {
          menuContent += `<li id='add'>添加</li>`;
        }
        if (this.buttonDelete) {
          menuContent += `<li id='delete'>删除</li>`;
        }
      } else if (this.selectPosition == constVar.CHOOSE_CONTENT) {
        if (this.buttonPrev) {
          menuContent += `<li id='prev'>${this.templateArr[this.selectIndex]["button"]["prev"]}</li>`;
        }
        if (this.buttonNext) {
          menuContent += `<li id='next'>${this.templateArr[this.selectIndex]["button"]["next"]}</li>`;
        }
        if (this.buttonAdd) {
          menuContent += `<li id='add'>添加</li>`;
        }
        if (this.buttonDelete) {
          menuContent += `<li id='delete'>删除</li>`;
        }
        menuContent += `<li id="chooseParent">选择父元素</li>`
      } else {
        return;
      }
      myMenu.innerHTML = menuContent;
      myMenu.style.display = "block";
      //获取鼠标视口位置
      myMenu.style.top = document.documentElement.scrollTop + event.clientY + "px";
      myMenu.style.left = event.clientX + "px";
    });
    //点击取消显示
    document.addEventListener("mousedown", event => {
      const target = findSpecialParent("data-ul", event.target);
      if (target == null) {
        myMenu.style.display = "none";
      }
    });
    /**end */

    //改变sortablejs参数
    screen.addEventListener("mousedown", (event) => {
      const target = findSpecialParent("data-target", event.target);
      if (target == null) {
        this.templateArrSortableOptions = {
          scroll: false,
          disabled: false,
          onStart : (event:any)=>{
            document.getElementById("container-phone-screen").setAttribute("data-draggable-src","sortable")
          },
          onUpdate: (event: any) => {
            this.selectIndex = event.newIndex;
            this.defineButton();
          }
        };
      } else {
        this.templateArrSortableOptions = {
          scroll: false,
          disabled: true,
          onStart : (event:any)=>{
            document.getElementById("container-phone-screen").setAttribute("data-draggable-src","sortable")
          },
          onUpdate: (event: any) => {
            this.selectIndex = event.newIndex;
            this.defineButton();
          }
        };
      }
    });
  }
  //增加组件
  addComponent(id,position=-1) {
      this.template.forEach((item, index) => {
        if (item.id.value == id.value) {
          this.selectIndex = position==-1?this.templateArr.length:position;
         
          this.templateArr.splice(this.selectIndex,0,item.getInstance());
          console.log("position="+position+",length="+this.templateArr.length);
          this.selectPosition = constVar.CHOOSE_COMPONENT;
          document.getElementById("container-phone-screen")
                  .setAttribute("data-index", constVar.DATA_INDEX_OF_CHOOSE_COMPONENT.toString());
          this.selectData = objToArr(this.templateArr[this.selectIndex]);
          this.templateArr = this.templateArr; //触发set重新渲染
        }
      });
    this.defineButton();
  }
  //从组件内容选中组件本身
  chooseParent(){
    let $ =window["$"];
    $(`>section:nth-of-type(${this.selectIndex+1})`,"#container-phone-screen").click();
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
        if (this.templateArr.length == 0) {
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
      } else if (this.selectDataIndex == 0 && !this.templateArr[this.selectIndex]["data"].length) {
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
    //console.log("4.handleData")
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
    //重新绑定样式
    if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
      const componentBox = findSpecialParent("data-index", target);
      const dom = document.getElementById("container-phone-screen").querySelectorAll("section").item(this.selectIndex);
      setSelectedClass("selected",dom, componentBox); //设置选中样式
    }
    this.defineButton();
  }
  //重新渲染某个组件的函数
  renderComponent() {
    const timeStart = new Date().getTime();
    const index = this.selectIndex;
    let newHtml;
    if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
      if(this.selectIndex == index){
        newHtml = this.templateArr[index].render(true);
      }else{
        newHtml = this.templateArr[index].render();
      }
    } else if (this.selectPosition == constVar.CHOOSE_CONTENT) {
      if(this.selectIndex == index){
        newHtml = this.templateArr[index].render(false, this.selectDataIndex);
      }else{
        newHtml = this.templateArr[index].render(false);
      }
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
    const timeEnd = new Date().getTime();
    console.log("重新渲染单个组件,共耗时：" + (timeEnd - timeStart) + "毫秒")
  }
  //预览
  preview($event) {
    if (this.isAvailable == false) {
      this.isAvailable = true;
      $event.currentTarget.innerText = "关闭";
      document.getElementById("preview").style.display = "block";
      this.previewHtml = "";
      this.templateArr.forEach((item, index) => {
        this.previewHtml += item.preview(index);
      })
      document.getElementById("previewHtml").innerHTML = this.previewHtml;
      this.templateArr.forEach((item, index) => {
        if(item.hasPreviewAction()){
          item.previewAction();
        }
      })
    } else {
      document.getElementById("preview").style.display = "none";
      document.getElementById("previewHtml").innerHTML = this.previewHtml;
      this.previewHtml = "";
      this.isAvailable = false;
      $event.currentTarget.innerText = "预览";
    }

  }
  //tempateArr自动渲染
  get templateArr() {
    return this._templateArr;
  }
  set templateArr(change) {
    const timeStart = new Date().getTime();
    const screen = document.getElementById("container-phone-screen");
    this._templateArr = change;
    this.renderHtml = "";
    //渲染模板
    this._templateArr.forEach((item, index) => {
      if(this.selectPosition == constVar.CHOOSE_COMPONENT){
        if(this.selectIndex == index){
          this.renderHtml += item.render(true);
        }else{
          this.renderHtml += item.render(false);
        }
      }else if(this.selectPosition == constVar.CHOOSE_CONTENT){
        if(this.selectIndex == index){
          this.renderHtml += item.render(false,this.selectDataIndex);
        }else{
          this.renderHtml += item.render(false);
        }
      }else{
        return ;
      }
    })
    screen.innerHTML = this.renderHtml;
    //绑定函数
    this._templateArr.forEach((item, index) => {
      item.bindFunc();
    })
    //获取第一个组件到选中组件的高度a，scrollTop为（a-screen）/2
   // const screenScrollTop = document.querySelector("#container-phone-screen>.selected")["offsetTop"]-document.querySelector("#container-phone-screen").clientHeight/2;
   // screen.scrollTo(0, screenScrollTop);
    const timeEnd = new Date().getTime();
    console.log("重新渲染所有组件，共耗时：" + (timeEnd - timeStart) + "毫秒")
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
  //文件上传
  beforeUpload() {
    const pic = document.getElementById('pic');
    //console.log(pic);
    pic.click();
  }
  upload(event) {
    const file = event.currentTarget.files[0];
    //console.log(file);
    const formData = new FormData();
    formData.append('imgFiles', file);
    this.http.post("http://k.21cn.com/api/publish/uploadUserPic.do", formData)
      .then(res => {
        //console.log(res)
        if (this.selectPosition == constVar.CHOOSE_COMPONENT) {
          this.templateArr[this.selectIndex]['图标'] = res.list[0]["url"];
        } else {
          this.templateArr[this.selectIndex]['data'][this.selectDataIndex]['图标'] = res.list[0]["url"];
        }
        this.renderComponent();
      })
      .catch(res => {
        console.log(res)
      })
  }

  /**菜单栏拖到手机屏幕区域的拖动事件*/
  drag(ev, id) {
    const screen=document.getElementById("container-phone-screen")
    screen.setAttribute("data-draggable-src","template");
    screen.setAttribute("data-drag-position","-1");
    this.dragTemplateId = id;
  }
  drop(ev) {
    const $ = window["$"];
    const screen = document.getElementById("container-phone-screen")
    const dragSrc = screen.getAttribute("data-draggable-src");
    //确认位置
    const index = $(screen).attr("data-drag-position");
    if (dragSrc != "sortable") {
       this.addComponent(this.dragTemplateId,index);
    }
  }
  dragover(ev) {
    ev.preventDefault();
  }
  /**end*/
}
