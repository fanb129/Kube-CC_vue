// import YAML from 'yaml'
import yaml from 'js-yaml'
// json转换为yaml格式
export const json2yaml = (jsonData) => {
  try {
    return {
      data: typeof (jsonData) === 'string' ? yaml.dump(JSON.parse(jsonData)) : yaml.dump(jsonData),
      error: false
    }
  } catch (err) {
    return {
      data: '',
      error: true
    }
  }
}
// yamlStr 为字符串形式的yaml数据
// returnString 是否返回字符串格式的json数据
export const yaml2json = (yamlStr, returnString) => {
  try {
    return {
      data: returnString ? JSON.stringify(yaml.load(yamlStr), null, 2) : yaml.load(yamlStr),
      error: false
    }
  } catch (err) {
    return {
      data: '',
      error: true
    }
  }
}
