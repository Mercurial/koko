import _ from 'underscore';
import bridge from '../common/bridge';
import configuration from './lib/configuration';
import React from 'react';
import shortcutManager from './lib/shortcut-manager';

const rootBufferName = configuration.get('root-buffer-name');
const commandSymbol = configuration.get('command-symbol');

export default class InputBox extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    shortcutManager.on('message', this.onMessageKey.bind(this));
    shortcutManager.on('command', this.onCommandKey.bind(this));
    shortcutManager.on('exit', this.onExitKey.bind(this));

    // window events
    bridge.on('focus', this.onFocusWindow.bind(this));
  }

  onMessageKey() {
    let input = React.findDOMNode(this.refs.input);
    if (input.value.startsWith(commandSymbol)) {
      input.value = '';
    }
    this.focus();
  }

  onCommandKey() {
    let input = React.findDOMNode(this.refs.input);
    if (!input.value.startsWith(commandSymbol)) {
      input.value = commandSymbol;
    }
    this.focus();
  }

  onExitKey() {
    this.blur();
  }

  onFocusWindow() {
    if (this.props.channel !== rootBufferName) {
      this.focus();
    }
  }

  render() {
    return (
      <div id='input-box'>
        <form onSubmit={this.submit.bind(this)}>
          <input ref='input' type='text'
                 onKeyDown={this.keyDown.bind(this)} />
        </form>
      </div>
    );
  }

  shouldComponentUpdate(nextProps) {
    let input = React.findDOMNode(this.refs.input);
    return !input.matches(':focus');
  }

  submit(e) {
    e.preventDefault();
    let input = React.findDOMNode(this).querySelector('input');
    let inputValue = input.value;
    if (inputValue.length > 0) {
      this.props.submit(inputValue);
    }
    input.value = '';
  }

  focus() {
    let input = React.findDOMNode(this).querySelector('input');
    input.focus();
  }

  blur() {
    let input = React.findDOMNode(this).querySelector('input');
    input.blur();
  }

  keyDown(e) {
    let modified = _.some(['Alt', 'Control', 'Meta', 'Shift'], e.getModifierState.bind(e));
    let special = _.contains(['U+001B', 'U+0020', 'U+0008', 'U+007F'], e.nativeEvent.keyIdentifier);
    if (!modified && !special) {
      e.stopPropagation();
    }
  }
}
