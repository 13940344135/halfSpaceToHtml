

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