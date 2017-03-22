import ReactModal from 'components/react-modal';

let instance;

export default class ReactModalCtrl {
  static createInstance(inProps) {
    instance = instance || ReactModal.newInstance(inProps);
    return instance;
  }

  static show(inOptions){
    instance.component.show(inOptions);
  }

  static hide(){
    instance.component.hide();
  }

  static destory(){
    instance.destory();
    instance=null;
  }
}
