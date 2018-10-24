import React, {Component} from 'react';

import Button from '../components/Button';

export default class GroupClone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        groups: window.WAPI.getAllChats().filter(chat => chat.isGroup),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderGroup = group => {
    return (
      <div
        key={group.id._serialized}
        style={{padding: 10, border: 'solid 1px white', margin: 5, float: 'left'}}
      >
        <h4>{group.contact.name}</h4>

        <Button
          onClick={() => {
            this.props.onClickClone(group);
          }}
        >
          Clonar grupo de {group.groupMetadata.participants.length}{' '}
          participantes
        </Button>
      </div>
    );
  };

  render() {
    return (
      <div>
        <h3 style={{textAlign: 'center'}}>Clonar grupo</h3>

        {this.state.groups.map(this.renderGroup)}
      </div>
    );
  }
}
