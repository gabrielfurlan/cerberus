import last from 'lodash/last';

export default function parseGroupLink(url) {
  return last(url.split('/')).replace(/\/#/g, '');
}
