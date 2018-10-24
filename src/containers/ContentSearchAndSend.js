import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MUIDataTable from 'mui-datatables';
import MenuItem from '@material-ui/core/MenuItem';
import React, {Component} from 'react';
import Select from '@material-ui/core/Select';
import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import throttle from 'lodash/throttle';

function compactObject(obj) {
  return Object.keys(obj || {}).reduce((memo, key) => {
    if (obj[key] != null) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
}

const STAGES = {
  SELECT_IMAGES: 'selectImages',
  SELECT_CONTACTS: 'selectContacts',
};

export default class ContentSearchAndSend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      tags: [],
      targets: [],
      contents: [],
      types: [],
      themes: [],
      emotions: [],

      contacts: [],
      contactData: [],
      contactsSelected: [],

      selectedMemes: [],
      stage: STAGES.SELECT_IMAGES,

      selectedTags: [],
      selectedTargets: [],
      selectedContents: [],
      selectedTypes: [],
      selectedThemes: [],
      selectedEmotions: [],

      sendMinutes: 30,
      sendDelay: 0,
      sendRandom: true,
      sendKeep: false,
    };
  }

  componentDidMount() {
    fetch('https://antifa.agency/api/tags/')
      .then(res => res.json())
      .then(json => {
        this.setState({
          tags: json,
        });
      });

    fetch('https://antifa.agency/api/targets/')
      .then(res => res.json())
      .then(json => {
        this.setState({
          targets: json,
        });
      });

    fetch('https://antifa.agency/api/contents/')
      .then(res => res.json())
      .then(json => {
        this.setState({
          contents: json,
        });
      });

    fetch('https://antifa.agency/api/memetypes/')
      .then(res => res.json())
      .then(json => {
        this.setState({
          types: json,
        });
      });

    fetch('https://antifa.agency/api/themes/')
      .then(res => res.json())
      .then(json => {
        this.setState({
          themes: json,
        });
      });

    fetch('https://antifa.agency/api/emotions/')
      .then(res => res.json())
      .then(json => {
        this.setState({
          emotions: json,
        });
      });

    this.fetchMemes();

    const contacts = window.WAPI.getAllContacts();
    const contactData = contacts.map(contact => {
      return [
        contact.id.server[0] === 'c' ? 'Pessoa' : 'Grupo',
        contact.formattedName,
        contact.id.user,
        /^55/.test(contact.id.user) ? contact.id.user.slice(2, 4) : 'Gringo',
      ];
    });
    this.setState({
      contacts,
      contactData,
    });
  }

  setStage(stage) {
    this.setState({
      stage,
    })
  }

  addMeme(meme) {
    this.setState({
      selectedMemes: [
        ...this.state.selectedMemes,
        meme,
      ],
    })
  }

  removeMeme(memeIndex) {
    const { selectedMemes } = this.state;
    this.setState({
      selectedMemes: [
        ...selectedMemes.slice(0, memeIndex),
        ...selectedMemes.slice(memeIndex+1, selectedMemes.length),
      ]
    });
  }

  resetMemes() {
    if (!confirm('Limpar seleção?')) return;
    this.setState({
      selectedMemes: []
    });
  }

  fetchMemes = throttle(() => {
    this.setState({
      isLoading: true,
    });

    if (window.localStorage.memes) {
      this.setState({
        images: JSON.parse(window.localStorage.memes),
        isLoading: false
      });
      return;
    }

    fetch(
      `https://antifa.agency/api/memes/?${querystring.stringify(
        compactObject({
          tags: this.state.selectedTags.join(',') || null,
          emotions: this.state.selectedEmotions.join(',') || null,
          themes: this.state.selectedThemes.join(',') || null,
          types: this.state.selectedTypes.join(',') || null,
          contents: this.state.selectedContents.join(',') || null,
          targets: this.state.selectedTargets.join(',') || null,
        }),
      )}`,
    )
      .then(res => res.json())
      .then(json => {
        window.localStorage.memes = JSON.stringify(json);
        this.setState({
          images: json,
          isLoading: false,
        });
      });
  }, 2000);

  onClickSend = () => {
    const contactsToSend = this.state.contacts
      .filter((contact, i) => {
        return this.state.contactsSelected.indexOf(i) > -1;
      });

    this.props.onClickSend({
      contacts: contactsToSend,
      meme: this.state.selectedImage,
    });

    this.setState({
      selectedImage: null,
    });
  }

  render() {
    /* This is shit code, it's 4am */

    if (this.state.stage === STAGES.SELECT_CONTACTS) {
      const columns = [
        {name: 'Tipo'},
        {name: 'Nome'},
        {name: 'Número / ID'},
        {name: 'DDD'},
      ];

      const {
        sendRandom, sendKeep, sendDelay, sendMinutes, contactsSelected, contactData
      } = this.state;

      return (
        <div>
          <div style={{marginBottom: 15}}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                this.setStage(STAGES.SELECT_IMAGES);
              }}
              style={{marginRight: 20}}
            >
              Cancelar
            </Button>

            <InputLabel
              htmlFor="send-minutes"
              style={{
                fontSize: 14,
              }}
            >
              Enviar a cada
              <Input
                id="send-minutes"
                type="number"
                value={sendMinutes}
                onChange={({ target }) => this.setState({ sendMinutes: target.value })}
                style={{
                  width: 30,
                  marginLeft: 10,
                  marginRight: 10,
                  fontSize: 12,
                }}
              />
              minutos,
            </InputLabel>

            &nbsp;&nbsp;

            <InputLabel
              htmlFor="send-minutes"
              style={{
                fontSize: 14,
              }}
            >
              iniciando após
              <Input
                id="send-delay"
                type="number"
                value={sendDelay}
                onChange={({ target }) => this.setState({ sendDelay: target.value })}
                style={{
                  width: 30,
                  marginLeft: 10,
                  marginRight: 10,
                  fontSize: 12,
                }}
              />
              minutos
            </InputLabel>

            &nbsp;&nbsp;

            <Checkbox
              id="send-random"
              checked={sendRandom}
              onChange={() => this.setState({ sendRandom: !sendRandom })}
            />
            <InputLabel
              htmlFor="send-random"
              style={{
                fontSize: 14,
              }}
            >
              Randomizar minutos
            </InputLabel>

            <Checkbox
              id="send-keep"
              checked={sendKeep}
              onChange={() => this.setState({ sendKeep: !sendKeep })}
            />
            <InputLabel
              htmlFor="send-keep"
              style={{
                fontSize: 14,
              }}
            >
              Enviar novos memes após fim do envio
            </InputLabel>

            <Button
              variant="contained"
              color="primary"
              onClick={this.onClickSend}
              style={{marginLeft: 20}}
              disabled={!contactsSelected.length}
            >
              Enviar
            </Button>

          </div>

          <MUIDataTable
            title="Recipientes"
            columns={columns}
            data={contactData}
            options={{
              filterType: 'checkbox',
              print: false,
              download: false,
              selectableRows: true,
              rowsSelected: contactsSelected,
              onRowsSelect: (_s, rows) => {
                this.setState({
                  contactsSelected: rows.map(r => r.dataIndex),
                });
              },
            }}
          />
        </div>
      );
    }

    return (
      <div>
        <div style={{height: 60, width: '100%', display: 'flex'}}>
          {this.state.selectedMemes.map((meme, index) => (
            <Card
              key={index}
            >
              <img
                src={meme.thumb_base64}
                style={{height: 60, width: 'auto', marginLeft: 5}}
                onClick={() => this.removeMeme(index)}
              />
            </Card>
          ))}
          <div>
            <Button
              variant="contained"
              color="primary"
              style={{marginLeft: 5}}
              onClick={() => this.setStage(STAGES.SELECT_CONTACTS)}
              disabled={this.state.selectedMemes.length === 0}
            >
              Selecionar contatos
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{marginLeft: 5}}
              onClick={this.resetMemes.bind(this)}
              disabled={this.state.selectedMemes.length === 0}
            >
              Limpar seleção
            </Button>
          </div>
        </div>
        <div style={{marginBottom: 15, width: '100%', display: 'flex'}}>
          <FormControl style={{marginRight: 15, flex: 1}}>
            <InputLabel htmlFor="select-multiple-checkbox">Tag</InputLabel>
            <Select
              multiple
              value={this.state.selectedTags}
              onChange={e => {
                this.setState(
                  {
                    selectedTags: e.target.value,
                  },
                  () => {
                    this.fetchMemes();
                  },
                );
              }}
              input={<Input id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(', ')}
            >
              {this.state.tags.map(tag => (
                <MenuItem key={tag.id} value={tag.id}>
                  <Checkbox
                    checked={this.state.selectedTags.indexOf(tag.id) > -1}
                  />
                  <ListItemText primary={tag.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{marginRight: 15, flex: 1}}>
            <InputLabel htmlFor="select-multiple-checkbox">Emoção</InputLabel>
            <Select
              multiple
              value={this.state.selectedEmotions}
              onChange={e => {
                this.setState(
                  {
                    selectedEmotions: e.target.value,
                  },
                  () => {
                    this.fetchMemes();
                  },
                );
              }}
              input={<Input id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(', ')}
            >
              {this.state.emotions.map(emotion => (
                <MenuItem key={emotion.id} value={emotion.id}>
                  <Checkbox
                    checked={
                      this.state.selectedEmotions.indexOf(emotion.id) > -1
                    }
                  />
                  <ListItemText primary={emotion.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{marginRight: 15, flex: 1}}>
            <InputLabel htmlFor="select-multiple-checkbox">Tema</InputLabel>
            <Select
              multiple
              value={this.state.selectedThemes}
              onChange={e => {
                this.setState(
                  {
                    selectedThemes: e.target.value,
                  },
                  () => {
                    this.fetchMemes();
                  },
                );
              }}
              input={<Input id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(', ')}
            >
              {this.state.themes.map(theme => (
                <MenuItem key={theme.id} value={theme.id}>
                  <Checkbox
                    checked={this.state.selectedThemes.indexOf(theme.id) > -1}
                  />
                  <ListItemText primary={theme.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{marginRight: 15, flex: 1}}>
            <InputLabel htmlFor="select-multiple-checkbox">Tipo</InputLabel>
            <Select
              multiple
              value={this.state.selectedTypes}
              onChange={e => {
                this.setState(
                  {
                    selectedTypes: e.target.value,
                  },
                  () => {
                    this.fetchMemes();
                  },
                );
              }}
              input={<Input id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(', ')}
            >
              {this.state.types.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  <Checkbox
                    checked={this.state.selectedTypes.indexOf(type.id) > -1}
                  />
                  <ListItemText primary={type.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{marginRight: 15, flex: 1}}>
            <InputLabel htmlFor="select-multiple-checkbox">Conteúdo</InputLabel>
            <Select
              multiple
              value={this.state.selectedContents}
              onChange={e => {
                this.setState(
                  {
                    selectedContents: e.target.value,
                  },
                  () => {
                    this.fetchMemes();
                  },
                );
              }}
              input={<Input id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(', ')}
            >
              {this.state.contents.map(content => (
                <MenuItem key={content.id} value={content.id}>
                  <Checkbox
                    checked={
                      this.state.selectedContents.indexOf(content.id) > -1
                    }
                  />
                  <ListItemText primary={content.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{marginRight: 15, flex: 1}}>
            <InputLabel htmlFor="select-multiple-checkbox">Público-alvo</InputLabel>
            <Select
              multiple
              value={this.state.selectedTargets}
              onChange={e => {
                this.setState(
                  {
                    selectedTargets: e.target.value,
                  },
                  () => {
                    this.fetchMemes();
                  },
                );
              }}
              input={<Input id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(', ')}
            >
              {this.state.targets.map(target => (
                <MenuItem key={target.id} value={target.id}>
                  <Checkbox
                    checked={this.state.selectedTargets.indexOf(target.id) > -1}
                  />
                  <ListItemText primary={target.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {this.state.isLoading ? (
          <CircularProgress />
        ) : this.state.images.length ? (
          <GridList cellHeight={160} cols={4}>
            {this.state.images.map(image => {
              return (
                <GridListTile key={image.id} style={{textAlign: 'center'}}>
                  <CardActionArea
                    onClick={() => this.addMeme(image)}
                  >
                    <img
                      src={image.thumb_base64}
                      style={{margin: '0 auto'}}
                    />
                  </CardActionArea>
                </GridListTile>
              );
            })}
          </GridList>
        ) : (
          'Nenhum material encontrado'
        )}
      </div>
    );
  }
}
