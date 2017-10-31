
const htmlparser = require("htmlparser2");

    public static charWidthConvert (source, type, options): string  {
        let dest = '';
        
          let parser = new htmlparser.Parser({
            onopentag: function(tagname, attribs){
              let attr = '';
              Object.keys(attribs).forEach(function (key) {
                attr = attr.concat(' ', key, '="', attribs[key], '"');
              })
              dest = dest.concat('<', tagname, attr, '>');
            },
            ontext: (text)=> {
              if (type === 'full2half') {
                let half = this.full2half(text, options);
                half = this.halfSpaceToHtml(half);
                dest = dest.concat(half);
              } else if (type === 'half2full') {
                // text = text.replace(/&nbsp;/g, ' ');
                let full = this.half2full(text, options);
                if (!options.space) {
                    full = this.halfSpaceToHtml(full);
                }
                // let eSp = /\s+$/.exec(full); // 查找出结尾要转换的空格
                dest = dest.concat(full);
              } else if (type === 'full2half4text') {
                dest = dest.concat(this.full2half(text, options));
              } else if (type === 'half2full4text') {
                dest = dest.concat(this.half2full(text, options));
              }
            },
            onclosetag: function(tagname){
              if (tagname === 'br') return;
              dest = dest.concat('</', tagname, '>');
            }
          }, {decodeEntities: true});
          parser.write(source.replace(/&nbsp;/g, ' '));
          parser.end();
          console.log(dest);
          return dest;
        }

        // 半角空格在html显示的转换处理
        public static halfSpaceToHtml(half){
            // 逻辑：白空格不能连续出现 并且 不能出现在两边
            let eSp = / +$/.exec(half); // 查找出结尾要转换的空格
            let newEndStr = ''; 
            if (eSp && eSp[0] != '\n') { // 如果结尾有空格
                let eSpStr = eSp[0];
                if(eSpStr.length%2 ==0){ // 判断空格是否为偶数个
                    for (var i = 0; i < eSpStr.length; i++) { // 若为偶数个 则以白空格开头 防止白空格出现在结尾处被浏览器忽略
                        if(i%2 ==0){
                            newEndStr = newEndStr + ' ';
                        }else{
                            newEndStr = newEndStr +  '&nbsp;';
                        }
                    }

                }else{ // 空格为奇数个 则以nbsp开头 防止白空格出现在结尾处 被浏览器忽略
                    for (var i = 0; i < eSpStr.length; i++) {
                        if(i%2 ==0){
                            newEndStr = newEndStr + '&nbsp;';
                        }else{
                            newEndStr = newEndStr +  ' ';
                        }
                    }
                }
                half = half.replace(/ +$/, ''); // 将结尾处空格去掉 newEndStr中存放显示用空格字符串
            }
            // half = half.replace(/[ ][ ]/g, '&nbsp; '); // 剩余的连续空格nbsp转换 
            // --------------------------------------------------------------------------------------

            let sSp = /^ +/.exec(half); // 查找出开头要转换的空格
            let newStartStr = ''; 
            if (sSp && sSp[0] != '\n') { // 如果开头有空格
                let sSpStr = sSp[0];
                for (var i = 0; i < sSpStr.length; i++) { // 以nbsp开头做空格转换 即防止白空格出现在开头处
                    if (i == 0) {
                        newStartStr = newStartStr + '&nbsp;';
                    }else{
                        if(i%2 ==0){
                            newStartStr = newStartStr +  '&nbsp;';
                        }else{
                            newStartStr = newStartStr + ' ';
                        }
                    }
                }
                half = half.replace(/^ +/, ''); // 将开头处空格去掉 newStartStr中存放显示用空格字符串
                        
            }
            // --------------------------------------------------------------------------------------

            let patt = new RegExp(/  +/,"g"); // 查找中间部分连续空格
            let sp;
            // let newHalf = '';
            while ((sp = patt.exec(half)) != null){ // 找到再也没有为止
                // let noSpArr = half.split(/\s+/); //从第一个处切开
                let noSp1 = half.substring(0,sp.index); 
                let noSp2 = half.substring(sp.index + sp[0].length, half.length); 
                let newStr = '';
                if (sp) {
                    let spStr = sp[0]; 

                    for (var i = 0; i < spStr.length; i++) { // 转换为以nbsp开头的显示用空格字符串
                        if (i == 0) {
                            newStr = newStr + '&nbsp;';
                        }else{
                            if(i%2 ==0){
                                newStr = newStr +  '&nbsp;';
                            }else{
                                newStr = newStr + ' ';
                            }
                        }
                    }
                        
                }
                half = noSp1 + newStr + noSp2;
                
            }
            return newStartStr +  half + newEndStr;
        }

    /**
     * Width Converter
     * Copyright 2017 Yanbin Ma under MIT
     * https://github.com/myanbin/hwfw-convert
     */
    static CODEPOINT_BASE = '\uff10'.codePointAt(0) - '0'.codePointAt(0);

    static CJK_PUNCTUATIONS = [
    0xff0c/* ， */, 0x3002/* 。 */, 0xff01/* ！ */, 0xff08/* （ */, 0xff09/* ） */, 0x3001/* 、 */, 0xff1a/* ： */, 0xff1b/* ； */,
    0xff1f/* ？ */, 0xff3b/* ［ */, 0xff3d/* ］ */, 0xff5e/* ～ */, 0x2018/* ‘ */, 0x2019/* ’ */, 0x201c/* “ */, 0x201d/* ” */,
    0x300a/* 《 */, 0x300b/* 》 */, 0x3008/* 〈 */, 0x3009/* 〉 */, 0x3010/* 【 */, 0x3011/* 】 */,
    ];

    static LATIN_PUNCTUATIONS = [
    0x2c/* , */, 0x2e/* . */, 0x21/* ! */, 0x28/* ( */, 0x29/* ) */, 0x2c/* , */, 0x3a/* : */, 0x3b/* ; */,
    0x3f/* ? */, 0x5b/* [ */, 0x5d/* ] */, 0x7e/* ~ */, 0x27/* ' */, 0x27/* ' */, 0x22/* " */, 0x22/* " */,
    0xab/* « */, 0xbb/* » */, 0x2039/* ‹ */, 0x203a/* › */, 0x5b/* [ */, 0x5d/* ] */,
    ];


    /* Reference: https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms */
    static FULL_SYMBOLS = [
    0xff02/* ＂ */, 0xff03/* ＃ */, 0xff04/* ＄ */, 0xff05/* ％ */, 0xff06/* ＆ */, 0xff07/* ＇ */, 0xff0a/* ＊ */, 0xff0b/* ＋ */,
    0xff0d/* － */, 0xff0e/* ． */, 0xff0f/* ／ */, 0xff1c/* ＜ */, 0xff1d/* ＝ */, 0xff1e/* ＞ */, 0xff20/* ＠ */, 0xff3c/* ＼ */,
    0xff3e/* ＾ */, 0xff3f/* ＿ */, 0xff40/* ｀ */, 0xff5b/* ｛ */, 0xff5c/* ｜ */, 0xff5d/* ｝ */,
    ];
    static HALF_SYMBOLS = EditCommonUtil.FULL_SYMBOLS.map((codePoint)=> {
    return codePoint - EditCommonUtil.CODEPOINT_BASE;
    });



    public static _mergeOptions (_options) {
    const defaultOptions = {
        digit: true,              // 将全角数字转换成半角
        alpha: true,              // 将全角字母转换成半角
        space: true,              // 将全角空格转换成半角
        symbol: true,             // 将全角的 #、$、%、& 等特殊字符转换成半角（不包括中文标点符号）
        punctuation: false,       // 将中文标点符号转换成对应英文标点符号（在中文环境中不推荐使用）
        smart_mode: true,         // 智能模式。可以识别出数值、网址等内容并进行精确转换
    };
    return Object.assign(defaultOptions, _options);
    }


    /**
     * Full width to Half width Tramsformer
     * @param {string} source Source text (full width)
     * @param {object} options Options
     */
    public static full2half (source, options) {
    const sourceSize = source.length;
    const _options = EditCommonUtil._mergeOptions(options);
    let output = [];
    for (let index = 0; index < sourceSize; index++) {
        const codePoint = source.codePointAt(index);
        if (/* Digit Flag = */_options.digit
            && codePoint >= 0xff10 && codePoint <= 0xff19) {
        output[index] = String.fromCodePoint(codePoint - EditCommonUtil.CODEPOINT_BASE);
        } else if (/* Alpha Flag = */_options.alpha
            && ((codePoint >= 0xff21 && codePoint <= 0xff3a) || (codePoint >= 0xff41 && codePoint <= 0xff5a))) {
        output[index] = String.fromCodePoint(codePoint - EditCommonUtil.CODEPOINT_BASE);
        } else if (/* Symbol Flag */_options.symbol
            && EditCommonUtil.FULL_SYMBOLS.indexOf(codePoint) !== -1) {
        output[index] = String.fromCodePoint(codePoint - EditCommonUtil.CODEPOINT_BASE);
        } else if (/* Space Flag = */_options.space
            && codePoint === 0x3000/* Fullwidth Space */) {
        output[index] = String.fromCodePoint(0x0020);
        } else {
        output[index] = source[index];
        }
    
        if (/* Punctuation Flag */_options.punctuation
                && EditCommonUtil.CJK_PUNCTUATIONS.indexOf(codePoint) !== -1) {
            output[index] = String.fromCodePoint(EditCommonUtil.LATIN_PUNCTUATIONS[EditCommonUtil.CJK_PUNCTUATIONS.indexOf(codePoint)]);
            }
    }
    let destination = output.join('');
    if (/* Smart Mode = */_options.smart_mode) {
        if (/* Digit Flag = */_options.digit) {
        destination = destination.replace(/\d[\uff0c]\d/g, (match)=> {
            return match.replace(/[\uff0c]/, ',');
        });
        destination = destination.replace(/\d\d[\uff1a]\d\d/g, (match)=> {
            return match.replace(/[\uff1a]/, ':');
        });
        destination = destination.replace(/\d\d[\uff0e]\d\d/g, (match)=> {
            return match.replace(/[\uff0e]/, '.');
        })
        }
        if (/* Symbol Flag */_options.symbol) {
        destination = destination.replace(/https?[\uff1a]/g, (match)=> {
            return match.replace(/[\uff1a]/, ':');
        });
        }
    }
    return destination;
    }


    /**
     * Half width to Full width Tramsformer
     * @param {string} source Source text (half width)
     * @param {object} options Options
     */
    public static half2full (source, options) {
    const sourceSize = source.length;
    const _options = EditCommonUtil._mergeOptions(options);
    let output = [];
    for (let index = 0; index < sourceSize; index++) {
        const codePoint = source.codePointAt(index);
        if (/* Digit Flag = */_options.digit
            && codePoint >= 0x0030 && codePoint <= 0x0039) {
        output[index] = String.fromCodePoint(codePoint + EditCommonUtil.CODEPOINT_BASE);
        } else if (/* Alpha Flag = */_options.alpha
            && ((codePoint >= 0x0041 && codePoint <= 0x005a) || (codePoint >= 0x0061 && codePoint <= 0x007a))) {
        output[index] = String.fromCodePoint(codePoint + EditCommonUtil.CODEPOINT_BASE);
        } else if (/* Symbol Flag */_options.symbol
            && EditCommonUtil.HALF_SYMBOLS.indexOf(codePoint) !== -1) {
        output[index] = String.fromCodePoint(codePoint + EditCommonUtil.CODEPOINT_BASE);
        } else if (/* Space Flag = */_options.space
            && codePoint === 0x0020/* Halfwidth Space */) {
        output[index] = String.fromCodePoint(0x3000);
        } else {
        output[index] = source[index];
        }

        if (/* Punctuation Flag */_options.punctuation
            && EditCommonUtil.LATIN_PUNCTUATIONS.indexOf(codePoint) !== -1) {
        output[index] = String.fromCodePoint(EditCommonUtil.CJK_PUNCTUATIONS[EditCommonUtil.LATIN_PUNCTUATIONS.indexOf(codePoint)]);
        }
    }
    let destination = output.join('');
    if (/* Smart Mode = */_options.smartMode) {
        if (/* Digit Flag = */_options.digit) {
        destination = destination.replace(/\d[,]\d{3}/g, (match)=> {
            return match.replace(/[,]/, String.fromCodePoint(0xff0c));
        });
        destination = destination.replace(/\d\d[:]]\d\d/g, (match)=> {
            return match.replace(/[:]/, String.fromCodePoint(0xff1a));
        });
        destination = destination.replace(/\d\d[.]]\d\d/g, function (match) {
            return match.replace(/[.]/, String.fromCodePoint(0xff0e));
        });
        }
        if (/* Symbol Flag */_options.symbol) {
        destination = destination.replace(/https?[:]/g, (match)=> {
            return match.replace(/[:]/, String.fromCodePoint(0xff1a));
        });
        }
    }
    return destination;
    }