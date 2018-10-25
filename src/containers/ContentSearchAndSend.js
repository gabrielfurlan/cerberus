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
import Title from '../components/Title';
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

const STEPS = {
  IMAGES: 'Images',
  CONTACTS: 'Contacts',
  CONFIGURE: 'Configure',
};

const EXPLANATION = {
  IMAGES_1: 'Selecione um meme',
  IMAGES_2: 'Selecione mais memes, para serem enviados em um período de tempo determinado por você posteriormente',
  CONTACTS_1: 'Selecione um ou mais contatos',
  CONFIGURE_1: 'Configure acima o envio'
}

const bottomMenu = {"height":"60px","width":"100%","display":"flex","position":"fixed","zIndex":"999","bottom":"0","background":"#e8e8e8","padding":"10px","left":"0","right":"0","boxShadow":"0px -3px 3px rgba(0, 0, 0, 0.2)","boxSizing":"border-box"};
const bottomMenuRightButton = {"position":"absolute","right":"10px"};
const bottomMenuExplanation = {
  color: "#565656",
  verticalAlign: "middle",
  padding: "0 20px",
  lineHeight: "40px",
  fontSize: 16,
  color: 'purple',
};

export default class ContentSearchAndSend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      collections: [],
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
      step: STEPS.IMAGES,

      selectedCollections: [],
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

  setStep(step) {
    this.setState({
      step,
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

  getExplanation(step) {

    const { selectedMemes, contactsSelected } = this.state;

    if (step === STEPS.IMAGES) {
      if (!selectedMemes.length) return EXPLANATION.IMAGES_1
      else if (selectedMemes.length === 1) return EXPLANATION.IMAGES_2
      else return '';
    }
    else if (step === STEPS.CONTACTS) {
      if (!contactsSelected.length) return EXPLANATION.CONTACTS_1
      else return '';
    }
    else if (step === STEPS.CONFIGURE) {
      return EXPLANATION.CONFIGURE_1;
    }

    return '';
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
          collections: this.state.selectedCollections.join(',') || null,
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
      meme: this.state.selectedMemes,
    });

    this.setState({
      selectedMemes: [],
    });
  }

  render() {
    /* This is shit code, it's 4am */

    const {
      sendRandom, sendKeep, sendDelay, sendMinutes, contactsSelected, contactData
    } = this.state;

    if (this.state.step === STEPS.CONTACTS) {
      const columns = [
        {name: 'Tipo'},
        {name: 'Nome'},
        {name: 'Número / ID'},
        {name: 'DDD'},
      ];

      return (
        <div>
          <div style={bottomMenu}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                this.setStep(STEPS.IMAGES);
              }}
              style={{marginRight: 20}}
            >
              ‹ Voltar
            </Button>
            <div style={bottomMenuExplanation}>{ this.getExplanation(STEPS.CONTACTS) }</div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.setStep(STEPS.CONFIGURE)}
              style={bottomMenuRightButton}
              disabled={!contactsSelected.length}
            >
              Próximo passo: Configurar Envio ›
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

    else if (this.state.step === STEPS.CONFIGURE) {
      return (
        <div
          style={{
            background: 'white',
            marginLeft: 50,
          }}
        >

          <Title>Tempo para iniciar o envio</Title>
          <InputLabel
            htmlFor="send-minutes"
          >
            Iniciar o envio após
            <Input
              id="send-delay"
              type="number"
              value={sendDelay}
              onChange={({ target }) => this.setState({ sendDelay: target.value })}
              style={{
                width: 30,
                marginLeft: 10,
                marginRight: 10,
              }}
            />
            minutos
          </InputLabel>
          <br/><br/>

          {
            this.state.selectedMemes.length > 1 &&
              <div              >
                <Title>Tempo entre os envios</Title>
                <InputLabel
                  htmlFor="send-minutes"
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
                    }}
                  />
                  minutos
                </InputLabel>
                <br/>
                <Checkbox
                  id="send-random"
                  checked={sendRandom}
                  onChange={() => this.setState({ sendRandom: !sendRandom })}
                />
                <InputLabel
                  htmlFor="send-random"
                >
                  Randomizar minutos
                </InputLabel>
                <br/><br/>
              </div>

          }

          <Title>Repetição de envio</Title>
          <Checkbox
            id="send-keep"
            checked={sendKeep}
            onChange={() => this.setState({ sendKeep: !sendKeep })}
          />
          <InputLabel
            htmlFor="send-keep"
          >
            Enviar novos memes após fim do envio
          </InputLabel>

          <div style={bottomMenu}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                this.setStep(STEPS.CONTACTS);
              }}
              style={{marginRight: 20}}
            >
              ‹ Voltar
            </Button>
            <div style={bottomMenuExplanation}>{ this.getExplanation(STEPS.CONFIGURE) }</div>
            <Button
              variant="contained"
              color="primary"
              onClick={this.onClickSend}
              style={bottomMenuRightButton}
              disabled={!contactsSelected.length}
            >
              Enviar &nbsp;
              {this.state.selectedMemes.length} memes para &nbsp;
              {this.state.contactsSelected.length} &nbsp; contatos ›
            </Button>
          </div>

        </div>
      );
    }

    return (
      <div>
        <div style={{marginBottom: 15, width: '100%', display: 'flex'}}>

          <FormControl style={{marginRight: 15, flex: 1}}>
            <InputLabel htmlFor="select-multiple-checkbox">Coleção</InputLabel>
            <Select
              multiple
              value={this.state.selectedCollections}
              onChange={e => {
                this.setState(
                  {
                    selectedCollections: e.target.value,
                  },
                  () => {
                    this.fetchMemes();
                  },
                );
              }}
              input={<Input id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(', ')}
            >
              {this.state.collections.map(collection => (
                <MenuItem key={collection.id} value={collection.id}>
                  <Checkbox
                    checked={this.state.selectedCollections.indexOf(collection.id) > -1}
                  />
                  <ListItemText primary={collection.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

        <div style={bottomMenu}>
          {/*<Button
            variant="contained"
            color="secondary"
            style={{marginLeft: 5}}
            onClick={this.resetMemes.bind(this)}
            disabled={this.state.selectedMemes.length === 0}
          >
            Limpar seleção
          </Button>*/}
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
          <div style={bottomMenuExplanation}>{ this.getExplanation(STEPS.IMAGES) }</div>
          <Button
            variant="contained"
            color="primary"
            style={{marginLeft: 5}}
            onClick={() => this.setStep(STEPS.CONTACTS)}
            disabled={this.state.selectedMemes.length === 0}
            style={bottomMenuRightButton}
          >
            Próximo passo: Selecionar contatos ›
          </Button>

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
