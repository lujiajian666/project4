import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  template = [{
      id: 1,
      name: "list模板",
      data: [
        {pic:"../assets/nobody.png",title:"新用户注册即送",award:"送200牛"},
        {pic:"../assets/nobody.png",title:"新用户注册即送",award:"送200牛"},
        {pic:"../assets/nobody.png",title:"新用户注册即送",award:"送200牛"},
      ],
      default:{pic:"../assets/nobody.png",title:"新用户注册即送",award:"送200牛"}
    },
    {
      id: 2,
      name: "list模板2"
    }
  ];
  templateArr = [];
  renderHtml = '';
  selectIndex = 0;
  addComponent(id) {
    this.template.forEach((item, index) => {
      if (item.id == id) {
        this.templateArr.push(item);
      }
    });
  }
  showData(index) {
    this.selectIndex = index;
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
  //list组件函数
  listRender(){
     ``
  }
  listAdd(index){
    const data=this.templateArr[index];
    data.data.push(data.default);
  }
}
