(
    function (window, document) {
// Strings case & words #core

        // toString `val` to String - public function in _z.toString( Object ), _z(Object).toString()
        let toString = function toString(val) {
            val = arguments.length ? arguments[0] : this.val();
            return String(val == null ? "" : val).toString();
        };

        const props = {
            toString: toString,

            // toWords `string` to array of words - public function in _z.toWords( String )
            // todo: replace `10px` to [`10`, `px`]
            toWords: function toWords(string, wordSeparator = /[^A-Za-z0-9]/g) {
                wordSeparator = wordSeparator || /[^A-Za-z0-9]/g;
                return String(string).replace(/[^A-Za-z0-9]/g, ' ').split(' ').filter(x => x)
                // .split(wordSeparator).filter(x => x);
            },

            // reduceWords `string` apply callback for each word - public function in _z.reduceWords( String, Callback, ' ' )
            reduceWords: function forEachWord(string, callback, wordSeparator) {
                return reduce(_z.toWords(string, wordSeparator), callback, '');
            },

            // ucWords `val` to upper case first char for each word - public function in _z.ucWords( String )
            ucWords: function ucWords(str, lcWords = true) {
                return reduce(_z.toWords(str), function (p, c, i, array) {
                    return toString(p) + _z.ucFirst(c, lcWords) + (
                        i + 1 !== array.length ? " " : ""
                    );
                });

            },

            // ucFirst `val` to upper case first char - public function in _z.ucFirst( String )
            ucFirst: function ucFirst(str, lcString = true) {
                str = toString(str);
                lcString && (
                    str = toLC(str)
                );

                return toUC(str[0]) + str.slice(1);
            },

            // lcFirst `val` to lower case first char - public function in _z.lcFirst( String )
            lcFirst: function lcFirst(str, ucString = false) {
                str = toString(str);
                ucString && (
                    str = toUC(str)
                );

                return toLC(str[0]) + str.slice(1);
            },

            // capitalize = ucFirst
            // String.capitalize
            capitalize: function capitalize(string) {
                return _z.ucFirst(toLC(toString(string)));
            },

            // camelCase `string` to camelCase (camelCaseWord) - public function in _z.camelCase( String )
            camelCase: function camelCase(string) {
                return _z.reduceWords(string, function (prev, word, index) {
                    return toString(prev) + (
                        (
                            word = toLC(toString(word))
                        ) && index ? _z.ucFirst(word) : word
                    );
                }, /\W/g);
            },

            // studlyCase `string` to studlyCase (StudlyCaseWord) - public function in _z.studlyCase( String )
            studlyCase: function studlyCase(string) {
                return _z.reduceWords(string, function (prev, word, index) {
                    return toString(prev) + _z.ucFirst(word = toLC(toString(word)));
                }, /\W/g);
            },

            // snakeCase `string` to snakeCase (snake_case_word) - public function in _z.snakeCase( String )
            snakeCase: function snakeCase(string) {
                return _z.reduceWords(string, function (prev, word, index) {
                    return toString(prev) + (
                        index ? '_' : ''
                    ) + toLC(toString(word));
                }, /\W/g);
            },

            // kebabCase `string` to kebabCase (kebab-case-word) - public function in _z.kebabCase( String )
            kebabCase: function kebabCase(string) {
                return _z.reduceWords(string, function (prev, word, index) {
                    return toString(prev) + (
                        index ? '-' : ''
                    ) + toLC(toString(word));
                }, /\W/g);
            },

            /*
                   TESTS:
                   titleCase: function titleCase(string, withLowers = true) {
                   string = string.replace(/([\w\d_']+)/g, function (txt) {
                   return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                   });

                   if(withLowers)
                   ['A', 'An', 'The', 'At', 'By', 'For', 'In', 'Of', 'On', 'To', 'Up', 'And', 'As', 'But', 'Or', 'Nor', 'Not', 'Un', 'Une', 'Le', 'La', 'Les', 'Du', 'De', 'Des', 'À', 'Au', 'Aux', 'Par', 'Pour', 'Dans', 'Sur', 'Et', 'Comme', 'Mais', 'Ou', 'Où', 'Ne', 'Ni', 'Pas'].each(function (R) {
                   string = string.replace(new RegExp('\\s' + R + '\\s', 'g'), (txt) => txt.toLowerCase());
                   });

                   if(withLowers)
                   ['Id', 'R&d'].each(function (R) {
                   string = string.replace(new RegExp('\\b' + R + '\\b', 'g'), (txt) => txt.toUpperCase());
                   });

                   return string;
                   },
                   */

            // titleCase `string` to titleCase (Title Case Word) - public function in _z.titleCase( String )
            titleCase: function titleCase(string) {
                return _z.reduceWords(string, function (prev, word, index) {
                    word = word.replace(/([\w\d_']+)/g, (d) => _z.ucFirst(d));
                    return _z.toString(prev) + (
                        index ? ' ' : ''
                    ) + word;
                }, /[\s]+/igm);
            },

            // lowerCase `string` to lowerCase (lower case word) - public function in _z.lowerCase( String )
            lowerCase: function lowerCase(string) {
                return toLC(string);
            },

            // upperCase `string` to upperCase (UPPER CASE WORD) - public function in _z.upperCase( String )
            upperCase: function upperCase(string) {
                return toUC(string);
            },

            /**
             * @param {Array} pairs
             * @return {Object}
             */
            pairs: function fromPairs(pairs) {
                let index = -1,
                    length = pairs == null ? 0 : pairs.length,
                    result = {};

                while (++index < length) {
                    let pair = pairs[index];
                    result[pair[0]] = pair[1];
                }

                return result;
            },
        };

        return _z.extend(props);
    }
)
(
    this, this.document || {
    isdocument: false,
    getRootNode: () => {
    },
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
},
);
