import React, {Component} from 'react';

export default function Button(props = {}) {
  return (
    <button
      {...props}
      style={{
        color: 'white',
        border: 'solid 1px white',
        padding: 10,
        fontSize: 16,
        ...props.style,
      }}
    />
  );
}
