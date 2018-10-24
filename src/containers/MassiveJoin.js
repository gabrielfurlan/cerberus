import React, {Component} from 'react';
import fetch from 'isomorphic-fetch';

import Button from '../components/Button';
import extractGroupsFromText from '../logic/extract-groups-from-text';
import parseGroupLink from '../util/parse-group-link';

export default class MassiveJoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentText: '',
      currentGroups: [],
      randomGroups: [],
    };
  }

  componentDidMount() {
    this.fetchGroups();
  }

  fetchGroups() {
    fetch('https://ursal.dev.org.br/api/chat/channels/')
      .then(res => res.json())
      .then(randomGroups => {
        this.setState({randomGroups});
      });
  }

  onChangeText = e => {
    this.setState({
      currentText: e.target.value,
      currentGroups: extractGroupsFromText(e.target.value),
    });
  };

  onClickJoin = () => {
    this.props.onClickJoin(this.state.currentGroups);
  };

  onClickRandomJoin = () => {
    this.props.onClickRandomJoin(
      this.state.randomGroups.map(group => group.url),
    );
  };

  onClickFetchGroups = () => {
    this.fetchGroups();
  };

  renderGroup = group => {
    const groupId = parseGroupLink(group.url);

    return (
      <div key={group.id}>
        <img
          style={{height: 50, width: 50}}
          alt=""
          src={`https://chat.whatsapp.com/invite/icon/${groupId}`}
        />
        {group.title} - <a href={group.url}>{group.url}</a>
      </div>
    );
  };

  render() {
    return (
      <div>
        <div style={{display: 'flex'}}>
          <div style={{width: '49%', borderRight: 'solid 1px white'}}>
            <h3 style={{textAlign: 'center'}}>
              Digite uma mensagem contendo links de grupos abaixo
            </h3>
            <hr />

            <textarea
              style={{width: '90%'}}
              value={this.state.currentText}
              cols="30"
              id=""
              name=""
              rows="10"
              onChange={this.onChangeText}
            />
          </div>

          <div style={{width: '50%'}}>
            <h3 style={{textAlign: 'center'}}>Grupos extraídos do seu texto</h3>
            <hr />
            <pre>
              <code>{JSON.stringify(this.state.currentGroups, null, 2)}</code>
            </pre>

            <Button onClick={this.onClickJoin}>
              Adicionar join desses grupos à fila de execução
            </Button>
          </div>
        </div>

        <div>
          <h3 style={{textAlign: 'center'}}>Entre em grupos aleatórios</h3>

          <Button onClick={this.onClickFetchGroups}>
            Carregar novos grupos
          </Button>

          <Button onClick={this.onClickRandomJoin}>
            Adicionar join desses grupos à fila de execução
          </Button>

          {this.state.randomGroups.map(this.renderGroup)}
        </div>
      </div>
    );
  }
}
