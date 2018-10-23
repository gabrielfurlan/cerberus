const whatsAppGroupRe = /https:\/\/chat.whatsapp.com\/[^\s]+/gm;

export default function extractGroupsFromText(text) {
  const matches = [];
  let match;

  do {
    match = whatsAppGroupRe.exec(text);
    if (match) {
      matches.push(match[0]);
    }
  } while (match);

  return matches;
}
