//Tokenise a source string into MdC
function lex(src) {
	
	//tokenMap contains regular expressions to match all lexical tokens.
	//The comments indicate what is being matched,
	//STRICT provides instructions on how to change the regex to adhere strictly to the JSesh MdC specification,
	//BEFORE and AFTER indicate the tokens which need to be matched in a given order relative to each other.
	//Note: All regex sequences must start with ^ (start-position anchor) in order to be properly matched by the algorithm below.
	//TODO: Add or remove '-' to relevant groups based on strictness.
	var tokenMap = {
		//Formatting:
		T_WHITESPACE: /^\s+/,									// any white space, to be ignored
		T_NEWPAGE: /^-?!!/,										// -!! (STRICT: remove '?') (BEFORE: T_NEWLINE, T_CONCATENATION)
		T_NEWLINE: /^-?!(?:=\d+%)?/,							// -!, -!=(number)% (STRICT: remove first '?') (BEFORE: T_CONCATENATION, AFTER: T_NEWPAGE)
		T_SEPARATOR: /^{l\d+,\d+}/i,							// {L(number),(number)}
		T_LACUNA: /^[hv\/]?\//i,								// h/, v/, //, / (STRICT: remove 'i') (BEFORE: T_GLYPH)
		T_SPACING: /^(?:\.\.|\.|\?\d+)/,						// .., ., ?(number)
		//Groups:
		T_CARTOUCHE_START: /^<(?:[sh]?[0-3]|[SHF])?-/i,			// <-, <S-, <H-, <F-, <(0-3)- <s(0-3)-, <h(0-3)- (STRICT: remove 'i')
		T_CARTOUCHE_END: /^-[sh]?[0-3]?>/i,						// ->, -(0-3)>, -s(0-3)>, -h(0-3)> (STRICT: remove 'i') (BEFORE: T_CONCATENATION)
		T_EDITORIAL_START: /^\[[&{\['"\(\?]/,					// [&, [(, [', [", [{, [[, [?
		T_EDITORIAL_END: /^[&}\]'"\)\?]\]/,						// &], )], '], "], }], ]], ?] (BEFORE: T_GROUP_END, T_LIGATURE)
		T_GROUP_START: /^\(/,									// (
		T_GROUP_END: /^\)/,										// ) (AFTER: T_EDITORIAL_END)
		T_CONTEXT_CHANGE: /^(?:#b|#e|\$r|\$b)/,					// #b, #e, $r, $b
		//Positioning:
		T_POSITIONING: /^{{\d+,\d+,\d+}}/,						// {{(number),(number),(number)}}
		T_ABSOLUTE: /^\*\*/,									// ** (BEFORE: T_JUXTAPOSITION)
		T_SUBORDINATION: /^:/,									// :
		T_JUXTAPOSITION: /^\*/,									// * (AFTER: T_ABSOLUTE)
		T_LIGATURE: /^(?:\^\^\^?|&&&?|&)/,						// ^^^, &&&, & (STRICT: remove all but first '?') (AFTER: T_EDITORIAL_END)
		T_OVERLAY: /^##?/,										// ## (STRICT: remove '?') (BEFORE: T_SHADING)
		T_CONCATENATION: /^-/,									// - (AFTER: T_NEWLINE, T_NEWPAGE, T_CARTOUCHE_END)
		//Modifiers:
		T_MODIFIER: /^\\\w*/,									// \, \(any alphanumeric string of characters)
		T_GRAMMAR: /^(?:__|_|=)/,								// __, _, = (BEFORE: T_GLYPH)
		T_SHADING: /^#1?2?3?4?/,								// #, #(any ordered combination of 1234) (AFTER: T_OVERLAY)
		//Text blocks:
		T_SUPERSCRIPT: /^\|[\s\S]*?(?:(?:[^\\](?:\\\\)*)-|$)/,	// anything between | and non-escaped - or EOF
		T_TEXT: /^\+s|^\+[\s\S]*?(?:(?:[^\\](?:\\\\)*)\+s|$)/i,	// +s, anything between + and non-escaped +s or EOF (STRICT: remove 'i')
		T_GLYPH: /^\w+/											// any alphanumeric string of characters (AFTER: T_LACUNA, T_GRAMMAR)
		//T_ERROR: /^./											// Errors are handled below,
		//T_EOF: /^$/											// as is EOF.
	};
	
	var tokens = [], offset = 0;				// Initialise variables.
	lexing: while(offset < src.length) {		// While the end hasn't been reached,
		var pattern = src.substring(offset);	// get the non-lexed section of the input
		for(var token in tokenMap) {			// and add the next matching token to the result.
			if(tokenMap[token].test(pattern)) {
				var match = tokenMap[token].exec(pattern)[0];
				tokens.push({ key: token, value: match, position: offset });
				offset += match.length;			// Set the new offset to the end of the matched token
				continue lexing;				// and continue lexing!
			}
		}
		//If no tokens could match the pattern, the current character is an error.
		tokens.push({ key: 'T_ERROR', value: pattern[0], position: offset });						// Add the error to the result,
		console.error("Lexer: unexpected character '" + pattern[0] + "' at position " + offset);	// notify the console,
		offset++;																					// and ignore the offending character.
	}
	tokens.push({ key: 'T_EOF', value: 'end of file', position: src.length });	//Add an EOF to the result.
	return tokens;
}
//Regex for any order of 1234: /^#(?(?!([1-4])\1)(?(?!([1-4])[1-4]\2)(?(?!([1-4]){2}\3)(?(?!([1-4])[1-4]{2}\4)(?(?!([1-4]){2}[1-4]\5)(?(?!([1-4]){3}\6)[1-4]{0,4}|[1-4]{0,3})|[1-4]{0,3})|[1-4]{0,3})|[1-4]{0,2})|[1-4]{0,2})|[1-4]?)/