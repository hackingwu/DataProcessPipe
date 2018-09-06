const moment = require("moment")
/*
  1. data selection
  Expression:
    Map, using . to get value by key
    List, using [] to select element
  2. data format
  Expression:
    like AWK
    {$column_name } ;has double/single quote means content is column name
    {$column_idx } ;without double/single will be treated as column index
  Built-In Function:
    Time 
      Timestamp(Milliseconds, seconds) <=> DateTime(date format)
    Text 
      String Format
      Regex SubString 
    Number
      Calculation
*/

/* must trim before 
   Map, using . to get value by key
   can use like chain
*/
const getValueByKey = (expression, data) => {
  if (! data instanceof Object) return data;
  keyArr = expression.split(".").forEach( (key, index) => {
    if (data && key in data) data = data[key];
  });
  return data;
}

/* must trim before 
   List, using [] to select element
   [1, 2]
   [1, -1]
*/
const subArray = (expression, data) => {
  if (! data instanceof Array) return data;
  expression = expression.substring(1, expression.length -1);
  expression = expression.split(",").map(e => e.trim());
  startOffset = Number(expression[0]);
  endOffset = Number(expression[1]);
  if (startOffset < 0) startOffset += data.length;
  if (endOffset < 0)   endOffset = endOffset + 1 + data.length;
  if (startOffset > endOffset) return data;
  return data.slice(startOffset, endOffset);
}

/*
https://momentjs.com/docs/#/parsing/string-format/
*/
const ts2date = (dateFormat, value) => {
  let date;
  if (value.match(/^\d{10}$/)) {
    date = moment(Number(value+"000"));
  } else if (value.match(/^\d{13}$/)) {
    date = moment(Number(value));
  } 
  return date.format(dateFormat);

}

/*
sprintf
*/
const sprintf = (format, value) => {
  return sprintf(format, value);
}



/*
不支持正反预查
*/
const regexReplace = (regexStr, replacement, value) => {
  let regex = new RegExp(regexStr);
  return value.replace(regex, replacement);
}


/*
取第一个匹配的
*/
const regexSubstr = (regexStr, value) => {
  let regex = new RegExp(regexStr);
  let matcher = value.match(regex);
  if (matcher) return matcher[0];
  return value;
}

const ProcessTypeNone = 0;
const ProcessTypeMap  = 1;
const ProcessTypeList = 2;
const ProcessTypeColumn = 3;
const builtInFunctions = {
  'ts2date': ts2date,
  'regexSubstr': regexSubstr,
  'regexReplace': regexReplace,
  'sprintf': sprintf
}


const processFunction = (functions, value) => {
  functions.split(";").forEach( funExpr => {
    let funArgs = funExpr.split(/\s/)
    let fun = funArgs.shift(1);
    if (fun in builtInFunctions) {
      funArgs.push(value);
      value = builtInFunctions[fun].apply(this, funArgs)
    }
  })
  return value;
}

const process = (expression, data) => {

  let start = -1;
  let end = -1;


  for (let i = 0; i < expression.length; i++) {
    let c = expression.charAt(i);
    start = i;  
    if (c == ".") {
      for(end = start + 1; end < expression.length; end++) {
        if (expression.charAt(end).match(/\s/)) break;
      }
      data = getValueByKey(expression.substring(start, end), data);
      i = end + 1;
    } else if(c == '[') {
      for (end = start + 1; end < expression.length; end++) {
        if (expression.charAt(end) == ']') break;
      }
      data = subArray(expression.substring(start, end + 1), data);
      i = end + 1;
    } else if (c == '{') {
      for (end = start + 1; end < expression.length; end++) {
        if (expression.charAt(end) == '}') break;
      }

      let entries = expression.substring(start + 1, end).split(",")
      entries.forEach( entry =>{
        let keyValue = entry.split(":").map(x => (x.trim()))
        let column = keyValue[0];
        let functions = keyValue[1];

        if (column.startsWith("$")) {
          idx = column.substring(1);
          if (data instanceof Array) {
            // value = data[idx];
            data[idx] = processFunction(functions, data[idx])
          }
        } else {
          if (data instanceof Array) {
            data.forEach(map => {
              map[column] = processFunction(functions, map[column])
            })
          } else if (data instanceof Object) {
            data[column] = processFunction(functions, data[column])
          }
        }
      })

      i = end + 1;
    }
  }

  return data;
}

module.exports = {
  process
}