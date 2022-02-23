# API Para leitura de balança DYMO SCALE


###Instalação

npm install
node index.js




### colocar api para rodar como serviço do windows
no arquivo nodeService.js alterar o conteudo de script na linha 6 com o caminho do arquivo do servidor
OBS.: Colocar barra dupla \\

Exemplo: "C:\\Users\\Bruno Wan Der Maas\\Desktop\\node js\\node\\index-teste.js"

após isso rodar o comando
node nodeService.js


### Para verificar se o serviço esta rodando
Windows + R
services.msc
procure por "nodeBasicServer"



### Para rodar a api de Fotos
no arquivo read.js alterar a variavel pathImages (linha 14), para a pasta onde a camera do windows salva as imagens
OBS.: Colocar barra dupla \\
Exemplo: "C:\\Users\\Bruno Wan Der Maas\\Pictures\\Camera Roll"

no arquivo serceFoto.js alterar o conteudo de script para o caminho do arquivo read.js

após isso rodar o comando
node serviceFoto.js



#### Para Excluir o servico do windows
execute o cmd como Administrador e execute o seguinte comando:
sc delete nodebasicserver.exe
