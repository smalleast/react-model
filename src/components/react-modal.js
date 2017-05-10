/**
 * Created by tony on 2017/5/4.
 */
import './style.scss';
import documentAppend from 'react-document-append';
import calcStyle from 'calc-style';
import classNames from 'classnames';
import {ReactBackdrop} from 'react-backdrop';
import React, {PropTypes} from 'react';
export default class ReactModal extends React.Component {
  static propTypes = {
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    buttons: PropTypes.array,
    theme: PropTypes.oneOf(['ios', 'tranparent']),
    className: PropTypes.string,
    backdropStyle: PropTypes.object
  }

  static newInstance(inProps) {
    return documentAppend(ReactModal, inProps, {
      className: 'react-modal-wrapper'
    });
  }

  static defaultProps = {
    header: null,
    body: null,
    buttons: [],
    backdropStyle: {
      style: {
        opacity: 0.7
      }
    }
  }

  componentWillMount() {

  }

  constructor(props) {
    super(props);
    this.state = {
      header: props.header,
      body: props.body,
      visible: props.visible,
      style: {},
      buttons: props.buttons,
      theme: props.theme,
      animating: false
    }
    this._timer = null;
  }

  show(inOptions) {
    console.log('show');
    this._setVisible(inOptions, true);
  }

  hide() {
    console.log('hide');
    this._setVisible({}, false);
  }

  _setVisible(inOptions, inValue) {
    let self = this;
    self.setState({
      animating: true
    })
    this._timer=setTimeout(this._calcStyleOnShow.bind(this, inOptions, inValue), 300)
  }

  _calcStyleOnShow(inOptions, inValue) {
    let self = this;

    self.setState(
      Object.assign({}, self.props, {
        visible: inValue
      }, inOptions), function () {
        calcStyle(self.refs.root, function (inStyle) {
          self.setState({
            style: inStyle
          })
          self._clearTimeout();
        })
      })
  }
  _clearTimeout() {
    clearTimeout(this._timer);
    this._timer = null;
  }

  _click() {
    this.hide();
  }

  _onTransitionEnd() {
    let self = this;
    self.setState({
      animating: false
    })
  }

  render() {
    const {backdropStyle, visible} = this.state;
    return (
      <div className="react-modal-container">
        <ReactBackdrop style={backdropStyle} visible={visible}/>
        <div
          ref="root"
          data-visible={this.state.visible}
          data-animating={this.state.animating}
          data-theme={this.state.theme}
          className={classNames('react-modal', this.props.className)}
          hidden={!this.state.visible && !this.state.animating}
          style={{
            marginTop: `-${this.state.style.height / 2}px`,
            marginLeft: `-${this.state.style.width / 2}px`
          }}
          onTransitionEnd={this._onTransitionEnd.bind(this)}
          onClick={this._click.bind(this)}>
          <div className="react-modal-content">
            {
              this.state.header && typeof(this.state.header) === 'string' &&
              <div className="react-modal-hd" dangerouslySetInnerHTML={{__html: this.state.header}}/>
            }
            {
              this.state.header && typeof(this.state.header) === 'object' &&
              <div className="react-modal-hd">{this.state.header}</div>
            }

            {
              this.state.body && typeof(this.state.body) === 'string' &&
              <div className="react-modal-bd" dangerouslySetInnerHTML={{__html: this.state.body}}/>
            }
            {
              this.state.body && typeof(this.state.body) === 'object' &&
              <div className="react-modal-bd">{this.state.body}</div>
            }

            {
              this.state.buttons.length > 0 && <div className="react-modal-ft">
                {this.state.buttons.map((item, index) => {
                  return <div key={index} className="react-modal-button"
                              onClick={item.onClick.bind(this)}>{item.text}</div>
                })}
              </div>
            }
          </div>
        </div>
      </div>

    )
  }
}
