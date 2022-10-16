# git 常用命令总结

[git book中文文档](http://gitbook.liuhui998.com/index.html)

[gerrit日常使用](https://www.jianshu.com/p/b77fd16894b6)

## 基本命令
```
1、git init
2、git remote add origin http://192.168.10.250/t3-web-frontend/t3-web-operation.git
拉取远程分支
3、git fetch origin dev-xxx
 根据远程分支创建本地分支,并切换到当前分支
4、git checkout -b dev20190622 origin/dev-xxx

修改代码
6、git status
7、git add vue.config.js
8、git diff vue.config.js
9、git commit -m "注释"
推送远程
10、git push origin dev20190622:dev-xxx
11、git log
12、git checkout dev20190623

git push <远程主机名> <本地分支名>  <远程分支名>
例如 git push origin master：refs/for/master ，
即是将本地的master分支推送到远程主机origin上的对应master分支， origin 是远程主机名，

第一个master是本地分支名，第二个master是远程分支名。

    1.1 git push origin master

    如果远程分支被省略，如上则表示将本地分支推送到与之存在追踪关系的远程分支
    （通常两者同名），如果该远程分支不存在，则会被新建

     1.2 git push origin ：refs/for/master 

　　如果省略本地分支名，则表示删除指定的远程分支，
　　因为这等同于推送一个空的本地分支到远程分支，等同于 git push origin --delete master

    1.3 git push origin

　　 如果当前分支与远程分支存在追踪关系，则本地分支和远程分支都可以省略，
　　 将当前分支推送到origin主机的对应分支 

　1.4 git push

　　如果当前分支只有一个远程分支，那么主机名都可以省略，形如 git push，可以使用git branch -r ，查看远程的分支名

```

## 移除
```
移除cache 状态, 
git rm --cache 文件名

移除cache 状态, 并直接删除
git rm -f 文件名

```

## 撤销
```
取消暂存的文件
git reset HEAD 文件名1 文件名2 ...

撤消对文件的修改
git checkout -- 文件名
```


## 分支
```
查看远程分支
git branch -r

创建分支
git branch 分支名

删除分支
git branch -D 分支名

切换分支
git checkout 分支名

创建和切换合起来
git checkout -b iss53
相等于
$ git branch iss53
$ git checkout iss53

合并分支
git merge 覆盖分支名

如果有冲突, 先解决冲突,然后commit


需要查看每一个分支的最后一次提交
git branch -v 

创建一个本地分支跟踪远程分支:
1. serverfix 分支上工作，可以将其建立在远程跟踪分支之上
git checkout -b serverfix origin/serverfix

2. 快捷方式
git checkout --track origin/serverfix

如果想要将本地分支与远程分支设置为不同名字
git checkout -b 别名 origin/serverfix

⭐️
设置已有的本地分支跟踪一个刚刚拉取下来的远程分支，或者想要修改正在跟踪的上游分支，
你可以在任意时间使用 -u 或 --set-upstream-to 选项运行 git branch 来显式地设置。

$ git branch -u origin/serverfix


想要查看设置的所有跟踪分支，可以使用 git branch 的 -vv 选项。 
这会将所有的本地分支列出来并且包含更多的信息，
如每一个分支正在跟踪哪个远程分支与本地分支是否是领先、落后
git branch -vv


git pull 大多数情况等于 git fetch + git merge

删除远程分支
git push origin --delete 分支名


```


## tag
```
查询tag
git tag

关键字查询tag
git tag -l 'develop_v*'

创建tag
git tag -a tag名 -m "注释内容"
轻量标签: 不需要使用 -a、-s 或 -m 选项，只需要提供标签名字

删除标签
git tag -d <tagname>
本地tag删除了，再执行该句，删除线上tag
git push origin :refs/tags/v1.4-lw

标签信息与对应的提交信息：
git show tag名

基于tag 创建新分支:
git checkout -b 分支名 tag名

拉取远程tag
git fetch origin tag tag名

推送tag到远程
git push origin --tags

```

## git 别名

```
$ git config --global alias.co checkout
$ git config --global alias.br branch
$ git config --global alias.ci commit
$ git config --global alias.st status

取消暂存文件
git config --global alias.unstage 'reset HEAD --'

$ git config --global alias.last 'log -1 HEAD'

演示将 git visual 定义为 gitk 的别名：
$ git config --global alias.visual '!gitk'

取消别名
git config --global --unset alias.st

```


git config --list
