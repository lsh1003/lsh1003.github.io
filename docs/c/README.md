# c语言学习总结

## gcc前置知识
程序执行的两种方式
1. 解释执行: 借助一个程序, 并且这个程序能够理解我们所写的程序, 按照要求一步一步执行
2. 编译执行: 借助一个程序, 并且这个程序能够将我们所写的程序编译成计算机能够懂得语言, 然后交给计算机来执行

编译器的执行步骤: 预编译 -> 汇编过程 -> 编译程序 -> 链接程序
> 1. 预编译阶段:  
>   作用: 去除注释,处理以#开头的预处理器(#include, #define,#ifdef)  
>   执行方式: gcc -E 文件名 -o .i为后缀的文件
> 2. 汇编过程; 语法分析, 词法分析, 语义分析, 符号汇总  
>   作用: 将预编译的程序编译成汇编语言  
>   执行方式: gcc -S .i为后缀的文件 -o .s为后缀的文件
> 3. 编译程序  
>   作用: 将会汇编程序编译成目标语言;  
>   执行方式: gcc -c .s为后缀的文件 .o为后缀的目标文件
> 4. 链接程序  
>   作用: 将所有目标文件链接为可执行程序  
>   执行方式: gcc -o .o为后缀的文件 可执行文件名

程序的执行过程:
1. 程序必须载入内存中. 在有操作系统的环境中, 一般这个由操作系统完成, 在独立的环境中, 程序的载入必须由手工安排, 也可是通过可执行代码植入只读内存完成
2. 程序的执行便开始. 接着调用main函数
3. 开始执行程序代码. 这个时候程序将使用一个运行时堆栈(stack), 储存函数的局部变量和返回地址. 程序同时也可以使用静态(static)内存, 储存于静态内存中的变量在程序的整个执行过程中一直保留着他们的值
4. 终止程序. 正常终止main函数; 也可能是意外终止

## 笔记
1. 头文件limits.h可以获取各种不同整型的大小

2. 清空缓冲区
```c
char ch;
while((ch = getchar()) != EOF);
```

3. 赋值语句的表达式结果就是自身值
可以将字符串常量赋给一个指向字符的指针, 但不能赋值给一个字符数组, 因为字符串常量的直接值是一个指针

4. signed一般用于char,因为char是否有符号由编译器决定的; (short, signed, unsigned)这几个说明符不能用于浮点型
5. void\*指针可以接受任意类型的指针; 
    1. 对于void\*类型的指针不能进行解引用操作, 因为不知道要操作多少个字节
    2. 对于void*类型的指针不能进行加减操运算


## 注释

### 多行注释

> /* 注释内容 */
>
> 第一个 /\* 和第一个*/中间的内容都为注释；
>
> 此注释不会从源代码中删除

### 单行注释

> //
>
> 两个/为单行注释

### 使用#if预处理指令注释

如果我们希望注释的代码能从源代码中删除，则可以使用#if指令

> #if 0
>
> // 不管是注释代码还是注释都不会在源代码中出现
>
> #endif

## 预处理

### #define预处理指令
作用
1. 定义标识符: #define MAX 100
2. 定义宏, #define机制包括了一个规定, 允许吧参数替换到文本中, 这种实现通常称之为宏(macro)或定义宏(define macro); 宏只是简单的替换, 而不会计算表达式, 

> 注意: 
> 1. #define 定义标识符时后面一定不要加; 号
> 2. 所以对用于数值表达式进行求值的宏定义都应该用这种方式加上括号, 避免在使用宏时由于参数中的操作符或邻近操作符之间不可预料的相互作用
> 3. 宏参数和#define定义中可以出现其他#define定义的变量, 但是对于宏, 不能出现递归
> 4. 当预处理器搜索#define定义的符号的时候, 字符串常量不被搜索

宏替换规则:
1. 在调用宏时, 首先对参数进行检查, 看看是否包含任何由#define定义的符号. 如果是, 则替换
2. 替换文本随后被插入到程序中原来文本的位置, 对于宏, 参数名被他们的值替换
3. 最后, 再对结果文件进行扫描, 看看他们是否包含任何由#define定义的符号, 如果是, 就重复上述步骤

宏替换的优势:
1. 用于调用函数和返回函数的代码可能比实际执行这个小型计算工作所需要的时间更多, 所以宏比函数在程序规模和速度上更胜一筹
2. 函数的参数必须声明类型, 所以函数必须在类型合适的表达式上使用. 而宏则与类型无关

劣势:
1. 宏没办法调试
2. 宏由于与类型无关, 所以不够严谨
3. 宏容易带来运算符优先级的问题, 可能会出错
4. 除非宏较短, 否则可能引起篇幅较长
5. 宏是不能递归的

**模拟offsetof函数计算结构体内的成员的偏移量**
```c
#define OFFSETOF(struct_name, member_name) (int)&(struct_name*)0->member_name
```

```c
// 第一版
// #define SQUARE(x) x*x
// 第二版
#define SQUARE(x) (x)*(x)

// 第一版
#define DOUBLE(x) x+x
// 第二版
#define DOUBLE(x) ((x)+(x))

#include <stdio.h>
int main() {
    printf("%d\n", SQUARE(5));
    // 如果使用第一版, 则替换之后 5+1*5+1
    // 使用第二版, 则替换之后 (5+1)*(5+1)
    printf("%d\n", SQUARE(5 + 1));
    
    // 如果使用第一版, 则替换之后 10 * 5 + 5
    // 使用第二版, 则替换之后 10 * ((5) + (5))
    printf("%d\n", 10 * DOUBLE(5));
    return 0;
}

// 
#define MALLOC(num, type) (type*)malloc(num*sizeof(type))
```

### #和##的作用
1. #, 吧一个宏参数变成对应的字符串
2. ##, 可以吧位于它两边的符号合成一个符号, 它允许宏定义从分离的文本片段创建标识符

```c
#include <stdio.h>

#define PRINT(x) printf("the value of x is %d\n", x);
#define PRINT2(x) printf("the value of "#x" is %d\n", x);

#define PRINT3(value, number) sum##value += number
int main() {
	printf("hello world\n");
	printf("hello" " world\n");
	printf("he" "llo"   " world\n");

    // #
	PRINT(100);

	int a = 100;
	PRINT2(100);
	PRINT2(a);

    // ##
	int sum1 = 30;
	// 替换之后 printf("%d\n", sum1 += 100);
	printf("%d\n", PRINT3(1, 10));
	return 0;
}
```

### #undef 宏
用于移除一个宏定义

### 条件编译
选择性的编译, 在编译时很容易的保留或者放弃某些代码

```c
// 第一种方式
#if 常量表达式

#endif

// 第二种方式
#if 常量表达式
// do something
#elif 常量表达式
// do something
#else

#endif

// 第三种方式
#if defined(symbol)
#endif
// 相当于 #ifdef symbol ... #endif

#if !defined(symbol)
#endif
// 相当于 #ifndef symbol ... #endif

// 如果定义了DEBUG, 则会编译
#ifdef DEBUG
#endif
```

### #include文件包含
两种方式:
1. 尖括号方式, #include <头文件>
2. 双引号方式, #include "头文件"

> **查找策略**:
> 1. 双引号方式先在当前目录下查找, 如果该头文件没找到, 编译器就会像查找库函数头文件一样在标准位置查找头文件. 如果找不到就编译报错
> 2. 尖括号方式则直接去标准路径下去查找, 如果找不到就提示编译错误; 如果以双引号的方式包含库函数头文件, 则效率比较低, 也不容易分清楚哪些是库文还是本地文件

### 防止头文件的重复包含
1. #pragma once
2. 使用条件编译
    ```c
    #ifndef _TEST_H_
    #define _TEST_H_
    // 头文件内容
    #endif
    ```

## 数据的表现形式
数据的表现形式有两种: 常量和变量

### 常量
定义常量的两种方式:
1. 使用const来定义
2. 使用#define来定义

**区别**
1. const修饰的常量有类型, 有名字, 占储存单元, 只是不能改变其值的变量,例如const float PI = 3.14;对于数组而言,const限定的数组的所有元素不能修改
2. 常量使用#define定义,只是一个预处理指令,不占用内存,在编译阶段仅仅是字符串的替换

**const常量:**
- long型常量以字母l或L结尾,无符号常量(unsigned)以字母u或U结尾,后缀ul或UL表明是unsigned long结尾
- 没有后缀的浮点型常量是double类型,后缀为f或F表示是float类型;后缀是l或L 表明是long double类型
- 字符常量也叫字符串字面量,就是用双引号括起来的0个或多个字符组成的字符序列

### 变量
变量代表一个有名字,具有特定属性的一个储存单元

规则: 先定义,后使用; 定义时需指定变量的类型和名字

**类型**
1. 整型常量
2. 实数常量: 小数形式和指数形式
3. 字符常量: 普通字符和转义字符,三字母词
4. 字符串常量, 就是双引号括起来的
5. 符号常量: 用#define指令指定一个 符号名称代表一个常量
6. 枚举常量

## typedef
使用typedef为各种数据类型定义新名字
> // 例子,在之后的类型未ptr都表示char *  
> typedef char *ptr;

## 数据类型
c语言中数据类型包括四种数据类型, 分别是整型, 浮点型, 数组和指针, 其他类型是从这四种类型派生出来的(摘自c和指针第二版)

字符类型(char)在内存中以整型的方式储存

字符串是以特殊的字符数组来储存,特殊在字符数组中第一个元素是字符串结束符(\0)之前的都是字符串的组成部分(包括\0); 简单来说就是字符串以\0结尾的字符数组

布尔类型: 0是false, 其余非0值都为true

1. 基本数据类型
    - 整型
        - 短整型(short int)
        - 基本整型(int)
        - 长整型(long int)
        - 双长整型(long long int)
        - 字符型(char)
        - 布尔值(bool)
    - 浮点型
        - 单精度浮点型(float)
        - 双精度浮点型(double)
        - 复数浮点型(float_comple,double_comple,long long_comple)
2. 派生类型
    - 指针类型(*)
    - 数组类型([])
    - 结构体类型(struct)
    - 共用体类型(union)
    - 函数类型
3. 枚举类型(enum)
4. 空类型(void)
    - 指针指向空类型
    - 函数无返回值
    - 函数无参数

### 整型
整型分为有符号(signed)和无符号(unsigned)两种, 两者的取值范围不同, 需要注意的是不能将一个负数赋值给无符号整型变量

类型限定符signed与unsigned(用于char或整型);unsigned类型的数总是0或正值, 所以有的数据的范围常常只有正值,我们可以充分利用变量的值的范围,可以将变量定义为"无符号"类型(unsigned int)

长整型(long int)需要在整数末尾加上L或l

编译期间,对于浮点型常量,默认按照双精度处理,分配8个字节,所以需要定义float类型需要在后面加f;long double类型需要在后面加L

长整型至少应该和整型一样长, 而整型至少应该和短整型一样长

**字符类型是以整型的方式存储的**

sizeof是测量类型或变量长度的运算符, 我们可以使用sizeof操作符来获取*变量*或者*类型*占用的字节数

## 类型转换
当一个运算符的几个操作数类型不同时, 就需要通过一些规则吧他们转换为某种共同的类型

自动类型转换: 把"比较窄的"操作数转换为"比较宽的"操作数, 并且不丢失信息的转换

**自动类型规则:**
- 如果其中一个操作数为long double, 则将另一个操作数转换为long double类型
- 如果其中一个操作数为double类型, 则将另一个操作数转换为double类型
- 如果其中一个操作数的类型为float, 则将另一个操作数转换为float类型
- 将char与short类型的操作数转换为int类型
- 如果其中一个操作数的类型为long, 则将另一个操作数也转换为long类型
- 字符类型的变量都将被转换为整型变量

> 表达式float类型的操作数不会转换为double类型

强制类型转换只是生成一个指定类型的值, 本身的值是不会改变的

**整型提升**(重要)
> 整型提升是按照变量的数据类型的符号位来提升的

表达式+也会发生整型提升,
```c
char c = 10;
printf("%u\n", sizeof(+c));  // 4
printf("%u\n", sizeof(c));  // 1
```

```c
// 负数的整型提升
char c1 = -1;
// 变量c1的二进制补码中只有8个比特位: 11111111
// 因为c1为有符号的char, 所以整型提升时, 高位补充符号位, 即为1
// 提升之后为 11111111111111111111111111111111

// 正数的整型提升
char c2 = 1;
// 变量c2的二进制补码中只有8个比特位: 000000001
// 因为char为有符号的char, 所以整型提升时, 高位补充符号位, 即为0
// 提升之后为 00000000000000000000000000000001

```

## 枚举类型
枚举类型就是将变量的取值限定在有限范围内,在定义时将可能的取值列举出来。

优点：
1. 增强代码的可读性
2. 和#define定义的标志服比较枚举有类型检查,更加严谨
3. 防止命名污染
4. 便于调试
5. 使用方便,一次可以定义多个变量

```c
// 三种方式来定义枚举
// 1. 先定义枚举类型,再定义枚举变量
enum WEEK {
    MON=1, TUE, WED, THU, FRI, SAT, SUN
};
enum WEEK week;

// 2. 定义枚举类型时定义枚举变量
enum DAY {
    MON=1, TUE, WED, THU, FRI, SAT, SUN
} week;

// 3. 省略枚举名称,直接定义
enum {
    MON=1, TUE, WED, THU, FRI, SAT, SUN
} week1;

// 可以将整型变量强转为枚举类型
enum week {
    MON,TUE,WED
}
int main() {
    int a = 1;
    // 1. 定义枚举变量
    enum week wee = WED;
    // 2. 强转
    wee = (enum week)a;
}
```

类型例子:
1. 整型
     1. char
        1. unsigned char
        2. signed char
     2. short [int]
        1. unsigned short [int]
        2. signed short [int]
     3. int
        1. signed int
        2. unsigned int
     4. long [int]
        1. unsigned long [int]
        2. signed long [int]
2. 浮点型
    1. float, 单精度浮点型
    2	
	int (*ap)[10] = NULL;. double, 双精度浮点型
3. 构造类型
    1. 数组类型
    2. 结构体类型
    3. 联合类型
    4. 枚举类型
4. 指针类型
    1. 字符指针, char *cp
    2. 整型指针, short *sp, int *ip, long *lp
    3. 浮点型指针, float *fp, double *dp
    4. 数组指针, []操作符优先级比*优先级高
        1. 数组指针, int (*ap)[10]: 指向长度为10,元素类型为int型的数组
        2. 指针数组, int *pa[10]: 长度为10,元素类型为int型的指针
    5. 结构体指针
    6. 函数指针
        6.1 函数指针, int (*fp)(int): fp是一个指针,指向了参数为int型,返回值为int的函数
        6.2 指针型函数, 就是一个返回指针的函数
5. void类型: 函数无返回值,函数没有形参,指针类型(无具体类型的指针)

## 作用域 
作用域, 变量在文件中的查找方式

当变量被定义在程序的不同位置,他们的作用范围也不同  
作用域,顾名思义,就是变量可以使用的范围.

如果在当前作用域中未找到变量则会去父级作用域查找,以此类推,直到全局作用域

四种作用域:
1. 文件作用域: 在代码块之外的声明的
2. 函数作用域: 函数块中声明的,也具有代码块作用域
3. 原型作用域: 只适用于在函数原型中声明的形参
4. 代码块作用域: 一对大括号括起来的

## 链接属性
标识符的链接属性决定如何处理在不同文件中出现的标识符。

三种链接属性
1. external(外部)
    1. 属于external链接属性的标识符不管声明多少次,位于几个源文件都指向同一实体
2. internal(内部)
    1. 属于internal的标识符在同一源文件中的所有声明都指向同一实体
    2. 属于internal的标识符在不同源文件中的所有声明则指向不同实体
3. none(无)
    1. 没有链接属性的标识符总是被当作单独的实体, 也就是说该标识符的多个声明被当作独立不同的实体

> 1. 只有具有**文件作用域(也就是全局作用域)的标识符**才能拥有external和internal的链接属性,其他作用域的标识符都是none属性
> 2. 默认情况下,具有文件作用域(也就是全局作用域)的标识符的链接属性是external, 也就是说该标识符允许跨文件访问, 对于在不同文件中声明多少次, 都表示同一实体
> 3. 对于具有external链接属性的标识符,可以使用static关键字将其链接属性变为internall属性
>> <span style="color: red;">使用static修改链接属性时需要注意两点:</span> 
>> 1. 只对具有文件作用域的标识符才有用(具有external属性的标识符), 对于其他作用域的标识符则属于静态变量
>> 2. 链接属性只能修改一次, 就是说标识符的链接属性一旦从external变为internal,则无法再变回去了

## 存储类型
变量的存储类型是指变量值得内存类型.变量的存储类型决定了变量何时创建,何时销毁,以及他的值将保存多久.

有三个地方可以存储变量
1. 静态内存区
2. 运行时堆栈
3. 硬件寄存器

变量缺省的储存类型取决于它的声明位置.
1. 凡是在任何代码块之外声明的变量总是储存于静态内存中,不属于堆栈,称为静态变量.
    > 静态变量特点:
    > 1. 在程序运行之前创建,在程序的整个执行期间始终存在
    > 2. **无法为它指定其他的存储类型**
2. 在代码块内部声明的变量的缺省存储类型为auto,存储于堆栈中,称为自动变量. 可以使用auto修饰这种存储类型.当程序执行到声明自动变量的代码块时, 自动变量才会创建, 当程序离开时, 自动变量则销毁
3. 对于代码块内部的声明的变量, 使用static修饰符修饰时, 可以使它的存储类型从自动变为静态变量,特点是在整个程序运行期间一直存在
    > 1. 修改变量的存储类型并不会修改该变量的作用域
    > 2. 函数的形参不能声明为静态, 因为实参总是在堆栈中传递给函数,用于递归
4. register关键字可以用于自动变量的声明, 储存于寄存器中, 这类变量称为寄存器变量.
    > 特点:
    > 1. 寄存器变量的创建和销毁时间与自动变量相同
    > 2. 读取速度快,我们可以将频繁使用的变量放在寄存器中

```
摘自《c程序设计》
1. auto: 所有局部变量默认的储存类,只能用在函数中,就是说它只能修饰局部变量
2. register: 储存类用于定义储存在寄存器而不是RAM中的变量;
    - 这意味着它的最大尺寸等于寄存器的大小,且不能对他使用一元"&"运算符,(因为它没有内存位置)
3. static: 全局声明的static变量或方法可以被任何函数或方法调用,前提是这些方法跟static变量或方法在同一文件中
    - 修饰局部变量时,指示编译器在程序的生命周期内保持局部变量的存在,因此,使用static修饰的局部变量可以在函数调用之间保持局部变量的值
    - 修饰全局变量,会使全局变量的作用域限制在声明它的文件中
4. extern: 用于提供一个全局变量的引用,全局变量对所有文件都可用。当使用extern时,对于无法初始化的变量,会把变量名指向一个之前定义过的储存位置
    - 当有多个文件且定义了一个可以在其他文件中使用的全局变量或函数时,可以在其他文件中使用extern来得到已定义的变量或函数的引用。
    - 可以这么理解,extern是用来在另一个文件中声明一个全局变量或函数
    - extern修饰符通常用于当有两个或多个文件共享相同的全局变量或函数时使用
```

注意点:
1. 静态变量如果不显式的指定其初始值,将初始化为0
2. 自动变量没有缺省的初始值,而显式的初始化将在代码块的起始处隐式插入一条赋值语句,如果没有显式的初始化,则自动变量为垃圾

## static关键字
作用
1. 用于函数定义时,或者用于代码块之外的变量声明时,static用于修改标识符的链接属性,但是作用域和储存类型不变,用这种方式声明的函数或变量只能再声明他们的源文件中访问
2. 当用于代码块内的变量声明时,static关键字用于修改变量的储存类型,从自动变量修改为静态变量,但是链接属性和作用域不受影响

## 控制语句(简要)
1. if语句
2. while
3. do{}while();
4. switch(记住一定要加break)
5. for循环
6. goto语句(应避免使用)

## 操作符
1. 算数操作符: + - * / %
2. 移位操作符: << >>
3. 位操作符: & | ^
4. 赋值操作符: =
5. 单目操作符: ! ++ -- sizeof ~ + *
6. 关系操作符: == > < >= <= !=
7. 逻辑操作符: && ||
8. 条件运算符: ?:
9. 下标引用: []
10. 函数调用: ()
11. 结构成员: ->

左值是能够出现在赋值符号左边的东西,右值是能够出现在赋值符号右边的东西

注意:
1. 有符号数和无符号进行大小比较时, 会把有符号数转为无符号数
    ```c
    #include <stdio.h>
    int i;  // 全局变量未手动初始化时,默认初始化为0
    int main() {
        i--;
        // 打印>
        // 因为i为-1, 而sizeof(i)为无符号数, 两数比较时会将-1转为无符号数
        if(i > sizeof(i)) {
            printf(">\n");
        } else {
            printf("<\n");
        }
        return 0;
    }
    ```

**算数操作符:**
1. 除了%之外, 其他操作符可以用在整型和浮点数
2. 对于/操作符, 如果两个数都为整型则执行整型除法; 而只要有浮点数执行的是浮点数除法
3. %操作符的两个操作数必须为整数, 返回的是整除之后的余数

**sizeof运算符:** 
用来计算类型或者变量所占用的内存大小, <span style="color: red;">但是sizeof是不参与计算的</span>
```c
// 注意: sizeof是不参与计算的
#include <stdio.h>
int main() {
	char c = 0;
	int a = 10;
	// 输出 1 10
	printf("%d\n", sizeof(c = a + 5));
	printf("%d\n", c);
	return 0;
}
```

**逗号表达式:** 就是用逗号隔开多个表达式, 逗号表达式从左向右依次执行, 整个表达式的结果为最后一个表达式的结果

## 函数
函数就是将大的计算任务分解成若干个小的任务

用“组装”的方式来简化程序设计,用到什么去设计什么这就是模块化程序设计的思路

函数就是用来完成特定功能的代码块

```
声明函数: 
返回值类型 函数值(形参列表) {
    // 函数体
    // 1. 局部变量的声明
    // 2. 函数语句块
}
```

**函数的原型**就是来告诉编译器期望接收什么类型的参数,接收参数的数量以及函数的返回值是什么

> // 函数原型  
> // 所有的函数都应该具有原型, 尤其是那些返回值不是整型的函数;  
> // 如果函数在调用之前,编译器无法看到它的原型,便会认定这个函数返回的是一个整型值;如果此时使用一个float来接收时,便会进行强转  
> int *func(float a, int b);

函数的参数都是以**值传递**的方式来调用的

注意点: 当函数传递的是数组(数组是常量指针),或者指针时,传递的时指针的一个拷贝,这时再获取数组中元素时,类似于指针的间接访问;因此参数是指针时类似于"传址调用"

```c
/**
 * 偶校验和: 二进制模式中1的个数是否为偶数
 */
int even_parity(int val, int n_bits) {
  int parity = 0;
  int i;
  while(n_bits > 0) {
    parity += val & 1;
    val >>= 1;
    n_bits--;
  }
  return parity%2 == 0;
}
```

### 递归
递归就是自己调用自己

注意点：递归一定要有出口, 就像while循环一定要有跳出循环的语句

```c
void binaryToAcill(unsigned int value) {
  unsigned int quotient;
  quotient = value / 10;
  if(quotient != 0) {
    binaryToAcill(quotient);
  }
  printf(value % 10 + '0');
}
```

## 指针
1. 指针是什么
2. 指针和指针类型
3. 野指针
4. 指针运算
5. 二级指针
6. 指针数组

指针就是一个变量，用来存放内存单元的地址，32位的指针大小为4个字节，64位的指针大小为8个字节

通过指针可以找到以它为地址的值

**声明指针：**
使用*来声明一个指针语法是，类型 *指针变量

```c
// 声明一个int型指针
int *p;
// 初始化为NULL
p = NULL;
```

**指针类型的意义**
1. 决定了指针进行解引用时能够访问的空间大小，
    1. int *p，*p能够访问4个字节
    2. char *p，*p能够访问1个字节
    3. double *p，*p能够访问8个字节
2. 指针加减整数时，决定了指针的步长(单位是字节)
    1. int *p，p+1向后偏移了4个字节
    2. char *p，p+1向后偏移了1个字节
    3. double *p，p+1向后偏移了8个字节

**野指针**
> 野指针就是指针指向的位置不可知的(随机的，不正确的，没有明确限制的)

情况: 
1. (局部变量)指针未初始化
2. 指针越界访问
3. 指针指向的空间未释放

如何避免野指针?
1. 指针初始化
2. 小心指针越界访问
3. 指针指向空间释放及时设置为NULL
4. 指针使用之前检查有效性

因为野指针是不可控的，所以建议
1. 声明指针，默认初始化为NULL
    ```c
    int *p = NULL;
    ```
2. 在使用动态内存分配的指针时一定要判NULL处理来检查有效性
    ```c
    int *p = (int *)malloc(40);
    if(p == NULL) {}
    ```
3. 在不使用指针时一定要及时置空
    ```c
    int *p = (int *)malloc(40);
    if(p != NULL) {
       // 使用完之后
       free(p);
       p = NULL;
    }
    ```

指针的运算, 一般用在数组中
1. 指针+-整数, 步长为指针类型的字节数
2. 指针-指针, 这两个指针一定是指向同一块内存, 值为两个指针之间的元素个数(并非字节个数)
3. 指针关系运算符

```c
// 比较两个指针,
// 标准规定：允许指向数组元素的指针与指向数组最后一个元素后面的那个内存位置的指针比较，但是不允许与指向第一个之前的那个内存位置的指针进行比较

// 1. 建议
#include <stdio.h>
#define MAX 10
int main() {
	int arr[MAX] = {1,2,3,4,5,6,7,8,9,10};
	int *p = NULL;
	
	// 允许数组的最后一个元素的内存位置进行比较
	for (p = &arr[MAX]; p > &arr[0];) {
		printf("*p=%d\n", *--p);
	}
	
	// 不允许数组的第一个之前的内存位置的指针进行比较, 不能保证它一定正确
	for (p = &arr[MAX-1]; p >= &arr[0];p--) {
		printf("*p=%d\n", *p);
	}
	return 0;
}
```

**指针基础总结**
```c
1. 指针就是一个变量, 用来保存内存地址, 地址唯一标识一块内存空间
2. 指针的内存大小是固定的, 32位4个字节, 64位8个字节
3. 指针的类型决定了指针加减一个整数时步长为多少个字节, 解引用操作时能够操作多少个字节
4. 指针的运算
```

**整型指针**
> 就是指向整型的指针, 步长为整型(short,int,long,long long)的字节大小, 并且能够操作(操作的意思是使用*对其解引用赋值)整型(short,int,long,long long)类型大小的字节

**浮点型指针**
> 指向浮点型的指针, 步长为浮点型(float, double)的字节大小, 并且能够操作浮点型(float,double)类型大小的字节

**字符指针**
> 作用:
> 1. 指向字符类型
> 2. 指向一个常量字符串; 从这里可以看出, 字符串的既可以使用字符数组来表示, 也可以使用字符指针来表示
>
> <span style="color: red;">Tips: 使用字符指针表示字符串时, 因为常量字符串不能使用*解引用改变字符串某个位置的字符,所以可以在声明的同时将字符指针声明为const指针; 例如 const *p = "abcdefg";</span>

**指针和数组**
1. 指针数组, 是一个数组,数组里的元素是指针类型, 比如 int *arr[10],是一个保存了10个int类型指针的数组
2. 数组指针, 是一个指针,指向了一个数组类型, 比如 int (*arr)[10], 是一个指向了保存10个int类型的数组的指针

```c
#include <stdio.h>

int main() {
	int arr[10] = { 1,2,3,4,5,6,7,8,9,10 };

	// 证明数组名是一个指向数组第一个元素的常量指针
	printf("%p\n", arr);
	printf("%p\n", &arr[0]);
	printf("%p\n", &arr);

	// 可以证明&arr其实是获取整个数组的地址，
	// 虽然和数组的第一个元素的地址相同,但&arr还是和arr有区别的
	// 相同点是地址相同, 不同点是字节大小不同,arr是和数组元素大小相同, &arr是整个数组的大小
	printf("%p\n", arr + 1);
	printf("%p\n", &arr[0] + 1);
	printf("%p\m", &arr + 1);
	return 0;
}
```

**指针数组**
> 是一个数组, 数组里面保存的元素是指针类型, 可以对数组中每个元素解引用来获取指针指向的值

```c
// 指针数组
#include <stdio.h>
int main() {
	//int a = 1;
	//int b = 2;
	//int c = 3;
	//int d = 4;
	//int e = 5;
	//int *arr[5] = { &a, &b, &c, &d, &e};
	//int i;
	//for (i = 0; i < 5;i++) {
	//	// 1. 使用下标获取数组的每个元素
	//	// 2. 由于数组的每个元素都是一个指针(指向int类型),可以使用*对其解引用来获取指针指向的值
	//	printf("%d\n", *arr[i]);
	//}

	// 数组是一个常量指针, 数组名就是数组首元素的地址
	int arr1[] = { 1,2,3,4,5 };
	int arr2[] = { 2,3,4,5,6 };
	int arr3[] = { 3,4,5,6,7 };
	// arr是一个数组, 里面保存了3个指针
	int *arr[3] = { arr1, arr2, arr3 };
	for (int i = 0; i < 3;i++) {
		for (int j = 0; j < 5;j++) {
			// *(arr + j) ===> arr[j]
			// printf("%d\t", *(arr[i] + j));
			printf("%d\t", arr[i][j]);
		}
		printf("\n");
	}
	return 0;
}
```

**数组指针**
> 是一个指针, 指向是数组

```c
// 初识
#include <stdio.h>
int main() {
	int arr[5] = { 1,2,3,4,5 };
	printf("%d\n", arr);
	printf("%d\n", &arr[0]);
	printf("%d\n", &arr);
	int (*pa)[5] = &arr;

	for (int i = 0; i < 5;i++) {
		// 首先使用*pa解引用出数组名(和数组是有区别的, 操作的内存大小不一样, 数组名是首元素的地址, 数组是整个数组的内存大小)
		// 数组名是数组首元素的地址,然后就可以对其加运算获取数组的每个元素
		// printf("%d\n", *(*pa + i));
		// 类似于
		printf("%d\n", (*pa)[i]);
	}
	return 0;
}
// 真正用法
#include <stdio.h>
void print1(int arr[3][5], int x, int y) {
	int i, j;
	for (i = 0; i < x;i++) {
		for (j = 0; j < y;j++) {
			// printf("%d\t", arr[i][j]);
			// 类似于, 先获取arr的每个元素, 每个元素是个数组, arr[i]直接获取的是数组名(数组的第一个元素),
			// 然后可以通过数组名加运算获取每个数组的元素, 最后解引用
			// printf("%d\t", *(arr[i] + j));
			// 类似于, 通过二维数组arr, 加运算获取二维数组arr中每个元素的地址(地址是数组的地址,所以加运算时步长为每个元素数组的内存大小), 
			// 每个元素也是一个数组, 也可以加运算获取每个数组中的元素, 最后解引用
			printf("%d\t", *(*(arr + i)+j));
		}
		printf("\n");
	}
}
void printf2(int(*arr)[5], int x, int y) {
    // 使用数组指针接收, 参数arr指向二维数组的首元素
	int i, j;
	for (i = 0; i < x; i++) {
		for (j = 0; j < y; j++) {
			// printf("%d\t", arr[i][j]);
			// printf("%d\t", *(arr[i] + j));
			printf("%d\t", *(*(arr + i) + j));
		}
		printf("\n");
	}
}
void printf3(int *parr[5], int x, int y) {
	// 使用指针数组接收,
	int i, j;
	printf("%d\n", parr[0]);
	printf("%d\n", parr[1]);
	printf("%d\n", parr[2]);
	for (i = 0; i < x;i++) {
		for (j = 0; j < y;j++) {
			const pv = *(parr + j + i * y);
			printf("%d\t", pv);
		}
		printf("\n");
	}
}
int main() {
	int arr[3][5] = { {1,2,3,4,5},{2,3,4,5,6},{3,4,5,6,7} };
	// print1(arr, 3, 5);
	printf2(arr, 3, 5);
	return 0;
}
```

**传参**
```c
// 一维数组传参
// 1. 直接数组传参
void test1(int arr[10]){}
// 2. 数组传参不写长度
void test2(int arr[]){}
// 3. 指针形式, 指针接受数组参数时,指针指向数组的第一个元素地址
void test3(int *arr){}
int main() {
    int arr[10] = { 0 };
}

// 二维数组传参, 函数形参只能省略第一个[]的数字,因为对一个二维数组,可以不知道有多少行,但是必须知道有多少列
```

**函数指针**
&函数名 和 函数名都是函数的地址, 函数指针就是存放函数地址的指针
```c
// 代码1
// 吧0强制转换为void (*)()函数指针类型, 0就是一个函数的地址, 然后再解引用,调用0地址处的该函数
(*(void (*)())0)();
// 代码2
void (*signal(int, void(*)(int)))(int);

// 使用typedef简化函数指针
typedef void (* pfunc)(int);
```

**函数指针数组**
数组是一个存放相同数据类型的连续的储存位置, 吧函数的地址存放在数组中,这就是函数指针数组

**回调函数**
回调函数就是不是由该函数的实现方直接调用,而是在特定的事件或条件发生时由另外的一方调用,用于对该事件或者条件进行响应; c语言中的回调函数是通过函数指针调用的函数, 将函数指针(地址)作为参数传递给另一个函数, 当这个指针被用来调用其所指向的函数

**指向函数指针数组的指针**
指向函数指针数组的指针是一个<span style="color:red;">指针</span>; 指针指向了一个<span style="color:red;">数组</span>; 数组的元素是<span style="color:red;">函数指针</span>


## 数组
学习目标：
1. 怎么声明一维数组，二维数组
2. 数组的内存结构是什么样子
3. 数组和指针区别
4. 数组做为参数传入函数
5. 数组指针和指针数组

数组表示一段连续的,固定长度(长度不可改变)且类型相同的储存空间, 数组名是指向数组起始位置的指针常量

数组的特点: 
1. 数组中每个元素的类型相同
2. 定长度

数组名的值就是一个指向数字第一个元素的指针

计算数组的长度: sizeof(数组名)/sizeof(数组名[0])
```c
// sizeof(数组名)的结果是整个数组所占用的字节数
// sizeof(数组名[0])的结果是数组每个元素所占用的字节数
char const keyword[] = {
    "do", "for", "if", "return"
};
```

### 一维数组
array[index] 等同于 *(array + index)

**声明定义一个数组**
1. 指定长度和元素: int arr[5] = {1,2,3,4,5};
2. 不指定长度,编译器会根据值的多少来计算出数组的长度: int arr[] = {1,2,3,4,5};
3. 指定部分元素,其余的元素取默认值(整型是0,字符型是'\0',指针是NULL): int arr[5] = {1,2,3};
4. 指定数组的默认值: int arr[5] = {0,0,0,0,0} 等价于=> int arr[5] = {0};

**取值赋值**
1. 取值: 数组名[下标]
2. 赋值: 数组名[下标] = 值

数组的下标是从0开始的,并且数组中的每一个元素都属于同一个数据类型

**声明数组参数**
数组做为函数的参数时, 函数的形参可以是数组, 也可以是指针

以下这两个函数原型是等价的:
1. int strlen(char *string);
2. int strlen(char string[]);

```c
// 复制字符串
// char const *string, 表示不能通过*string来修改原字符; 但是string表示字符指针,是一个字符地址,还是可以修改的
void strcpy(char *buffer, char const *string) {
    while((*buffer++ = *string++) != '\0');
}
```

#### 数组名的意义
1. sizeof(数组名), 这里的数组名表示整个数组, 计算的是整个数组的大小
2. &数组名, 这里的数组名表示整个数组, 取出的是整个数组的大小
3. 除此之外, 所有的数组名都表示首元素的地址

#### 指针和数组
1. 声明一个数组时,编译器将会根据声明所指定的元素数量为数组保留内存空间,然后再去创建数组名,它是一个常量,并且指向数组的起始位置
2. 声明一个指针变量时,编译器只为指针本身保留内存空间,它并不会为任何值分配内存空间,并且指针变量并不会被初始化为指向任何现有的内存空间,如果他是一个自动变量,它甚至都不会被初始化

#### 字符数组
数组中的元素都是字符(以单引号括起来的并且只有一个单词或符号);取值,赋值和整型数组都一样

**声明字符数组**
1. char carr[5] = {'a','b','c','d'};
2. 初始化默认值, char carr1[5] = {'\0'};

**字符串**  
一个字符串就是0个或多个的字符

c语言中使用字符数组表示字符串,字符串是由一个一个字符组成,\0标志着字符数组的结束

```c
// 声明一个字符串 abc; 注意: \0是字符串的结束标识符
char str1[4] = {'a','b','c','\0'};
char str2[] = {"abc"};
char str3[] = "abc";
```

```c
c中文件头string.h包含了许多操作字符串的函数
1. size_t strlen(char const *string); 字符串的长度
2. char *strcpy(char *dst, char const *src); 复制字符串(dst不能是字符串常量)
3. char *strcat(char *dst, char const *src); 连接字符串
4. int strcmp(char const *dst, char const *src); 比较字符串
5. char *strstr(char const *dst, char const *src); 查找子串
```

```c
#include <stdio.h>
#include <string.h>
int main() {
    // 打印hehe, 因为strlen返回的是size_t类型(无符号int), 相减之后还是无符号类型
    if(strlen("abc") - strlen("abcdef") > 0) {
        printf("hehe\n");
    } else {
        printf("haha\n");
    }
    return 0;
}
```

### 内存操作
1. void *memcpy(void *dst, void const *src, size_t length); 标准是不操作重叠内存(字节)
2. void *memmove(void *dst, void const *src, size_t length); 可以操作重叠内存
3. void *memcmp(void const *a, void const *b, size_t length);
4. void *memchr(void const *a, void const *b, size_t length);
5. void *memset(void *a, int ch, size_t length); 作用是将一块内存地址的内容全部设置为指定的内容, 通常为新申请的内存(数组或结构体)做初始化工作(注意：memset操作的是字节)

### 多维数组
数组的维数不止一个,也就是说数组的元素也是数组.

例如: int c[6][10]; 我们可以吧c看作是一个6个元素的向量,只不过每个元素是一个保存着10个int型的数组

array[n][m] => \*(\*(array + n) + m)

**储存顺序**
多维数组的储存顺序也是按照顺序来存储的

两种特殊指针:
1. 指向数组的指针: int (*p)[10];
2. 数组指针: int *p[10];

```c
int matrix[6][10];
int *mp;
mp = &matrix[3][8];
printf("First value is %d\n", &mp);
printf("Second value is %d\n", *++mp);
printf("Second value is %d\n", *++mp);
```

## 结构体(struct)
数组是相同类型的元素的集合, 可以通过**下标**或者**指针**间接访问元素

结构可以吧不同类型的值储存在一起, 每个结构的成员类型可能不同, 可以通过成员名字来访问

使用结构体一定要分清楚结构体类型, 结构体变量, 结构体变量的初始化

#### 声明结构
```c
struct 标识符 {
    类型说明符 结构成员1;
    类型说明符 结构成员2;
    ...
} [变量];
```

结构变量: 就是使用结构类型定义的变量

注意：
1. 定义结构体并不会为其分配内存空间, 只有使用新定义的结构体定义一个新变量时,编译器才会为其分配内存空间
2. 定义结构体时一定要加; 因为结构体是一个语句
3. 结构体中的成员为数组时,是静态值,所以不能直接赋值
4. 不同的结构声明即使他们的成员列表相同也被认为是不同的类型

```c
// 1. 声明结构体类型
struct Stu {
  char name[20];
  int age;
};

// 2. 声明匿名的结构体类型并定义变量
struct {
    char name[20];
    int age;
    double score;
} stu1;

// 技巧: 声明结构体时可以使用typedef创建一个新类型
// 这里的Simple是个类型名而不是结构类型名
typedef struct {
    int a;
    char b;
    float c;
} Simple;
```

### 结构成员
任何在结构外部声明的任何变量都可以做为结构的成员, 结构成员可以为标量, 数组, 指针, 其他结构变量

**访问结构成员**
1. 结构成员可以通过**结构变量**通过点运算符(.)来直接访问
2. **结构指针**通过箭头操作符间接访问(->), 相当于 (*p).成员

### 结构的自引用
一个结构的成员不能是自身的结构变量, 因为此时结构还未定义, 并不能知道结构所占用的空间大小, 则会一直陷入引用循环中; 但是可以通过结构指针来实现自引用

```c
// 不合法
struct SIMPLE {
    int a;
    char b;
    struct SIMPLE sim;  // 还未创建好结构类型, 未知大小
};

// 合法
struct SIMPLE {
    int a;
    char b;
    struct SIMPLE *p;  // 即使结构类型还未创建好,但是指针所占用内存大小是已知的
};
```

### 结构体内存对齐(计算结构体的内存大小)
结构的成员应该根据他们的边界进行重排, 已减少因边界对齐而造成的内存损失。根据边界对齐要求降序排列结构成员可以最大限度的减少结构储存中浪费的内存空间

**结构体的对齐规则**
1. 第一个成员在与结构体变量偏移量为0的地址处
2. 其他成员变量到某个数字(对齐数)的整数倍的地址处
    1. 对齐数 = 编译器默认的一个对齐数与该成员大小的较小值; vs中默认值为8
3. 结构体总大小为最大对齐数(每个成员变量都有一个对齐数)的整数倍
4. 如果嵌套了结构体的情况, 嵌套的结构体对齐到自己的最大对齐数的整数倍数处, 结构体的整体大小就是所有成员的最大对齐数(含嵌套结构体的对齐数)的整数倍

**为什么需要内存对齐?**
1. **平台原因(移植原因)**: 不是所有的硬件平台都能访问任意地址上的任意数据的; 某些硬件平台只能在某些地址处取某些特定类型的数据, 否则抛出硬件一场
2. **性能原因**: 数据结构(尤其是栈)应该尽可能的在自然边界上对齐.原因在于,为了访问未对齐的内存,处理器需要作两次内存访问; 而对齐的内存访问仅需要一次访问

总体来说: 结构体的内存对齐就是拿空间换时间的做法

在设计结构体的时候,我们纪要满足对齐,又要节省空间,我们应该: 让占用空间小的成员尽量集中在一起
```c
 内存对其
#include <stdio.h>
struct S {
	char c1;
	int a;
	char c2;
};
struct S2 {
	char c1;
	char c2;
	int a;
};
int main() {
	struct S s = {0};
	// 12
	printf("%d\n", sizeof(s));
	struct S2 s2 = {0};
	// 8
	printf("%d\n", sizeof(s2));
	return 0;
}
```

我们可以使用#pragma来修改默认的对齐数, 以达到节省空间的目的
```c
#include <stdio.h>
// 声明结构体类型S1
struct S1 {
	char a;
	double b;
};

// 1. 使用#pragma修改默认的内存对齐数
// 将默认的内存对齐数修改为4
#pragma pack(4)
struct S2 {
	char a;
	double b;
};
// 取消设置默认的对齐数,还原为默认值
#pragma pack()

#pragma pack(1)
struct S3 {
	char a;
	double b;
};
#pragma pack()
int main() {
	// 定义结构体变量s1
	struct S1 s1 = {0};
	// 打印16,首先储存成员a时,成员a为首成员,类型为char,占用1个字节;
	// 其次储存成员b时,成员b不是首成员,类型为double,占用8个字节,所以成员b的开始地址为 从结构体变量开始的位置偏移量为8的整倍数的地址
	// 结构体的大小为所有成员中最大对齐数的整倍数,这里最大对齐数为8(成员b的对齐数）
	printf("%d\n", sizeof(s1));

	// 12
	struct S2 s2 = {0};
	printf("%d\n", sizeof(s2));

	// 9
	struct S3 s3 = { 0 };
	printf("%d\n", sizeof(s3));
	return 0;
}
```

sizeof操作符能够得出一个结构的整体长度, 

如果需要确定结构某个成员的位置,应该考虑边界对齐因素,使用offsetof(type, memeber), 位于stddef.h中, 表示指定成员位于开始储存位置距离结构开始储存的距离偏移几个字节

```c
// 例子
#include <stdio.h>
#include <stddef.h>

struct ALIGN {
  char a;
  int b;
  char c;
} a1;

struct ALIGN2 {
  int a;
  char b;
  char c;
} a2;

typedef struct {
  char product[20];
  int quantity;
  float unit;
  float total;
} Transition;
typedef struct {
  int quantity;
  char product[20];
  float unit;
  float total;
} Transition2;


typedef struct {
  int a;
  short b[2];
} Ex2;

typedef struct Ex {
  int a;
  char b[3];
  Ex2 c;
  struct Ex *d;  // 通过指针来达到自引用目的
} Ex;

int main() {
  Ex x = {10, "Hi", {5, {-1, 25}}, 0};
  Ex *px = &x;
  printf("sizeof(Ex) = %d\n", sizeof(Ex));
  printf("*px=%d\n", *px);
  printf("px=%d\n", px);
  printf("*px.a=%d\n", (*px).a);
  printf("&(*px.a)=%d\n", &((*px).a));
  printf("*(px++)=%d\n", *(px++));
  printf("*(px+2)=%d\n", *(px+2));

  printf("&(px->a)=%d\n", &(px->a));
  printf("&(px->b)=%d\n", &(px->b));
  printf("&(px->c)=%d\n", &(px->c));
  printf("&(px->d)=%d\n", &(px->d));

  printf("sizeof(a1)=%d\n", sizeof(a1));
  printf("&(a1.a)=%d\n", &(a1.a));
  printf("&(a1.b)=%d\n", &(a1.b));
  printf("&(a1.c)=%d\n", &(a1.c));
  printf("offsetof(struct ALIGN, a)=%d\n", offsetof(struct ALIGN, a));
  printf("offsetof(struct ALIGN, b)=%d\n", offsetof(struct ALIGN, b));
  printf("offsetof(struct ALIGN, c)=%d\n", offsetof(struct ALIGN, c));
  printf("sizeof(a2)=%d\n", sizeof(a2));
  printf("&(a2.a)=%d\n", &(a2.a));
  printf("&(a2.b)=%d\n", &(a2.b));
  printf("&(a2.c)=%d\n", &(a2.c));
  printf("offsetof(struct ALIGN2, a)=%d\n", offsetof(struct ALIGN2, a));
  printf("offsetof(struct ALIGN2, b)=%d\n", offsetof(struct ALIGN2, b));
  printf("offsetof(struct ALIGN2, c)=%d\n", offsetof(struct ALIGN2, c));

  Transition t1;
  Transition2 t2;
  printf("sizeof Transition=%d\n", sizeof t1);
  printf("sizeof Transition2=%d\n", sizeof t2);
  return 0;
}
```

### 向函数中传递结构
第一种方式, 直接传递结构, 因为函数都是值传递, 所以函数中传递的都是结构的拷贝, 当结构成员较多时, 内存消耗大, 效率低; 并且在函数中修改结构的成员值时,并不会修改原结构的成员值

```c
typedef struct {
    int a;
    int b;
    char c;
} Tran;

// 如果结构占用内存较多,此时的拷贝效率比较低
Tran test(Tran t) {
    return t;
}
```

第二种方式, 通过结构指针传递, 指针占用固定字节数, 所以传递结构指针效率高, 但是有个缺陷是, 指针会改变指向, 可以通过传递常量指针解决

```c
typedef struct {
    int a;
    int b;
    char c;
} Tran;
Tran *testp(Tran *tp) {
    return tp;
}

// 传递const指针解决指向会改变的问题
Tran *testConstp(Tran const *tp) {
    return tp;
}
```

#### 柔型数组
c99中, 结构体中最后一个元素允许未知大小的数组, 这就叫做柔性数组成员

**创建柔性数组成员**
```c
// 第一种方式
typedef struct st_type {
    int i;
    int a[0];  // 柔性数组成员
} type_a;

// 第二种方式
typedef struct st_type2 {
    int i;
    int a[];  // 柔性数组成员
} type_a2;
```

**柔性数组特点**
1. 结构体中的柔性数组成员前面至少要有一个其他成员
2. sizeof返回的这种结构体大小不包括柔性数组的内存
3. 包含柔性数组成员的结构用malloc()函数进行内存的动态分配, 并且分配的内存大小应该大于结构的大小, 以适应柔性数组的预期大小

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
struct S {
	int a;
	int b[];
};
int main() {
	// 结构体的大小加上柔性数组的大小
	struct S* ps = (struct S*)malloc(sizeof(struct S) + 5 * sizeof(int));
	if (ps == NULL) {
		printf("%s\n", strerror(errno));
		return 0;
	}

	ps->a = 100;
	int i = 0;
	for (i = 0; i < 5; i++)
	{
		ps->b[i] = i;
	}
	// 重新分配大小
	struct S* ptr = (struct S*)realloc(ps, sizeof(struct S) + 10 * sizeof(int));
	if (ptr != NULL) {
		// 分配成功则覆盖原数组
		ps = ptr;
	}
	for (i = 5; i < 10; i++)
	{
		ps->b[i] = i;
	}
	free(ps);
	ps = NULL;
	return 0;
}
```
```c
// 不使用柔性数组, 实现以上方式
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
struct S {
	int a;
	int *b;
};
int main() {
	// 结构体的大小加上柔性数组的大小
	struct S* ps = (struct S*)malloc(sizeof(struct S));
	if (ps == NULL) {
		printf("%s\n", strerror(errno));
		return 0;
	}
	// 有了struct S指针变量之后就可以动态分配成员变量b的大小了
	ps->b = (int*)malloc(sizeof(int) * 5);

	ps->a = 100;
	int i = 0;
	for (i = 0; i < 5; i++)
	{
		ps->b[i] = i;
	}
	// 重新分配大小
	int* iptr = (int*)realloc(ps->b, 10 * sizeof(int));
	if (iptr != NULL) {
		// 分配成功则覆盖原数组
		// 重新分配了struct S指针变量之后就可以动态分配成员变量b的大小了
		ps->b = iptr;
	}
	for (i = 5; i < 10; i++)
	{
		ps->b[i] = i;
	}

	for (i = 0; i < 10;i++) {
		printf("%d\n", ps->b[i]);
	}
	free(ps->b);
	ps->b = NULL;
	free(ps);
	ps = NULL;
	return 0;
}
```

**柔性数组好处**
1. 方便内存释放
    > 如果我们的代码是在一个给别人使用的函数中, 在里面做了二次内存分配, 并把整个结构体返回给用户.用户调用free可以释放结构体, 但是用户并不知道这个结构体内的成员也需要free, 所以你不能指望用户来发小这个事情. 所以如果我们吧结构体的内存一起其成员要的内存一次分配好了, 并返回给用户一个结构体指针, 有用户做一次free就可以吧所有的内存也给释放
2. 有利于访问速度
    > 连续的内存有益于提高访问速度, 也有益于减少内存碎片

### 位域(也叫位段, 位字段)
位域声明和结构类似, 位域成员是一个或者多个位的字段, 储存于一个或多个整型值中

位域声明:
1. 成员必须声明为int, unsigned int, signed int类型
2. 在成员后面是一个冒号和一个整数, 这个整数指定该位段占用的位数目

```c
// 位域声明
struct CHAR {
    unsigned ch :1;
    unsigned font :7;
    unsigned size :19;
} ch;
```

目的:
1. 使用位域我们可以很方便的访问一个整型值的部分内容

但是在实际开发中, 由于位域在不同系统中可能有不同的结果, 并且**任何可以使用位域实现的任务都可以使用以为移位和屏蔽来实现** 所以我们应避免使用位域。

位域在不同系统中可能有不同的结果：
1. int位域别当作是有符号数还是无符号数目
2. 位域的最大数目不确定. 许多编译器吧位域成员的长度限制在一个整型值的长度内, 所以一个能够运行于32位的整数的机器上可能在16位机器上无法运行
3. 位域成员在内存中是从左到右分配还是从右到左分配
4. 当声明了两个位域, 第2个位域比较大, 无法容纳第1个位域剩余位时, 编译器可能吧第2个位域放在内存的下一个字, 也可能直接放在第1个字后, 从而在两个内存位置的边界形成重叠

内存分配：
1. 位段的成员可以是int, unsigned int, signed int或者是char(整型家族)类型
2. 位段的空间上需要以4个字节(int)或者1个字节(char)的方式来开辟; 如果是int类型则一次开辟一个int型的空间;如果是char类型则一次开辟一个char型的空间
3. 位段涉及很多不确定因素,位段是不跨平台的,注重可移植型的程序应该避免使用位段

```c
// 位段
#include <stdio.h>
struct S {
	int a:2;
	int b:5;
	int c:7;
	// int d:33;  // C2034	“S::d”: 位域类型对位数太小; 所以这里不能超过最大位数
	int d:32;
};
int main() {
	printf("%d\n", sizeof(S));
	return 0;
}

// 位段2
#include <stdio.h>
struct S {
	int a:2;
	int b:5;
	int c:7;
	int d:32;
};
struct S1 {
	char a : 3;
	char b : 4;
	char c : 5;
	char d : 4;
};
int main() {
	// 8
	printf("%d\n", sizeof(S));
	// 3
	printf("%d\n", sizeof(S1));
	struct S1 s = {0};
	// 内存结构为 00100010 00000100 00000010
	s.a = 10;
	s.b = 20;
	s.c = 8;
	s.d = 3;
	return 0;
}
```


### 联合, 也叫共用体(union)
联合的所有成员引用的是内存中相同的位置, 联合所占用的内存大小必须能够存放下最大的成员, 所以联合的内存大小至少和内存最大的成员的一样

如果想在不同时刻吧不同的东西存在相同的位置时, 可以使用联合; 内存中某个特定的区域在不同的时刻储存不同类型的值

内存分配:
1. 共用体的内存大小至少是最大成员的字节大小
2. 当最大成员大小不是最大对齐数的整数倍的时候，就要对齐到最大对齐数的整数倍

```c
union {
    float f;
    int i;
} fi;

// 使用共用体判断大小端
int check() {
    union {
		char c;
		int i;
	}u;
	u.i = 1;
	return u.c;
}
```

## 内存分配
c中内存分配有三种:
1. 静态储存区(数据段): 编译时分配, 主要储存全局变量和静态变量;在程序执行时由系统分配和回收
2. 栈储存区(stack): 编译时不进行分配, 也叫做动态储存分配, 储存局部变量,形参; 由编译器来回收内存, **函数执行结束时这些储存单元自动回收**. 栈内存分配的运算内置于处理器的指令中, 效率很高, 但是分配的内存空间有限. 栈区主要存放运行函数而分配的局部变量, 函数参数, 返回数据, 返回地址等
3. 堆储存区(heap): 当编译器无法确认数据区域的大小时, 在堆储存区中动态分配, 由程序员自己编写的代码, 在程序中分配和回收
4. 代码块, 存放函数体(类成员函数和全局函数)的二进制代码和常量字符串

```c
堆和栈的区别:
1. 内存分配和回收方式不同, 栈是由编译器来分配内存, 主要存放函数参数值和局部变量, 而堆是代码来分配和释放
2. 存放内容不同, 栈主要用来存放函数的参数和局部变量, 而堆的存放内容没有限制
3. 大小限制不同, 栈是由高地址向低地址扩展, 是一块连续的内存区域, 也就是说, 栈顶的地址和栈的最大容量是系统预先设定好的, 如果超过了这个范围, 将提示堆栈溢出
4. 效率不同, 栈执行效率高, 而堆是由malloc等函数分配的内存, 速度比较慢
```

## 动态内存分配
1. 动态内存分配是什么?
2. 为什么需要动态内存分配?

数组是一段连续的内存空间, 在编译期间都已经确定了数组的长度; 但是, 数组的长度常常在运行时才知道.

第一种情况在编译期间,给数组分配内存空间较小时, 不够存放在运行期间输入的数据; 第二种情况, 在编译期间给数组分配的内存够空间较大时, 运行期间输入的数据较少, 会造成数组有较多的内存空间未使用; 为了在运行期间合理的利用内存空间, 可以给数组动态分配内存空间

```c
// 以下两种开辟空间的特点:
// 1. 开辟的空间大小固定
// 2. 数组在申明时,必须制定数组的长度,它所需要的内存在编译时分配
int val = 20;  // 在栈空间上开辟四个字节
char arr[10] = {0};  // 在栈空间上开辟10个字节的连续空间
```

动态内存分配函数:
1. void \*malloc(分要配字节数), 执行动态内存分配, **并未初始化申请的内存块**
2. void \*calloc(元素个数, 元素的大小), 执行动态内存分配, **返回指向内存的指针之前会吧它初始化为0**
3. void *realloc(void *ptr, 新大小), 用于修改一个原先已经分配内存块的大小, 可以使一块内存放大或者缩小
4. void free(void *ptr), 参数是NULL, 或者由malloc, calloc, realloc申请的内存块指针

void指针可以强制转换为其他类型的指针

> 注意: 
> 1. 在使用malloc, calloc, realloc申请内存块时, 必须进行判空(不为NULL)处理
> 2. 在free释放内存后, 可以将指针初始化为NULL, 否则虽然释放了内存地址, 但是指针还是指向内存地址的


**malloc和free**
使用: void* malloc(size_t size), 这个函数向内存申请一块连续可用的空间,并返回指向这块空间的指针
- 如果开辟成功,则返回一个指向开辟好空间的指针
- 如果开辟失败, 则返回一个NULL指针, 因此malloc的返回值一定要检查
- 返回值得类型是void*, 所以malloc函数并不知道开辟空间的类型, 具体在使用的时候使用者自己来决定
- 如果参数size为0, malloc的行为是标准未定义的,取决于编译器

free函数是专门用来释放开辟的内存
- 如果参数ptr指向的空间不是动态开辟的, 那free函数的行为是未定义的
- 如果参数的ptr是NULL指针, 则函数什么都不做
```c
// malloc和free
#include <stdlib.h>
#include <string.h>
#include <errno.h>

int main() {
    // 向堆内存申请10*4个字节的空间
    int *p = (int*)malloc(10 * sizeof(int));
    if(p == NULL){
        // 空间不足申请失败
        printf("%s\n", strerror(errno));
    } else {
        // 申请成功
        int i = 0;
        for(i = 0;i<10;i++) {
            *(p + i) = i;
        }
        for(i = 0;i<10;i++) {
            printf("%d\t", *(p+i));
        }
    }
    free(p);
    p = NULL;
    return 0;
}
```

**calloc**
函数原型: void* calloc (size_t num, size_t size);

- 函数的功能是为num个大小为size的元素开辟一块空间, 并且吧空间的每个字节初始化为0
- 与函数malloc的区别只在于会在返回地址前, 吧申请的空间的每个字节初始化为0

```c
// void* calloc(size_t num, size_t size)
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
int main() {
	int *p = (int*)calloc(10, 4);
	if (p == NULL) {
		printf("%s\n", strerror(errno));
	}
	else {
		// 申请成功
		int i = 0;
		for (i = 0; i < 10;i++) {
			*(p + i) = i;
		}

		for (i = 0; i < 10; i++) {
			printf("%d\n", *(p + i));
		}
	}
	free(p);
	p = NULL;
	return 0;
}
```

**realloc**
用来调整动态内存空间的大小

函数原型: void* realloc(void* ptr, size_t size);

- ptr为需要调整的内存地址
- size为调整之后的大小
- 返回值为调整之后的内存起始位置
- 这个函数调整为原内存空间大小的基础上, 还会将原来的数据移动到新的空间上
- realloc调整内存空间的2中情况
    1. 当原内存空间之后足够大时, 可以追加, 则直接追加返回原地址
    2. 当原内存空间之后不足时, 则realloc会重新找一块新的满足需求的内存空间, **吧原来的数据拷贝过来, 释放旧的内存空间**, 最后返回新的空间地址
    3. **一定要用新的变量来接受realloc开辟的地址**, 因为realloc有可能开辟新空间失败, 如果开辟成功的话就可以使用新变量覆盖旧变量的值

```c
// 重新开辟新空间, 相当于malloc
int* p = (int*)realloc(NULL, 40);
```

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
int main() {
	int* p = (int*)malloc(10 * 4);
	if (p == NULL) {
		printf("%s\n", strerror(errno));
	}
	else {
		int i = 0;
		for (i = 0; i < 10;i++) {
			*(p + i) = i;
		}

		for (i = 0; i < 10; i++)
		{
			printf("%d\n", *(p+i));
		}

		int* np = (int*)realloc(p, 20 * 4);
		if (np != NULL) {
			p = np;
		}
		for (i = 0; i < 20; i++)
		{
			printf("%d\n", *(p + i));
		}
	}
	free(p);
	p = NULL;
	return 0;
}
```

**常见的内存错误**
1. 对空指针的解引用操作
2. 对动态开辟内存的越界访
3. 对非动态开辟内存的空间使用free
4. 使用free释放动态开辟的内存空间的一部分(中间对开辟的内存空间首地址进行加减运算了)
5. 对同一片动态开辟的内存空间多次释放
6. 动态开辟的空间内存忘记释放(内存泄漏)

## 文件操作

### 什么是文件
在程序设计中, 文件分两种
1. 程序文件: 包括源代码文件(.c为后缀), 目标文件(.obj为后缀), 可执行文件(.exe文件)
2. 数据文件: 文件的内容不一定是程序, 而是程序运行时读写的数据, 比如程序运行时需要从中读取的文件, 或者输出内容的文件

### 文件类型
1. 二进制文件: 数据在内存中以二进制的形式存放, 不加转换的输出到外存中
2. 字符文件: 数据在外存中以ASCLL形式储存, 则在储存前需要转换。以ASCLL字符的形式储存的文件就是字符文件

字符一律以ASCLL形式存放, 数值既可以以ASCLL形式存放也可以以二进制形式存放

### 文件的缓冲区
ANSIC标准采用"**缓冲文件系统**"的方式处理数据文件, 所谓缓冲文件系统就是系统自动地在内存中为程序中每一个正在使用的文件开辟一块"**文件缓冲区**"

当从内存向磁盘输出数据会先送到内存中的缓冲区, 装满缓冲区后才一起送到磁盘上; 如果从磁盘向计算机读入数据, 则从磁盘文件中读取数据输入到内存缓冲区, 然后再从缓冲区逐个的将数据送到程序数据区(程序变量等)

缓冲区的大小根据c编译系统决定的

当程序刚打开时, 会默认打开三个流
1. stdin, 标准输入流, 对应键盘
2. stdout, 标准输出流, 对应显示器
3. stderr, 标准错误刘

### 文件的打开和关闭
```c
// 文件打开
FILE* fopen(const char* filename, const char* mode);
// 文件关闭
int close(File* stream);
```

**文件的打开模式**
文件使用方式       | 含义                                    | 如果指定文件不存在
   ----            | ----                                    | ----
"r"(只读)          |  输入数据, 打开一个已存的文件           | 出错
"w"(只写)          |  输出数据, 打开一个文件                 | 新建一个文件
"a"(追加)          |  向文件末尾添加数据                     | 出错
"rb"(二进制只读)   |  输入数据, 打开一个二进制文件           | 出错
"wb"(二进制只写)   |  输出数据, 打开一个二进制文件           | 新建一个文件
"ab"(追加)         |  向一个二进制文件末尾添加数据           | 出错
"r+"(读写)         |  读和写, 打开一个文本文件               | 出错
"w+"(读写)         |  读和写, 建立一个新文件                 | 新建一个文件
"a+"(读写)         |  打开一个文件, 在文件末尾进行读写       | 新建一个文件
"rb+"(读写)        |  读和写, 打开一个二进制文件             | 出错
"wb+"(读写)        |  读和写, 新建一个二进制文件             | 新建一个文件
"ab+"(读写)        |  打开一个二进制文件, 在文件末尾读和写   | 新建一个文件


> 对于为更新而打开的文件（包含“+”号的文件），在允许输入和输出操作的情况下，流应被刷新（fflush）或重新定位（fseek、fsetpos、rewind) 在写操作之后的读操作之前。流应在读取操作之后的写入操作之前重新定位（fseek、fsetpos、rewind）（只要该操作未到达文件末尾）

**操作文件的方式**
```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
int main() {
	// 1. 打开文件
	FILE* fw = fopen("./main.txt", "w");
	if (fw == NULL) {
		printf("%s\n", strerror(errno));
	}
	else {
		// 2. 操作文件
		// 文件打开成功
		fputc('a', fw);
		// 3. 关闭文件
		fclose(fw);
		fw = NULL;
	}
	return 0;
}
```

**操作文件的函数**
1. 字符输入函数, int fgetc ( FILE\* stream );
2. 字符输出函数, int fputc ( int character, FILE\* stream );
3. 字符串输入函数, char\* fgets ( char\* str, int num, FILE\* stream );
    > 从流中读取字符并将它们作为 C 字符串存储到str 中，直到**已读取( num -1) 个字符**或**到达换行符**或**文件结尾**.
    > 换行符使fgets停止读取，但它被函数视为有效字符并包含在复制到str 的字符串中。在复制到str的字符后自动附加终止空字符  
    > str字符串  
    > 指向char数组的指针，其中复制了读取的字符串。  
    > int 数量  
    > 要复制到str 中的最大字符数（包括终止空字符）。  
    > 流  
    > 指向标识输入流的FILE对象的指针。
      stdin可以用作从标准输入读取的参数。  
    > 返回值: 成功时，该函数返回str。
        如果在尝试读取字符时遇到文件尾，则设置eof 指示符( feof )。如果在读取任何字符之前发生这种情况，则返回的指针是空指针（并且str的内容保持不变）。
        如果发生读取错误，则会设置错误指示符( ferror ) 并返回空指针（但str指向的内容可能已更改）。
4. 字符输出函数, int fputs ( const char\* str, FILE\* stream )
5. 格式输入函数, int fscanf ( FILE\* stream, const char\* format, ... );
6. 格式输出函数, int fprintf ( FILE\* stream, const char\* format, ... );
7. 二进制读取, size_t fread ( void\* ptr, size_t size, size_t count, FILE\* stream );
8. 二进制写入, size_t fwrite ( const void\* ptr, size_t size, size_t count, FILE\* stream );

> scanf/fscanf/sscanf对比
> 1. scanf/printf 是针对标准输入流/标准输出流的格式化输入/输出语句
> 2. fscanf/fprint 是针对所有输入流/所有输出流的格式化输入/输出语句
> 3. sscanf/swscanf sscanf是从字符串中读取格式化数据,swscanf是吧格式化数据储存到字符串中

**文件结束判定**
EOF为文件结束标志

使用perror来替换strerror提示报错信息

被错误使用的feof，

在文件读取过程中, 不能使用feof函数的返回值直接用判断文件是否结束
而是**应用于当文件读取结束时 判断时读取失败结束, 还是遇到文件尾结束**

1. 文件读取是否结束, 判断返回值为EOF(fgetc), 或者NULL(fgets)
    > 1. fgetc判断是否为EOF
    > 2. fgets判断返回值是否为NULL
2. 二进制文件的读取结束判断, 判断返回值是否小于实际要读的个数
    > fread判断返回值是否小于实际要读的个数

**fseek**重新设置文件内部指针(光标)的位置
我们可以调用fseek允许在读和写之间切换。

函数原型: int fseek ( FILE * stream, long int offset, int origin );

对于以二进制模式打开的流，新位置是通过向origin指定的参考位置添加偏移量来定义的。 对于以文本模式打开的流，偏移量应为零或先前调用ftell返回的值，并且来源必须为SEEK_SET。 如果使用这些参数的其他值调用该函数，则支持取决于特定的系统和库实现（不可移植）。 在结束文件内部指示器的的流

参数：
1. stream流: 指向标识流的FILE对象的指针。
2. offset偏移量: 
    1. 二进制文件：从origin偏移的字节数。
    2. 文本文件：零或ftell返回的值。
3. origin起源: 用作偏移量参考的位置。它由\&lt;cstdio&gt; 中定义的以下常量之一指定，专门用作此函数的参数：
    > 常数     | 参考位置
    > ---      | ---
    > SEEK_SET | 文件开头
    > SEEK_CUR | 文件指针的当前位置
    > SEEK_END | 文件结束 *
4. 返回值:
    > 如果成功，该函数返回零。否则，它返回非零值。如果发生读取或写入错误，则会设置错误指示符( ferror )。


**ftell**获取文件内光标的位置
函数原型: long int ftell ( FILE * stream );

**rewind**将文内光标重置到文件开头
函数原型: void rewind ( FILE * stream );


例子：
```c
// fgetc
#include <stdio.h>
int main() {
	FILE* fp = fopen("./main.txt", "r");
	if (fp == NULL) {
		perror("open main.txt failed");
		return 0;
	}

	char ch;
	// fget可以使用EOF来判断是否到了文件末尾
	while ((ch = fgetc(fp)) != EOF) {
		printf("%c", ch);
	}

	fclose(fp);
	fp = NULL;
	return 0;
}
```


```c
/*
 函数原型: size_t fread ( void\* ptr, size_t size, size_t count, FILE\* stream );
 作用: 从流中读取数据块
 从流中 读取count 个元素的数组，每个元素的大小为size字节，并将它们存储在ptr指定的内存块中。 流的位置指示器提前读取的总字节数。 如果成功，读取的总字节数为(size*count)。
 指针
	指向大小至少为(size*count)字节的内存块的指针，转换为void*。
 尺寸
	要读取的每个元素的大小（以字节为单位）。
	size_t是无符号整数类型。
 计数
	元素的数量，每个元素的大小为size字节。
	size_t是无符号整数类型。
 流
	指向指定输入流的FILE对象的指针。
 返回成功读取的元素总数。
	如果此数字与count参数不同，则表示发生读取错误或读取时到达文件末尾。在这两种情况下，都设置了适当的指标，可以分别使用ferror和feof进行检查。
	如果size或count为零，则该函数返回零，并且流状态和ptr指向的内容保持不变。
	size_t是无符号整数类型。
    
 fwrite同理
*/
//#include <stdio.h>
//int main() {
//	FILE* fp = fopen("./main.txt", "wb");
//	if (fp == NULL) {
//		perror("error:");
//		return 0;
//	}
//
//	// 1. fwrite写
//	char buf[1024] = "lishihao\n";
//	fwrite(buf, 1, 1024, fp);
//
//	fclose(fp);
//	fp = NULL;
//	return 0;
//}
#include <stdio.h>
int main() {
	FILE* fp = fopen("./main.txt", "rb");
	if (fp == NULL) {
		perror("error:");
		return 0;
	}

	// 2. fread读
	char buf[1024] = { 0 };
	fread(buf, 1, 1024, fp);
	printf("%s\n", buf);

	fclose(fp);
	fp = NULL;
	return 0;
}
```

```c
#include <stdio.h>
int main() {
	char str[1024] = {0};
	// 从标准流中输入一行, 输出一行
	gets(str);
	puts(str);
	return 0;
}
```