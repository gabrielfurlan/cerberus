import React, {Component} from 'react';

import Button from '@material-ui/core/Button';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  renderTab = (tab, i) => {
    return (
      <Button
        key={i}
        onClick={() => {
          this.setState({
            activeTab: i,
          });
        }}
        style={{
          marginRight: 15,
        }}
      >
        {tab.title}
      </Button>
    );
  };

  renderContent() {
    return this.props.tabs[this.state.activeTab].content;
  }

  render() {
    return (
      <div>
        <div>{this.props.tabs.map(this.renderTab)}</div>
        <hr />
        <div>{this.renderContent()}</div>
      </div>
    );
  }
}
