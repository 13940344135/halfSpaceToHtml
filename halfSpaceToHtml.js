

        // ��ǿո���html��ʾ��ת������
        public static halfSpaceToHtml(half){
            // �߼����׿ո����������� ���� ���ܳ���������
            let eSp = / +$/.exec(half); // ���ҳ���βҪת���Ŀո�
            let newEndStr = ''; 
            if (eSp && eSp[0] != '\n') { // �����β�пո�
                let eSpStr = eSp[0];
                if(eSpStr.length%2 ==0){ // �жϿո��Ƿ�Ϊż����
                    for (var i = 0; i < eSpStr.length; i++) { // ��Ϊż���� ���԰׿ո�ͷ ��ֹ�׿ո�����ڽ�β�������������
                        if(i%2 ==0){
                            newEndStr = newEndStr + ' ';
                        }else{
                            newEndStr = newEndStr +  '&nbsp;';
                        }
                    }

                }else{ // �ո�Ϊ������ ����nbsp��ͷ ��ֹ�׿ո�����ڽ�β�� �����������
                    for (var i = 0; i < eSpStr.length; i++) {
                        if(i%2 ==0){
                            newEndStr = newEndStr + '&nbsp;';
                        }else{
                            newEndStr = newEndStr +  ' ';
                        }
                    }
                }
                half = half.replace(/ +$/, ''); // ����β���ո�ȥ�� newEndStr�д����ʾ�ÿո��ַ���
            }
            // half = half.replace(/[ ][ ]/g, '&nbsp; '); // ʣ��������ո�nbspת�� 
            // --------------------------------------------------------------------------------------

            let sSp = /^ +/.exec(half); // ���ҳ���ͷҪת���Ŀո�
            let newStartStr = ''; 
            if (sSp && sSp[0] != '\n') { // �����ͷ�пո�
                let sSpStr = sSp[0];
                for (var i = 0; i < sSpStr.length; i++) { // ��nbsp��ͷ���ո�ת�� ����ֹ�׿ո�����ڿ�ͷ��
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
                half = half.replace(/^ +/, ''); // ����ͷ���ո�ȥ�� newStartStr�д����ʾ�ÿո��ַ���
                        
            }
            // --------------------------------------------------------------------------------------

            let patt = new RegExp(/  +/,"g"); // �����м䲿�������ո�
            let sp;
            // let newHalf = '';
            while ((sp = patt.exec(half)) != null){ // �ҵ���Ҳû��Ϊֹ
                // let noSpArr = half.split(/\s+/); //�ӵ�һ�����п�
                let noSp1 = half.substring(0,sp.index); 
                let noSp2 = half.substring(sp.index + sp[0].length, half.length); 
                let newStr = '';
                if (sp) {
                    let spStr = sp[0]; 

                    for (var i = 0; i < spStr.length; i++) { // ת��Ϊ��nbsp��ͷ����ʾ�ÿո��ַ���
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