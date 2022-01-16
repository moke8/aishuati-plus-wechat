# 爱刷题PLUS--API
爱刷题PLUS在[爱刷题](https://github.com/moke8/aishuati/)的基础上，舍弃了部署简单、纯前端部署等优势，加入了管理后台、更加方便管理操作和题库录入、修改等。在UI界面上采用了新的设计（原本大概属于没有设计）。

具体内容可以查看[爱刷题PLUS--ADMIN](https://github.com/moke8/aishuati-plus-admin/)和[爱刷题PLUS--API](https://github.com/moke8/aishuati-plus-api/).

## 后台优化

### 录入优化
支持JSON题库录入（[（WORD转json）](https://github.com/moke8/aishuati/)）、Excel题库录入、Word文档录入

支持后台在线修改题库以及内容

### 星标题库
推荐的题库将在首页展示，并在题库列表页置顶

### 题库统计
后台支持统计7天和30天内题库访问次数、题目累计错题次数

### 意见反馈
允许用户直接反馈和错题反馈，帮助管理者更好的管理项目

### 用户管理
支持统计用户近7天和近30天的访问次数

## 小程序特点

### 错误反馈
直接反馈和错题反馈

### banner展示
可以帮助引流到公众号等

### 四种刷题模式
顺序练习、错题练习、乱序练习、题型练习（单选、多选、简答、填空）

### 自定义UI显示
支持夜间模式、护眼模式、日间模式三种配色
支持自定义字体大小
支持自定义是否播放答题提示音
支持自定义答对题目是否后自动下一页

### 答题情况概览
支持答题情况概览和跳转

## API端开发构思
内容分为题库、意见反馈、使用记录、用户管理几个部分
具体可以到[爱刷题PLUS--ADMIN](https://github.com/moke8/aishuati-plus-admin/)和[爱刷题PLUS--API](https://github.com/moke8/aishuati-plus-api/)中查看

## 配置
### 小程序配置
utils/global.js

### 数据库配置
sql/index.js

## 开发
API内容主要分为admin和wechat两个部分，分别对应管理后台和小程序的API。
在层级上分为router、controllers、sql三个部分，也就是路由、控制器、数据库语句。

## 图片预览
[![7NGQxg.md.jpg](https://s4.ax1x.com/2022/01/16/7NGQxg.md.jpg)](https://imgtu.com/i/7NGQxg)

[![7NGMRS.md.jpg](https://s4.ax1x.com/2022/01/16/7NGMRS.md.jpg)](https://imgtu.com/i/7NGMRS)

[![7NG3rj.md.jpg](https://s4.ax1x.com/2022/01/16/7NG3rj.md.jpg)](https://imgtu.com/i/7NG3rj)

[![7NGKG8.md.jpg](https://s4.ax1x.com/2022/01/16/7NGKG8.md.jpg)](https://imgtu.com/i/7NGKG8)

[![7NGJZn.md.jpg](https://s4.ax1x.com/2022/01/16/7NGJZn.md.jpg)](https://imgtu.com/i/7NGJZn)

[![7NG1MQ.md.jpg](https://s4.ax1x.com/2022/01/16/7NG1MQ.md.jpg)](https://imgtu.com/i/7NG1MQ)

[![7NG8qs.md.jpg](https://s4.ax1x.com/2022/01/16/7NG8qs.md.jpg)](https://imgtu.com/i/7NG8qs)
