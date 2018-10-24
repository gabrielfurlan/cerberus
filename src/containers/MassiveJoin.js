import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MUIDataTable from 'mui-datatables';
import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import fetch from 'isomorphic-fetch';

import extractGroupsFromText from '../logic/extract-groups-from-text';
import parseGroupLink from '../util/parse-group-link';

export default class MassiveJoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentText: '',
      currentGroups: [],
      randomGroups: [],
      rowsSelected: [],
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
    const groupsToJoin = this.state.randomGroups
      .map(group => group.url)
      .filter((group, i) => {
        return this.state.rowsSelected.indexOf(i) > -1;
      });

    this.props.onClickJoin(this.state.randomGroups.map(group => group.url));
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
    const columns = [{name: 'Nome'}, {name: 'Link', options: {filter: false}}];
    const randomGroupsData = this.state.randomGroups.map(group => {
      return [group.title, <a href={group.url}>{group.url}</a>];
    });

    return (
      <div>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            Entre em grupos a partir de um texto
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div style={{display: 'flex', width: '100%'}}>
              <div style={{width: '49%', borderRight: 'solid 1px black'}}>
                <h3 style={{textAlign: 'center'}}>
                  Digite uma mensagem contendo links de grupos abaixo
                </h3>

                <TextField
                  label="Texto contendo links"
                  multiline
                  rowsMax="4"
                  value={this.state.currentText}
                  style={{
                    width: '100%',
                  }}
                  onChange={this.onChangeText}
                  margin="normal"
                />
              </div>

              <div style={{width: '50%'}}>
                <h3 style={{textAlign: 'center'}}>
                  Grupos extraídos do seu texto
                </h3>

                <hr />

                <div style={{textAlign: 'center', padding: 30}}>
                  {this.state.currentGroups.length ? (
                    <ul>
                      {this.state.currentGroups.map((group, i) => (
                        <li key={i}>{group}</li>
                      ))}
                    </ul>
                  ) : (
                    'Nenhum grupo extraído do texto'
                  )}
                </div>

                <Button
                  disabled={!this.state.currentGroups.length}
                  variant="contained"
                  color="primary"
                  onClick={this.onClickJoin}
                >
                  Adicionar join de {this.state.currentGroups.length} grupos à
                  fila de execução
                </Button>
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            Entre em grupos aleatórios
          </ExpansionPanelSummary>

          <ExpansionPanelDetails>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <Button variant="contained" onClick={this.onClickFetchGroups}>
                Carregar novos grupos
              </Button>

              <MUIDataTable
                title="Grupos"
                columns={columns}
                data={randomGroupsData}
                options={{
                  filterType: 'checkbox',
                  print: false,
                  download: false,
                  selectableRows: true,
                  rowsSelected: this.state.rowsSelected,
                  onRowsSelect: (_s, rows) => {
                    this.setState({
                      rowsSelected: rows.map(r => r.dataIndex),
                    });
                  },
                  pagination: false,
                }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={this.onClickRandomJoin}
              >
                Adicionar join de {this.state.rowsSelected.length} grupos à fila
                de execução
              </Button>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}
