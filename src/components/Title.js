import React from 'react';

const style = {
	fontSize: 22,
  marginBottom: 10,
  marginTop: 20,
};

const Title = ({ children }) => (
  <div style={style}>
    {children}
  </div>
);

export default Title;