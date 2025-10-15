// 获取显示元素
const display = document.getElementById("display");

// 添加键盘事件监听器，允许用户通过键盘输入
document.addEventListener('keydown', function(event) {
    // 获取按键的键值
    const key = event.key;
    
    // 允许的按键：数字0-9，运算符+、-、*、/，小数点.，回车=，退格键，Escape键
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                         '+', '-', '*', '/', '.', 'Enter', 'Backspace', 'Escape'];
    
    // 检查按键是否在允许的列表中
    if (allowedKeys.includes(key)) {
        // 阻止默认行为，避免页面滚动等
        event.preventDefault();
        
        // 根据不同的按键执行不同的操作
        if (key === 'Enter') {
            // 回车键执行计算
            calculate();
        } else if (key === 'Backspace') {
            // 退格键删除最后一个字符
            deleteLast();
        } else if (key === 'Escape') {
            // Escape键清空显示
            clearDisplay();
        } else {
            // 其他允许的按键添加到显示
            appendToDisplay(key);
        }
    }
    // 如果按键不在允许的列表中，不做任何操作（忽略字母和其他字符）
});

// 函数：向显示区域添加输入
function appendToDisplay(input) {
    // 将输入添加到显示值
    display.value += input;
    // 调整字体大小以适应输入长度
    adjustFontSize();
}

// 函数：清空显示区域
function clearDisplay() {
    display.value = "";
    // 重置字体大小
    adjustFontSize();
}

// 函数：计算表达式
function calculate() {
    try {
        // 使用eval计算表达式
        display.value = eval(display.value);
        // 调整字体大小以适应结果
        adjustFontSize();
    } catch (error) {
        // 如果计算出错，显示错误信息
        display.value = "Syntax Error";
        // 调整字体大小以适应错误信息
        adjustFontSize();
    }
}

// 函数：删除最后一个字符
function deleteLast() {
    // 移除最后一个字符
    display.value = display.value.slice(0, -1);
    // 调整字体大小
    adjustFontSize();
}

// 函数：根据输入长度调整字体大小
function adjustFontSize() {
    // 获取当前输入的长度
    const length = display.value.length;
    
    // 根据长度设置不同的字体大小
    // 长度小于等于8时，使用最大字体
    if (length <= 8) {
        display.style.fontSize = "4rem";
    } 
    // 长度在9-12之间时，使用中等字体
    else if (length <= 12) {
        display.style.fontSize = "3rem";
    } 
    // 长度在13-16之间时，使用较小字体
    else if (length <= 16) {
        display.style.fontSize = "2rem";
    } 
    // 长度大于16时，使用最小字体
    else {
        display.style.fontSize = "1.5rem";
    }
    
    // 保存当前输入长度到data属性
    display.setAttribute('data-input-length', length);
}

// 初始化时调整字体大小
adjustFontSize();