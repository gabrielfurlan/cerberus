function check() {
    const isFromBrazil = function(chat) {
	const chatId = chat.id.user;
	return chatId.match(/^55/);
    };

    const isHigherThanLimit = chat => chat.unread > 10

    const chats = window.WAPI.getUnreadMessages();
    chats.forEach(function(chat) {
	if (!isFromBrazil(chat)) {
            window.WAPI.contactBlock(chat.id._serialized, function(done) {
		console.log('contato bloqueado: internacional' + chat.id._serialized);
            });
	}

	if (isHigherThanLimit(chat)) {
            window.WAPI.contactBlock(chat.id._serialized, function(done) {
		console.log('contato bloqueado: excedeu limite' + chat.id._serialized);
            });
	}

    });

    setTimeout(check, 200);
}

check();
