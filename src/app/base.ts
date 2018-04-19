/**
 * 某个节点添加某个类名，删除其他节点的该类名字
 * className 要添加的类目
 * node 目标节点
 * area 删除其他节点的范围
 */
const setSelectedClass=( className , node , area)=>{
   if(area == null ){
     return ;
   }
   //把范围内所有该类名去掉
   var re = new RegExp("\\s+" + className + "\\s*")
   const all = area.querySelectorAll(`.${className}`);
         all.forEach(element => {
                 element.className=element.className.replace(re,"")
         }); 
    //当前节点添加类名   
    if(node){
      node.className = node.className+` ${className} `;
    }            
}
//找出当前元素在兄弟节点中排第几
const siblingsIndex = (elm) => {
  if(elm == null){
    return 0;
  }
  const p = elm.parentNode.children;
  for (var i = 0; i < p.length; i++) {
    if (p[i] == elm) {
      return i;
    }
  }
  return 0;
}
//根据查找最近的有自定义属性attribute的父元素
const findSpecialParent = (attribute, child) => {
  if (child && child.hasAttribute) {
    if (child.hasAttribute(attribute)) {
      return child;
    } else {
      return findSpecialParent(attribute, child.parentNode)
    }
  } else {
    return null;
  }
}
//克隆函数
const clone = (obj) => {
  var o;
  if (typeof obj == "object") {
    if (obj === null) {
      o = null;
    } else {
      if (obj instanceof Array) {
        o = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(clone(obj[i]));
        }
      } else {
        o = {};
        for (var k in obj) {
          o[k] = clone(obj[k]);
        }
      }
    }
  } else {
    o = obj;
  }
  return o;
}
//对象转数组(只能转基本类型)
const objToArr = (obj) => {
  const arr = [];
  for (let i in obj) {
    if(!(obj[i] instanceof Array) && !(obj[i] instanceof Object))
    arr.push([i, obj[i]]);
  }
  return arr;
}
interface baseComponent {
  render(isselected,selectDataIndex);
  preview();
  bindFunc();
  setData(value);
  getInstance();
  hasPreviewAction();
  id;
  pic;
  name;
  data;
  timestamp;
  defaultData;
  className;
  button;
  maxChildrenNum
}
const constVar={
  //id=container-phone-screen处的data-index，如果是-2，是没选中组件(对应状态0)，-1选中组件（对应状态1）,其他选中组件内容（对应状态2）
  CHOOSE_NOTHING :0,
  CHOOSE_COMPONENT :1,
  CHOOSE_CONTENT :2,
  DATA_INDEX_OF_CHOOSE_NOTHING:-2,
  DATA_INDEX_OF_CHOOSE_COMPONENT:-1,  
}

export {
  siblingsIndex,
  findSpecialParent,
  clone,
  objToArr,
  baseComponent,
  setSelectedClass,
  constVar
}
