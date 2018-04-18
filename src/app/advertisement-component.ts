import {
  findSpecialParent,
  baseComponent,
  siblingsIndex,
  setSelectedClass
} from './base';
export class AdvertisementComponent implements baseComponent {
  id = {
    value: 3
  };
  pic = {
    value: "../assets/menu.png"
  };
  name = {
    value: "列表"
  };
  data: [{
    '标题': '我们需要什么样的文学观?',
    '小标题': "21天系统化教你上手带团队",
    '图标': "http://placehold.it/60x70",
    '原价': 20,
    '现价': 20,
  }];
  timestamp = {
    value: 0
  };
  defaultData = {
    '标题': '请填写标题',
    '小标题': "请填写小标题",
    '图标': "http://placehold.it/60x70",
    '原价': 20,
    '现价': 20
  }
  className = {
    value: "list-component"
  };
  button = {
    prev: "上移",
    next: "下移"
  }
  maxChildrenNum = {
    value: 3
  };
  constructor(time) {
    this.timestamp = {
      value: time
    }
  };
  render(index: any, selectDataIndex: any) {
    throw new Error("Method not implemented.");
  }
  preview(index: any) {
    throw new Error("Method not implemented.");
  }
  bindFunc() {
    throw new Error("Method not implemented.");
  }
  setData(value: any) {
    throw new Error("Method not implemented.");
  }
  getInstance(time: any) {
    throw new Error("Method not implemented.");
  }
}
