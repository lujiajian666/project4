const siblingsIndex = (elm) => {
  const p = elm.parentNode.children;
  for (var i = 0; i < p.length; i++) {
    if (p[i] == elm) {
      return i;
    }
  }
  return 0;
}
//公共函数
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
//对象转数组
const objToArr = (obj) => {
  const arr = [];
  for (let i in obj) {
    arr.push([i, obj[i]]);
  }
  return arr;
}
interface baseComponent {
  render(index);
  bindFunc();
  setData(value);
}
export {
  siblingsIndex,
  findSpecialParent,
  clone,
  objToArr,
  baseComponent
}
