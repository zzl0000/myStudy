/**
 *  @abstract 要全面掌握JavaScript 需要从三个方面了解 （他的本质、历史、和局限性） 
 */

// 1.ECMAScript  由ECMA-262定义，提供核心语音功能
// 2文档对象DOM 提供访问和操作网页内容的方法和接口
// 3.浏览器对象 Bom 提供与浏览器交互的方法和接口


/**
 *  @abstract JavaScript 基本概念 
 */

// 1.关键字及保留字 

//  break       do        instanceof       typeof 
//  case        ekse      new              var
//  catch       finally   return           void
//  continue    for       swtich           whike
//  debugger    function  this             with
//  default     if        throw
//  delete      in        try


// abstract     enum      int               short
// boolean      export    interface         static
// byte         extends   long              super
// char         final     native            synchronized
// calss        float     package           throws
// const        goti      private           transient
// debugger     implements  protected       volatile
//double        import    public            let         yield



//  2.变量  

// ECMAScript的变量是松散类型的。


//  3.数据类型

'6种数据类型： 5种简单类型（undefriend、null、bollean、number、string）, 一种复杂类（object）'

// 3.1.Typeof 操作符 检查数据类型

'差异性在检查null 返回的值 Typeof（null） 为 object或者function '

// 薄弱点 obejict 数据类型 

var o = new Object()

'object实例具有的属性和方法'

// constructor: 保留着用于创建当前对象的函数。对于前面的例子而言，构造函数就是Object



// 4.变量、作用于和内存 问题 

// 4.1 变量

'变量----包含基本类型和引用类型的值'

'局部作用域中修改的对象不会再全局作用域中反映出来'

function setName(obj) {
    obj.name = 'Nicholas'
    obj = new Object()
    boj.name = 'Greg'
}

var person = new Object();

setName(person)

alert(person) // 'Nicolas'

'检测类型 -- 基础类型 typeof（）'

var s = 'Nicholad',
    n = null,
    b = true,
    i = 22,
    u,
    o = new Object()

alert(typeof (s))   //   string
alert(typeof (n))   //   object || undefined
alert(typeof (b))   //   boolean
alert(typeof (i))   //   number
alert(typeof (u))   //   undefined
alert(typeof (o))   //   object


'检测类型 -- 引用类型 instanceof（）'

result = variable instanceof constructor

alert(person instanceof Object)  // '变量person是Object吗？'
alert(person instanceof Array)  // '变量person是Array吗？'
alert(person instanceof RegExp)  // '变量person是RegExp吗？'



//4.2 执行环境  及作用域

'tray catch  和with语句 可以用来延长作用域链'

function buildDurl() {
    var qs = '?debug=true';
    with (location) {
        var url = href + qa;
    }
    return url;
}


// 4.3垃圾回收机制 

'1.标记清除2. 引用计数 '





// 引用类型

'5.1 Object 类型'

'5.2 Array 类型'


'5.2.1  检测数组'


//  只有一个全局执行环境 

if (value instanceof Array) {
    //  执行操作
}

// ie9 + 
if (Array.isArray(value)) {
    //  执行操作
}

'5.2.2 转换方法'

toString() //  创建一个数组值的以逗号分隔的字符串
toLocaleString()  // 创建一个数组值的以逗号分隔的字符串
valueOf() // 返回数组本身
join()  // 接受一个参数，用作分割符，然后返回包含所有数组项的字符串


'5.2.3  栈方法 '

push()  //  接收任意数量的参数，把它们逐个添加到数组末尾，并返回修改后的长度
pop() // 从数组末尾移除最后一项，减少数组length长度，返回移除的


'5.24 队列方法'

'栈数据结构的访问规则是LIFO(后进先出)'
'队列数据结构访问规则是FIFO(先进先出)'

shift()  // 从数组末尾移除最后一项，减少数组length长度，返回移除
unshift() // 和shift()用法相反

'5.25 重排序方法'

reverse() // 反转数组顺序
sort() //升序排序

function compare(value1, value2) {
    if (value1 < value2) {
        return -1
    } else if (value1 > value2) {
        return 1
    } else {
        return 0
    }
}

var values = [0, 1, 5, 10, 15]
values.sort(compare)
alert(values) // 0,1,5,10,15

'5.26 操作方法'

concat()  // 基于当前数组中的所有项创建一个新数组

var colors = ['red', 'green', 'blue']
var colors2 = colors.concat('yellow', ['black', 'brown'])
alert(colors) // red green blue
alert(colors2) // red green blue yellow black brown



slice() // 基于当前数组中的一项或多项创建一个新数组

var colors = ['red', 'green', 'blue']
var removed = colors.slice(0, 1)
alert(colors) // green blue
alert(removed) // red

removed = colors.slice(1, 0, 'yellow', 'orange')
alert(colors) // green yellow orange blue
alert(removed) // ''

removed = colors.slice(1, 1, 'red', 'purple')
alert(clors) // green red purple orange blue
alert(removed) // yellow

'5.27 位置方法'

indexOf()   // 接收两个参数 要查询的项、查找起点位置的索引
lastIndexOf()   //接收两个参数 要查询的项、查找起点位置的索引

'5.28 迭代方法'

every() // 对数组中的每一项运行给定函数，如果该函数对每一项都返回ture,则返回ture
filter() // 对数组中的每一项运行给定函数，返回该函数会返回true的项组成的数组
forEach() // 对数组中的每一项运行给定函数，这个方法没有返回值
map() // 对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组
some() //对数组中的每一项运行给定函数，如果该函数对任一项返回ture,则返回ture

var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]

var everyResult = numbers.every(function (item, index, array) {
    return (item > 2)
})

alert(everyResult) // false

var someResult = numbers.some(function (item, index, array) {
    return (item > 2)
})

alert(someResult) // true

var filterResult = numbers.filter(function (item, index, array) {
    return (item > 2)
})

alert(filterResult) // 3,4,5,4,3

var mapResult = numbers.map(function () {
    return item * 2
})

alert(mapResult) // 2,4,6,8,10,8,6,4,2

numbers.forEach(function (item, index, array) {
    //执行操作
})

'5.29  归并方法'

reduce() // 从数组的第一项开始， 迭代所有数组项，然后构建一个最终返回值。 接收两个参数( 1.每项上调用的函数, 2.可选的，作为归并基础的初始值)
reduceRight() //从数组的z最后一项开始，迭代所有数组项，然后构建一个最终返回值。 接收两个参数( 1.每项上调用的函数, 2.可选的，作为归并基础的初始值)

var vaules = [1, 2, 3, 4, 5]

var sum = values.reduce(function (perv, cur, index, array) {
    return perv + cur
})

alert(sum) // 15

var sum = values.reduceRight(function (prev, cur, index, array) {
    return prev + cur
})

alert(sum) // 15

'5.3 Date类型'

var now = new Date() // 当前时间

Date.UTC(2000, 0)  // 参数分别是年月， 需注意的是月份中一月为0 ，以此叠加后面的月份
Date.parse("may 25, 2004") // 接收一个表示日期的字符串参数，然后尝试根据这个字符串返回相遇日期的毫秒数
Date.now() // 获取当前时间的毫秒数


// 常见获取时间方法
now.getTime()
now.getFullYear()
now.getMonth()
now.getDate()
now.getDay()
now.getHours()
now.getMinutes()
now.getSeconds()
now.getMinutes()

// 常见设置时间方法
now.setTime()
now.setFullYear()
now.setMonth()
now.setDate()
now.setDay()
now.setHours()
now.setMinutes()
now.setSeconds()
now.setMinutes()


'5.4 RegExp 类型'

'正则表达式中的元字符 : ( [ { \ ^ $ | ? + . } ] )  使用时都需要转译'

/**  正则表达式实例属性 ： global -> g   ignoreCase -> i  multiline ->  m
                         lastIndexOf  
                         source
*/

/**  RegExp 构造函数 属性  input -> $_  lastMatch -> $&  lastParen -> $+  
 *                        leftContext -> $`  multiline -> $* rightcontext -> &'
 */



'5.4 Function 类型'

'函数的构建类型 : 1.声明式 2.函数表达式 3.Function构造式'

function sum(num1, num2) {
    return num1 + num2
}

var sum = function (num1, num2) {
    return num1 + num2
}

var sum = new Function('num1', 'num2', 'return num1 + num2'); // 不推荐

'5.4.3 作为值得函数'

// 例子 通过不同属性 sort()排序比较

function createCompareFn(name) {
    return function (obj1, obj2) {
        var value1 = obj1[name]
        var value2 = obj2[name]
        if (value1 > value2) {
            return 1
        } else if (value1 < value2) {
            return -1
        } else {
            return 0
        }
    }
}

var data = [{ name: 'zachary', age: '28' }, { name: 'nicholas', age: '29' }]
data.sort(createCompareFn('name'))
alert(data[0].name) // nicholas
data.sort(createCompareFn('age'))
alert(data[0].name) // zachary

'5.5.4 函数内部属性'

'arguments、this 两个对象'


'arguments.callee 属性指向当前函数'

// 阶乘函数

function factorial(num) {
    if (num <= 1) {
        return 1
    } else {
        return num * arguments.callee(num - 1)
    }
}


'5.5.5 函数属性和方法 '

'--属性-- prototype 、length'

// length  表示函数希望接收的命名参数个数

function sayName(name) {
    alert(name)
}

alert(sayName.length) // 1

//prototype apply() call() bind()

function sum(num1, num2) {
    return num1 + num2
}

function applySum(num1, num2) {
    //return sum.apply(this, [num1, num2])
    return sum.apply(this, arguments)
}

function callSum(num1, num2) {
    return sum.call(this, num1, num2)
}

alert(applySum(10, 10)) // 20
alert(callSum(10, 10)) // 20


window.color = 'red'
var o = { color: 'blue' }

function sayColor() {
    alert(color)
}

var objSayColor = sayColor.bind(0)

alert(objSayColor()) // blue

'5.6  三种特殊类型 '

//boolean

//number

'number类型 提供的几个方法 toFixed()、toExponential()、toPercision()'

//string

'5.6.1.字符方法 charAt()和charCodeAT()'

var stringValue = 'hello world'
alert(stringValue.charAt(1)) // 'e'
alert(stringValue.charCodeAt(1)) // '101'

'5.6.2.字符操作方法 concat() slice() substring() substr()'

var stringValue = 'hello'
var result = stringValue.concat('world')
alert(result) // 'hello world'
alert(stringValue) // 'hello'



alert(result.slice(3)) // 'lo world'
alert(result.substring(3)) // 'lo world'
alert(result.substr(3)) // 'lo world'

alert(result.slice(3, 7)) // 'lo w'
alert(result.substring(3, 7)) // 'lo w'
alert(result.substr(3, 7)) // 'lo worl'


alert(result.slice(-3)) // 'rld'
alert(result.substring(-3)) // 'hello world'
alert(result.substr(-3)) // 'rld'

alert(result.slice(3, -4)) // 'lo w'
alert(result.substring(3, -4)) // 'hel'
alert(result.substr(3, -4)) // ''


'5.6.3.字符位置方法 indexOf() lastIndexOf()'
'5.6.4.trim()方法'
'5.6.5.字符串大小写转换方法 toLowerCase() toLocalLowerCase() toUpperCase() toLocalUpperCase()'
var stringValue = 'hello world'
alert(stringValue.toUpperCase()) // 'HELLO WORLD'
alert(stringValue.toLowerCase()) // 'hello world'

'5.6.6.字符串匹配方法'

function htmlEscape(text) {
    return text.replace(/[<>"&]/g, function (match, pos, originalText) {
        switch (match) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\"': return '&qut;';
        }
    })
}
alert(htmlEscape("<p class=\"greeting\">Hello World!</p>"))  // 




'5.7 单体内置对象'

'5.7.1 Global对象  Global(全局对象)'

// parseInt() isNaN() isFinite() parseFloat() ....

'5.7.1.1 URI 编码方法'
var url = ''
encodeURI(url)
encodeURIComponent(url)
decodeURI(url)
decodeURIComponent(url)

'5.7.1.2 eval()方法'
'5.7.1.3 Global对象的属性'

// undefined NaN Infinity Object Function Boolean String Number Date RegExp
// Error EvalError RangeError ReferenceError SyntaxError TypeError URIError


'5.7.1.4 window对象'

var global = function () {
    return this;
}();

'5.7.2 Math 对象'

'1.Math对象属性 '

// Math.E                   自然数的底数，即常量e的值
// Math.LN10                10的自然对数
// Math.LN2                 2的自然对数
// Math.LOG2E               以2为底e的对数 
// Math.LOG10E              以10为底e的对数
// Math.PI                  π的值
// Math.SQRT1_2             1/2的平方根
// Math.SQRT2               2的平方根

'2. Math.min()  Math.Max() 确定一组数组中的最小值和最大值'

'3.舍入方法'

Math.ceil('25.1') // 26  //执行向上舍入
Math.floor('25.9') // 25  //执行向下舍入
Math.round('25.5') // 26  // 执行四舍五入

'4. random() 方法  ： 返回大于0小于1的一个随机数'

// 值 = Math.floor(Math.random * 可能值得总是 + 第一个可能在 )  --- 从某个整数访问随机取一个值

function selectForm(lowerValue, upperValue) {
    var choicce = upperValue - lowerValue + 1
    return Math.floor(Math.random * choicce + lowerValue )
}

var num = selectForm(2,10)

alert(num) // 介于2-10之间的一个随机数


'5.其他方法'


// Math.abs(num)                  返回num的绝对值
// Math.exp(num)                  返回Math.E的num次幂
// Math.Log(num)                  返回num的自然数对数
// Math.pow(num,power)            返回num的power次幂
// Math.sqrt(num)                 返回num的平方根
// Math.acos(x)                   返回x的反余弦值
// Math.asin(x)                   返回x的反正弦值
// Math.atan(x)                   返回x的反正切值
// Math.atan2(y,x)                返回y/x的反正切值
// Math.cos(x)                    返回x的余弦值
// Math.sin(x)                    返回x的正弦值
// Math.tan(x)                    返回x的正切值



'第六章 面向对象的程序设计'

































