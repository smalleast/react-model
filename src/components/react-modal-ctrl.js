import ReactModal from 'components/react-modal';

let instance;

export default class ReactModalCtrl {
  static createInstance(inProps) {
    instance = instance || ReactModal.newInstance(inProps);
    return instance;
  }

  static show(inOptions, inCallback) {
    console.log(instance);
    instance.component.show(inOptions, inCallback);
  }

  static hide(inCallback) {
    instance.component.hide(inCallback);
  }

  static destory() {
    instance.destory();
    instance = null;
  }
}
