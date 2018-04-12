import {
  Component,OnInit
} from '@angular/core';
import {
  MenuComponent
} from './menuComponent'
import {
  findSpecialParent,
  objToArr,
  constVar
} from './base';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  sortablejs
} from 'sortablejs'
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
  selectIndex:number = 0;
  selectDataIndex:number //当前选中的data的index,根据这个获取selectData
  selectData; //当前选中的data
  selectComponent=constVar.CHOOSE_NOTHING;
  myConstVar=constVar //给模板用的
  ngOnInit(){
    //给container-phone-screen绑定捕获阶段函数，给data-index设定没被点击
    document.getElementById("container-phone").addEventListener("click",function(){
       document.getElementById("container-phone-screen").setAttribute("data-index",constVar.DATA_INDEX_OF_CHOOSE_NOTHING.toString())
    },true)
   
  }
  
  //增加组件
  addComponent(id) {
    this.template.forEach((item, index) => {
      if (item.id == id) {
        this.templateArr.push(item.getInstance());
        this.templateArr = this.templateArr; //触发set重新渲染
      }
    });
  }
  //上移
  positionUp() {
    if (this.selectComponent==constVar.CHOOSE_COMPONENT) {
      if (this.selectIndex == 0) {
        return;
      } else {
        let temp = this.templateArr[this.selectIndex - 1];
        this.templateArr[this.selectIndex - 1] = this.templateArr[this.selectIndex];
        this.templateArr[this.selectIndex] = temp;
        this.selectIndex--;
        this.templateArr = this.templateArr //触发set
      }
    } else if(this.selectComponent==constVar.CHOOSE_CONTENT){
      if (this.selectDataIndex == 0){
        return ;
      }else{
        let temp = this.templateArr[this.selectIndex]["data"][this.selectDataIndex-1];
        this.templateArr[this.selectIndex]["data"][this.selectDataIndex-1] = this.templateArr[this.selectIndex]["data"][this.selectDataIndex];
        this.templateArr[this.selectIndex]["data"][this.selectDataIndex] = temp;
        this.selectDataIndex--;
        this.renderComponent();   
      }
    } else {
      return ;
    }

  }
  //下移
  positionDown() {
    //console.log("1",this.templateArr[this.selectIndex]["data"]);
    if (this.selectComponent==constVar.CHOOSE_COMPONENT) {
      if (this.selectIndex == this.templateArr.length - 1) {
        return;
      } else {
        let nextIndex=this.selectIndex-0+1;
        let temp = this.templateArr[nextIndex];
        this.templateArr[nextIndex] = this.templateArr[this.selectIndex];
        this.templateArr[this.selectIndex] = temp;
        this.selectIndex++;
        this.templateArr = this.templateArr //触发set
      }
    } else if(this.selectComponent==constVar.CHOOSE_CONTENT){
      //console.log("2",this.templateArr[this.selectIndex]["data"]);
      if (this.selectDataIndex == this.templateArr[this.selectIndex]["data"].length-1){
        return ;
      }else{
        let nextIndex=this.selectDataIndex-0+1;
        let temp = this.templateArr[this.selectIndex]["data"][nextIndex];
        this.templateArr[this.selectIndex]["data"][nextIndex] = this.templateArr[this.selectIndex]["data"][this.selectDataIndex];
        this.templateArr[this.selectIndex]["data"][this.selectDataIndex] = temp;
        this.selectDataIndex++;
        //console.log("3",this.templateArr[this.selectIndex]["data"])
        this.renderComponent();   
      }
    } else {
      return ;
    }

  }
  //删除
  delete(){
    if(this.selectComponent==constVar.CHOOSE_COMPONENT){
      //删除组件
      this.templateArr.splice(this.selectIndex,1);
      if(this.selectIndex-1>=0){
        this.selectIndex--;
      }else{
        this.selectIndex=0;
      }
      this.templateArr = this.templateArr //触发
    }else if(this.selectComponent==constVar.CHOOSE_CONTENT){
      //删除组件内容
      this.templateArr[this.selectIndex]["data"].splice(this.selectDataIndex,1);
      if(this.selectDataIndex-1>=0){
         this.selectDataIndex--;
      }else{
         this.selectDataIndex = 0;
      }

      if(this.templateArr[this.selectIndex]["data"]<=0){//全部内容都删了,组件也删掉
        this.templateArr.splice(this.selectIndex,1);
        this.selectDataIndex = -1;
        this.selectIndex--;
        this.templateArr = this.templateArr //触发
      }else{
        console.log("123")
        this.renderComponent();
      }
      
      
    }
  }
  //添加
  add(){
    const useTemplate = this.templateArr[this.selectIndex];
    const addData = useTemplate["defaultData"];
    const maxChildrenNum=useTemplate["maxChildrenNum"];
    if(useTemplate["data"].length < maxChildrenNum){
      this.templateArr[this.selectIndex]["data"].push(addData); 
      this.selectDataIndex=useTemplate["data"].length-1;
      console.log(this.selectDataIndex);
      this.renderComponent();
    }
    
  }

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
      if (this.selectIndex == index && this.selectComponent==constVar.CHOOSE_CONTENT) {
        this.renderHtml += item.render(index, this.selectDataIndex);
      }else{
        this.renderHtml += item.render(index);
      }
    })
    document.getElementById("container-phone-screen").innerHTML = this.renderHtml;
    //绑定函数
    this._templateArr.forEach((item, index) => {
      item.bindFunc();
    })
    //selected样式绑定
    if (this.selectComponent==constVar.CHOOSE_COMPONENT) {
      const dom = document.getElementById("container-phone-screen").querySelectorAll("section").item(this.selectIndex);
      dom.className = dom.className + " selected"
    }
    //拖拽
    const el=document.getElementById("container-phone-screen");
    const sortable=sortablejs;
    sortable.create(el);
    
  }
  //组件数组处理
  handleData(event) {
    const target = event.target;
    //确定selectIndex，知道选中哪个组件
    const parent = findSpecialParent("data-id", target);
    if (parent) {
      this.selectIndex = parseInt(parent.getAttribute("data-id"));
    }
    //把该组件的data转为数组，方便输出
    this.selectDataIndex = event.currentTarget.getAttribute("data-index");
    if (this.selectDataIndex == constVar.DATA_INDEX_OF_CHOOSE_NOTHING) { //没选中东西
      this.selectComponent = constVar.CHOOSE_NOTHING;
    } else if(this.selectDataIndex == constVar.DATA_INDEX_OF_CHOOSE_COMPONENT){ //选中的是组件本身
      this.selectData = objToArr(this.templateArr[this.selectIndex]);
      this.selectComponent = constVar.CHOOSE_COMPONENT;
    } else{ //选中组件内容
      this.selectData = objToArr(this.templateArr[this.selectIndex]['data'][this.selectDataIndex]);
      this.selectComponent = constVar.CHOOSE_CONTENT;
    }
    if (this.selectComponent==constVar.CHOOSE_CONTENT) {
      console.log("选中第" + this.selectIndex + "个组件的第" + this.selectDataIndex + "项")
    } else if(this.selectComponent==constVar.CHOOSE_COMPONENT){
      console.log("选中第" + this.selectIndex + "个组件")
    } else{
      console.log("没选中")
    }

  }
  
  //重新渲染某个组件的函数
  renderComponent() {
    console.log("renderCall")
    const index = this.selectIndex;
    let newHtml;
    if(this.selectComponent==constVar.CHOOSE_COMPONENT){
      newHtml = this.templateArr[index].render(index);
    }else if(this.selectComponent==constVar.CHOOSE_CONTENT){
      newHtml = this.templateArr[index].render(index, this.selectDataIndex);
    }
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
    //重新绑定样式
    if(this.selectComponent==constVar.CHOOSE_COMPONENT){
      const dom = document.getElementById("container-phone-screen").querySelectorAll("section").item(this.selectIndex);
      dom.className = dom.className + " selected"
    }
  }

}