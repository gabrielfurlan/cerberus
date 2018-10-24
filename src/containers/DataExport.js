import React, {Component} from 'react';
import download from 'downloadjs';

import Button from '@material-ui/core/Button';

export default class DataExport extends Component {
  onClickExport = () => {
    console.log('Running export');

    const chats = window.WAPI.getAllChats();

    chats.forEach(chat => {
      chat.allMessages = window.WAPI.getAllMessagesInChat(chat.id._serialized);
    });

    console.log(chats);

    download(
      JSON.stringify(chats, null, 2),
      `WhatsApp Chats ${new Date()}.json`,
      'text/json',
    );
  };

  render() {
    return (
      <div>
        <h3 style={{textAlign: 'center'}}>Exportação de dados</h3>

        <hr />

        <p>
          Essa aba exporta as listas de contatos, organizadas por grupos, os
          administradores dos grupos e todas as mensagens.
        </p>

        <hr />

        <Button
          variant="contained"
          color="primary"
          onClick={this.onClickExport}
        >
          Exportar dados de grupos
        </Button>
      </div>
    );
  }
}
