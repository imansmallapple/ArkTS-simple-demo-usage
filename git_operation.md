This repo listed all kinds of git operation during my work.

[git合并历史多个commits](#git合并历史多个commits)  
[git拆分历史一个commit为多个次commit](#git拆分历史一个commit为多个次commit)  
[git修改历史一个commit的提交记录和历史代码](#git修改历史一个commit的提交记录和历史代码)  
[git更安全地强制推送本地仓库代码](#git更安全地强制推送本地仓库代码)  
[修改Git提交历史中的author，email和name等信息](#修改git提交历史中的authoremail和name等信息)  
[如何修改git的第一次提交信息](#如何修改git的第一次提交信息)

## git合并历史多个commits
#### 使用场景
在应用开发过程中提交过多次数的commit，需要合并提交一些历史记录

#### 解决方法
```bash
//首先进入rebase交互模式
git rebase -i [commit SHA code]
//进入vim界面，按i进入Insert模式
//修改需要合并的记录为 s
// :wq 保存修改
//进入vim界面，按i进入Insert模式
//整理修改commit记录
// :wq 保存修改
//结束
```

## git拆分历史一个commit为多个次commit
#### 使用场景
某次提交时修改的文件过多需要拆分成多次记录

#### 解决方法
```bash
//首先进入rebase交互模式
git rebase -i [commit SHA code]
//进入vim界面，按i进入Insert模式
//修改需要拆分的记录为 edit
// :wq 保存修改

//撤销版本A的提交
git reset HEAD~

//撤销完版本A的提交后，我们就可以把两个重大改动分开提交了
git add change1.cpp
git commit -m "Version A"

git add change2.cpp
git commit -m "Version B"

//完成 rebase 过程
git rebase --continue

//结束
```

#### 参考资料  
https://juejin.cn/post/6844903471506800647

## git修改历史一个commit的提交记录和历史代码
#### 使用场景
某次提交的记录描述和代码内容不恰当/不正确，需要修改

#### 解决方法
```bash
//首先进入rebase交互模式
git rebase -i [commit SHA code]
//进入vim界面，按i进入Insert模式
//修改需要修改的记录为 edit
// :wq 保存修改

//撤销版本A的提交
git reset HEAD~

//撤销完版本A的提交后，进行想要的修改
git add change.cpp
git commit --amend

//进入vim界面，按i进入Insert模式
//修改commit内容
// :wq 保存修改

//完成 rebase 过程
git rebase --continue

//结束
```

## git更安全地强制推送本地仓库代码
```bash
git push --force-with-lease
```

## 修改Git提交历史中的author，email和name等信息
```bash
//首先进入rebase交互模式
git rebase -i [commit SHA code]
//进入vim界面，按i进入Insert模式
//修改需要修改的记录为 edit
// :wq 保存修改

git commit --amend -s --author="Chen <chensong64@h-partners.com>"

//完成 rebase 过程
git rebase --continue

//结束
```

```bash
//修改email和name的话
git config user.name <your name>
git config user.email <your email>
```

#### 参考资料  
https://zhuanlan.zhihu.com/p/455741996

## 如何修改git的第一次提交信息
```bash
git rebase -i --root
```
#### 参考资料  
https://www.jianshu.com/p/12c98eb74aaf