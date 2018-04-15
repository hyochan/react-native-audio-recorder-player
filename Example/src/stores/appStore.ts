import User from '@models/User';
import { observable } from 'mobx';

import moment from 'moment';
import 'moment/locale/ko';
import 'moment/locale/ja';
// import 'moment/locale/zh-cn';
// import 'moment/locale/es';
// import 'moment/locale/fr';
// import 'moment/locale/id';

interface ILocale {
  value: string;
  locale_moment: string;
}

class ObservableListStore {
  @observable private _ready: boolean;
  @observable private _rootNavigatorActionHorizontal: boolean;
  @observable private _locale: ILocale = {
    value: 'ko',
    locale_moment: 'ko',
  };
  @observable private _user: User;

  constructor() {
    this._rootNavigatorActionHorizontal = false;
    this._user = new User();
  }

  public get ready(): boolean  {
    return this._ready;
  }

  public set ready(value: boolean ) {
    this._ready = value;
  }

  public get rootNavigatorActionHorizontal(): boolean {
    return this._rootNavigatorActionHorizontal;
  }

  public set rootNavigatorActionHorizontal(value: boolean) {
    this._rootNavigatorActionHorizontal = value;
  }

  public get locale(): ILocale  {
    return this._locale;
  }

  public set locale(locale: ILocale ) {
    this._locale = locale;
    if (locale.value === 'ko' || locale.value === 'ja') {
      moment.locale(locale.value);
      return;
    }
    moment.locale('en');
  }

  public get user(): User {
    return this._user;
  }

  public set user(value: User) {
    this._user = value;
  }
}

const observableListStore = new ObservableListStore();
export default observableListStore;
