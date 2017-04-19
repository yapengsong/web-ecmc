# 搭建开发环境

## 安装nodejs
### Windows
直接[下载](https://nodejs.org/en/)安装
### linux
以CentOS为例，root用户登录，执行以下命令  

    curl --silent --location https://rpm.nodesource.com/setup | bash -  
执行成功之后使用yun安装，命令如下  

    yum -y install nodejs  
参考[官方文档](https://github.com/nodejs/node-v0.x-archive/wiki/Installing-Node.js-via-package-manager)  
## 安装依赖的nodejs模块
使用npm安装nodejs模块需要git，请确保机器上已经安装好git，然后在项目目录下运行如下命令  

    npm install -g bower gulp //bower和gulp推荐全局安装（-g），全局安装后可直接使用bower和gulp命令
    npm install //安装其余模块
## 安装依赖的第三方插件
在项目目录下运行如下命令，会将依赖的第三方插件下载到bower_components文件夹中  

    bower install --allow-root
    
>Tips:
在Windows平台下使用Git Bash执行命令，可能会遇到`$ bower install --allow-root bash: bower: command not found`的错误，可以执行命令——
```bash
$ ./node_modules/bower/bin/bower install --allow-root
```
来完成第三方插件的安装。


# 运行代码  
## 编译代码  
在项目目录下执行如下命令，会将编译后的代码写入dist文件夹中。  

    gulp build    
    
>Tips:
直接运行可能会像上面那样遇到 `command not found`的错误，则需要指定路径执行命令——
```bash
$ ./node_modules/gulp/bin/gulp.js build
```

## 使用源码启动服务  
在项目目录下执行如下命令

    gulp

  >Tips:
```bash
$ ./node_modules/gulp/bin/gulp.js
```  

# 部署服务  
## 准备环境  
在服务器上安装nodejs和git。  
## 上传文件  
将编译后的dist目录、package.json和index.js文件上传到服务器的同一目录下。  
## 安装部署依赖的nodejs模块  
在服务器的部署目录下执行  

    NODE_ENV=production npm install    
## 修改端口号和代理服务器
端口号和代理的后台tomcat服务地址在index.js文件中修改。  
## 启动服务  
在服务器的部署目录下执行  

    npm start  
# 使用forever启动服务
forever可以使nodejs服务后台运行，并在服务故障时自动重启。[GitHub地址](https://github.com/foreverjs/forever)
## 安装forever
使用如下命令全局安装  

    $ [sudo] npm install forever -g  
## 启动服务
在项目目录下运行如下命令  

    forever -a -l ecmc.log -o out.log -e err.log start index.js  
