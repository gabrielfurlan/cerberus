import React, {Component} from 'react';

import Button from '../components/Button';
import extractGroupsFromText from '../logic/extract-groups-from-text';

export default class MassiveJoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentText: '',
      currentGroups: [],
    };
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

  render() {
    return (
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
    );
  }
}
