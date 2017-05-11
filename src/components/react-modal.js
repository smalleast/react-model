/**
 * Created by tony on 2017/5/11.
 */
import './style.scss';
import documentAppend from 'react-document-append';
import calcStyle from 'calc-style';
import classNames from 'classnames';
import {ReactBackdrop} from 'react-backdrop';
import React, {PropTypes} from 'react';
import noop from 'noop';
import objectAssign from 'object-assign';

export default class ReactModal extends React.Component {
  static propTypes = {
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    buttons: PropTypes.array,
    theme: PropTypes.oneOf(['ios', 'tranparent']),
    className: PropTypes.string,
    backdropStyle: PropTypes.object,
    onClick: PropTypes.func
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
    onClick: noop,
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
      style: {},
      buttons: props.buttons,
      theme: props.theme,
      onClick: props.onClick,
      hidden: true,
      visible: false,
      animating: false
    };
    this._callback = null;
  }

  show(inOptions, inCallback) {
    this._callback = inCallback;
    const {visible} = this.state;
    const {root} = this.refs;
    !visible && this.setState({animating: true, hidden: false}, () => {
      setTimeout(() => {
        this.setState({visible: true})
      })
    });

    let options = objectAssign({}, this.props, inOptions);
    this.setState(options, () => {
      calcStyle(root, (style) => {
        this.setState({style});
      })
    })
  }

  hide(inCallback) {
    console.log('hide');
    this._callback = inCallback;
    this.setState({visible: false})
  }

  _onTransitionEnd = (inEvent) => {
    const {visible} = this.state;
    this.setState({animating: false}, () => {
      !visible && this.setState({hidden: true});
      if (this._callback && typeof this._callback === 'function') {
        this._callback();
      }
    })
  }

  render() {
    const {backdropStyle, visible, onClick, hidden, animating, theme} = this.state;
    return (
      <div className="react-modal-container">
        <ReactBackdrop style={backdropStyle} visible={visible} onClick={onClick.bind(this)}/>
        <div
          ref="root"
          data-visible={visible}
          data-animating={animating}
          data-theme={theme}
          className={classNames('react-modal', this.props.className)}
          hidden={hidden}
          style={{
            marginTop: `-${this.state.style.height / 2}px`,
            marginLeft: `-${this.state.style.width / 2}px`
          }}
          onTransitionEnd={this._onTransitionEnd}>
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
