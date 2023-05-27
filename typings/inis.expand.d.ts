declare namespace INIS {
  interface Result<T> {
    code: number;
    msg: string;
    data: T;
  }

  interface InisList<T> {
    page: number;
    count: number;
    data: T[];
  }

  interface Common<T> {
    json: any;
    text: string | null;
    result: T;
    create_time: number;
    update_time: number;
    delete_time: number;
  }

  interface UserResult {
    level: number[];
  }

  interface ArticleResult {
    group: string | null;
    tags: string | null;
    author: Author;
  }

  interface UserList extends InisList<User> {}
  interface ConfigList extends InisList<Config> {}
}
