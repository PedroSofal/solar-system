# Solar System

Este projeto, ainda sem nome, se trata de um modelo 3D, em escala, do Sistema Solar, construído com Three.js, a partir de dados reais obtidos principalmente do sistema Horizons da NASA.

## Versão online

Para executar o app em seu navegador, [clique aqui](https://solar-system-x4vg.onrender.com/).

## Recursos principais

- **Máquina do tempo:** acelere a passagem do tempo, volte ao passado ou digite uma data personalizada para visualizar como era o Sistema Solar no momento exato em que você nasceu;

- **Informações sobre os corpos celestes:** busque por um planeta ou lua e descubra informações como a duração do período orbital, temperatura média, entre muitas outras;

- **Controle de camadas:** exiba ou oculte camadas como os rótulos e as linhas das órbitas, ou ative a iluminação de ambiente para melhor visualizar regiões inalcançadas pela luz solar;

- **Responsividade:** acesse pelo celular ou reduza a janela para o canto da tela sem perder funcionalidades;

- **Acesso offline:** por não depender de dados em tempo real, você pode continuar usando o app normalmente sem depender de internet, após iniciá-lo;

- **Performance otimizada:** o app utiliza culling, LOD, lazy loading e diversas outras técnicas para garantir a melhor experiência de performance, ao trabalhar com milhares de polígonos;

## Pontos de interesse

A cena compreende todos os planetas e planetas-anões, bem como seus respectivos satélites naturais, além de dezenas de asteróides e os principais cometas.

Saturno é sempre uma grande atração por causa de seu complexo sistema de anéis. Se você chegar bem pertinho conseguirá ver as milhares de partículas que compõem os anéis do gigante gasoso.

Urano, Netuno e Júpiter são outros planetas que exibem um sistema de anéis, mas você sabia que o planeta-anão Haumea e o centauro Cáriclo também possuem um anéis?

Outro evento empolgante que acontece no Sistema Solar é a liberação de gases por cometas ativos quando se aproximam do Sol, devido à radiação e aos ventos solares, o que lhes confere uma coma em torno do núcleo e uma cauda formada por gás e poeira. Use a máquina do tempo para posicionar um cometa antes da órbita de Júpiter para conferir o fenômeno em ação.

E, claro, não deixe de apreciar o nosso planeta azul flutuando no espaço com sua camada de atmosfera e efeitos de shaders baseados na luz do Sol. Dependendo da data é possível até observar o eclipse solar com a projeção da sombra da Lua sobre a Terra, ou até a passagem de um cometa como o Halley.

## Precisão

A física dos corpos segue o **modelo kepleriano** com precessões seculares (nodal e apsidal), baseado em elementos orbitais para a época J2000 (1º de janeiro de 2000 às 10h no Horário de Brasília).

Isso significa que a posição dos corpos celestes em qualquer instante é determinada por informações sobre suas órbitas, como o **semi-eixo maior, inclinação, longitude do nó ascendente, argumento do periápside, excentricidade e anomalia média**, essas duas últimas sendo usadas para calcular a anomalia excêntrica, através da equação de Kepler, e a anomalia verdadeira, que é a posição real do corpo em sua órbita elíptica.

O movimento de translação é completado com a utilização do **período orbital e as precessões** do nodo ascendente e do argumento do periápside.

Diferente de modelos n-body e modelos numéricos completos, o modelo com base kepleriana não considera perturbações gravitacionais, que podem resultar em órbitas altamente variáveis ao longo do tempo. Por esse motivo, quanto mais longe do J2000, a posição de algumas luas deve apresentar desvios em relação a um modelo mais preciso, como o Eyes on the Solar System, da NASA.

Na tentativa de mitigar essas imprecisões, foram feitos alguns ajustes finos nos dados de precessão apsidal e nodal, e períodos orbitais. Os exemplos de correções mais extremas são as luas Valetudo, S/2003 J 23, S/2022 J 1 e S/2022 J 2 de Júpiter, e as luas Bestla, Skrymir, S/2004 S 7 e S/2019 S 6 de Saturno.

Com relação ao movimento de rotação, o principal desafio é inclinar o eixo de rotação do corpo celeste na direção correta. Sabemos que a Terra é tombada cerca de 23° em relação ao plano de sua órbita, mas para que lado ocorre essa inclinação? Para os principais planetas do Sistema Solar e para a nossa Lua foram utilizados dados disponíveis sobre a **ascensão reta e a declinação (RA/DEC)** para calcular o vetor do norte polar e inclinar os objetos corretamente, por meio de quarteniões.

Isso é particularmente importante nos casos de Saturno, que mantém seus anéis orientados exatamente como na vida real durante todo o período de simulação, além de Urano que possui uma obliquidade extrema, fazendo com que o planeta gire de lado como se estivesse rolando sobre sua órbita.

A estratégia de coordenadas RA/DEC também foi adotada para construir o **plano de Laplace** dos satélites mais próximos de seus planetas, que costumam orbitar próximos ao plano equatorial do corpo primário. As demais luas, quando existentes, são referenciadas a partir da **Eclíptica**, seguindo o referencial adotado pelo sistema Horizons.

# Créditos

Projeto desenvolvido por Pedro Sofal.

O banco de dados foi construído a partir da API [Le système solaire à portée de votre souris](https://api.le-systeme-solaire.net/), apesar de bastante modificada e atualizada com dados do [Horizons System, do Jet Propulsion Laboratory da NASA](https://ssd.jpl.nasa.gov/).

As texturas dos planetas, planetas-anões, Sol e Lua foram fornecidas pelo [Solar System Scope](https://www.solarsystemscope.com/textures/). Já as demais texturas foram baixadas do site [Free PBR](https://freepbr.com/).

O modelo usado para representar corpos sem equilíbrio hidrostático foi construído por Pasquill e disponibilizado em [Sketchfab](https://sketchfab.com/3d-models/asteroid-low-poly-9a43ef48a70647188576ccb5987b7e64).

A ideia do projeto nasceu de um curso básico de Three.js do canal [Zero to Mastery](https://www.youtube.com/watch?v=KM64t3pA4fs), no YouTube.
