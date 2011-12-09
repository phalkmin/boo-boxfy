cfg = {
	url: 'http://boo-box.com/',
	urle: 'http://sledge.boo-box.com',
	urlstatic: 'http://static.boo-box.com'
};

if (typeof(bbD) == 'undefined') {
	$ = jQuery;
	var bbD = new Object();
	var le_fake_dom;

	// do key:value in js querysring
	bbD.add = function(key, val) {
		bbD[key] = val;
	}
	// get affiliated options
	var codePairs = $("#booboxfy").attr('src').split('?')[1].split('&');
	$(codePairs).each( function(i){
		// cria um atributo novo no elm DOM
		// pega dois valores e coloca os como key e value respectivamente
		bbD.add( this.split('=')[0], this.split('=')[1] );
	});
}

// ensina o IE como escrever html
function fIE(dom) {
	// downcase em nome de tag
	dom = dom.replace(/<([^> ]*)/gi, function(s) {
		return s.toLowerCase();
	});
	// deleta tag do jquery
	dom = dom.replace(/ ?jQuery([^=]*)=([^> ]*)/gi, '');
	// coloca aspas nos atributos que estiverem sem
	dom = dom.replace(/( )?([^ =]*)=([^"'>][^ >]*)/gi, '$1$2="$3"');
	return dom;
};

