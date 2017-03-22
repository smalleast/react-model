import './style.scss';
import classNames from 'classnames';
import {ReactBackdropCtrl} from 'react-backdrop';
import documentAppend from 'react-document-append';
import calcStyle from 'calc-style';

export default class ReactModal extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    buttons: React.PropTypes.array,
    backdropStyle: React.PropTypes.object,
    theme: React.PropTypes.oneOf(['ios', 'tranparent']),
    body: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
    ])
  };

  static defaultProps = {
    header: null,
    body: null,
    busy: false,
    visible: false,
    theme: 'ios',
    buttons: [],
    backdropStyle: {
      style: {
        opacity: 0.7
      }
    }
  };

  static newInstance(inProps) {
    return documentAppend(ReactModal, inProps, {
      className: 'react-modal-wrapper'
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      header: props.header,
      body: props.body,
      theme: props.theme,
      dimensions: {},
      visible: props.visible,
      buttons: props.buttons,
      animating: false
    };
    this._timer = null;
  }

  componentWillMount() {
    ReactBackdropCtrl.createInstance(this.props.backdropStyle);
  }

  show(inOptions) {
    this._setVisible(inOptions, true);
  }

  hide() {
    this._setVisible({}, false);
  }

  _setVisible(inOptions, inValue) {
    this.setState({
      animating: true
    });
    this._timer = setTimeout(this._measureOnShow.bind(this, inOptions, inValue));
  }

  _measureOnShow(inOptions, inValue) {
    console.log(ReactBackdropCtrl);
    var self = this;
    self.setState(
      Object.assign({}, self.props, {
        visible: inValue
      }, inOptions), function () {
        calcStyle(self.refs.root, function (inStyle) {
          self.setState({
            dimensions: inStyle
          })
          inValue ? ReactBackdropCtrl.show() : ReactBackdropCtrl.hide();
          self._clearTimeout();
        })
      }
    );
  }

  _clearTimeout() {
    clearTimeout(this._timer);
    this._timer = null;
  }

  _onTransitionEnd() {
    this.setState({
      animating: false
    });
  }

  render() {
    return (
      <div
        ref="root"
        data-theme={this.state.theme}
        data-visible={this.state.visible}
        data-animating={this.state.animating}
        hidden={!this.state.visible && !this.state.animating}
        onTransitionEnd={this._onTransitionEnd.bind(this)}
        style={{
          marginTop: `-${this.state.dimensions.height / 2}px`,
          marginLeft: `-${this.state.dimensions.width / 2}px`
        }}
        className={classNames('react-modal', this.props.className)}>
        <div className="react-modal-content">
          {this.state.header && typeof(this.state.header) == 'string' &&
          <div className="react-modal-hd" dangerouslySetInnerHTML={{__html: this.state.header}}></div>}
          {this.state.header && typeof(this.state.header) == 'object' &&
          <div className="react-modal-hd">{this.state.header}</div>}

          {this.state.body && typeof(this.state.body) == 'string' &&
          <div className="react-modal-bd" dangerouslySetInnerHTML={{__html: this.state.body}}></div>}
          {this.state.body && typeof(this.state.body) == 'object' &&
          <div className="react-modal-bd">{this.state.body}</div>}

          {this.state.buttons.length > 0 && <div className="react-modal-ft">
            {this.state.buttons.map((item, index) => {
              return <div key={index} className="react-modal-button" onClick={item.onClick.bind(this)}>{item.text}</div>
            })}
          </div>}
        </div>
      </div>
    );
  }
}
