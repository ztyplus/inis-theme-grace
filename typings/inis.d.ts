/// <reference path="./inis.expand.d.ts" />

declare namespace INIS {
  interface Author {
    id: number;
    nickname: string;
    avatar: string;
    description: string;
    result: UserResult;
  }

  interface User extends Common<UserResult | null> {
    id: number;
    account: string;
    avatar: string;
    nickname: string;
    email: string;
    phone: string;
    remark: string;
    description: string;
    source: string;
    login_time: number;
  }

  interface Login {
    token: string;
    user: User;
  }

  interface Article extends Common<ArticleResult> {
    id: number;
    uid: number;
    title: string;
    abstract: string;
    content: string;
    covers: string;
    group: string;
    views: number;
    top: number;
    last_update: number;
    remark: string;
    tags: string;
  }

  interface ArticleGroup extends Common<any> {
    id: number;
    name: string;
    pid: number;
    avatar: string;
    description: string;
  }

  interface Config extends Common<any> {
    id: number;
    key: string;
    remark: string;
    value: string;
  }
}
