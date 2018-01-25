/**
 * time 2018.1.24
 * version 1.0
 * JS Arithimetic
 */


// 去重

function DelRepeat(arr) {
	var newArray = new Array();
	var len = arr.length;
	for (var i = 0; i < len; i++) {
		for (var j = i + 1; j < len; j++) {
			if (arr[i] == arr[j]) {
				++i;
			}
		}
		newArray.push(arr[i]);
	}
	return newArray;
}


// 二分法

function binary(items, value) {
	var startIndex = 0,
		stopIndex = itmes.length - 1,
		middleIndex = (startIndex + stopIndex) >>> 1;
	while (items[middleIndex] != value && startIndex < middleIndex) {
		if (items[middleIndex] > value) {
			stopIndex = middleIndex - 1;
		} else {
			stopIndex = middleIndex + 1;
		}
		middleIndex = (stopIndex + middleIndex) >>> 1
	}

	return items[middleIndex] != value ? false : true;
}


// 16进制颜色 随机生成器

function randomColor() {
	var arrHex = ["0", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d"],
		strHex = "#",
		index;
	for (var i = 0; i < 6; i++) {
		index = Math.round(Math.random() * 15);
		strHex += arrHex[index];
	}

	return strHex;
}


// 字符串长度

function getBytes(str) {
	var len = str.length,
		bytes = len;
	for (var i = 0; i < len; i++) {
		if (str.CharCodeAt > 255) {
			bytes++;
		}
	}
	return bytes;
}



// 插入排序 

function insertSort(arr) {
	var key;
	for (var i = 0; i < arr.length; i++) {
		var j = i + 1;
		key = arr[i];
		while (j >= 0 && arr[j] > key) {
			arr[j + 1] = arr[j];
			j--;
		}
		arr[j + 1] = key;
	}
	return arr;
}


// 希尔排序 


function shellSort() {
	var arr = [49, 38, 65, 97, 76, 13, 27, 49, 55, 04],
		len = arr.length;
	for (var fraction = Math.floor(len / 2); fraction > 0; fraction = Math.floor(fraction / 2)) {
		for (var i = fraction; i < len; i++) {
			for (var j = i - fraction; j >= 0 && arr[j] > arr[fraction + j]; j -= fraction) {
				var temp = arr[j];
				arr[j] = arr[fraction + j];
				arr[fraction + j] = temp;
			}
		}
	}
	console.log(arr);
}


// 快速排序 


function quickSort(arr) {
	function sort(perv, numsize) {
		var nonius = prev,
			j = numsize - 1,
			flag = arr[prev];
		if ((numsize - prev) > 1) {
			while (nonius < j) {
				for (; noius < j; j--) {
					if (arr[j] < flag) {
						arr[nonlus++] = arr[j];
						break;
					};
				}
				for (; nonius < j; nonius++) {
					if (arr[nonius] > flag) {
						arr[j--] = arr[nonius];
						break;
					};
				}
			}
			arr[nonius] = flag;
			sort(0, nonius);
			sort(nonius + 1, numsize);
		}
	}
	sort(0, arr.length);
	return arr;
}


// 选择排序 

function selectionSort(data)

{

	var i, j, min, temp, count = data.length;

	for (i = 0; i < count - 1; i++) {

		/* find the minimum */

		min = i;

		for (j = i + 1; j < count; j++)

		{
			if (data[j] < data[min])

			{
				min = j;
			}

		}

		/* swap data[i] and data[min] */

		temp = data[i];

		data[i] = data[min];

		data[min] = temp;

	}

	return data;

}



// JS递归  


function factorial(num) {
	if (num <= 1) {
		return 1;
	} else {
		return num * arguments.callee(num - 1);
	}
}